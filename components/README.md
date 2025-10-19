# Summit Components

This directory contains shared components and data for the Homborsund AI Summit website. Each summit year now has its own dedicated route.

## Structure

### Routes
Each summit year has its own route in the app directory:
- `/app/summit/2024/page.tsx` — 2024 summit (completed event with archive section)
- `/app/summit/2025.1/page.tsx` — 2025.1 summit (completed, bespoke content)
- `/app/summit/2025.2/page.tsx` — 2025.2 summit (completed, festival recap)
- `/app/summit/2026.1/page.tsx` — 2026.1 summit (current default with evolving plan)
- `/app/summit/page.tsx` — Summit index showing upcoming and archive listings

### Shared Components (`/shared`)
- `summit-header.tsx` - Common header with summit hero context and link back to the index
- `summit-schedule.tsx` - Schedule section component
- `summit-speakers.tsx` - Speakers section component
- `summit-venue.tsx` - Venue information section
- `summit-registration.tsx` - Registration/CTA section

### Data & Types
- `lib/summit-config.ts` — Central source for summit metadata, CTA behaviour and default year
- `components/shared/index.ts` — Barrel export for shared summit components

## Usage

Navigate directly to summit routes:
- `/summit/2024` - 2024 summit
- `/summit/2025.1` - 2025.1 summit
- `/summit/2026.1` - 2026.1 summit (default)
- `/summit` - Index with upcoming and previous summits listed

Import shared components in summit pages:

```tsx
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2025.1";

export default function Summit2025_1Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  
  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <SummitHeader 
        activeYear={YEAR} 
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={["..."]}
      />
      <SummitSchedule schedule={[/* ... */]} />
      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
      <SummitRegistration activeYear={YEAR} summit={summitInfo} />
    </main>
  );
}
```

## Adding New Summits

1. Add summit metadata to `lib/summit-config.ts`
2. Create a new route directory (e.g., `/app/summit/2026/`)
3. Create `page.tsx` in the new directory
4. Update `DEFAULT_YEAR` in `lib/summit-config.ts` if needed

## Special Features by Summit

### 2024 (Completed)
- Archive section with photos and testimonials
- Past summit styling

### 2025.1 (Upcoming)
- Navigation links to sections
- Hot Topics section with AI trends
- Norwegian ML Experience section
- How to Attend section with self-invitation philosophy
- Experience section about unplugging

### 2025.2 (Completed Festival)
- Inline schedule, speakers and venue sections
- Registration section now points visitors toward the upcoming summit

### 2026.1 (Upcoming Default)
- Placeholder roadmap with evolving agenda cards
- Interest form that collects early sign-ups without issuing tickets
