# U8.1 — CAMBA Design System Audit

**Date:** 2026-06-22  
**Scope:** Student-facing surfaces post-U7 (Dashboard, Journey, Mock Center, Achievements, Profile, Learning, Writing AI, Speaking AI)  
**Type:** Audit only — no redesigns, no functional changes

---

## Visual reference & screenshots

Live component reference: **`/design-system`** (`DesignSystemShowcase`).

> **Screenshot note:** Capture manual screenshots at 375px and 1024px for each surface listed below and attach to this folder as `docs/design-system/screenshots/u8-1-{surface}-{width}.png` during U8.2 kickoff. This audit documents findings from code review and token analysis; visual confirmation is recommended before U8.2 animation work.

### Recommended screenshot matrix

| Surface | Route | Priority |
|---------|-------|----------|
| Dashboard | `/dashboard` | P0 |
| Journey | `/journey` | P0 |
| Mock Center | `/mock-tests` | P0 |
| Achievements | `/achievements` | P0 |
| Portfolio | `/profile` | P0 |
| Learning path | `/learning` | P1 |
| Lesson player | `/learning/lesson/[id]` | P1 |
| Mock detail | `/mock-tests/[id]` | P1 |
| Mock take | `/mock-tests/[id]/take` | P1 |
| Writing exercise | (in-lesson) | P1 |
| Speaking exercise | (in-lesson) | P1 |

---

## Severity legend

| Level | Meaning |
|-------|---------|
| **Critical** | Breaks cohesion or accessibility; fix before U8.2 |
| **High** | Visible inconsistency on primary surfaces |
| **Medium** | Noticeable on comparison; fix in U8.3–U8.4 |
| **Low** | Polish / technical debt |

---

## Phase A — Product surface audit

### Typography

| Finding ID | Severity | Description |
|------------|----------|-------------|
| U8-1-TYP-01 | **High** | Page titles split: `camba-display` (U7) vs `camba-h1` (`PageHeader`) vs responsive `text-xl sm:text-2xl` (mock/lesson heroes) |
| U8-1-TYP-02 | **Medium** | `camba-h2` used for empty-state titles while sections use `camba-h3` — inverted hierarchy |
| U8-1-TYP-03 | **Medium** | `camba-display` used for non-heading stats (journey completion %, mock center featured title as h2) |
| U8-1-TYP-04 | **High** | Parent/teacher `StudentProgressOverview` uses raw `text-2xl font-bold text-gray-900` |
| U8-1-TYP-05 | **Low** | Compact achievement cards add `text-sm` override on `camba-h3` |

**Usage counts (grep):** `camba-display` ~15 page/hero usages; `camba-h3` ~40+ section/card usages; `camba-body`/`camba-caption` widespread on U7 surfaces.

### Spacing

| Finding ID | Severity | Description |
|------------|----------|-------------|
| U8-1-SPC-01 | **Medium** | `camba-section-stack` base gap overridden: `gap-8 sm:gap-10` (4 surfaces) vs `gap-6 sm:gap-8` (achievements) |
| U8-1-SPC-02 | **Low** | SectionHeader uses fixed `mb-4` outside spacing token scale |
| U8-1-SPC-03 | **Medium** | Card padding mix: CambaCard `md` (p-5) vs inline `p-5 sm:p-7 lg:p-8` on heroes |
| U8-1-SPC-04 | **Low** | Grid gaps vary: `gap-3`, `gap-4`, `gap-6` without documented mapping to xs–2xl |

### Cards

| Finding ID | Severity | Description |
|------------|----------|-------------|
| U8-1-CRD-01 | **High** | Three mock card implementations (see duplicate patterns) |
| U8-1-CRD-02 | **Medium** | Hero cards use `rounded-3xl`; CambaCard uses `rounded-2xl` |
| U8-1-CRD-03 | **Medium** | Dual elevation: `CambaCard` CVA shadows vs `.camba-card` / `.camba-card-interactive` globals |
| U8-1-CRD-04 | **Low** | Journey level cards vs profile snapshot cards — same CambaCard but different internal stat layouts |

### Shadows & elevation

| Token | Usage |
|-------|--------|
| `--shadow-sm/md/lg` | Defined; CambaCard uses Tailwind `shadow-sm` / `shadow-md` |
| `--shadow-card` | Used by `.camba-card` utility |
| Hero panels | `shadow-md` inline on dashboard/profile heroes |

