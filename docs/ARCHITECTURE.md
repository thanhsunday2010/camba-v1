# CAMBA System Architecture

## Overview

CAMBA is designed as a **generic learning platform** with configurable content hierarchy, enabling future expansion to IELTS, TOEIC, SAT, Mathematics, and other programs without architectural changes.

## Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  Next.js App Router │ Shadcn UI │ next-intl (vi default) │
├─────────────────────────────────────────────────────────┤
│                    Application Layer                     │
│  Server Actions │ Route Handlers │ Middleware            │
├─────────────────────────────────────────────────────────┤
│                      Domain Layer                        │
│  Auth │ Learning │ Gamification │ AI │ Adaptive Engine   │
├─────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                  │
│  Supabase Auth │ PostgreSQL │ Storage │ Gemini API       │
└─────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User → Login/Register Page
  ├── Email/Password → Supabase Auth → Session Cookie
  └── Google OAuth → Supabase OAuth → /auth/callback → Session

New User → auth.users INSERT trigger
  ├── Create profiles row
  ├── Assign 'student' role
  ├── Initialize user_gamification
  └── Initialize user_streaks
```

## Authorization Model

Role-Based Access Control (RBAC) via PostgreSQL RLS:

| Resource | Student | Parent | Teacher | Admin |
|----------|---------|--------|---------|-------|
| Own profile | RW | R (linked) | R (students) | RW |
| Content | R (published) | - | R | RW |
| Progress | RW (own) | R (linked) | R (students) | R |
| Gamification | R (own) | R (linked) | - | RW |
| Classes | Join | - | RW (own) | RW |
| AI Settings | - | - | - | RW |

## Content Model

All content is database-driven with JSONB metadata for program-specific configuration:

```typescript
// Program settings example (stored in program_settings table)
{
  "mastery_unlock_threshold": 3,
  "placement_test_questions": 30,
  "shield_display": {
    "reading": { "min": 0, "max": 15 },
    "listening": { "min": 0, "max": 15 }
  }
}

// Level metadata example (stored in levels.metadata)
{
  "cefr": "a2",
  "yle": true,
  "max_shields": 15
}
```

## Mastery & Unlock Logic

```
Lesson Attempt → Calculate accuracy & completion
  → Update lesson_progress
  → Determine mastery_level (0-4)
  → If mastery >= 3: unlock next lesson
  → Award XP via xp_logs
  → Update streak calendar
```

## Internationalization

- Default locale: Vietnamese (`vi`)
- All UI strings in `src/i18n/messages/{locale}.json`
- Dynamic content translations via `content_translations` table
- URL strategy: `localePrefix: 'as-needed'` (vi has no prefix)

## API Patterns

### Server Actions (Primary)
- `src/actions/auth.ts` — Authentication
- Future: `src/actions/learning.ts`, `src/actions/gamification.ts`

### Route Handlers (Webhooks/Callbacks)
- `src/app/auth/callback/route.ts` — OAuth callback

### Data Queries
- `src/lib/queries/` — Reusable Supabase queries

## Deployment (Vercel)

1. Connect GitHub repository
2. Set environment variables from `.env.example`
3. Configure Supabase production project
4. Run database migrations
5. Deploy

## Security Considerations

- Row Level Security on all tables
- Service role key server-side only
- OAuth redirect URLs whitelisted in Supabase
- Content approval workflow (draft → pending_review → published)
- AI-generated content requires admin review before publishing

## Future Module Integration Points

| Module | Integration Point |
|--------|-------------------|
| Exercise Engine | `exercises.content` JSONB + `questions` table |
| AI Writing | `writing_submissions` + `ai_feedback` |
| AI Speaking | `speaking_submissions` + Supabase Storage |
| Adaptive Engine | `learning_recommendations` table |
| League System | `leagues` + `league_rankings` weekly cron |
| Parent Dashboard | `parent_student_links` + aggregated queries |
