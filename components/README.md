# Summit Components

This directory contains shared components and data for the Homborsund AI Summit website. Each summit year now has its own dedicated route.

## Structure

### Routes
Each summit year has its own route in the app directory:
- `/app/summit/2024/page.tsx` - 2024 summit (completed event with archive section)
- `/app/summit/2025.1/page.tsx` - 2025.1 summit (upcoming event with special sections)
- `/app/summit/2025.2/page.tsx` - 2025.2 summit (upcoming event, basic layout)
- `/app/summit/page.tsx` - Main summit page that redirects to the default year

### Shared Components (`/shared`)
- `summit-header.tsx` - Common header with navigation between summits
- `summit-schedule.tsx` - Schedule section component
- `summit-speakers.tsx` - Speakers section component
- `summit-venue.tsx` - Venue information section
- `summit-registration.tsx` - Registration/CTA section

### Data & Types
- `summit-data.ts` - Contains all summit data and configuration
- `summit-types.ts` - TypeScript type definitions
- `index.ts` - Main exports for easy importing

## Usage

Navigate directly to summit routes:
- `/summit/2024` - 2024 summit
- `/summit/2025.1` - 2025.1 summit
- `/summit/2025.2` - 2025.2 summit (default)
- `/summit` - Redirects to default year

Import shared components in summit pages:

```tsx
import { summits } from "@/components/summit-data";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";

const YEAR = "2025.1";

export default function Summit2025_1Page() {
  const activeSummit = summits[YEAR];
  
  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <SummitHeader activeYear={YEAR} activeSummit={activeSummit} />
      <SummitSchedule activeSummit={activeSummit} />
      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
      <SummitRegistration activeYear={YEAR} activeSummit={activeSummit} />
    </main>
  );
}
```

## Adding New Summits

1. Add summit data to `summit-data.ts`
2. Create a new route directory (e.g., `/app/summit/2026/`)
3. Create `page.tsx` in the new directory
4. Update `DEFAULT_YEAR` in `summit-data.ts` if needed

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

### 2025.2 (Upcoming)
- Basic layout with standard sections
- Includes Knut speaker (conditional on year >= 2025.2) 