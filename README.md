# Solid Craft Construction LLC

Marketing site for **Solid Craft Construction LLC**. Next.js static export for Cloudflare Pages.

Printed domain: [solidcraftbuilds.com](https://solidcraftbuilds.com). This repo replaces the generic live template. Do not invent DNS, a street, a town, a CCB number, hours, prices, or reviews.

## Stack

- Next.js App Router (`output: 'export'`), publish `out/`
- Copy lives in `lib/site.ts` (Voice locked)
- Quote form posts to FormSubmit (`pnw@solidcraftbuilds.com`)
- No admin in v1

## Local

```bash
npm install
npm run build
```

Static files land in `out/`. Preview:

```bash
npx wrangler pages dev ./out
```

## Deploy

From the export `out` directory:

```bash
npx wrangler pages deploy --project-name=solid-craft-construction
```

Or from the repo root:

```bash
npm run pages:deploy
```

First FormSubmit send asks that inbox to confirm the address.

## Contact on the site

- Joel Paz — [(541) 653-6793](tel:+15416536793)
- Ahren Paz — [(541) 255-9111](tel:+15412559111)
- Email us [pnw@solidcraftbuilds.com](mailto:pnw@solidcraftbuilds.com)
- Hablamos español
- Work (card back order): Decks, Fences, Siding, Drywall, Windows, Roofing
- Free estimates

No street. No town. No CCB. No hours. No star scores. No job photos we do not have. No Georgia copy. Do not print 541-422-2372.

## Look

Ground `#1A1E22`. Card `#212426`. Ink `#F3F1EC`. Gold `#DCB368`. Mute `#7C8387`.
Big Shoulders Display + Libre Franklin.

- Hero is the printed card (table knocked out): SC + house, SOLID white / CRAFT gold, Joel and Ahren, Hablamos español, email
- `public/logo-mark.png` — SC + house crop for chrome
- `public/logo-tile.png` — same mark on a charcoal tile
- No work gallery until they send job photos
