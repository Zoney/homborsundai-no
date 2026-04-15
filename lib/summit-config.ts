export const DEFAULT_YEAR = "2026.1";

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
    status: "Completed"
  },
  "2025.1": {
    title: "Homborsund AI Summit",
    date: "3. Mai 2025",
    theme: "Agentic & Multimodal AI: Beyond GenAI with o4-mini & The Hardware Wars",
    status: "Completed"
  },
  "2025.2": {
    title: "Homborsund AI Festival",
    date: "18. oktober 2025",
    theme: "Flashy Agents & Friendly Robots",
    status: "Completed",
    registrationKey: "2025.2.signedup",
    infoNotice: "This gathering just wrapped. Relive the sparks below and keep your eyes on the spring 2026 plans."
  },
  "2026.1": {
    title: "Homborsund AI Summit",
    date: "18. april 2026",
    theme: "Proof of Human",
    status: "Upcoming",
    registrationKey: "2026.1.info",
    cta: {
      label: "Sign Up",
      href: "/summit/2026.1/register",
      type: "register",
    },
    speakers: [
      { name: "Lars", description: "What Are Humans For?" },
      { name: "Cathrine", description: "What the Island Goat Can Teach Us About What’s Coming" },
      { name: "Open floor", description: "Speakers Corner: Prompting — what's working, what's next" },
      { name: "Michael", description: "Growing Up in the Age of AI — Now What?" },
      { name: "Øyvind", description: "Why Would We Need Coding Agents in 2026?" },
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
