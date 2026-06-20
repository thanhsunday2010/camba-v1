# CAMBA - Cambridge English Exam Preparation Platform

Production-ready self-study platform for K12 students preparing for Cambridge English exams.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Next.js Server Actions, Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (Email + Google OAuth)
- **AI:** Google Gemini 2.5 Flash (Phase 4)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase account
- Google Cloud Console (for OAuth)

### Setup

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env.local
```

Fill in your Supabase and app URL values.

3. **Set up Supabase database**

Run migrations in order via Supabase SQL Editor or CLI:

```bash
npx supabase db push
# Or manually run:
# supabase/migrations/001_initial_schema.sql
# supabase/migrations/002_rls_policies.sql
# supabase/migrations/004_gamification_rls.sql
# supabase/migrations/005_ai_storage_and_exercises.sql
# supabase/migrations/006_mock_test_sample.sql
# supabase/migrations/007_parent_teacher.sql
# supabase/migrations/008_ielts_program.sql
```

4. **Configure Supabase Auth**

- Enable Email provider in Authentication > Providers
- Enable Google OAuth with Client ID and Secret
- Add redirect URL: `http://localhost:3000/auth/callback`

5. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for Vercel deployment, env vars, and post-deploy checklist.

```bash
npm run lint
npm run typecheck
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # i18n routes (default: vi)
│   │   ├── (auth)/         # Login, register, forgot password
│   │   └── (dashboard)/    # Protected student dashboard
│   └── auth/callback/      # OAuth callback handler
├── actions/                # Server Actions
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── auth/               # Auth forms
│   ├── dashboard/          # Dashboard widgets
│   └── layout/             # Navigation, shells
├── i18n/
│   ├── messages/           # Translation files (vi, en, ...)
│   ├── routing.ts
│   └── request.ts
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── auth/               # Role helpers
│   └── queries/            # Data fetching
└── types/                  # TypeScript types

supabase/
├── migrations/             # SQL schema + RLS policies
└── seed.sql                # Initial Cambridge program data

docs/
├── ERD.md                  # Database entity relationship diagram
├── ARCHITECTURE.md         # System architecture overview
└── DEPLOYMENT.md           # Vercel + Supabase production runbook
```

## Development Phases

| Phase | Status | Scope |
|-------|--------|-------|
| 1 | ✅ Complete | Architecture, Database, Authentication |
| 2 | ✅ Complete | Learning Engine + Content Management |
| 3 | ✅ Complete | Gamification System |
| 4 | ✅ Complete | AI Features (Gemini) |
| 5 | ✅ Complete | Mock Tests |
| 6 | ✅ Complete | Parent & Teacher Dashboards |
| 7 | ✅ Complete | Multi-Program Expansion |
| 8 | ✅ Complete | Production Optimization |
| 9 | ✅ Complete | Security & Integrity Sprint |
| 10 | ✅ Complete | Data Model Alignment |
| 11 | ✅ Complete | Content Management Completion (~80% schema coverage) |

See [docs/MIGRATION_PLAN_PHASE10.md](./docs/MIGRATION_PLAN_PHASE10.md) for migration 010 runbook.

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for Vercel + Supabase production setup.

## Content Architecture

Generic multi-program hierarchy (not Cambridge-specific):

```
Program → Level → Skill → Unit → Lesson → Exercise → Question
```

Examples:
- Cambridge → Flyers → Reading → Unit 1 → Lesson 1
- IELTS → Band 5 → Reading → Unit 1 → Lesson 1
- Math → Grade 6 → Algebra → Unit 1 → Lesson 1

## User Roles

- **Student** — Learning, progress, gamification
- **Parent** — Child progress monitoring
- **Teacher** — Classes, assignments, reports
- **Admin** — Content management, users, settings

## License

Proprietary — All rights reserved.
