# Summit Architecture Refactor

## Overview

The summit pages have been refactored to be more modular, flexible, and maintainable. Each summit page is now completely independent and can have its own unique layout and content while still sharing common components.

## Key Changes

### 1. Shared Configuration (`lib/summit-config.ts`)
- **DEFAULT_YEAR**: Centralized configuration for the default/current summit
- **SUMMIT_METADATA**: Basic metadata for all summits (title, date, theme, status)
- Easy to add new summits by just adding entries to this configuration

### 2. Refactored Shared Components
All shared components now accept specific props instead of complex data objects:

- **SummitHeader**: Takes individual props (activeYear, title, date, theme, description)
- **SummitSchedule**: Takes schedule array directly
- **SummitVenue**: Takes activeYear only (uses shared DEFAULT_YEAR)
- **SummitRegistration**: Takes activeYear and status
- **SummitSpeakers**: Unchanged (already flexible)

### 3. Independent Summit Pages
Each summit page now:
- Imports summit metadata from shared config
- Defines its own inline content (description, schedule, etc.)
- Can have completely unique layouts and sections
- No dependency on shared SummitData type

## Benefits

### ✅ Flexibility
- Each summit can look completely different (see 2025.3 hackathon example)
- No forced layout constraints
- Easy to add unique sections per summit

### ✅ Maintainability
- Shared configuration in one place
- No duplicate DEFAULT_YEAR definitions
- Clear separation of concerns

### ✅ Scalability
- Adding a new summit requires:
  1. Add entry to `SUMMIT_METADATA`
  2. Create new page file
  3. Define inline content
  4. Use shared components as needed

## Example: Adding a New Summit

### 1. Update Configuration
```typescript
// lib/summit-config.ts
export const SUMMIT_METADATA: Record<string, SummitMetadata> = {
  // ... existing summits
  "2026.1": {
    title: "Homborsund AI Workshop",
    date: "March 2026",
    theme: "Hands-on AI for Everyone",
    status: "Upcoming"
  }
};
```

### 2. Create Page
```typescript
// app/summit/2026.1/page.tsx
"use client";

import { SummitHeader, SummitSchedule } from "@/components/shared";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.1";

export default function Summit2026_1Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  
  const description = ["Your unique description here"];
  const schedule = [
    { time: "10:00", event: "Workshop begins" }
  ];

  return (
    <main className="your-unique-styling">
      <SummitHeader 
        activeYear={YEAR} 
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={description}
      />
      <SummitSchedule schedule={schedule} />
      {/* Your unique content here */}
    </main>
  );
}
```

## Migration Summary

### Before
- Rigid SummitData type forced same structure
- DEFAULT_YEAR duplicated in every file
- Shared components tightly coupled to data structure
- Hard to create unique layouts

### After
- Flexible inline content definition
- Centralized configuration
- Loosely coupled shared components
- Complete layout freedom per summit

## File Structure
```
lib/
  summit-config.ts          # Shared configuration

components/shared/
  summit-header.tsx         # Refactored to accept individual props
  summit-schedule.tsx       # Refactored to accept schedule array
  summit-venue.tsx          # Simplified props
  summit-registration.tsx   # Simplified props
  summit-speakers.tsx       # Unchanged

app/summit/
  2024/page.tsx            # Refactored with inline content
  2025.1/page.tsx          # Refactored with inline content
  2025.2/page.tsx          # Refactored with inline content
  2025.3/page.tsx          # New hackathon example (completely different layout)
```

This architecture makes it easy to create summits that look completely different while still benefiting from shared components and configuration. 