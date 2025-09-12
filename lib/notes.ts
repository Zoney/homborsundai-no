export type Note = {
  slug: string
  title: string
  date: string
  summary: string
  author?: string
  tags?: string[]
}

export const NOTES: Note[] = [
  {
    slug: "coding-agents-2025",
    title: "Claude Code vs Codex: Agentic Coding Gets Real",
    date: new Date().toISOString().slice(0, 10),
    summary:
      "Thoughts on the rapid rise of agentic coding tools, how we use Convex + Codex for full type-safe velocity, and what parts of this repo feel like SaaS in disguise.",
    author: "Homborsund AI",
    tags: ["agents", "claude", "codex", "convex", "typescript"],
  },
];

export function getNote(slug: string) {
  return NOTES.find((n) => n.slug === slug) ?? null;
}

