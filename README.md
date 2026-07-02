# utahux.com

Portfolio site for Utah UX — Astro 5 (static) + Sanity CMS, deployed on Cloudflare Workers static assets.

## Editing content

- Studio: run `npm run dev` and open http://localhost:5174/studio (or `/studio` on the live site).
- **Case studies** and **client proposals** live in Sanity (project `71kxkqkh`, dataset `production`, public).
  New case studies appear automatically in the homepage Projects grid (ordered by the card's `order` field).
- Homepage copy, work history, and process sections are hardcoded in `src/components/`.
- Publishing in Studio triggers a rebuild via the Sanity webhook → Cloudflare deploy hook (once configured).

## Development

```
npm install
npm run dev        # dev server + embedded Studio on :5174
npm run build      # static build to dist/
npx wrangler deploy  # deploy dist/ to Cloudflare Workers
```

Env (`.env`): `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`. The dataset is public — no tokens needed for builds.

## Architecture

- `src/styles/webflow.css` — the un-minified Webflow export; **the pixel-parity contract**. Component markup keeps the original class names.
- `src/styles/site.css` — consolidated per-page inline styles (wave animation, nav overrides).
- `src/styles/proposal.css` — proposal-only styles (comparison table, deliver/maintain lists, sideline layout).
- `src/pages/[...slug].astro` — case studies (`/ancestry/onboarding/` etc., two-segment slugs).
- `src/pages/proposals/[slug].astro` — proposals (noindexed, excluded from sitemap/robots).
- Block renderers in `src/components/blocks/` map Sanity types 1:1 to the original Webflow markup.
- Client JS is minimal: GLightbox (case-study galleries), lazy Calendly loader, wave-emoji animation,
  click-to-load YouTube facade. No jQuery, no Webflow runtime.
- `public/_redirects` 301s the old `.html` URLs; `public/_headers` sets CSP + security headers
  (relaxed on `/studio/*`).

## One-time scripts

- `scripts/migrate-content.mjs` — the original static→Sanity migration (idempotent; uses your
  Sanity CLI login). Asset cache in `scripts/.asset-manifest.json` (gitignored).

## Remaining launch steps

1. Deploy: `npx wrangler deploy` (or connect the repo via Workers Builds in the Cloudflare dashboard
   for build-on-push + previews).
2. Cloudflare dashboard → Worker `utahux` → create a **deploy hook**; add it as a webhook in
   sanity.io/manage (filter `_type in ["caseStudy","proposal"]`).
3. Cutover: add `www.utahux.com` as the Worker's custom domain (zone already on Cloudflare),
   then disable GitHub Pages and merge this branch to `main` (deleting the legacy export).
