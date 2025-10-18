Homborsund.no – Development, Convex, and Deployment

## Setup

- Install dependencies: `pnpm install`
- Copy `.env.example` to `.env.local` and fill in values
  - Set `NEXT_PUBLIC_CONVEX_URL` as described below
- Start the app: `pnpm dev` (http://localhost:3000)

## Convex

This repo uses Convex for registrations and related server functions. The app reads `NEXT_PUBLIC_CONVEX_URL` to know which Convex deployment to talk to.

### Create or link a Convex project

1) Start a dev deployment (cloud, interactive):
- `pnpm run convex:dev`
- Log in / select or create a Convex project when prompted.
- The CLI prints a stable Development URL. Put that in `.env.local` as `NEXT_PUBLIC_CONVEX_URL` for local development when not using `--local`.

2) Optional: create Production deployment (from dashboard or CLI):
- `pnpm run convex:deploy` (after you’re ready to publish changes to Production)
- Copy the Production URL from the dashboard for use in Vercel Production.

### Local development (`--local`)

Use a fully local Convex dev server when you want everything to run locally.

- Start local Convex: `pnpm run convex:local`
- Copy the Local URL printed by the CLI into `.env.local` as `NEXT_PUBLIC_CONVEX_URL`
- In a separate terminal: `pnpm dev`

Notes:
- Keep the Convex terminal running while developing; it hot-reloads functions and regenerates types.
- If types are missing in CI, we run `convex codegen` on install (see package.json).

### Environment matrix

- Local (`--local`): `.env.local` → `NEXT_PUBLIC_CONVEX_URL` is the local URL printed by `convex dev --local`.
- Preview (Vercel): set `NEXT_PUBLIC_CONVEX_URL` in Vercel “Preview” environment to the Convex Development URL (shared dev deployment).
- Production (Vercel): set `NEXT_PUBLIC_CONVEX_URL` in Vercel “Production” environment to the Convex Production URL.

### Useful Convex commands

- `pnpm run convex:dev` – Start cloud dev deployment (watch server).
- `pnpm run convex:local` – Start local dev server.
- `pnpm run convex:deploy` – Deploy functions/schema to Production.
- `pnpm exec convex codegen` – Regenerate types in `convex/_generated/`.

## Vercel Deployment

The project deploys on Vercel using standard Next.js defaults.

- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output: `.next`

### Environment variables on Vercel

Set these in Vercel Project Settings → Environment Variables:

- Preview:
  - `NEXT_PUBLIC_CONVEX_URL` → Convex Development URL
- Production:
  - `NEXT_PUBLIC_CONVEX_URL` → Convex Production URL

- All environments:
  - `SLACK_SIGNUPS_WEBHOOK_URL` → Slack incoming webhook for the `#summit-signups` channel.

Other variables from `.env.example` should be filled appropriately for each environment.

### Notes

- The repo runs `convex codegen` on install to ensure generated types exist during Vercel builds.
- For local dev, you can choose between `--local` (fully local) or the shared cloud Development server.
