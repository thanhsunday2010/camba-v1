# U8.4 — Mobile Audit

**Date:** June 2026  
**Scope:** All student-facing routes at 320–1024px  
**Status:** Audit complete — optimizations applied per findings

---

## Audit Methodology

Static code audit across `src/app/[locale]/(dashboard)/` and `src/components/` for:

- Fixed / min widths causing overflow
- Multi-column grids without mobile fallback
- Touch targets under 44px
- Typography below readable thresholds
- Unintentional horizontal scroll
- Sticky header / safe-area gaps
- Keyboard / viewport risks on inputs

Target widths: **320, 360, 375, 390, 430, 768, 1024**

---

## Severity Summary

| Severity | Count | Examples |
|----------|-------|----------|
| **Critical** | 4 | Mock take nav reachability, iOS input zoom, nav touch targets, hero stat crowding |
| **Moderate** | 8 | Filter chips, matching selects, achievement filters, compact stats scroll |
| **Minor** | 6 | Intentional horizontal carousels, legacy gray in matching, settings typography |

---

## Route-by-Route Findings

### Dashboard (`/dashboard`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Hero stat tiles | 320–390 | Moderate | `min-w-[6.5rem]` caused horizontal pressure beside greeting |
| Stats strip compact | 320 | Minor | Intentional horizontal snap — acceptable |
| Section grids | 375+ | Compliant | `grid-cols-1` default, sm+ enhancement |
| Nav | 320 | Critical | Hamburger / icon buttons under 44px |

### Journey (`/journey`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Level cards | 320+ | Compliant | Single column → sm:2 → xl:3 |
| Progress summary | 320 | Compliant | 2-column stat grid readable |
| Milestone section | 375 | Compliant | Stacks naturally |

### Mock Center (`/mock-tests`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Premium cards | 320+ | Compliant | Full-width stack |
| Filter chips | 320–390 | Moderate | `py-1.5` chips below touch minimum |
| Readiness grid | 768+ | Compliant | 2→4 cols progressive |
| Hub scope tabs | 320 | Moderate | Wrap OK; touch targets improved |

### Mock Detail (`/mock-tests/[id]`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Primary CTAs | 320 | Compliant | Already `flex-col sm:flex-row` full-width |
| Section list | 320+ | Compliant | Vertical stack |
| Analytics card | 375 | Compliant | Single column insights |

### Mock Take (`/mock-tests/[id]/take`) — **Highest priority**

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Prev/Next/Submit | 320–390 | **Critical** | Inline footer hard to reach one-handed |
| Section pills | 320 | Moderate | Wrapped pills crowded; now horizontal scroll rail |
| MCQ choices | 320 | Moderate | `py-3` below 44px min height |
| Progress bar | All | Compliant | Full-width segments |
| Writing/Speaking embed | 375 | Moderate | Editor zoom + keyboard overlap risks |

### Learning (`/learning`, `/learning/lesson/[id]`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Skill nav rail | 320 | Minor | Intentional horizontal scroll |
| Level switcher | 320 | Minor | Snap scroll chips |
| Lesson player | 375 | Compliant | Single column |

### Writing AI (embedded)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Textarea font | 375 iOS | **Critical** | 15px body triggered zoom |
| Keyboard overlap | 390 | Moderate | No scroll-margin on focus |

### Speaking AI (embedded)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Record button | 320 | Moderate | Default button height < 44px |
| Transcript panel | 320+ | Compliant | Full-width readable |

### Achievements (`/achievements`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Filter chips | 320 | Moderate | Small tap targets |
| Card grid | 320+ | Compliant | 1 → 2 → 3 cols |
| Showcase carousel | 320 | Minor | Intentional snap scroll |

### Profile / Portfolio (`/profile`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Two-column sections | 768+ | Compliant | Single column on mobile |
| Snapshot stats | 320 | Compliant | 2-col grid |
| Hero stats | 390 | Compliant | 2-col grid |

### Analytics (mock + dashboard)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Grammar/vocab lists | 320+ | Compliant | Vertical stacks |
| Dashboard insights | 375 | Compliant | 2-col sm grid |

### Settings (`/settings`)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Form cards | 320+ | Compliant | Single column |
| Inputs | 375 iOS | Moderate | Should use 16px on mobile inputs |

### Navigation (global)

| Issue | Width | Severity | Finding |
|-------|-------|----------|---------|
| Desktop nav hidden | <768 | Compliant | Hamburger pattern exists |
| Mobile drawer links | 320 | Critical | Link height below 44px |
| Sticky header | notched | Moderate | No safe-area-top |
| Settings/logout icons | 320 | Moderate | Icon-only 36px buttons |

---

## Intentional Horizontal Scroll (Acceptable)

- Dashboard stats strip (compact mode)
- Achievement showcase carousels
- Learning skill / level chip rails
- Mock section pill rail (new)

These use `snap-x`, hidden scrollbars, and do not cause page-level overflow.

---

## Desktop Assumptions Identified (Not blocking)

- `StudentDashboardLayout` sidebar at `lg:` — stacks correctly on mobile
- `max-w-7xl` main container — responsive with padding
- Some legacy `gray-*` in matching exercise (pre-U7) — cosmetic only

---

## U8.4 Remediation Map

| Finding | Fix |
|---------|-----|
| Touch targets | `--touch-target-min`, `.camba-touch-target*` utilities |
| Safe areas | `.camba-safe-top/bottom/x`, layout shell |
| Mock take nav | `.camba-mobile-action-bar` sticky bottom |
| iOS input zoom | `.camba-input-mobile` 16px on textareas/selects |
| Hero crowding | 2-col grid stats on mobile |
| Filter chips | `min-h-[var(--touch-target-min)]` on mobile |

Implementation: `docs/u8-4-implementation-report.md`
