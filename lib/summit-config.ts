export const DEFAULT_YEAR = "2025.2";

export type SummitMetadata = {
  title: string;
  date: string;
  theme: string;
  status: 'Upcoming' | 'Completed';
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
    status: "Upcoming"
  }
};
