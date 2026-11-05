# Repo Guidelines for Codex Agents

This repository uses **npm** with a Next.js + TypeScript setup. UI components come from **Shadcn UI** with **Tailwind CSS** already configured. It runs on our own app server at Hetzner (see `README.md`): Postgres, Better Auth, our own mail server, and **no outbound network at runtime**. Never add a third-party service, script, font or analytics call.

## Setup
- Install dependencies with `npm ci`.
- Copy `.env.example` to `.env.local`, start `npm run db:dev` (local Postgres via PGlite).
- All Shadcn UI components are already available in `components/ui`.

## Development
- Start the local server with `npm run dev`. The app runs on <http://localhost:3520>.
- Create a production build with `npm run build`.
- `/admin` needs a login (e-mail code or passkey) as an admin: `@homborsundai.no`, an address the superadmin added, or `HAI_SUPERADMIN`.
- Logs go to stdout as one JSON line (`lib/logg.ts`); never log tokens, codes or e-mail addresses. Meaningful actions also go to the activity log (`lib/hendelser.ts`).
- If you change what is stored, for how long, or who sees it, update `app/personvern/page.tsx` in the same commit.

## Quality Checks
- Run `npm run lint` to check code style.
- Run `npm run build && npm test` to build and run the Jest tests.

Always make sure lint, build and tests succeed before committing changes.

## Contribution Workflow
- Keep commits focused and descriptive.
- Use clear PR titles and include a short summary of changes in the description.
- Do not commit build output or dependencies.

These practices help Codex agents collaborate effectively and keep the project healthy.

## SEO & AI SEO Conventions

- Base URL: Set `NEXT_PUBLIC_BASE_URL` in `.env.local`. It powers canonical URLs, sitemap, robots, and JSON‑LD.
- Site metadata: `app/layout.tsx` defines `metadataBase`, title template, Open Graph and Twitter defaults. `app/head.tsx` injects Organization and WebSite JSON‑LD.
- Sitemap/robots: `app/sitemap.ts` and `app/robots.ts` are present. The sitemap auto‑includes summits from `lib/summit-config.ts` and notes from `lib/notes.ts`.
- OG images: `app/opengraph-image.tsx` and `app/twitter-image.tsx` provide default social cards. You can override per route by adding the same files under that route.
- Caching: Prefer static pages (`export const revalidate = <seconds>`); ISR does not survive a restart on the server, so never rely on it for data.

### New Summit Page
- Create `app/summit/[year]/layout.tsx` with:
  - `export const revalidate` (e.g., `86400`).
  - `export async function generateMetadata()` for title/description/canonical/Open Graph/Twitter.
  - Inline JSON‑LD `<script>` tags for `Event` and `BreadcrumbList`.
- Create or update `app/summit/[year]/page.tsx` for the UI.
- Update `lib/summit-config.ts` with `{ title, date, theme, status }` for the year. Sitemap picks it up automatically.
- Optional: add `app/summit/[year]/opengraph-image.tsx` for a custom OG image.

### New Note / Article
- Create `app/notes/[slug]/page.tsx` with:
  - `export const metadata` including `alternates: { canonical: "/notes/[slug]" }`.
  - `export const revalidate` (e.g., `86400`).
  - An Article JSON‑LD `<script type="application/ld+json">` with `headline`, `datePublished`, `author`, and `mainEntityOfPage` using `NEXT_PUBLIC_BASE_URL`.
- Add the note entry to `lib/notes.ts` so it appears on `/notes` and gets included in the sitemap.

### General Pages
- Add `export const revalidate` to enable ISR and CDN caching.
- Add `alternates.canonical` in `metadata` or use `generateMetadata` for dynamic pages.
- Avoid `"use client"` on pages unless necessary to keep them server‑rendered and cacheable.

### Redirects
- Use `next.config.mjs` `redirects()` for canonical routing (e.g., `/summit` → latest `/summit/[year]`).

### Validate
- Verify meta tags and canonical URLs in the browser DevTools.
- Validate JSON‑LD with Google’s Rich Results Test.
- Run `npm run lint`, `npm run build` and `npm test` before opening a PR.