**Finding U8-1-ELV-01 (Medium):** Hover lift only on `.camba-card-interactive`, not all `CambaCard interactive` variants consistently.

### Border radius

| Token | Tailwind | Observed |
|-------|----------|----------|
| `--radius-2xl` | `rounded-2xl` | CambaCard default, most U7 cards |
| `--radius-xl` | `rounded-xl` | Stat boxes, icon containers |
| `--radius-3xl` | *undefined* | Heroes use `rounded-3xl` |
| Pills | `rounded-full` | Status pills, filter chips |

### Badges & status pills

| System | Component | Consistent? |
|--------|-----------|-------------|
| Lesson/mock state | `LessonStatusPill` | ✅ Yes |
| Achievement rarity | `AchievementRarityBadge` | ✅ Yes |
| Gold mock | Custom span in PremiumMockCard | ⚠️ One-off styling |
| AI evaluated | `MockAiSkillBadges` | ✅ Yes |
| Program | `ProgramBadge` | ✅ Yes |
| Readiness bands | Text + color in mock center | ⚠️ No shared pill component |

**Finding U8-1-BDG-01 (Medium):** Readiness labels (building/developing/ready) use ad-hoc text colors, not status tokens.

### Buttons

| Finding ID | Severity | Description |
|------------|----------|-------------|
| U8-1-BTN-01 | **High** | `outline`/`ghost` use `gray-*` not semantic tokens |
| U8-1-BTN-02 | **Medium** | Primary CTA split: `quest` (empty states) vs `default` (forms) vs inline `Link`+`Button` |
| U8-1-BTN-03 | **Low** | `sm` icon buttons in nav may be below 44px touch target |
| U8-1-BTN-04 | **Low** | Loading: `isPending` on forms; `Loader2` on speaking recorder — no shared loading button pattern |

### Empty states

**Canonical pattern:** `DashboardEmptyState` — adopted across U7 (15+ import sites). ✅ Strong consistency.

| Finding ID | Severity | Description |
|------------|----------|-------------|
| U8-1-EMP-01 | **Low** | `EmptyStateIllustrated` / `EmptyIllustratedState` still in camba index — unused on U7 surfaces |
| U8-1-EMP-02 | **Medium** | `FutureGoalsCard` empty uses dashed CambaCard, not DashboardEmptyState |
| U8-1-EMP-03 | **Low** | Mock center full-page empty uses `MockTestEmptyState` wrapper — OK |

### Loading states

| Route | Implementation | Issue |
|-------|----------------|-------|
| `/dashboard` | `DashboardSkeleton` | ✅ Matches layout |
| `/journey` | `LearningPathSkeleton` | **Medium** — wrong semantic skeleton |
| `/profile` | Raw Skeleton blocks | **Medium** — no shared profile skeleton |
| `/achievements` | Raw Skeleton grid | **Medium** — inconsistent with card shapes |
| `/mock-tests` | `MockTestLoadingSkeleton` | ✅ OK |
| `/learning` | `LearningPathSkeleton` | ✅ OK for learning |

**Finding U8-1-LOAD-01 (High):** Journey loading uses learning path skeleton — layout mismatch causes shift.

### Forms

| Surface | Pattern | Issues |
|---------|---------|--------|
| Settings `ProfileForm` | shadcn Input + Button sm | No labels, hidden locale, no success/error feedback |
| Writing editor | Custom textarea | Good focus ring; no error state component |
| Speaking recorder | Button + Mic states | Good loading state; errors via callback only |
| Achievement filters | Filter chips | Accessible tablist on achievements ✅ |
| Mock hub filters | Legacy hub filters | Separate from mock center |

**Finding U8-1-FRM-01 (Medium):** Form validation feedback inconsistent — auth forms use text-gray-*, settings minimal.

### Mobile layouts

Audited via code (responsive classes). Manual device pass recommended.

| Finding ID | Severity | Width | Description |
|------------|----------|-------|-------------|
| U8-1-RSP-01 | **Medium** | 320–390 | Dashboard hero stat row may wrap awkwardly; portfolio link stacks above stats |
| U8-1-RSP-02 | **Medium** | 375 | Achievement filter chips wrap — OK but dense |
| U8-1-RSP-03 | **High** | 320 | Mock center featured hero — long titles + badges may crowd |
| U8-1-RSP-04 | **Medium** | 768 | Journey level grid 2-col — OK; unit roadmap timeline tight |
| U8-1-RSP-04 | **Low** | 430 | Portfolio snapshot grid 2×4 — readable |
| U8-1-RSP-05 | **Medium** | all | Horizontal achievement carousel — scroll OK; no scroll hint |

