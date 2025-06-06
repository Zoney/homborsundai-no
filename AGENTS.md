# Repo Guidelines for Codex Agents

This repository uses **pnpm** with a Next.js + TypeScript setup. UI components come from **Shadcn UI** with **Tailwind CSS** already configured. Follow these steps when working here.

## Setup
- Install dependencies with `pnpm install`.
- Run `pnpm install` again whenever starting a new workspace before running
  other `pnpm` commands like `pnpm lint` or `pnpm test`. Missing dependencies
  will cause these tasks to fail.
- Copy `.env.example` to `.env` and fill in the required values.
- All Shadcn UI components are already available in `components/ui`.

## Development
- Start the local server with `pnpm dev`. The app runs on <http://localhost:3000>.
- Create a production build with `pnpm build`.
- The `/admin` route is protected by Google Workspace authentication.

## Quality Checks
- Run `pnpm lint` to check code style.
- Run `pnpm test` to execute Jest tests. The test script automatically runs `pnpm build` before Jest.

Always make sure `pnpm lint` and `pnpm test` succeed before committing changes.

## Contribution Workflow
- Keep commits focused and descriptive.
- Use clear PR titles and include a short summary of changes in the description.
- Do not commit build output or dependencies.

These practices help Codex agents collaborate effectively and keep the project healthy.
