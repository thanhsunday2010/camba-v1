# U7.5 — Student Profile & Cambridge Portfolio Experience — Implementation Report

## 1. Audit findings

**Existing profile surfaces (pre-U7.5):**
- `/settings` — account editing only (`ProfileForm`), not a learning portfolio
- `/dashboard` — hero, missions, continue learning, weekly progress, mock preview, achievements preview, journey preview
- `/journey` — full Cambridge pathway visualization (U7.2)
- `/mock-tests` — Mock Center with readiness, gold collection, recent results (U7.3)
- `/achievements` — full achievement collection (U7.4)
- No dedicated `/profile` route despite middleware already protecting it

**Progress sources (reused):**
- Gamification: `getUserGamification`, `getUserStreak`, `xpProgressInLevel`
- Journey: `getLearningJourneyViewModel`, `getNextLessonContext`
- Mocks: `getMockTestHubViewModel`, `buildReadinessFromHub`, `pickRecommendedMock`
- Achievements: `buildStudentAchievementContext`, `buildAchievementViewModel`, `pickNextAchievement`
- Writing/Speaking: `ai_feedback` rows parsed by `parseWritingFeedbackRows` / `parseSpeakingFeedbackRows`

**Certification sources:**
- Gold Mock certifications from completed `isGoldMock` hub entries
- Level completions from journey level status
- Rare achievement entries as portfolio credentials (presentation layer)

**Analytics sources:**
- Mock scores/trends from hub + recent `mock_test_attempts`
- Writing strengths/weaknesses from M2 Writing AI `response_data`
- Speaking pronunciation/fluency/vocabulary from M2.3 Speaking AI dimensions

**Reusable components identified:** `AchievementShowcase`, `NextAchievementCard`, `PremiumMockCard`, `SectionHeader`, `CambaCard`, `DashboardEmptyState`, journey summary patterns.

**Technical debt noted:** Progress fragmented across four routes; settings conflated with identity; no single share-ready export surface (addressed via `shareReady` VM field, private-only for MVP).

**Missing portfolio concepts (now addressed):** unified hero, Cambridge snapshot, cross-domain growth sections, deterministic future goals, portfolio navigation entry points.

---

## 2. Portfolio architecture

**New layer:** `src/lib/profile/`

| File | Role |
|------|------|
| `student-profile-types.ts` | Portfolio VM slices: identity, hero, snapshot, learning, mock, writing, speaking, certifications, achievements, journey, futureGoals, `shareReady` |
| `student-profile-view-model.ts` | `getStudentPortfolioViewModel()` — single server aggregation |
| `student-profile-utils.ts` | AI feedback parsing, profile completion %, future goals, trends, rare achievements |
| `student-profile-labels.ts` | Re-exports `StudentProfileViewLabels` for integrators |

**Principle:** Aggregate and present only — no new scoring, progress calculations, or certification engines.

**Sharing readiness (Phase N):** `shareReady` object on VM includes student name, level, CEFR, activity counts, certification count, `generatedAt` — ready for parent/teacher export in U8 without public profiles in MVP.

---

## 3. Profile page implementation

**Route:** `/profile` → `src/app/[locale]/(dashboard)/profile/page.tsx`

- Loads current user, calls `getStudentPortfolioViewModel(user, t("nextMilestoneFallback"))`
- Resolves achievement, certification, milestone, and goal text via existing i18n helpers
- Renders `StudentProfileView` inside `StudentPageShell narrow`
- Loading skeleton: `profile/loading.tsx`

---

## 4. Profile hero

**Component:** `StudentProfileHero`

Displays: student name, Cambridge level/program, CEFR badge, XP, gamification level, current/best streak, profile completion progress bar, member since date, link to account settings.

Visual: premium gradient card, professional typography — not social-media style.

---

## 5. Cambridge snapshot

**Component:** `CambridgeSnapshotCard`

Compact stat grid: level, CEFR, units completed, mocks completed, writing/speaking tasks, certifications earned, achievements unlocked. Empty note for new students.

---

## 6. Learning progress section

**Component:** `LearningProgressSection`

Reuses journey/next-lesson data from VM — current unit/lesson, units/lessons completed, progress %, next milestone, CTA to `/journey`. Guided empty state when no progress.

---

## 7. Mock performance section

**Component:** `MockPerformanceSection`

Reuses mock hub analytics: best/latest score, mocks completed, readiness band, performance trend, recent results list, recommended mock via `PremiumMockCard`. CTA to Mock Center. Empty state for students with no mock history.

---

## 8. Writing growth section

**Component:** `WritingGrowthSection`

