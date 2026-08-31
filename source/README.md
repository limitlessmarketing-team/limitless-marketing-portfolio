# Limitless Marketing Group — portfolio site

Marketing and lead-capture site for Limitless Marketing Group. Built with
[vinext](https://github.com/cloudflare/vinext) (Next.js App Router on Cloudflare
Workers), with Drizzle + D1 behind the contact form.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # verify the production build
npm run lint     # eslint
npm test         # build + render check
```

Node `>=22.13.0` required.

## Editing the site

**Almost everything you'll want to change lives in `site.config.ts`** — phone
number, email, projects, testimonials, process steps and the founder block.
Edit values there rather than hunting through JSX.

| I want to change…                 | Edit                               |
| --------------------------------- | ---------------------------------- |
| Phone, email, page title          | `site` in `site.config.ts`         |
| Portfolio projects                | `projects` in `site.config.ts`     |
| Testimonials                      | `testimonials` in `site.config.ts` |
| Process steps / value props       | `processSteps`, `values`           |
| The "who you're working with" bio | `founder`                          |
| Layout and copy                   | `app/page.tsx`                     |
| Styling                           | `app/globals.css`                  |

### Adding a project

Selected Work is a **library grid** — compact catalogue tiles, three across on
desktop, reflowing to two and then one. It's built to grow: add entries to
`projects` and the grid wraps to new rows without the section taking over the
page.

Add an entry to `projects` and drop the screenshot in `public/`. Use a **16:9**
image at roughly 1600×900 — the tile crops to 16:9 from the top, so anything
taller loses its bottom edge. Set `concept: true` for design concepts and
mockups; it renders a "Concept" badge so the portfolio never implies a
live client engagement that doesn't exist.

Set `image: null` while a screenshot is still being captured. The card then
renders a designed "capture in progress" tile instead of a blank or broken
image. Point `image` at the file and the tile is replaced automatically.

**SRV Heating & Air is currently `image: null`** — it needs a real screenshot.

## Theme

The palette lives in the `:root` block of `app/globals.css`: a dark near-black
base with a blue undertone, ambient aurora glows and hairline rules.

| Token           | Value     | Notes                               |
| --------------- | --------- | ----------------------------------- |
| `--void`        | `#05070c` | page base                           |
| `--surface`     | `#0a0e17` | alternating bands                   |
| `--text`        | `#f5f7fa` | 18.8:1 on `--void`                  |
| `--muted`       | `#98a2b3` | 7.8:1 on `--void`                   |
| `--accent`      | `#4d7cfe` | glows, rules, hover states          |
| `--accent-soft` | `#8fa9ff` | 8.9:1 — safe for small text on dark |

Primary CTAs are white pills with near-black text (18.8:1) rather than
white-on-blue (3.7:1) — better contrast and a more premium read. Headlines use
the system display face (SF Pro on macOS), so no webfont is loaded.

`app/site-chrome.tsx` owns the scroll-driven chrome: the header's `data-scrolled`
state and the mobile bar's hero-aware visibility.

### Adding testimonials

`testimonials` ships empty and the section renders nothing while it stays that
way — no placeholder praise ever reaches production. Add real quotes and the
section appears automatically.

## Contact form

The form at `#contact` posts to `app/api/leads/route.ts`, which writes to the
`leads` table in D1 (`db/schema.ts`).

- `.openai/hosting.json` sets `"d1": "DB"` so the platform provisions the binding.
- After changing `db/schema.ts`, run `npm run db:generate` and deploy so the
  migration is applied.
- If D1 is unavailable the route returns `503` and the form surfaces the phone
  number and email instead, so a broken database never silently eats a lead.
- A hidden honeypot field (`company_website`) filters basic bot spam.

**Reading your leads:** query the `leads` table from the Cloudflare D1 console.
If you'd rather get an email on each submission, add a transactional provider
(Resend, Postmark) inside the route's `try` block after the insert.

## Analytics

Off by default. Set `plausibleDomain` in `site.config.ts` to your domain to
enable cookie-free [Plausible](https://plausible.io) analytics — no consent
banner required. Swap the script block in `app/layout.tsx` for GA4 or another
provider if you prefer.

## SEO

- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- `ProfessionalService` JSON-LD is emitted from `app/layout.tsx`. It's
  deliberately **not** `LocalBusiness` and claims no service area, so the brand
  reads as national rather than regional.
- Update `site.url` in `site.config.ts` once a custom domain is attached —
  canonical URLs, the sitemap and structured data all read from it.

## Deployment

Deployed via the OpenAI Sites platform (`.openai/hosting.json`). This project
does not use `wrangler.jsonc`; local bindings are simulated by `vite.config.ts`.

## Useful commands

- `npm run dev` — local development
- `npm run build` — verify the production build
- `npm test` — build and verify the rendered output
- `npm run lint` — eslint
- `npm run db:generate` — generate Drizzle migrations after schema changes
