# Limitless Marketing Group — portfolio

The portfolio site we send to prospective clients.

**Live:** https://nolimitwebs.com

---

## What's in here

This repo holds two copies of the same site. That's deliberate — read this bit
before changing anything.

### `site/` — what's actually live

Seven plain files: one web page, one stylesheet, an icon, a social-share image
and three project screenshots. No build step, no server. **This is the folder
Vercel serves.**

Edit `site/index.html` directly for quick copy changes (a phone number, a
headline). Commit, and if the Vercel project is connected to this repo (see
below) the change goes live on its own.

### `source/` — the full editable project

The proper application this site was built from. It has things the static copy
can't: a real contact form that saves every lead to a database, and a config
file where all the content lives in one place instead of buried in HTML.

Use this when you want to make a real change — add a project to the portfolio,
restyle something, edit several pages of copy. See `source/README.md`.

**`source/` does not run on Vercel.** It's built for Cloudflare Workers, which
is what the database form needs. Pointing Vercel at it will fail the build.

---

## Making a change

**Small edit (copy, phone number):** edit `site/index.html`, commit.

**Real change (new project, restyle, new section):**

1. `cd source && npm install`
2. `npm run dev` and edit — most things live in `source/site.config.ts`
3. `npm run build` when you're happy
4. Regenerate the static copy in `site/` from the build output, or ask Claude to

Adding a portfolio project means adding an entry to `projects` in
`source/site.config.ts` and dropping a 16:9 screenshot (~1600×900) into
`source/public/`.

---

## Connecting this repo to Vercel

**Done (2026-09-01).** The Vercel project `limitless-marketing-portfolio` is
connected to this repo with Root Directory `site`, so every push to `main`
deploys automatically. The settings, if it ever needs re-creating:

| Setting          | Value           |
| ---------------- | --------------- |
| Root Directory   | `site`          |
| Framework Preset | `Other`         |
| Build Command    | *(leave empty)* |
| Output Directory | *(leave empty)* |

---

## Lead capture

**Live and verified (2026-09-01).** The contact form posts every submission to
Supabase (`public.portfolio_leads`), and a database trigger emails the lead to
contact@limitlessxcollective.com via Resend within seconds. Even if email ever
breaks, the lead is still safely stored in the table. See `supabase/README.md`
for the full design and rebuild instructions.

## Known gaps

- **No testimonials yet.** `testimonials` in `source/site.config.ts` is empty on
  purpose, and the section stays hidden until it has real quotes in it. Nothing
  invented ever ships.
- **Two of three projects are concepts.** MEC Painting and SRV Heating & Air are
  labelled "Concept" because they live on preview URLs, not client domains.
  Limitless Collective is labelled "Live". Flip `concept` in the config if that
  changes.
