/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { getNote } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import { Quote, LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Claude Code vs Codex: Agentic Coding Gets Real | Homborsund AI",
  description:
    "Reflections on agentic coding tools, and how this repo pairs Convex with Codex for type-safe velocity.",
};

export default function ArticlePage() {
  const note = getNote("coding-agents-2025");
  return (
    <div className="min-h-screen bg-gradient-cool text-white py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <p className="text-rosebud-300 text-sm">Community Notes</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2">Claude Code vs Codex: Agentic Coding Gets Real</h1>
        <p className="text-rosebud-300 mt-2">{note?.date} {note?.author ? `• ${note.author}` : ""}</p>
        {note?.tags && (
          <div className="mt-3 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <Badge key={t} variant="secondary" className="bg-ferra/60 text-rosebud-100 border-ferra-600">{t}</Badge>
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none mt-8">
          <p>
            Agentic coding is no longer a demo—it's landing in real workflows. Tools like
            Anthropic's Claude Code and OpenAI's Codex CLI are racing to make “work with my codebase”
            a first-class capability: grounded conversations on repos, structured planning, and
            iterative execution with safety rails.
          </p>

          <blockquote className="border-l-4 border-copperrose/70 pl-4 py-2 my-6 bg-ferra/30 rounded-r">
            <div className="flex items-start gap-2 text-rosebud-100">
              <Quote className="h-5 w-5 mt-1 flex-shrink-0" />
              <p className="m-0">
                The shift is from autocomplete to agents: tools that plan,
                apply precise patches, and validate outcomes against your
                types and tests.
              </p>
            </div>
          </blockquote>

          <h2 className="mt-12 pt-6 border-t border-ferra-600/50 text-3xl md:text-4xl font-bold tracking-tight text-rosebud-50">Why this matters</h2>
          <p>
            The promise isn't just chat that can write functions; it's assistants that understand
            project intent, propose plans, change code surgically, and validate outcomes. Compared to
            earlier code completion tools, these agents can reason over broader context—tests, APIs,
            data models—and keep changes consistent with your architecture and type system.
          </p>

          <h2 className="mt-10 pt-4 border-t border-ferra-600/40 text-2xl md:text-3xl font-semibold text-rosebud-50">How we build: type-safe velocity</h2>
          <p>
            In this repo, we lean on full TypeScript strictness and Convex for typed server
            functions. Pairing Convex's generated types with an agentic flow (via Codex) means we
            can move fast without losing safety: mutations and queries stay strongly typed end to end,
            and UI wiring catches mismatches early.
          </p>

          <h3 className="mt-10 pt-4 border-t border-ferra-600/30 text-xl md:text-2xl font-semibold text-rosebud-100">What we shipped that feels like a SaaS</h3>
          <ul>
            <li><strong>Summit registrations</strong>: typed Convex mutations/queries with validation and storage.</li>
            <li><strong>Admin dashboards</strong>: list, edit, and delete registrations with server routes and SWR.</li>
            <li><strong>Tickets + verification</strong>: QR ticket pages and a verification flow for check-in.</li>
            <li><strong>Email notifications</strong>: transactional email hooks for confirmations/ops.</li>
            <li><strong>Auth gating</strong>: Google Workspace–protected admin routes.</li>
            <li><strong>Bot protection</strong>: Turnstile integration on public forms.</li>
            <li><strong>Multi-summit content</strong>: schedules, speakers, venue sections with reusable components.</li>
            <li><strong>Migrations + config</strong>: structured utilities and typed configs for repeatable changes.</li>
          </ul>
          <p>
            In another world, this stack could be a handful of paid SaaS tools. Instead, we’re
            vibe-coding it: owning our data, iterating quickly, and keeping everything composable and
            type-safe.
          </p>

          <h2 className="mt-12 pt-6 border-t border-ferra-600/50 text-3xl md:text-4xl font-bold tracking-tight text-rosebud-50">Claude Code and Codex, head to head</h2>
          <p>
            The interesting bit isn’t who “wins” but how both product lines are converging on a
            similar idea: practical agents that plan, apply changes, and follow house style. Claude
            Code pushes hard on grounded reasoning and careful edits; Codex CLI leans into open,
            scriptable workflows you can tailor to your repo. Both are rapidly improving at handling
            multi-file refactors, incremental diffs, and safety checks.
          </p>

          <div className="my-8 grid md:grid-cols-2 gap-4">
            <div className="rounded-md border border-ferra-600 bg-tarawera/50 p-4">
              <h4 className="text-rosebud-50 font-semibold mb-2">Claude Code highlights</h4>
              <ul className="list-disc pl-5 text-rosebud-200">
                <li>Repo-grounded reasoning and task-focused coding mode</li>
                <li>Artifacts for inline previews and diffs</li>
                <li>Strong natural language refactor guidance</li>
              </ul>
            </div>
            <div className="rounded-md border border-ferra-600 bg-tarawera/50 p-4">
              <h4 className="text-rosebud-50 font-semibold mb-2">Codex CLI highlights</h4>
              <ul className="list-disc pl-5 text-rosebud-200">
                <li>Open, scriptable workflows with patch-based edits</li>
                <li>Planning, validation hooks, and repo-specific context</li>
                <li>Keeps changes minimal and reviewable</li>
              </ul>
            </div>
          </div>

          <div className="rounded-md border border-copperrose/50 bg-copperrose/10 p-4">
            <h4 className="text-rosebud-50 font-semibold mb-2">Try Codex locally</h4>
            <p className="text-rosebud-200 mb-2">Install the terminal agent and point it at your repo:</p>
            <pre className="whitespace-pre-wrap text-sm bg-tarawera/60 p-3 rounded border border-ferra-600 text-rosebud-100">
{`npm i -g @openai/codex
codex`}
            </pre>
            <p className="text-rosebud-300 text-sm mt-2">Also available via Homebrew: <code>brew install codex</code>.</p>
          </div>

          <h2 className="mt-10 pt-4 border-t border-ferra-600/40 text-2xl md:text-3xl font-semibold text-rosebud-50">Install Claude Code</h2>
          <div className="rounded-md border border-ferra-600 bg-tarawera/50 p-4">
            <h4 className="text-rosebud-50 font-semibold mb-2">Quick start</h4>
            <p className="text-rosebud-200 mb-2">Install and launch from the terminal:</p>
            <pre className="whitespace-pre-wrap text-sm bg-tarawera/60 p-3 rounded border border-ferra-600 text-rosebud-100">
{`npm i -g @anthropic-ai/claude-code
cd your-awesome-project
claude`}
            </pre>
            <p className="text-rosebud-300 text-sm mt-2">
              Editor/Desktop specifics vary — see the official guide:
              {" "}
              <a className="underline hover:text-white" href="https://docs.anthropic.com/en/docs/claude-code/setup" target="_blank" rel="noreferrer">Claude Code setup</a>.
            </p>
          </div>

          <h2 className="mt-10 pt-4 border-t border-ferra-600/40 text-2xl md:text-3xl font-semibold text-rosebud-50">What this unlocks for us</h2>
          <ul>
            <li><strong>Faster feature loops</strong>: spec → plan → patch → validate in minutes.</li>
            <li><strong>Consistent quality</strong>: typed Convex endpoints and strict TS keep agents honest.</li>
            <li><strong>Operational clarity</strong>: agents propose changes; humans review, ship, and own outcomes.</li>
          </ul>

          <h2 className="mt-10 pt-4 border-t border-ferra-600/30 text-2xl md:text-3xl font-semibold text-rosebud-50">Let’s discuss it live</h2>
          <p>
            This is an active area we’ll dig into face to face at our summits—tradeoffs,
            safety, and where these tools already pay off. Bring your questions and examples.
          </p>

          <h2 className="mt-12 pt-3 border-t border-ferra-600/30 text-base md:text-lg uppercase tracking-wider text-rosebud-200">Sources</h2>
          <ul className="space-y-2 text-rosebud-200">
            <li className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <a className="underline hover:text-white" href="https://www.anthropic.com/news/claude-3-7-sonnet" target="_blank" rel="noreferrer">Anthropic: Claude 3.7 Sonnet</a>
            </li>
            <li className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <a className="underline hover:text-white" href="https://www.anthropic.com/news/artifacts" target="_blank" rel="noreferrer">Anthropic: Artifacts</a>
            </li>
            <li className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <a className="underline hover:text-white" href="https://github.com/openai/codex" target="_blank" rel="noreferrer">OpenAI: Codex CLI (GitHub)</a>
            </li>
            <li className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <a className="underline hover:text-white" href="https://docs.convex.dev/" target="_blank" rel="noreferrer">Convex docs</a>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/notes">
            <Button variant="secondary">Back to notes</Button>
          </Link>
          <Link href="/summit">
            <Button className="bg-copperrose hover:bg-copperrose-600">Upcoming summit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
/* eslint-enable react/no-unescaped-entities */
