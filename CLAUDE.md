# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

There are no tests configured yet.

## Architecture

This is a **Next.js 16 App Router** project for a transport booking service (AD Transport). It uses TypeScript strict mode, Tailwind CSS v4, and Supabase as the database/backend.

### Path alias

`@/*` maps to the repo root (not `src/`). So `@/src/features/...`, `@/components/ui/...`, and `@/lib/utils` all resolve relative to the root.

### Directory layout

```
src/
  app/
    (marketing)/        # Public landing page route group
    (booking)/
      reserver/         # Booking page (/reserver)
    api/v1/
      booking-requests/ # POST — create a booking
      ride-options/     # GET  — list vehicle options
      pricing/estimate/ # POST — price estimate
      health/           # GET  — health check

  features/             # Feature modules (see below)
  infrastructure/       # Concrete implementations (Supabase repos, Resend, Mapbox)
  components/
    layout/             # site-header, site-footer, mobile-bottom-cta
    shared/             # Generic UI wrappers (page-container, section, empty-state…)
    branding/           # logo, brand-mark
  lib/
    supabase/           # client / server / admin Supabase helpers + generated types
    email/              # Resend client
    env/                # Typed env variables
    utils/              # cn, currency, date, distance, object helpers
    validations/        # Shared Zod schemas

components/ui/          # shadcn/ui primitives (root-level, aliased as @/components/ui)
```

### Feature module structure

Each feature under `src/features/<name>/` follows the same internal layout:

| Path | Purpose |
|---|---|
| `types/` | TypeScript types |
| `schemas/` | Zod validation schemas |
| `dto/` | Input/output data-transfer objects |
| `constants/` | Feature constants |
| `use-cases/` | Application logic (one file per use-case) |
| `services/` | Domain services called by use-cases |
| `repositories/` | Repository interfaces (implemented in `src/infrastructure/`) |
| `components/` | React components owned by this feature |
| `hooks/` | React hooks (booking feature only) |
| `index.ts` | Public barrel export |

Features: **booking**, **pricing**, **ride-options**, **locations**, **notifications**, **auth**, **marketing**.

### Infrastructure layer

`src/infrastructure/` contains the concrete implementations that satisfy the repository interfaces defined in each feature:

- `repositories/supabase-booking.repository.ts` → implements `booking/repositories/booking.repository.interface.ts`
- `repositories/supabase-ride-options.repository.ts` → implements `ride-options/repositories/ride-options.repository.interface.ts`
- `providers/resend-email.provider.ts` → implements `notifications/providers/email.provider.interface.ts`
- `providers/mapbox-geocoding.provider.ts` — geocoding for address resolution
- `auth/api-key.guard.ts`, `api-auth.ts`, `session-auth.ts`
- `logging/logger.ts`

### Key dependencies

| Package | Role |
|---|---|
| `@supabase/supabase-js` | Database + auth |
| `react-hook-form` + `@hookform/resolvers` + `zod` | Form validation |
| `radix-ui` | Headless UI primitives |
| `class-variance-authority` + `clsx` + `tailwind-merge` | Styling utilities |
| `lucide-react` | Icons |

### Note on current state

Most files under `src/` are empty scaffolds — the folder/type structure has been defined but implementation has not been written yet. The only populated source file is `components/ui/button.tsx` (and the other shadcn primitives at the root `components/ui/`).
