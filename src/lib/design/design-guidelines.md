# CAMBA Design Guidelines (U8.1 Foundation)

This document defines approved patterns, deprecated patterns, and migration guidance for U8.2–U8.5 polish work. **No page redesigns in U8.1** — follow these when touching existing surfaces.

---

## 1. Design principles

1. **One product** — U7 surfaces should feel like chapters of the same Cambridge learning app, not separate products.
2. **Tokens first** — Prefer CSS variables and `camba-*` utilities over one-off Tailwind values.
3. **Semantic color** — Use `--foreground`, `--muted`, `--border`, `--program-*` instead of `gray-*`.
4. **Accessible by default** — Section `aria-labelledby`, progressbar roles, visible focus rings (`camba-focus-ring`).
5. **Premium, not playful** — Gradients and celebration are intentional; avoid social-media clutter.

---

## 2. Typography

| Role | Class | Element | Use for |
|------|-------|---------|---------|
| Display | `camba-display` | `h1` | Marketing moments, hero stats (use sparingly for non-headings) |
| Page title | `camba-display` | `h1` | Top of page (Dashboard greeting, Journey, Mock Center, Profile) |
| Section title | `camba-h3` | `h2` | `SectionHeader`, major sections |
| Card title | `camba-h3` | `h3` | Cards, list items, achievement names |
| Body | `camba-body` | `p` | Descriptions, paragraphs |
| Caption | `camba-caption` | `p` | Meta, subtitles, labels |
| Stat | `camba-stat` | `p` | XP, scores, large numbers in stat boxes |
| Status | `camba-caption font-semibold` | `span` | Pills, inline status |

**Helpers:** `src/lib/design/typography.ts`

### Deprecated

- `text-2xl font-bold text-gray-900` (parent/teacher legacy)
- `camba-display text-xl sm:text-2xl` overrides on mock/lesson heroes
- Using `camba-h1` for page titles when rest of U7 uses `camba-display`

---

## 3. Spacing

| Token | Value | Usage |
|-------|-------|--------|
| `--space-page-x/y` | responsive | Page padding via `StudentPageShell` |
| `--space-section` | 1.5–2rem | Default vertical section gap |
| `--space-card` | 1.25–1.5rem | Card internal padding (CambaCard md/lg) |
| `--space-gap-sm` → `xl` | 0.5–1.5rem | Inline flex/grid gaps |

**Layout utility:** `camba-section-stack` — column flex with `--space-section` gap.

**U7 convention (documented, not yet tokenized):** Premium pages add `gap-8 sm:gap-10`. Achievements uses `gap-6 sm:gap-8`. Prefer consolidating to `--space-section-lg` in U8.2.

---

## 4. Cards

Use `CambaCard` from `@/components/camba/primitives/camba-card`.

| Variant | Purpose |
|---------|---------|
| `default` | Standard content |
| `elevated` | Emphasized summary |
| `hero` | Gradient hero panels |
| `achievement` | Unlocked achievements |
| `mission` | Daily mission |
| `lesson` | Interactive lesson cards |
| `mockTest` | Mock exam cards |
| `empty` | Dashed placeholder |

**Padding:** `sm` (compact), `md` (default), `lg` (hero stats).

**Interactive:** Set `interactive` for hover lift + focus ring.

### Deprecated

- Raw `.camba-card` class on new components (use CambaCard)
- Third mock card variant (`mock-test-card.tsx`) for new work

---

## 5. Buttons

Shadcn `Button` with CAMBA variants:

| Variant | Priority | Use for |
|---------|----------|---------|
| `quest` | Primary CTA | Start learning, take mock, empty-state actions |
| `default` | Primary | Generic submit |
| `outline` | Secondary | Settings, cancel |
| `ghost` | Tertiary | Nav actions, portfolio link |
| `link` | Inline | Text links styled as buttons |

**Sizes:** `sm` (inline), `default`, `lg` (empty-state CTAs).

**Focus:** `focus-visible:ring-2 focus-visible:ring-primary/50` — migrate to program ring in U8.2.

---

## 6. Status & badges

| Pattern | Component | Domain |
|---------|-----------|--------|
| Lesson/mock state | `LessonStatusPill` | Learning, mocks |
| Achievement rarity | `AchievementRarityBadge` | Achievements |
| Program | `ProgramBadge` | Heroes, profile |
| Gold mock | Inline badge in `PremiumMockCard` | Mock center |
| AI skills | `MockAiSkillBadges` | Mock cards |
| Mastery | `MasteryBadge` | Lesson analytics |

**Tokens:** `src/lib/design/status-tokens.ts`

---

## 7. Empty states

**Canonical (U7):** `DashboardEmptyState`

- Dashed border, soft gradient, icon in rounded box, optional `Button variant="quest" size="lg"`
- Used by: dashboard sections, profile, achievements, learning path, mock center

**Future (U8.3):** Consider extracting to `CambaEmptyState` in `camba/feedback/` without changing visuals initially.

---

## 8. Loading states

| Route | Pattern |
|-------|---------|
| Dashboard | `DashboardSkeleton` |
| Journey | `LearningPathSkeleton` (semantic mismatch — issue U8-1-LOAD-02) |
| Profile / Achievements | Raw `Skeleton` blocks |
| Mock tests | `MockTestLoadingSkeleton` |
| Learning | `LearningPathSkeleton` |

**Rule:** Prefer skeleton shapes that match final layout. Avoid spinner-only full pages.

---

## 9. Page structure

```tsx
<StudentPageShell narrow?> {/* narrow for focused flows */}
  <div className="camba-section-stack gap-8 sm:gap-10">
    <header>{/* Page title: camba-display h1 */}</header>
    <section aria-labelledby="...">
      <SectionHeader titleId="..." />
      {/* content */}
    </section>
  </div>
</StudentPageShell>
```

**Reference implementation:** `JourneyView`, `StudentProfileView`, `MockCenterView`.

---

## 10. Responsive breakpoints

Audit targets: **320, 375, 390, 430, 768, 1024px**.

- Single-column default; grids at `sm:` / `md:` / `lg:`
- `min-w-0` on flex children with truncation
- Touch targets ≥ `--touch-target-min` (44px) for primary actions

---

## 11. Accessibility checklist

- One `h1` per page
- Section titles as `h2` via `SectionHeader`
- `aria-labelledby` on `<section>`
- Progress bars: `role="progressbar"` + valuenow/min/max
- Icon-only buttons: `aria-label` or visible text
- Filter chips: `role="tablist"` where applicable (achievements)

---

## 12. Deprecated components (do not extend)

See `src/lib/design/component-inventory.ts` — status `legacy` or `duplicate`.

Priority cleanup in U8.5:

- `achievement-section.tsx`, `dashboard-achievement-strip.tsx`
- `continue-learning-panel.tsx`, `dashboard-missions.tsx`, `mock-test-panel.tsx`
- `mock-test-card.tsx` (non-premium)
- `mock-test-hub-filters.tsx` (pre-U7.3)

---

## 13. Related files

| File | Purpose |
|------|---------|
| `docs/design-system/u8-1-design-audit.md` | Full audit with severity |
| `src/lib/design/design-system-audit.ts` | Token findings (machine-readable) |
| `src/lib/design/design-system-report.ts` | Executive summary |
| `src/lib/design/component-inventory.ts` | Component catalog |
| `src/lib/design/typography.ts` | Typography helpers |
| `/design-system` | Live component showcase (Phase U2) |
