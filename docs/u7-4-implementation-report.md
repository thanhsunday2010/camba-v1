# U7.4 — Achievement & Motivation System — Implementation Report

## 1. Audit findings

**Existing gamification (reused, not duplicated):**
- XP/level: `awardXp`, `calculateLevelFromXp` in `src/lib/gamification/`
- Badges DB: `badges` + `user_badges` via `checkAndAwardBadges`, `getUserBadges`
- Streaks: `user_streaks`, `streak_calendar` via `recordDailyActivity`
- Missions: `daily_missions` / `user_daily_missions`
- Triggers: `onExerciseCompleted`, `onMockTestCompleted` in `events.ts`

**Previous UI:** `DashboardAchievementStrip` showed DB badges only (max 5, earned only, no progress). Dormant `AchievementSection`, orphaned streak/mission components, celebration provider not wired to server awards.

**Parallel systems:** Journey milestones computed but not linked to achievements; no writing/speaking badge criteria in DB.

**Technical debt noted:** Celebration disconnect, league UI dead, duplicate badge card implementations. U7.4 adds unified presentation layer without replacing XP/certification engines.

---

## 2. Achievement architecture

**New layer:** `src/lib/achievements/`

| File | Role |
|------|------|
| `achievement-types.ts` | Categories, rarity, criteria, context, evaluated VM types |
| `achievement-definitions.ts` | 24 static `AchievementDefinition` entries |
| `achievement-utils.ts` | `evaluateStudentAchievements`, `buildAchievementViewModel`, `pickNextAchievement` |
| `achievement-view-model.ts` | Server aggregation + context builder |
| `achievement-i18n.ts` | Label builders + text resolution |

**Principle:** Aggregate and present only — no duplicate XP, certification, or scoring logic.

---

## 3. Achievement definitions

24 achievements across 7 categories:

- **Learning:** First Lesson, Unit Explorer, Learning Streak
- **Assessment:** First Mock, Mock Explorer, Assessment Champion
- **Writing:** First Writing Task, Writing Improver, Writing Specialist
- **Speaking:** First Speaking Task, Speaking Explorer, Speaking Champion
- **Consistency:** 3/7/30-Day Streak
- **Cambridge Journey:** Completed Starters/Movers/Flyers, KET Ready, PET Ready
- **Certification:** First Gold Mock, Gold Mock Finisher, Multi-Mock Certified, Cambridge Excellence

Each has: id, titleKey, descriptionKey, category, icon, rarity (presentation only), numeric criteria, sortOrder.

---

## 4. Evaluation engine

**`evaluateStudentAchievements(context)`** — pure, deterministic.

**Context sources (single server fetch):**
- Lesson/unit progress from `lesson_progress`
- Mock stats from `mock_test_attempts` + hub gold flags
- Writing/speaking from `ai_feedback` counts
- Streaks from `user_streaks`
- Level completion from journey-style aggregates
- DB badge slugs for bridge criteria (future `badge_slug` type)

**Output:** unlocked state, progress current/target/percent, `pickNextAchievement` (closest locked by remaining count).

---

## 5. Achievement showcase

**Component:** `src/components/achievements/achievement-showcase.tsx`

Horizontal scroll carousel of recent unlocked achievements with rarity styling, tap-to-detail, empty state, view-all link.

Used on dashboard via `DashboardAchievementsSection`.

---

## 6. Achievement detail modal

**Component:** `src/components/achievements/achievement-detail-dialog.tsx`

Shows title, description, category, rarity, unlock condition, progress bar, unlock date (when available), next-step hint.

Opened from showcase and collection page cards.

---

## 7. Next achievement card

**Component:** `src/components/achievements/next-achievement-card.tsx`

Displays closest locked achievement with progress message (e.g. "Complete 1 more to unlock Mock Explorer") and link to `/achievements`.

On dashboard below showcase; in Mock Center when assessment/certification next exists.

---

## 8. Dashboard integration

**Files:** `student-dashboard-data.ts`, `dashboard-achievements-section.tsx`, `student-dashboard-view.tsx`

Replaces badge-only strip with:
1. Recent achievements showcase
2. Next achievement card
3. Unlock notifier (subtle toast for newly seen unlocks)

