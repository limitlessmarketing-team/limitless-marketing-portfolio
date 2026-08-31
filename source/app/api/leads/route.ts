import { getDb } from "../../../db";
import { leads } from "../../../db/schema";

export const dynamic = "force-dynamic";

const MAX = { name: 120, business: 160, phone: 40, email: 200, message: 2000 };

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Deliberately permissive — just enough to catch typos, not to reject real addresses. */
function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** Requires at least 7 digits, which every real phone number has. */
function looksLikePhone(value: string) {
  return (value.match(/\d/g) ?? []).length >= 7;
}

function isMissingTable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const cause =
    error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
  return /no such table|D1 binding|bindings are unavailable/i.test(`${message}\n${cause}`);
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people leave this hidden field empty. Pretend success so
  // bots don't learn they were caught.
  if (clean(payload.company_website, 200)) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const name = clean(payload.name, MAX.name);
  const business = clean(payload.business, MAX.business);
  const phone = clean(payload.phone, MAX.phone);
  const email = clean(payload.email, MAX.email);
  const message = clean(payload.message, MAX.message);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please add your name.";
  if (!phone && !email) {
    fieldErrors.phone = "Add a phone number or an email so we can reach you.";
  } else {
    if (phone && !looksLikePhone(phone)) fieldErrors.phone = "That phone number looks incomplete.";
    if (email && !looksLikeEmail(email)) fieldErrors.email = "That email address looks incomplete.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ fieldErrors }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.insert(leads).values({
      name,
      business,
      phone,
      email,
      message,
      source: "website",
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 400),
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    // The database not being wired up must never look like the visitor's fault.
    // The form falls back to showing phone and email when it sees `fallback`.
    console.error("lead capture failed", error);

    return Response.json(
      {
        error: isMissingTable(error)
          ? "Our form isn't connected yet."
          : "Something went wrong on our end.",
        fallback: true,
      },
      { status: 503 }
    );
  }
}
