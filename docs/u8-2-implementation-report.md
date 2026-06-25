# U8.2 — Motion System & Celebration Layer — Implementation Report

## 1. Motion audit findings

Pre-U8.2 CAMBA relied on CSS utilities (`camba-scale-in`, `camba-pulse-soft`, width-based progress transitions) and Sonner toasts. **Framer Motion was not installed.** Celebrations were fragmented between toasts and modals with no shared motion layer.

Full audit: `docs/design-system/u8-2-motion-audit.md`

---

## 2. Motion principles

**File:** `src/lib/design/motion-principles.ts`

Five categories: Navigation, State Change, Progress, Celebration, Feedback — each with purpose, examples, and max duration. Documented allowed transforms (opacity, scale, translate) and forbidden patterns (width animation on large containers, confetti, list-wide bounce).

---

## 3. Motion token system

**File:** `src/lib/design/motion-tokens.ts`

| Token | Duration |
|-------|----------|
| fast / microinteraction | 150ms |
| normal / modal | 250ms |
| slow | 400ms |
| celebration | 600ms |
| page | 300ms |

CSS mirror updated in `src/styles/tokens/motion.css` with `--duration-celebration`, `--duration-page`, `--duration-modal`, and skeleton shimmer keyframes.

**Utils:** `src/lib/design/motion-utils.ts` — `motionDuration`, `fadeUpVariants`, `pageTransitionVariants` with reduced-motion zeroing.

---

## 4. Shared motion primitives

**Directory:** `src/components/camba/motion/`

| Component | Purpose |
|-----------|---------|
| `AnimatedSection` | Section fade-up with stagger |
| `AnimatedCard` | Card enter + optional hover lift |
| `AnimatedCounter` | Stat count-up (rAF, reduced-motion safe) |
| `AnimatedProgress` | scaleX progress bar |
| `AnimatedBadge` | Badge scale-in |
| `AnimatedAchievement` | Achievement carousel item |
| `AnimatedPageTransition` | Route enter/exit |
| `XPGainAnimation` | Floating +XP burst |
| `BadgeUnlockAnimation` | Achievement/cert reveal banner |
| `MockCompletionCelebration` | Wraps existing complete summary |
| `SkeletonShimmer` | Premium loading shimmer |
| `MotionCelebrationProvider` | Hosts XP/badge overlays |

**Hook:** `useCambaMotion()` — reduced motion, transitions, stagger.

Exported from `@/components/camba`.

---

## 5. Dashboard enhancements

- `StudentDashboardView`: all sections wrapped in `AnimatedSection` with stagger indices
- `DashboardHero`: `AnimatedCounter` for XP, `AnimatedProgress` for level bar (client component)
- `DashboardSkeleton`: `SkeletonShimmer` blocks
- `CelebrationProvider`: wires `showXpBurst` on XP/level events

---

## 6. Journey enhancements

- `JourneyView`: header, summary, levels, units, mocks, milestones in `AnimatedSection`
- `JourneyLevelCard`: wrapped in `AnimatedCard` with per-index delay

---

## 7. Mock center enhancements

- Featured mock hero: `AnimatedSection` entrance
- `PremiumMockCard`: `AnimatedCard` with hover lift
- `MockTestCompleteSummary`: score `AnimatedCounter`
- `MockTestPageShell`: `MockCompletionCelebration` wrapper (enhances, does not replace summary)

---

## 8. Achievement celebrations

- `AchievementShowcase`: `AnimatedAchievement` per carousel item
- `AchievementUnlockNotifier`: toast + `BadgeUnlockAnimation` via `MotionCelebrationProvider`
- Achievements loading: `SkeletonShimmer` grid

---

## 9. XP gain animation

**Component:** `XPGainAnimation`  
**Trigger:** `celebrateXp`, `celebrateLevelUp` (via `CelebrationProvider`)  
**Behavior:** Small floating +XP label, rise + fade, auto-dismiss, bottom-right — no full-screen overlay.

---

## 10. Badge unlock animation

**Component:** `BadgeUnlockAnimation`  
**Trigger:** Achievement unlock notifier, `celebrateBadge`  
**Behavior:** Scale-in card with subtle glow, auto-dismiss ~2.2s. Toast retained for accessibility.

---

## 11. Mock completion celebration

**Component:** `MockCompletionCelebration`  
Wraps `MockTestCompleteSummary` on mock take complete layer — spring scale-in entrance only.

---

## 12. Writing/Speaking completion feedback

- `WritingFeedbackCard`: `AnimatedSection` entrance + `AnimatedCounter` on overall score
- `SpeakingFeedbackCard`: same pattern
Educational tone preserved — no exaggerated effects.

---

## 13. Loading motion improvements

- `SkeletonShimmer` + `camba-skeleton-shimmer` CSS (opacity pulse, disabled under reduced motion)
- Profile, achievements, dashboard loading updated
- Existing `DashboardSkeleton` upgraded

---

## 14. Accessibility review

- All Framer Motion components use `useReducedMotion()` — durations zeroed, transforms skipped
- CSS `@media (prefers-reduced-motion: reduce)` disables infinite animations
- Celebrations retain Sonner toasts when motion disabled
- Progress bars keep `role="progressbar"` + aria values
- `aria-live="polite"` on XP burst container

---

## 15. Performance review

- Transform/opacity only on motion primitives
- `AnimatedProgress` uses `scaleX` not width animation
- Stagger capped; no animation on long achievement lists beyond visible carousel items
- Page transition `mode="wait"` with 300ms budget
- No layout thrashing from height/width tweens on U7 surfaces

---

## 16. Technical debt cleanup

- Consolidated celebration overlays into `MotionCelebrationProvider`
- Extended CSS motion tokens (celebration/page/modal durations)
- Added shimmer replacing raw `animate-pulse` on premium loading routes
- Legacy `camba-scale-in` retained for modals (compatible with Framer layer)

**Not removed (U8.5):** Legacy `camba-animate-fill` width transitions on older progress bars outside U7 hero.

---

## 17. Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (pre-existing warnings) |
| `npm run test:validation` | **244/244 pass** (+3 motion tests) |

---

## 18. Readiness for U8.3 Empty State Overhaul

- Motion primitives ready to wrap unified empty states
- `AnimatedSection` can animate empty → content transitions
- Celebration layer separate from empty-state visuals — U8.3 can refactor `DashboardEmptyState` without breaking motion
- Shimmer skeleton pattern established for empty-state loading handoff

---

## Page transition

**File:** `src/app/[locale]/(dashboard)/template.tsx`  
Subtle fade + 8px Y on dashboard route changes via `AnimatedPageTransition`.

---

## Success definition

Students experience clearer progress feedback (animated stats, progress bars, section reveals) and meaningful celebration moments (XP burst, badge reveal, mock complete entrance) without game-like distraction. Motion respects `prefers-reduced-motion` and maintains CAMBA's premium Cambridge tone.
