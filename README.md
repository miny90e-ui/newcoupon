# New Coupon

Coupon and deals website for stores in every category, built with Next.js 16, PostgreSQL (Prisma) and Tailwind CSS 4.

## Features

- **Public site:** homepage carousel, featured deals, popular stores, categories, an A–Z store list, store pages with code/deal filters and expired offers, a best-deals page (sort by popular, newest or ending soon) and search.
- **Coupon reveal:** clicking **Get Code** opens the code in a new tab and sends the current tab to the store through the affiliate link. Every click is counted.
- **Accounts:** register, sign in and save coupons with the heart button.
- **Admin (`/admin`):** dashboard, stores (with logo upload), coupons, categories, homepage banners, CSV import and user roles.
- **SEO:** per-page titles and descriptions, canonical links, `sitemap.xml`, `robots.txt` and breadcrumb structured data.
- **Built-in pages:** About, Contact, Privacy, Terms and Affiliate disclosure.

## Run locally (macOS)

```bash
npm install
```

In one terminal, start a throwaway local PostgreSQL. No install needed; data is kept in `.local-db/`:

```bash
npm run db:local
```

In a second terminal:

```bash
cp .env.example .env    # then set DATABASE_URL to the one db:local printed
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin, using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

## Deploy

See [DEPLOY.md](DEPLOY.md) for step-by-step setup on a Hostinger VPS: Nginx, PM2, HTTPS, and auto-deploy from GitHub Actions.

## Project layout

```
prisma/          schema, migrations, seed
src/app/         pages (App Router), admin panel, server actions
src/components/  UI components
src/lib/         database, session auth, queries, helpers
deploy/          VPS setup script, deploy script, Nginx config
```
