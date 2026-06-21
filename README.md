# DallasLights.com

A directory of lighting companies serving the Dallas–Fort Worth area, built with Next.js.
Monetization model: free listings → paid Premium/Featured placements + lead generation.

## What's here

- **Homepage** — hero, category grid, listings spotlight
- **Category pages** — `/residential`, `/commercial`, `/outdoor`, `/electricians`, `/smart-home`, `/holiday`
- **Company profile pages** — `/company/[slug]`, one per business, with `LocalBusiness` SEO schema
- **Submit page** — `/submit`, free + paid tier pitch and a listing form
- **SEO built in** — per-page metadata, JSON-LD structured data, auto `sitemap.xml` and `robots.txt`
- **Analytics** — env-var driven (Google Analytics or Plausible); see below

## ⚠️ Before going live: verify the listing data

The 23 companies in `src/lib/listings.ts` are **real businesses**, with phone numbers and
service areas pulled from each company's own website in June 2026. Business details change —
**re-confirm each phone number and address before publishing**, and remove any company that
asks not to be listed.

No star ratings, review counts, or license numbers were invented — those fields are left
empty on purpose. Only add them later from a real, verifiable source.

## Turning on analytics

Set ONE of these as an environment variable in your host (e.g. Vercel → Settings → Environment Variables):

- `NEXT_PUBLIC_GA_ID` = your Google Analytics 4 ID (looks like `G-XXXXXXXXXX`) — free
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `dallaslights.com` — Plausible, paid, privacy-friendly

Nothing tracks until one is set.

## Making the lead form actually deliver

The "Request a Free Quote" form posts to `src/app/api/contact/route.ts`, which currently only
logs the lead. To receive leads by email, sign up for a service like Resend, add `RESEND_API_KEY`,
and uncomment the send logic in that file.

## Running locally (optional — not required to deploy)

Requires Node.js 18.18+.

```
npm install
npm run dev      # preview at http://localhost:3000
npm run build    # production build
```
