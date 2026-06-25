# U8.1 — Design System Audit & UX Consistency — Implementation Report

## 1. Audit scope

Audited student-facing surfaces across:

- `src/components/camba/` — primitives, cards, feedback, layout
- `src/components/dashboard/` — U7.1 dashboard (31 files)
- `src/components/journey/` — U7.2 journey (8 files)
- `src/components/mock-tests/` — U7.3 mock center + legacy hub
- `src/components/achievements/` — U7.4 achievements
- `src/components/profile/` — U7.5 portfolio
- `src/components/learning/` — path, units, lesson player
- `src/components/writing/` — Writing AI
- `src/components/speaking/` — Speaking AI
- `src/app/[locale]/(dashboard)/` — routes and loading.tsx files

**Method:** Code review, token file analysis, grep-based usage counts, component import graph. No page redesigns or functional changes.

**Visual reference:** `/design-system` showcase page. Screenshot capture checklist in `docs/design-system/u8-1-design-audit.md`.

---

## 2. Typography findings

- **High:** Page title fragmentation (`camba-display` vs `PageHeader`/`camba-h1` vs responsive overrides)
- **Medium:** Empty states use `camba-h2` while sections use `camba-h3`
- **High:** Legacy `text-gray-*` on parent/teacher progress overview
- **Deliverable:** `src/lib/design/typography.ts` — canonical role → class mapping

---

## 3. Spacing findings

- **Medium:** `camba-section-stack` gap overridden per page (`gap-8 sm:gap-10` vs `gap-6 sm:gap-8`)
- **Medium:** Hero padding uses responsive literals outside `--space-card` tokens
- **Low:** Grid gaps (`gap-3/4/6`) not mapped to xs–2xl scale
- Tokens exist in `spacing.css`; adoption incomplete on U7 pages

---

## 4. Card hierarchy findings

**Canonical:** `CambaCard` with variants (default, elevated, hero, achievement, lesson, mockTest, empty).

**Issues:**

- Three mock card implementations (High)
- Heroes use `rounded-3xl` vs card `rounded-2xl` (Medium)
- Dual elevation system: CVA + `.camba-card` globals (Medium)

**Classification:**

| Tier | Variants / examples |
|------|---------------------|
| Primary | `elevated`, `hero`, featured mock |
| Secondary | `default`, journey level cards |
| Summary | Profile snapshot, journey progress summary |
| Action | `lesson`, `mockTest` interactive |
| Achievement | `achievement` variant + rarity ring |

---

## 5. Button hierarchy findings

- **Primary:** `quest` variant for motivational CTAs (empty states)
- **Secondary:** `outline`, `default`
- **Tertiary:** `ghost` (portfolio link, nav)
- **High debt:** `gray-*` in shadcn button outline/ghost variants
- Loading/disabled: ad-hoc per form; no shared `Button loading` pattern

---

## 6. Badge/status findings

- **Canonical:** `LessonStatusPill`, `AchievementRarityBadge`, `ProgramBadge`, `MockAiSkillBadges`
- **Gap:** Mock readiness bands use inline colors, not shared pill
- **Gap:** Gold badge styling inline in PremiumMockCard
- Status tokens in `status-tokens.ts` — well structured for learning states

---

## 7. Loading-state findings

| Severity | Issue |
|----------|-------|
| High | Journey route uses LearningPathSkeleton — layout mismatch |
| Medium | Profile/achievements use raw Skeleton, not shared patterns |
| OK | Dashboard, mock-tests use dedicated skeletons |

Recommendation: Add `JourneySkeleton`, `ProfileSkeleton` in U8.2 without changing routes yet.

---

## 8. Empty-state inventory

**15+ surfaces** use `DashboardEmptyState` — strong U7 consistency.

**Outliers:** Profile future goals (dashed CambaCard), analytics empty state, illustrated empty state unused on U7.

Full inventory table in `docs/design-system/u8-1-design-audit.md` Phase I.

**U8.3 prep:** Issue list ready; no redesign in U8.1.

---

## 9. Form UX findings

- Settings profile form: minimal labels, no success feedback
- Writing editor: good focus styling; no shared validation UI
- Speaking recorder: solid loading/error handling
- Filter chips: achievements accessible; hub filters legacy style

---

## 10. Responsive findings

Code-level audit at 320–1024px. **10 issues** documented for U8.4:

- Dashboard hero stacking at 320px
- Mock center featured badge crowding
- Achievement carousel scroll hint
- Nav density at tablet width
- Touch targets on filter chips

No mobile redesign in U8.1.

---

## 11. Accessibility findings

**Strengths:** Section `aria-labelledby`, progressbar roles, sr-only achievement states, Radix dialog focus.

**Issues (documented, no refactor):**

- Hardcoded English eyebrow on achievements page
- Nav toggle aria-label not i18n
- Minor progressbar label gaps
- Focus ring split between `camba-focus-ring` and button rings

---

## 12. Technical debt inventory

**Priority 1 (8 items):** Legacy dashboard panels, mock-test-card, mock-test-hub-filters — see audit Phase N.

**Priority 2:** Duplicate heroes, status-chip, gray button variants.

**Priority 3:** Motion tokens unused, design showcase outdated (U2).

Full list in `src/lib/design/component-inventory.ts`.

---

## 13. Design system foundation

| File | Purpose |
|------|---------|
| `docs/design-system/u8-1-design-audit.md` | Full audit + severity |
| `src/lib/design/design-system-audit.ts` | Token findings (TS) |
| `src/lib/design/typography.ts` | Typography helpers |
| `src/lib/design/component-inventory.ts` | Component catalog |
| `src/lib/design/design-system-report.ts` | Executive report API |
| `src/lib/design/design-guidelines.md` | Approved/deprecated patterns |
| `src/lib/design/design-system.validation.test.ts` | Foundation smoke tests |

---

## 14. Migration recommendations

1. **U8.2** — Shared page hero shell; migrate button grays; wire motion tokens; journey/profile skeletons
2. **U8.3** — Extract `CambaEmptyState`; unify future-goals empty visual
3. **U8.4** — Fix responsive issue list (RSP-01–10)
4. **U8.5** — Remove legacy dashboard components; consolidate to PremiumMockCard

---

## 15. Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run test:validation` | Pass (241 tests incl. 4 U8.1 design tests) |

**No functional regressions.** No visual changes to production pages.

---

## 16. Readiness for U8.2 Animation Layer

**Ready:**

- Documented approved patterns and deprecated list
- Typography role mapping for consistent application during animation work
- Motion tokens exist in `motion.css` (currently underused)
- Component inventory identifies safe vs legacy touch points
- Loading/empty issue lists prevent animation on mismatched skeletons

**U8.2 should start with:**

1. `JourneySkeleton` + fix U8-1-LOAD-01 before animating journey sections
2. Shared `PageHeroShell` to unify headers before hero entrance animations
3. Apply `--duration-normal` / `--ease-out` from motion tokens to `.camba-card-interactive` consistently

---

## Success definition

CAMBA now has a **documented, unified design system foundation** that identifies major UX inconsistencies and provides a clear roadmap for U8.2–U8.5 — without introducing feature work or visual regressions in U8.1.