From parsed M2 Writing AI feedback: tasks completed, average score, top strengths, improvement areas, recent activity, trend label. Empty state guides to learning path.

---

## 9. Speaking growth section

**Component:** `SpeakingGrowthSection`

From M2.3 Speaking AI evaluations: tasks completed, average score, pronunciation/fluency/vocabulary averages, recent activity, trend. No new evaluation logic.

---

## 10. Certification showcase

**Component:** `CertificationShowcase`

Gold Mock certifications, level completions, rare achievement credentials. Each entry styled as a valuable credential card. Future-ready kinds for writing/speaking certifications in types. Empty state with mock center CTA.

---

## 11. Achievement showcase

**Component:** `ProfileAchievementSection`

Integrates U7.4 `AchievementShowcase` + `NextAchievementCard`. Shows recent unlocked, rare achievements strip, progress toward next achievement, view-all CTA to `/achievements`.

---

## 12. Journey integration

**Component:** `JourneyProgressSection`

Integrates U7.2 journey VM: current level, levels completed, journey completion %, current/next milestone (resolved via journey i18n). Reinforces portfolio ↔ journey relationship. Empty state for unconfigured program.

---

## 13. Future goals section

**Component:** `FutureGoalsCard`

Deterministic goals from `buildFutureGoals()`: next achievement, recommended mock, level completion, first gold mock, writing improver, streak targets. Capped at 5 goals. No AI required.

---

## 14. Mobile optimization

- Single-column `camba-section-stack` layout throughout
- Hero stats: 2-column grid on small screens, 3-column on sm+
- Responsive cards with `min-w-0`, flex-wrap headers
- Mock recommended card and achievement carousel use existing responsive patterns
- Tested layout targets: 320px, 375px, 390px, 768px — no horizontal scroll intended

---

## 15. Accessibility review

- Semantic `<section>` + `aria-labelledby` on all portfolio sections
- Progress bars use `role="progressbar"` with valuenow/min/max
- Goal list uses `<ol role="list">`
- Portfolio link buttons keyboard-focusable via `camba-focus-ring`
- Icon decorations marked `aria-hidden`
- Achievement filters retain tablist semantics on achievements page (unchanged)

---

## 16. Performance review

- Single `getStudentPortfolioViewModel()` call on profile page
- Achievement context fetched once, then parallel fetches for gamification, streak, mock hub, AI feedback, recent mocks
- Journey VM loaded only when program exists (heavier query, acceptable for dedicated portfolio page)
- Pure transforms in `student-profile-utils.ts` — no repeated client-side recalculation
- Dashboard/journey/mock/achievements pages unchanged in data fetching — only add lightweight `PortfolioLink`

---

## 17. Empty-state review

Every section handles zero-data gracefully:
- Snapshot: motivational empty note
- Learning, mock, writing, speaking, certifications, journey: titled empty states + action CTAs
- Achievements: reuses U7.4 showcase empty states
- Future goals: dashed card when no goals yet
- New students never see blank screens

---

## 18. Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (pre-existing warnings only, none in profile code) |
| `npm run test:validation` | **237/237 pass** (includes 5 new U7.5 profile utils tests) |

**New tests:** `src/lib/profile/student-profile-utils.validation.test.ts` — profile completion, AI feedback parsing, future goals, trends.

---

## 19. Readiness for U8 Parent Experience

**Ready:**
- `shareReady` view model field for export/parent summary
- Portfolio aggregates all domains parents care about in one URL
- Certification and achievement presentation layers decoupled from engines
- i18n complete for EN + VI

**U8 can add:**
- Parent-facing read-only portfolio route using same VM
- PDF/export from `shareReady` + section slices
- Teacher share links without exposing account settings

**Explicitly not in MVP:** public profiles, social sharing, profile editing beyond settings link.

---

## Dashboard integration (Phase O)

| Surface | Integration |
|---------|-------------|
| Nav | `/profile` with UserCircle icon |
| Dashboard | `PortfolioLink` in `DashboardHero` |
| Journey | Header portfolio link |
| Mock Center | Header portfolio link |
| Achievements | Header portfolio link |

**Component:** `PortfolioLink` → `/profile`

---

## Success definition

When a student opens **CAMBA Profile**, they immediately understand:
- Who they are as a Cambridge learner (hero + snapshot)
- What they have accomplished (certifications, achievements, journey)
- How they are improving (writing/speaking growth, mock trends)
- What certifications they have earned (gold mocks, level completions)
- What they should do next (future goals)

The profile is a premium Cambridge learning portfolio — not a settings page.