**Prepared for U8.4:** Full responsive issue list in Section 10 of implementation report.

### Accessibility

| Finding ID | Severity | Description |
|------------|----------|-------------|
| U8-1-A11Y-01 | **Medium** | Mock center featured block uses `h2` with `camba-display` under page `h1` — OK hierarchy |
| U8-1-A11Y-02 | **Low** | Achievements hardcoded "Cambridge Achievements" eyebrow — not i18n |
| U8-1-A11Y-03 | **Low** | Some progressbars missing `aria-label` (dashboard level bar has label ✅) |
| U8-1-A11Y-04 | **Medium** | Nav mobile menu button `aria-label="Toggle menu"` — English only |
| U8-1-A11Y-05 | **Low** | Focus rings: `camba-focus-ring` on cards; buttons use ring-primary — slight inconsistency |

**Strengths:** Widespread `aria-labelledby`, `sr-only` on achievement lock state, semantic sections on U7 pages.

---

## Phase B — Design token audit

See **`src/lib/design/design-system-audit.ts`** for machine-readable findings.

### Token inventory

| File | Contents |
|------|----------|
| `colors.css` | Semantic + program + status + gamification colors |
| `typography.css` | camba-display through camba-stat |
| `spacing.css` | Page, section, card, gap tokens + utilities |
| `shadows.css` | sm/md/lg/glow/card |
| `radius.css` | sm through 2xl |
| `motion.css` | duration/ease (underused in components) |
| `cambridge-programs.css` | Per-program theme overrides |
| `globals.css` | @theme inline + gradient/card utilities |

### Duplicate / magic number summary

- **7** token findings documented (0 critical, 2 high, 4 medium, 1 low)
- **4** duplicate pattern groups (mock cards, empty states, heroes, page headers)
- **4** documented magic numbers (icon box 4.5rem, stat min-width 6.5rem, etc.)

---

## Phase C–G — System summaries

| Phase | Status | Output |
|-------|--------|--------|
| C Typography | Documented | `src/lib/design/typography.ts` |
| D Spacing | Documented | Findings U8-1-SPC-*; no token changes |
| E Card hierarchy | Documented | CambaCard variants = canonical |
| F Button hierarchy | Documented | shadcn variants; gray-* debt noted |
| G Status/badges | Documented | status-tokens.ts canonical |

---

## Phase H — Loading experience

| ID | Severity | Recommendation |
|----|----------|----------------|
| U8-1-LOAD-01 | High | Create `JourneySkeleton` matching JourneyView sections |
| U8-1-LOAD-02 | Medium | Create `ProfileSkeleton` mirroring profile sections |
| U8-1-LOAD-03 | Medium | Align achievements loading with `SkeletonCard` pattern |
| U8-1-LOAD-04 | Low | Export skeleton variants from `camba/feedback/skeletons.tsx` |

---

## Phase I — Empty state inventory (U8.3 prep)

| Location | Component | Copy source | CTA |
|----------|-----------|-------------|-----|
| Dashboard daily mission | DashboardEmptyState | dashboard i18n | Start learning |
| Dashboard continue | DashboardEmptyState | dashboard i18n | View path |
| Dashboard mock rec | DashboardEmptyState | dashboard i18n | Mock center |
| Dashboard skills | DashboardEmptyState | dashboard i18n | Learning |
| Dashboard activity | DashboardEmptyState | dashboard i18n | — |
| Dashboard journey preview | DashboardEmptyState | dashboard i18n | Journey |
| Achievements collection | DashboardEmptyState | achievements i18n | Start learning |
| Achievement showcase | DashboardEmptyState | achievements i18n | Start learning |
| Learning path | LearningPathEmpty → DashboardEmptyState | learning i18n | — |
| Mock center (no tests) | MockTestEmptyState | mockCenter i18n | — |
| Profile learning | DashboardEmptyState | profile i18n | Journey |
| Profile mocks | DashboardEmptyState | profile i18n | Mock center |
| Profile writing | DashboardEmptyState | profile i18n | Learning |
| Profile speaking | DashboardEmptyState | profile i18n | Learning |
| Profile certs | DashboardEmptyState | profile i18n | Mock tests |
| Profile journey | DashboardEmptyState | profile i18n | Settings |
| Profile goals | CambaCard dashed | profile i18n | — |
| Mock analytics | analytics-empty-state | mock i18n | — |
| Next achievement | NextAchievementCard empty | achievements i18n | — |

