# Solid Craft Construction LLC

Marketing site for **Solid Craft Construction LLC**. Public pages are a Next.js static export for Cloudflare Pages. Owner admin is `/admin` (bookmark only, not linked in chrome).

Printed domain: [solidcraftbuilds.com](https://solidcraftbuilds.com). This repo replaces the generic live template. Do not invent DNS, a street, a town, a CCB number, hours, prices, or reviews.

## Stack

- Next.js App Router (`output: 'export'`), publish `out/`
- Copy fallback in `lib/site.ts` (Voice locked). Live copy comes from D1 when Pages Functions are up
- Cloudflare Pages Functions in `/functions`
- New D1 database `solid-craft-construction` (binding `DB`) — this project only
- New R2 bucket `solid-craft-construction-photos` (binding `PHOTOS`) — quote images, Work uploads, optional before/after
- Quote form writes the D1 inbox (optional job photos to R2) and also emails `pnw@solidcraftbuilds.com` via FormSubmit when that inbox is confirmed

Do not reuse Sharky's D1, R2, `SESSION_SECRET`, cookie, or passwords.

## Local public static

```bash
npm install
npm run build
```

Static files land in `out/`. Without Functions, the public site still renders Voice copy from `lib/site.ts`.

## Local admin (Pages Functions + D1)

```bash
cp .dev.vars.example .dev.vars
openssl rand -hex 32
# paste that value as SESSION_SECRET in .dev.vars — do not commit .dev.vars
npm run build
npx wrangler d1 execute solid-craft-construction --local --file=schema.sql
npx wrangler d1 execute solid-craft-construction --local --file=seed.sql
npx wrangler pages dev ./out
```

Open `/admin`. First visit: **Create owner** (your name + a password of at least 8 characters). Then Site / Requests / Photos / Users.

`ready()` also creates tables and Voice seed if D1 is empty, so the first `/admin` hit still works after schema is missing.

## How Remy creates the first owner (production)

1. Create this project's D1 and R2 (once):

   ```bash
   npx wrangler d1 create solid-craft-construction
   npx wrangler r2 bucket create solid-craft-construction-photos
   ```

2. Paste the real `database_id` from `d1 create` into `wrangler.jsonc` (replace the placeholder UUID).

3. Apply schema and Voice seed on remote D1:

   ```bash
   npx wrangler d1 execute solid-craft-construction --remote --file=schema.sql
   npx wrangler d1 execute solid-craft-construction --remote --file=seed.sql
   ```

4. Generate a **new** session secret. Do not copy Sharky's.

   ```bash
   openssl rand -hex 32
   npx wrangler pages secret put SESSION_SECRET --project-name=solid-craft-construction
   ```

5. Deploy (`npm run pages:deploy` or the Pages Git build: `npm ci && npm run build`, output `out`).

6. Open `https://<this-pages-host>/admin/` (or the custom domain later). Nobody else should have an owner yet.

7. **Create owner**: type Remy's name and a new password (8+ characters). This is the only time that screen appears. Bookmark `/admin`. It is not in the public nav.

8. Use Site to edit public copy. Quote form rows land in Requests (unread/read, optional job photo). Photos can add/remove Work shots and optional before/after pairs.

If an owner already exists, the create-owner form is locked. Sign in with that name and password, or add another admin from Users.

## Deploy

```bash
npm run pages:deploy
```

Same Pages project `solid-craft-construction`. Build: `npm ci && npm run build`. Output: `out`.

First FormSubmit send asks `pnw@solidcraftbuilds.com` to confirm the address.

## Contact on the site

- Joel Paz — [(541) 653-6793](tel:+15416536793)
- Ahren Paz — [(541) 255-9111](tel:+15412559111)
- Email us [pnw@solidcraftbuilds.com](mailto:pnw@solidcraftbuilds.com)
- Hablamos español
- Work (card back order): Decks, Fences, Siding, Drywall, Windows, Roofing
- Free estimates

No street. No town. No CCB. No hours. No star scores. No Georgia copy. Do not print 541-422-2372. Do not label work photos Porches or Junk removal.

## Look

Ground `#1A1E22`. Card `#212426`. Ink `#F3F1EC`. Gold `#DCB368`. Mute `#7C8387`.
Big Shoulders Display + Libre Franklin.

- Chrome mark is `public/logo-cutout.png` (SC + gold roof only). No black box. No charcoal tile.
- Hero is the cutout on `#1A1E22` plus Voice H1. No gold card frame.
- Mobile header: Call Joel fully visible. Ahren in the dock/footer. Hablamos español in the footer.
- Work stack: only photos that have a picture. Optional before/after sliders stay hidden until both images exist and Visible is on.
- About keeps each sentence on its own line.
