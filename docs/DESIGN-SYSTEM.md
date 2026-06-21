# CAMBA Design System (Phase U2)

Student-facing UI foundation for the CAMBA Cambridge English learning platform.

## Principles

- **Premium gamified learning** — motivating for K12, credible for parents
- **Cambridge-branded** — program colors + shield progression metaphor
- **Mobile-first** — touch targets, responsive cards, clear hierarchy
- **Vietnamese UI** — all visible copy via i18n or component `label` props
- **English code** — tokens, components, and docs in English

## Token layers

| File | Purpose |
|------|---------|
| `src/styles/tokens/colors.css` | Brand, semantic, gamification, mastery, lesson states |
| `src/styles/tokens/typography.css` | Display, headings, body, stat classes (`.camba-h1`, etc.) |
| `src/styles/tokens/spacing.css` | Page/section/card spacing, layout utilities |
| `src/styles/tokens/radius.css` | Border radius scale |
| `src/styles/tokens/shadows.css` | Elevation + program glow |
| `src/styles/tokens/motion.css` | Durations, easing, animation utilities |
| `src/styles/tokens/borders.css` | Focus ring tokens |
| `src/styles/tokens/icons.css` | Icon box sizes |
| `src/styles/tokens/cambridge-programs.css` | Per-level theme overrides (`data-program`, `data-density`) |

Imported via `src/app/globals.css` → `@import "../styles/tokens/index.css"`.

## Program themes

Wrap student routes with `CambridgeProgramTheme`:

```tsx
<CambridgeProgramTheme programSlug={level?.slug}>
  {children}
</CambridgeProgramTheme>
```

Sets `data-program` (starters | movers | flyers | ket | pet) and `data-density` (explorer | achiever | scholar).

JS helpers: `src/lib/design/cambridge-programs.ts`, `src/lib/design/status-tokens.ts`.

## Component library

Import from `@/components/camba`:

### Layout
- `StudentPageShell`, `ContentSection`, `StudentDashboardLayout`
- `PageHeader`, `SectionHeader`

### Cards
- `CambaCard` — base with variants: `default`, `elevated`, `hero`, `achievement`, `mission`, `stat`, `lesson`, `mockTest`, `empty`
- `HeroCard`, `StatCard`, `ProgressCard`, `MissionCard`, `LessonCard`, `UnitCard`, `SkillCard`, `MockTestCard`, etc.

### Gamification
- `XPBar`, `LevelBadge`, `StreakCard`, `CoinChip`, `BadgeCard`, `RewardSummaryCard`
- `CelebrationProvider` + `useCelebration()` for XP/level/badge toasts

### Cambridge
- `CambridgeShield`, `ProgramBadge`, `CambridgeShieldCard`, `SkillShieldProgress`, `MasteryMeter`

### Feedback
- `FeedbackBanner`, `CelebrationBanner`, `DashboardSkeleton`, `EmptyIllustratedState`

## Usage guidelines

1. **Do not hardcode colors** on student pages — use `text-program`, `bg-program-muted`, CSS vars, or CAMBA components.
2. **Pass Vietnamese labels** as props from `getTranslations()` — components stay locale-agnostic.
3. **Use `StudentPageShell`** for vertical rhythm on redesigned pages.
4. **Lesson states** — use `LessonStatusPill` + `LessonVisualState` from status tokens.
5. **Mastery** — use `MasteryBadge` with levels 0–4 aligned to `MASTERY_LEVELS`.

## Preview

Visit `/design-system` (authenticated) to see all components with sample Vietnamese copy.

## Next: Phase U3

Redesign `/dashboard` using:
- `StudentDashboardLayout` + `HeroCard` + `ContinueLearningCard`
- `StatCard` row, `MissionCard`, `StreakCard`, `CambridgeShieldCard`
- Replace plain sections with CAMBA cards (no business logic changes)
