import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * `cloudflare:workers` only resolves inside the Workers runtime. Importing it at
 * the top level makes any non-workerd host (notably `vinext start`, which runs a
 * plain Node server) blow up at module-load time — before a caller's try/catch
 * can run, turning a missing database into an unhandled 500. Loading it lazily
 * keeps the failure catchable so callers can degrade gracefully instead.
 */
async function getEnv(): Promise<Record<string, unknown>> {
  const mod = (await import("cloudflare:workers")) as { env?: Record<string, unknown> };
  return mod.env ?? {};
}

export async function getDb() {
  let env: Record<string, unknown>;

  try {
    env = await getEnv();
  } catch (error) {
    throw new Error(
      "Cloudflare bindings are unavailable in this runtime. Use `npm run dev` (workerd) or deploy to the Sites platform.",
      { cause: error instanceof Error ? error : undefined }
    );
  }

  const db = env.DB as D1Database | undefined;

  if (!db) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(db, { schema });
}
