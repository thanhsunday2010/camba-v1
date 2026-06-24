# U7.2 — Cambridge Learning Journey Experience — Implementation Report

## 1. Audit findings

**Curriculum structure:** Program → Level → Skill → Unit → Lesson. UI pivots skills into thematic unit groups via `pivotSkillsToCurriculumUnits()`.

**Progress (unchanged):** Lesson completion from `updateLessonProgress()` / `calculateLessonCompletion()`. Unlock via `unlock_after_lesson_id` + mastery threshold. Mocks are **not** lesson-gated.

**Reused:** `getLearningPath`, `getNextLessonContext`, `getMockTestHubViewModel`, `path-ui-utils` (unit/level progress math, visual states), `pivotSkillsToCurriculumUnits`, `pickRecommendedMock`, `CambaCard`, `ProgressRing`, `SectionHeader`, `LearningPathEmpty`, `LearningLevelSwitcher`.

**Extended:** New visual journey layer only — no new progress tables or unlock rules.

**Untouched:** Lesson player, scoring, mock player, gamification formulas, AI evaluation.

---

## 2. Journey architecture

Visual layer mapping:

```
Cambridge Program
  └── Level cards (Starters → PET)
        └── Unit roadmap (current level)
              └── Mock checkpoint
                    └── Major milestones
```

Route: `/journey` — aspirational roadmap. Dashboard preview links here.

---

## 3. View model implementation

| File | Role |
|------|------|
| `learning-journey-types.ts` | `JourneyLevel`, `JourneyUnit`, `JourneyMock`, `JourneyMilestone`, `LearningJourneyViewModel` |
| `learning-journey-utils.ts` | Pure derivations from existing progress |
| `learning-journey-view-model.ts` | `getLearningJourneyViewModel()` — server aggregation |

Progress sources: `fetchUserLessonProgress`, `getLearningPath` (current level detail), `getMockTestHubViewModel`, `getUserGamification`.

---

## 4. Journey page implementation

- `src/app/[locale]/(dashboard)/journey/page.tsx`
- `src/app/[locale]/(dashboard)/journey/loading.tsx`
- `src/components/journey/journey-view.tsx`

---

## 5. Level cards

`JourneyLevelCard` — per-level completion %, lessons/mocks counts, writing/speaking progress, CEFR badge, current-position indicator.

---

## 6. Unit roadmap

`JourneyUnitRoadmap` — vertical timeline with completed / current / locked / upcoming units + mock checkpoint at end.

---

## 7. Mock milestones

`JourneyMockMilestone` — Gold badge, writing/speaking badges, recommended/completed states, links to mock detail.

---

## 8. Achievement milestones

`JourneyMilestoneSection` — level completions, first writing/speaking exam, first Gold mock, KET/PET ready — derived from existing completion data.

---

## 9. Dashboard integration

- `DashboardJourneyPreview` on dashboard after Continue Learning
- `buildJourneyPreview()` in `student-dashboard-data.ts`
- Nav item: **Learning Journey** → `/journey`

---

## 10. Mobile optimization

- Vertical roadmap (no horizontal page scroll)
- Level cards: 1 → 2 → 3 column responsive grid
- Touch-friendly CTAs and milestone cards
- Progress summary stacks on small screens

---

## 11. Accessibility review

- Semantic headings (`h1` page, `h2` sections)
- `aria-labelledby` on sections
- `role="list"` / `listitem` on roadmap and milestones
- `camba-focus-ring` on links
- Progress ring + `role="progressbar"` on dashboard hero (U7.1)

---

## 12. Performance review

- Parallel fetch batch in `getLearningJourneyViewModel`
- Program-wide lesson aggregates in one query (not N× `getLearningPath`)
- Full path tree only for **current level** (unit roadmap detail)
- Dashboard preview uses existing dashboard data — no extra journey VM on dashboard load

---

## 13. Empty-state review

- No level selected → `LearningPathEmpty` + level switcher on `/journey`
- No mocks → mock milestone empty card with CTA
- Dashboard preview empty → guided CTA to `/journey`
- Weekly/summary zeros explained via copy (not raw blanks)

---

## 14. Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (pre-existing warnings only) |
| `npm run test:validation` | 227/227 pass |

---

## 15. Readiness for U7.3 Mock Center Redesign

Journey surfaces mock milestones and recommended mocks using `getMockTestHubViewModel` + display states. U7.3 can enhance mock hub UI while journey mock sections continue to consume the same hub view model and aggregates.

---

## Key files

| Area | Path |
|------|------|
| Types | `src/lib/learning/journey/learning-journey-types.ts` |
| Utils | `src/lib/learning/journey/learning-journey-utils.ts` |
| View model | `src/lib/learning/journey/learning-journey-view-model.ts` |
| Page | `src/app/[locale]/(dashboard)/journey/page.tsx` |
| Components | `src/components/journey/*.tsx` |
| Dashboard preview | `src/components/dashboard/dashboard-journey-preview.tsx` |
| i18n | `journey.*`, `dashboard.journeyPreview*` in en/vi JSON |
