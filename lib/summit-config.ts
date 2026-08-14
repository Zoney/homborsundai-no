export const DEFAULT_YEAR = "2026.2";

export type SummitCta = {
  label: string;
  href: string;
  description?: string;
  isExternal?: boolean;
  type?: 'register' | 'info' | 'community';
};

export type SummitMetadata = {
  title: string;
  date: string;
  theme: string;
  status: 'Upcoming' | 'Completed';
  lastModified: string;
  registrationKey?: string;
  cta?: SummitCta;
  infoNotice?: string;
  speakers?: Array<{
    name: string;
    description: string;
    activeFrom?: string;
  }>;
}

export const SUMMIT_METADATA: Record<string, SummitMetadata> = {
  "2024": {
    title: "Homborsund AI Conference",
    date: "August 17th 2024",
    theme: "Back to Basics",
    status: "Completed",
    lastModified: "2024-08-17",
  },
  "2025.1": {
    title: "Homborsund AI Summit",
    date: "3. Mai 2025",
    theme: "Agentic & Multimodal AI: Beyond GenAI with o4-mini & The Hardware Wars",
    status: "Completed",
    lastModified: "2025-05-03",
  },
  "2025.2": {
    title: "Homborsund AI Festival",
    date: "18. oktober 2025",
    theme: "Flashy Agents & Friendly Robots",
    status: "Completed",
    lastModified: "2025-10-18",
    registrationKey: "2025.2.signedup",
    infoNotice: "This gathering just wrapped. Relive the sparks below and keep your eyes on the spring 2026 plans."
  },
  "2026.1": {
    title: "Homborsund AI Summit",
    date: "18. april 2026",
    theme: "Proof of Human",
    status: "Completed",
    lastModified: "2026-04-18",
    registrationKey: "2026.1.info",
    infoNotice: "This edition just wrapped. Relive the sparks below and keep an eye out for what comes next.",
    speakers: [
      { name: "Lars", description: "What Are Humans For?" },
      { name: "Robin", description: "Who Killed the AI Project?" },
      { name: "Open floor", description: "Speakers Corner: Prompting — what's working, what's next" },
      { name: "Michael", description: "Growing Up in the Age of AI — Now What?" },
      { name: "Øyvind", description: "Why Would We Need Coding Agents in 2026?" },
    ],
  },
  "2026.2": {
    title: "Homborsund AI Summit",
    date: "3. oktober 2026",
    theme: "No Hype. Just Fire.",
    status: "Upcoming",
    lastModified: "2026-08-14",
    registrationKey: "2026.2.info",
    cta: {
      label: "Sign up — it's real",
      href: "/summit/2026.2/register",
      type: "info",
      description: "Saturday 3 October 2026 at Vågsholt skole. Doors 15:00 with the grill already lit, first talk 17:00.",
    },
    infoNotice: "Saturday 3 October 2026 at Vågsholt skole in Krømpe. Doors at 15:00 with the grill already going, first talk at 17:00. Eight talks, one bonfire, roughly twenty seats — and the schoolhouse has filled every single time. Sign up so we know how much to put on the grill.",
    speakers: [
      {
        name: "Lars",
        description: "The State of AI in Agder",
      },
      {
        name: "Michael",
        description: "Build Something. Now!",
      },
      {
        name: "Knut",
        description: "Why Industry Doesn't Fall for Demos",
      },
      {
        name: "Cathrine",
        description: "Real AI for Leaders — the Hype Stays Outside",
      },
      {
        name: "Eivind",
        description: "The Company That Remembers: An LLM Wiki for the Enterprise",
      },
      {
        name: "Arild",
        description: "The Kommune Has Entered the Chat",
      },
      {
        name: "Hanne",
        description: "The Longest Context Windows in the Room",
      },
      {
        name: "Øyvind",
        description: "One Analogy to Rule Them All",
      },
    ],
  }
};

export function getSummitRegistrationKey(id: string): string {
  return SUMMIT_METADATA[id]?.registrationKey ?? id;
}

export function findSummitIdByRegistrationKey(key: string): string | null {
  const match = Object.entries(SUMMIT_METADATA).find(([, metadata]) => metadata.registrationKey === key);
  return match ? match[0] : null;
}

export function resolveSummitId(input: string): string {
  if (SUMMIT_METADATA[input]) {
    return input;
  }

  const fromRegistrationKey = findSummitIdByRegistrationKey(input);
  if (fromRegistrationKey) {
    return fromRegistrationKey;
  }

  return input;
}

export const DEFAULT_SUMMIT_REGISTRATION_KEY = getSummitRegistrationKey(DEFAULT_YEAR);

export function normalizeSummitRegistrationKey(input?: string | null): string {
  if (!input) {
    return DEFAULT_SUMMIT_REGISTRATION_KEY;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return DEFAULT_SUMMIT_REGISTRATION_KEY;
  }

  const resolvedId = resolveSummitId(trimmed);
  if (SUMMIT_METADATA[resolvedId]) {
    return getSummitRegistrationKey(resolvedId);
  }

  return trimmed;
}
