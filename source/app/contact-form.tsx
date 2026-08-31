"use client";

import { useId, useRef, useState } from "react";
import { leadCapture, mailHref, site, telHref } from "../site.config";

type FieldErrors = Partial<Record<"name" | "phone" | "email", string>>;
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  const fid = (name: string) => `${uid}-${name}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
    if ((data.company_website ?? "").trim()) {
      setStatus("sent");
      return;
    }

    const name = (data.name ?? "").trim();
    const phone = (data.phone ?? "").trim();
    const email = (data.email ?? "").trim();

    // Validate before the network call so errors are instant.
    if (!name) {
      setFieldErrors({ name: "Please add your name." });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    if (!phone && !email) {
      setFieldErrors({ phone: "Add a phone number or an email so we can reach you." });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setStatus("sending");
    setFieldErrors({});
    setFormError("");

    try {
      const response = await fetch(`${leadCapture.url}/rest/v1/${leadCapture.table}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: leadCapture.publishableKey,
          authorization: `Bearer ${leadCapture.publishableKey}`,
          prefer: "return=minimal",
        },
        body: JSON.stringify({
          name,
          business: (data.business ?? "").trim(),
          phone,
          email,
          message: (data.message ?? "").trim(),
          source: "portfolio",
        }),
      });

      if (response.ok) {
        setStatus("sent");
        return;
      }

      setStatus("error");
      setFormError("We couldn't save that.");
    } catch {
      setStatus("error");
      setFormError("We couldn't reach the server.");
    }

    requestAnimationFrame(() => errorRef.current?.focus());
  }

  if (status === "sent") {
    return (
      <div className="formPanel formDone" role="status">
        <b>Request received.</b>
        <p>
          We&apos;ll be in touch within one business day to set up your free mockup. If it&apos;s
          urgent, call <a href={telHref}>{site.phone.display}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="formPanel" onSubmit={handleSubmit} noValidate>
      <div className="formRow">
        <div className="field">
          <label htmlFor={fid("name")}>Your name *</label>
          <input
            id={fid("name")}
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? fid("name-error") : undefined}
          />
          {fieldErrors.name && (
            <span className="fieldError" id={fid("name-error")}>
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor={fid("business")}>Business name</label>
          <input id={fid("business")} name="business" autoComplete="organization" />
        </div>
      </div>

      <div className="formRow">
        <div className="field">
          <label htmlFor={fid("phone")}>Phone</label>
          <input
            id={fid("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? fid("phone-error") : undefined}
          />
          {fieldErrors.phone && (
            <span className="fieldError" id={fid("phone-error")}>
              {fieldErrors.phone}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor={fid("email")}>Email</label>
          <input
            id={fid("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? fid("email-error") : undefined}
          />
          {fieldErrors.email && (
            <span className="fieldError" id={fid("email-error")}>
              {fieldErrors.email}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor={fid("message")}>What do you need? (optional)</label>
        <textarea id={fid("message")} name="message" rows={3} />
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={fid("company_website")}>Leave this field empty</label>
        <input id={fid("company_website")} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="formNote">
        One phone number or email is enough. We reply within one business day — no spam, no list.
      </p>

      <button className="formSubmit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request my free mockup"}
        <b aria-hidden="true">↗</b>
      </button>

      {formError && (
        <p className="formError" role="alert" tabIndex={-1} ref={errorRef}>
          {formError} You can also call <a href={telHref}>{site.phone.display}</a> or email{" "}
          <a href={mailHref}>{site.email}</a>.
        </p>
      )}
    </form>
  );
}
