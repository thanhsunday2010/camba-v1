# Phase 10 — Data Model Alignment Migration Plan

**Migration file:** `supabase/migrations/010_data_model_alignment.sql`  
**Prerequisite:** Migrations 001–009 applied

---

## Overview

This sprint resolves schema-to-application drift identified in the platform audit without adding new product features.

| Drift area | Resolution |
|------------|------------|
| `question_type` vs `ExerciseType` | Add `reading_comprehension` to enum; migrate `reading` rows; app normalizer for legacy |
| Unlock model | Engine uses `unlock_after_lesson_id` as primary; `sort_order` fallback only |
| Shield scale | Unified 0–15 via `program_settings.shield_scale_max` and `shields.ts` |
| Stale progress on program switch | `lesson_progress.program_id` + cleanup on `selectProgram` |
| TypeScript drift | `database.ts` updated: `QuestionType`, `program_id`, RPC functions |

---

## Execution Order

### Step 1 — Backup (production)

```sql
-- Optional: snapshot progress before migration
CREATE TABLE lesson_progress_backup_20260618 AS
SELECT * FROM public.lesson_progress;
```

### Step 2 — Apply migration 010

```bash
# Supabase CLI
npx supabase db push

# Or SQL Editor: run contents of
# supabase/migrations/010_data_model_alignment.sql
```

**What it does:**

1. `ALTER TYPE question_type ADD VALUE 'reading_comprehension'`
2. `UPDATE questions SET question_type = 'reading_comprehension' WHERE question_type = 'reading'`
3. Adds `lesson_progress.program_id`, backfills from content hierarchy, sets NOT NULL
4. Adds indexes `idx_lesson_progress_program`, `idx_lesson_progress_user_program`
5. Seeds `program_settings.shield_scale_max = 15` for all programs

### Step 3 — Verify migration

```sql
-- No legacy reading question types
SELECT COUNT(*) FROM questions WHERE question_type = 'reading';
-- Expected: 0

-- All progress rows scoped
SELECT COUNT(*) FROM lesson_progress WHERE program_id IS NULL;
-- Expected: 0

-- Shield scale seeded
SELECT program_id, key, value FROM program_settings WHERE key = 'shield_scale_max';
```

### Step 4 — Deploy application

Deploy code that includes:

- `src/lib/learning/question-types.ts`
- `src/lib/learning/unlock.ts`
- `src/lib/learning/shields.ts`
- `src/lib/programs/progress-cleanup.ts`
- Updated actions/queries/types

### Step 5 — Run validation tests

```bash
npm run test:validation
```

---

## Rollback Plan

| Change | Rollback |
|--------|----------|
| `program_id` column | `ALTER TABLE lesson_progress DROP COLUMN program_id;` (loses scoping) |
| `reading_comprehension` enum value | Cannot remove enum value in PostgreSQL easily; keep app normalizer |
| Shield scale setting | Delete rows: `DELETE FROM program_settings WHERE key = 'shield_scale_max'` |
| App unlock logic | Revert to previous deploy |

**Note:** Enum value additions are forward-only in PostgreSQL. Rollback of question_type alignment relies on the app normalizer (`reading` → `reading_comprehension`).

---

## Post-Migration Application Behavior

### Program switch (`selectProgram`)

1. Deletes `lesson_progress` and `exercise_attempts` for other programs
2. Clears `shield_progress` and `current_level_id`
3. User retakes placement test for new program

### Lesson unlock

1. **Initial:** All lessons with `unlock_after_lesson_id IS NULL` in each unit
2. **After mastery:** Lessons where `unlock_after_lesson_id = completedLessonId`
3. **Fallback:** Next lesson by `sort_order` if no explicit dependents (legacy content)

### Mock test shields

- Skill accuracy → shield on **0–15** scale (was 1–5)
- Merged into `user_gamification.shield_progress` with clamping

---

## Future alignment (out of scope)

- Remove deprecated `reading` enum value (requires enum recreation)
- Implement `unlock_after_unit_id` for cross-unit gating
- Per-program `shield_progress` JSON structure
- Regenerate full `database.ts` via Supabase CLI codegen
- Add `program_id` to `exercise_attempts` for faster cleanup

---

## Related docs

- [SECURITY_REPORT.md](./SECURITY_REPORT.md) — Phase 9
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production runbook
