# U8.2 — Motion System Audit

**Date:** 2026-06-22  
**Pre-implementation audit** (completed before U8.2 motion layer)

---

## Summary

CAMBA had **no Framer Motion** dependency before U8.2. Motion was limited to CSS utilities in `motion.css`, Tailwind transitions, and Sonner toasts for celebrations.

---

## Existing motion patterns

| Pattern | Location | Usage |
|---------|----------|--------|
| `camba-scale-in` | `motion.css`, modals | Badge/level-up dialogs |
| `camba-pulse-soft` | `motion.css` | Streak flame, empty-state sparkle |
| `camba-animate-fill` | `motion.css`, progress bars | Width transition on XP/progress |
| `camba-animate-lift` | `motion.css`, globals | Card hover (CSS only) |
| `camba-streak-glow` | `motion.css` | Defined, rarely used |
| `camba-badge-shine` | `motion.css` | Defined, unused on U7 surfaces |
| `transition-all duration-700` | Dashboard hero, stats | Progress bars (layout-affecting) |
| `animate-spin` | Loaders | Forms, AI evaluation |
| `animate-pulse` | Skeletons | Loading states |
| Radix dialog animate-in | `ui/dialog.tsx` | Modal enter/exit |
| Sonner toasts | `rewards.ts`, achievements | XP, badges, missions |
| `CelebrationProvider` | Dashboard layout | Level-up/badge modals + toasts |

---

## Framer Motion

**Pre-U8.2:** Not installed.  
**Post-U8.2:** `framer-motion@11` — shared primitives in `src/components/camba/motion/`.

---

## Duplicate / inconsistent patterns

| Issue | Severity |
|-------|----------|
| Progress uses both width transition and stroke-dashoffset | Medium |
| `camba-scale-in` CSS vs Radix zoom-in on dialogs | Low |
| Celebration split: toast + modal, no unified motion layer | High |
| `camba-scale-in` on legacy `today-mission-section` only | Low |
| Achievement unlock: toast only, no visual badge moment | High |
| Mock complete: static summary, no entrance emphasis | Medium |
| Loading: mix of `animate-pulse` and plain Skeleton | Medium |

---

## Missing milestone moments

- XP gain visual burst (toast only)
- Achievement unlock overlay (toast only)
- Mock submission success entrance
- Writing/Speaking score reveal
- Dashboard section stagger on load
- Journey level card reveal
- Page route transition consistency
- Profile section progressive reveal

---

## Celebration hooks audit

| Hook | Triggers | Motion |
|------|----------|--------|
| `celebrateXp` | (available, rarely wired) | Toast |
| `celebrateLevelUp` | Level up | Toast + modal |
| `celebrateBadge` | Badge earn | Toast + modal |
| `celebrateMission` | Lesson/mock complete | Toast only |
| `AchievementUnlockNotifier` | Page load new unlocks | Toast only |

---

## U8.2 resolution map

| Gap | U8.2 deliverable |
|-----|------------------|
| No motion tokens in TS | `motion-tokens.ts` |
| No shared primitives | `camba/motion/*` |
| No page transitions | `(dashboard)/template.tsx` |
| XP/badge celebrations | `XPGainAnimation`, `BadgeUnlockAnimation` |
| Mock complete | `MockCompletionCelebration` |
| Reduced motion | `useReducedMotion` + CSS `@media` |

---

## Explicit non-goals (honored)

- No confetti / particle systems
- No game-like bouncing on lists
- No layout redesign
- No autoplay celebration on dashboard load
