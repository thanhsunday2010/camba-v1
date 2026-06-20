# CAMBA Phase 9 — Security Report

**Date:** June 18, 2026  
**Scope:** Re-audit after Security & Integrity Sprint (P0 fixes)  
**Build:** `npm run typecheck`, `npm run lint`, `npm run build` — pass

---

## Executive Summary

All **seven P0 items** from the platform audit have been addressed. The platform is materially safer for student-facing use, but **P1/P2 items remain** (rate limiting, class RLS, league bootstrap, etc.) and should be tackled in a follow-up sprint.

| P0 Item | Status |
|---------|--------|
| 1. Answer keys removed from client payloads | ✅ Fixed |
| 2. Password reset flow completed | ✅ Fixed |
| 3. AI publish workflow (`is_active`) | ✅ Fixed |
| 4. IDOR via `userId` parameters | ✅ Fixed |
| 5. Lesson unlock validation server-side | ✅ Fixed |
| 6. OAuth redirect sanitization | ✅ Fixed |
| 7. Speaking audio storage secured | ✅ Fixed |

**Post-sprint security grade: C+ → B** (student cheating vectors and auth gaps closed; operational hardening still needed)

---

## 1. Answer Keys Removed from Client Payloads

### Before
- `choices.is_correct` sent to browser in lessons, placement tests, and mock tests
- `question.content.correctAnswers`, `correctOrder`, and `pairs.right_text` exposed pre-submit

### After
- `src/lib/learning/sanitize-questions.ts` strips answer keys before any client-bound query
- Server scoring uses `fetchExerciseQuestionsFull`, `fetchPlacementTestFull`, `fetchMockTestByIdFull` (full data, server-only)
- `QuestionResult` from submit actions includes reveal data **only after** scoring
- UI components (`multiple-choice`, `multi-select`, `matching`, `gap-fill`, `sentence-ordering`) use `questionResult` for post-submit feedback

### Residual risk
- **Low:** RLS still allows authenticated users to SELECT raw `choices` via direct Supabase client if someone bypasses the app. Mitigation: app no longer exposes keys; DB-level column restriction would be P2.

---

## 2. Password Reset Flow

### Before
- Email redirected to `/reset-password` — page did not exist

### After
- `src/app/[locale]/(auth)/reset-password/page.tsx` + `ResetPasswordForm`
- `updatePassword` server action validates length/match, calls `supabase.auth.updateUser`
- Reset email redirects via `/auth/callback?next=/reset-password` (PKCE code exchange)
- i18n strings added (vi, en)

### Residual risk
- **Low:** Supabase email template and Site URL must include production callback URL (documented in `docs/DEPLOYMENT.md`)

---

## 3. AI Publish Workflow

### Before
- AI exercises created with `is_active: false`; publish set `status: published` only → invisible to students (RLS requires both)

### After
- `updateExerciseStatus` sets `is_active: true` when `status === "published"`

### Residual risk
- **None** for this specific bug

---

## 4. IDOR Elimination

### Before
Server actions accepted arbitrary `userId` from client:
- `fetchActiveProgramContext(userId)`
- `fetchActiveRecommendations(userId)`
- `getLatestStudyCoach(userId)`
- `getWritingFeedbackHistory(userId)`
- `getSpeakingFeedbackHistory(userId)`
- `startLesson(userId, ...)`
- `completeAiExercise(userId, ...)` / `saveAiFeedback({ userId })`

### After
- `src/lib/auth/session.ts` — `getSessionUser()` / `requireSessionUser()`
- All above actions derive user ID from session; no client-supplied user ID
- `completeAiExercise` and `saveAiFeedback` use session internally

### Residual risk
- **Medium:** Parent/teacher RPCs and queries that accept student IDs by design are unchanged (authorized via RLS). Direct Supabase API abuse still bounded by RLS.

---

## 5. Lesson Unlock Validation (Server-Side)

### Before
- `submitExerciseAttempt` did not verify `lesson_progress.is_unlocked`
- UI-only lock could be bypassed

