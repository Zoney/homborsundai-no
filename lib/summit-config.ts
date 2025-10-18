export const DEFAULT_YEAR = "2025.2";

export type SummitMetadata = {
  title: string;
  date: string;
  theme: string;
  status: 'Upcoming' | 'Completed';
  registrationKey?: string;
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
    status: "Upcoming",
    registrationKey: "2025.2.signedup"
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