**U8.3 action:** Unify visual language; keep copy; consider `CambaEmptyState` wrapper.

---

## Phase J — Form UX findings

| ID | Severity | Area | Issue |
|----|----------|------|-------|
| U8-1-FRM-01 | Medium | Settings | No visible labels, no toast on save |
| U8-1-FRM-02 | Low | Auth | gray-* helper text |
| U8-1-FRM-03 | Medium | Writing | Word counter present; no inline validation before submit |
| U8-1-FRM-04 | Low | Speaking | Mic permission errors user-facing ✅ |
| U8-1-FRM-05 | Medium | Filters | Hub filters vs achievement filters — different chip styles |

---

## Phase K — Responsive audit (U8.4 prep)

Issue list for U8.4 mobile polish:

1. **U8-1-RSP-01** — Dashboard hero right column stacking at 320px
2. **U8-1-RSP-03** — Mock center featured section badge overflow
3. **U8-1-RSP-05** — Achievement carousel discoverability
4. **U8-1-RSP-06** — Mock take player — verify question frame padding at 320px
5. **U8-1-RSP-07** — Writing editor min-height vs keyboard on mobile
6. **U8-1-RSP-08** — Portfolio certification grid — long titles truncation
7. **U8-1-RSP-09** — Nav item count — 6 items may crowd at 768px
8. **U8-1-RSP-10** — Filter chip touch targets on achievements page

---

## Phase L — Accessibility audit

No major refactor in U8.1. Documented issues: U8-1-A11Y-01 through 05.

**Positive patterns to preserve:**

- Section `aria-labelledby` on U7 pages
- Achievement detail dialog focus trap (Radix)
- Mock player progressbar on question index
- Profile completion progressbar with values

---

## Phase M — Design system foundation

| Deliverable | Path |
|-------------|------|
| Token audit (code) | `src/lib/design/design-system-audit.ts` |
| Typography helpers | `src/lib/design/typography.ts` |
| Component inventory | `src/lib/design/component-inventory.ts` |
| Executive report | `src/lib/design/design-system-report.ts` |
| Human guidelines | `src/lib/design/design-guidelines.md` |
| Live showcase | `/design-system` |

---

## Phase N — Technical debt inventory

### Priority 1 (U8.5 cleanup)

| Item | Path | Reason |
|------|------|--------|
| Legacy achievement section | `dashboard/achievement-section.tsx` | Replaced by U7.4 section |
| Achievement strip | `dashboard-achievement-strip.tsx` | Not in U7.1 view |
| Continue learning panel | `continue-learning-panel.tsx` | Superseded by card |
| Dashboard missions | `dashboard-missions.tsx`, `today-mission-section.tsx` | Superseded by daily mission card |
| Mock test panel | `mock-test-panel.tsx` | Superseded by recommended mock |
| Smart recommendation | `smart-recommendation-panel.tsx` | Unused in U7.1 |
| Mock hub filters page | `mock-test-hub-filters.tsx` | Superseded by mock center |
| Legacy mock card | `mock-test-card.tsx` | Use PremiumMockCard |

### Priority 2

| Item | Notes |
|------|-------|
| `camba/student-hero-card.tsx` | Overlaps DashboardHero |
| `camba/cards/hero-card.tsx` | Showcase / legacy |
| `status-chip.tsx` | LessonStatusPill preferred |
| `gamification/daily-missions.tsx` | Old mission UI |
| Gray palette in `button.tsx` | Token migration |

### Priority 3

| Item | Notes |
|------|-------|
| Unused CSS motion tokens | Wire in U8.2 animations |
| `EmptyStateIllustrated` | Consolidate with DashboardEmptyState |
| Design showcase (U2) | Update to reflect U7 components |

---

## Migration roadmap

| Milestone | Focus |
|-----------|-------|
| **U8.2** | Animation layer, page hero shell, spacing token lg, button token migration |
| **U8.3** | Empty state unification |
| **U8.4** | Responsive polish (issue list above) |
| **U8.5** | Legacy component removal, mock card consolidation |

---

## Success criteria (U8.1)

- [x] Full product audit documented
- [x] Token audit with severity
- [x] Typography helpers created (no page refactors)
- [x] Empty state inventory for U8.3
- [x] Responsive issue list for U8.4
- [x] Accessibility findings documented
- [x] Technical debt prioritized
- [x] Design system foundation files created
- [x] No functional or visual regressions