### After
- `src/lib/auth/lesson-access.ts`:
  - `assertLessonUnlockedForUser`
  - `assertExerciseInLesson` (validates lesson_id, `is_active`, `published`)
- Enforced in:
  - `submitExerciseAttempt`
  - `submitWritingForFeedback` / `submitSpeakingForFeedback`
  - `completeAiExercise`

### Residual risk
- **Low:** Placement test and mock test paths are intentionally open once authenticated (by design)

---

## 6. OAuth Redirect Sanitization

### Before
- `next` query param passed directly to redirect → open redirect

### After
- `src/lib/auth/redirect.ts` — `sanitizeRedirectPath` rejects `//`, `://`, backslashes
- Auth callback uses sanitizer before redirect
- Login form passes middleware `redirect` param; `signIn` honors sanitized path

### Residual risk
- **Low:** Relative paths only; external URLs blocked

---

## 7. Speaking Audio Storage

### Before
- Bucket `speaking-audio` public with open SELECT policy
- `getPublicUrl()` stored in DB

### After
- Migration `009_security_integrity.sql`:
  - Bucket set `public = false`
  - Drops `"Public read speaking audio"` policy
  - Adds teacher/parent/admin read policies via `is_teacher_of`, `is_parent_of`, `is_admin`
- `speaking.ts` stores storage path; uses `createSignedUrl` (7-day) when upload succeeds

### Residual risk
- **Low:** Signed URLs in DB expire; playback of historical submissions may need re-signing (P2 enhancement)
- **Note:** Run migration `009` on all environments

---

## Remaining Findings (Not P0 — Out of Scope)

| ID | Severity | Issue |
|----|----------|-------|
| R1 | P1 | No rate limiting on auth/AI endpoints |
| R2 | P1 | `classes` INSERT RLS does not require `is_teacher()` |
| R3 | P1 | League system RLS may block student league bootstrap |
| R4 | P2 | Placement/mock test questions still `SELECT TRUE` for all authenticated users |
| R5 | P2 | `createClass` lacks app-level teacher role check |
| R6 | P2 | Signed speaking URLs stored in DB will expire |

---

## Verification Checklist

- [x] Typecheck passes
- [x] Lint passes (no errors)
- [x] Production build passes
- [x] `/reset-password` route generated (5 locales)
- [x] Server actions no longer accept client `userId` for own-data reads
- [x] Migration `009` created for storage hardening

### Manual QA recommended

1. Complete an exercise — verify no `is_correct` in Network tab response HTML/JSON
2. Request password reset → follow email → set new password → login
3. Publish AI-generated exercise → confirm visible to student
4. Attempt `submitExerciseAttempt` on locked lesson via devtools — expect error
5. OAuth callback with `?next=https://evil.com` — should not redirect externally
6. Upload speaking audio — confirm bucket is private; URL is signed

---

## Files Changed (Phase 9)

| Area | Key files |
|------|-----------|
| Answer sanitization | `src/lib/learning/sanitize-questions.ts`, `src/lib/queries/learning.ts`, `src/lib/queries/mock-tests.ts`, exercise components |
| Auth | `src/actions/auth.ts`, `src/app/auth/callback/route.ts`, `src/lib/auth/redirect.ts`, `src/lib/auth/session.ts`, reset-password page/form |
| Lesson access | `src/lib/auth/lesson-access.ts`, `src/actions/learning.ts`, AI actions |
| IDOR | `src/actions/programs.ts`, `src/actions/ai/*.ts`, dashboard/settings/placement pages |
| CMS publish | `src/actions/admin/content.ts` |
| Storage | `supabase/migrations/009_security_integrity.sql`, `src/actions/ai/speaking.ts` |

---

## Conclusion

Phase 9 closes all audited **P0 security and integrity gaps**. The platform can proceed toward staged production rollout after running migration **009** and completing manual QA above. Schedule Phase 10 for P1 items (rate limiting, class/league RLS, signed URL refresh).