Concise — action-focused dashboard preserved.

---

## 9. Journey integration

**Files:** `journey-achievement-preview.tsx`, `journey-view.tsx`, `journey/page.tsx`

Journey page shows linked achievements (journey + gold + writing/speaking specialist) below milestone section — reinforces milestone ↔ achievement connection.

---

## 10. Mock Center integration

**Files:** `mock-center-view-model.ts`, `mock-center-achievement-preview.tsx`, `mock-center-view.tsx`

Mock Center fetches `getAchievementPreviewForMocks` in parallel with hub data. Surfaces assessment unlocked + next assessment/certification achievement at bottom.

---

## 11. Unlock notifications

**Component:** `src/components/achievements/achievement-unlock-toast.tsx`

`AchievementUnlockNotifier` compares unlocked IDs to `localStorage` and shows subtle Sonner toasts (max 3 per visit). Premium educational copy — does not block learning flow.

Also exports `showAchievementUnlockToast` for manual triggers.

---

## 12. Achievement collection page

**Route:** `/achievements`

**Component:** `achievements-collection-view.tsx`

Trophy room with filters: status (all/unlocked/locked), category, rarity. Grid layout, detail modal, encouragement for new students.

Nav link added in `dashboard-nav.tsx`.

---

## 13. Mobile optimization

- Single-column collection grid; horizontal scroll showcase on dashboard
- Touch-friendly filter chips and card tap targets
- `line-clamp`, `flex-wrap`, no horizontal page overflow
- Responsive grids: 1 → 2 → 3 columns

---

## 14. Accessibility review

- Semantic headings (`h1`–`h3`), `aria-labelledby` on sections
- Filter chips as `role="tab"` with `aria-selected`
- Progress bars with `role="progressbar"` and aria values
- Screen-reader labels for locked/unlocked state
- `camba-focus-ring` on interactive cards and filters
- Decorative icons `aria-hidden`

---

## 15. Performance review

- Single `buildStudentAchievementContext` per page load (parallel Supabase queries)
- Pure evaluation — no repeated DB calls per achievement
- Dashboard: achievements fetched alongside existing dashboard parallel batch
- Mock Center: achievement preview in existing `Promise.all` with hub
- Journey: separate lightweight preview fetch (shares evaluation utils)

---

## 16. Empty-state review

| Surface | Behavior |
|---------|----------|
| Dashboard showcase | Encouragement + CTA to learning |
| Next achievement | Fallback card with start-learning CTA |
| Collection page | Filter empty state + global encouragement banner for 0 unlocks |
| Mock Center preview | Hidden when no assessment achievements to show |
| Journey preview | Hidden when no journey-related achievements |

No blank sections; no unexplained zeros.

---

## 17. Validation results

```
npm run typecheck   — pass
npm run lint        — pass (pre-existing warnings only)
npm run test:validation — 232/232 pass (includes achievement-evaluation.validation.test.ts)
```

---

## 18. Readiness for U8.1 Parent & Progress Experience

**Prepared hooks:**
- `getAchievementViewModel` can feed parent dashboard achievement summary
- Category/rarity filters map to parent-friendly progress reports
- Progress percent on locked achievements supports "what child is working toward"
- Existing `user_badges` bridge allows merging legacy badges with new achievement catalog
- No changes to XP/scoring — parent view can show achievements without exposing game mechanics

**Suggested U8.1 integration:** Parent dashboard strip using `unlockedCount/totalCount` + next achievement title; weekly digest of new unlocks from `recentUnlocked`.

---

## Key files

| Area | Path |
|------|------|
| Types | `src/lib/achievements/achievement-types.ts` |
| Definitions | `src/lib/achievements/achievement-definitions.ts` |
| Evaluation | `src/lib/achievements/achievement-utils.ts` |
| Server VM | `src/lib/achievements/achievement-view-model.ts` |
| Collection page | `src/app/[locale]/(dashboard)/achievements/page.tsx` |
| Dashboard | `src/components/dashboard/dashboard-achievements-section.tsx` |
| i18n | `achievements.*` in `en.json` / `vi.json` |
