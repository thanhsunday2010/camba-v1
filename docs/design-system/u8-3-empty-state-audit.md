# U8.3 — Empty State Audit

**Date:** June 2026  
**Scope:** Student-facing surfaces in `src/components/`, `src/app/[locale]/(dashboard)/`  
**Status:** Audit complete — implementation follows this document

---

## Executive Summary

Before U8.3, CAMBA had **three parallel empty-state implementations** with inconsistent copy quality:

| Component | Variant | Usage |
|-----------|---------|-------|
| `DashboardEmptyState` | Feature (gradient + quest CTA) | U7 dashboard, profile, achievements, mocks |
| `EmptyStateIllustrated` | Compact dashed | Legacy dashboard panels |
| Inline card copy | Minimal | Daily mission, next achievement, future goals |

**Developer-oriented copy** (“No activity yet”, “No results yet”, “No data”) appeared on high-traffic surfaces. Analytics empty states exposed internal concepts (“grammar and vocabulary tags”).

U8.3 consolidates on `src/components/camba/empty-states/` with student-friendly Cambridge copy and mandatory CTAs.

---

## Severity Classification

### Critical — First-impression dead ends

| Surface | Before | Issue |
|---------|--------|-------|
| Dashboard continue learning | “No lesson suggested yet” | No motivation, weak CTA |
| Dashboard mock shortcut | “No mock tests yet” | Passive, no exam-readiness framing |
| Dashboard recent activity | “No activity yet” | Feels broken |
| Mock center hub (no tests) | Filter-oriented copy | Wrong context when program empty |
| Portfolio writing/speaking | “No history yet” | Missed opportunity to explain AI value |
| Journey / profile journey | “Journey not started” | No pathway vision |

### Moderate — Section-level gaps

| Surface | Before | Issue |
|---------|--------|-------|
| Dashboard skill insights | “Insights coming soon” | Vague |
| Dashboard daily mission | Inline card only | Inconsistent with other sections |
| Mock readiness / recent / gold | No CTA | Dead-end sections |
| Mock analytics (insufficient tags) | Technical metadata wording | Misleading / developer tone |
| Achievements filter empty | No reset action | Filter trap |
| Learning path no level | Adequate but terse | Missing Cambridge pathway framing |

### Minor — Acceptable with polish

| Surface | Before | Issue |
|---------|--------|-------|
| Achievements “all caught up” | Good copy | Inline variant only |
| Future goals empty | Dashed card | No shared component |
| Mock hub filter empty | Generic filter message | Missing reset |
| Level collection empty | Single caption line | No empty-state component |

---

## Surface-by-Surface Audit

### Dashboard (`src/components/dashboard/`)

| Component | Copy (before) | Visual | Action | Quality |
|-----------|---------------|--------|--------|---------|
| `dashboard-daily-mission-card` | “No mission queued yet” | Inline card | Start learning | Moderate → **Fixed** |
| `dashboard-continue-learning-card` | “No lesson suggested yet” | FeatureEmptyState | Start learning | Critical → **Fixed** |
| `dashboard-recommended-mock` | Mock empty copy | FeatureEmptyState | Take mock | Critical → **Fixed** |
| `dashboard-skill-insights` | “Insights coming soon” | FeatureEmptyState | Go to path | Moderate → **Fixed** |
| `dashboard-recent-activity` | “No activity yet” | FeatureEmptyState | Start learning | Critical → **Fixed** |
| `dashboard-journey-preview` | Adequate | FeatureEmptyState | View journey | Minor → **Polished** |
| `dashboard-missions` | Legacy panel | EmptyStateIllustrated | None | Minor → **Wrapped** |
| `dashboard-recommended-lesson` | Legacy | EmptyStateIllustrated | Start learning | Minor → **Wrapped** |
| `dashboard-skill-progress` | “No skill data yet” | EmptyStateIllustrated | None | Moderate → **Copy updated** |
| `dashboard-recent-badges` | Generic | EmptyStateIllustrated | None | Minor → **Wrapped** |
| `dashboard-mock-test-shortcut` | Generic | EmptyStateIllustrated | Browse mocks | Critical → **Wrapped + copy** |

### Learning (`src/components/learning/`)

| Component | Copy | Visual | Action | Quality |
|-----------|------|--------|--------|---------|
| `learning-path-empty` | Contextual i18n | FeatureEmptyState | Varies | Moderate → **Unified** |
| `lesson-empty-state` | “No exercises yet” | LearningEmptyState | Back to path | Moderate → **Unified** |
| `learning-path-view` | noLevel / noContent | LearningPathEmpty | Placement CTA | Moderate → **Copy updated** |

### Mock Center (`src/components/mock-tests/`)

| Component | Copy | Visual | Action | Quality |
|-----------|------|--------|--------|---------|
| `mock-center-view` | Section empties | MockEmptyState | Added CTAs | Moderate → **Fixed** |
| `mock-test-hub-filters` | Filter / hub empty | MockEmptyState | Reset / learn | Moderate → **Fixed** |
| `mock-test-empty-state` | Wrapper | MockEmptyState | Optional | **Consolidated** |
| `analytics-empty-state` | Single caption | Minimal | None | Critical → **Title + honest copy + CTA** |

### Achievements (`src/components/achievements/`)

| Component | Copy | Visual | Action | Quality |
|-----------|------|--------|--------|---------|
| `achievement-showcase` | Good U7 copy | FeatureEmptyState | Start learning | Minor → **Retained** |
| `achievements-collection-view` | Filter empty | FeatureEmptyState | Start + reset | Moderate → **Fixed** |
| `next-achievement-card` | Inline | Custom card | Start learning | Minor → **InlineEmptyState** |

### Profile / Portfolio (`src/components/profile/`)

| Section | Copy | Visual | Action | Quality |
|---------|------|--------|--------|---------|
| Learning progress | Good U7 | FeatureEmptyState | Start learning | Minor → **Retained** |
| Mock performance | Good U7 | FeatureEmptyState | Browse mocks | Minor → **Retained** |
| Writing growth | “No writing history” | FeatureEmptyState | Start writing | Critical → **Fixed** |
| Speaking growth | “No speaking history” | FeatureEmptyState | Start speaking | Critical → **Fixed** |
| Certifications | Good U7 | FeatureEmptyState | Explore mocks | Minor → **Retained** |
| Journey progress | “Journey not started” | FeatureEmptyState | Set up program | Critical → **Fixed** |
| Future goals | Inline dashed | Custom | None | Minor → **PortfolioInlineEmptyState** |

### Journey (`src/components/journey/`)

| Component | Copy | Visual | Action | Quality |
|-----------|------|--------|--------|---------|
| `journey-view` | noLevelTitle | LearningPathEmpty | Program picker | Moderate → **Copy updated** |
| Mock milestone empty | Passive | Text only | None | Moderate → **Copy updated** |

### Analytics (M1.5 integration)

| Mode | Before | After |
|------|--------|-------|
| No attempt | “You need to complete a mock test…” | Title + guidance + “Take a mock test” CTA |
| Insufficient metadata | “…not enough grammar and vocabulary tags” | Honest: insights expand as content is tagged |

### Search & Filters

| Surface | Issue | Fix |
|---------|-------|-----|
| Mock hub filters | Dead-end on empty filter | Reset filters secondary action |
| Achievements filters | No reset | Reset filters button |

### Error Recovery

| Concern | Status |
|---------|--------|
| Empty vs error conflation | `ErrorRecoveryState` component added; distinct from empty states |
| Loading vs empty | Unchanged — skeletons remain separate (U8.2) |

---

## Legacy Components (Technical Debt)

| Legacy | Replacement | Status |
|--------|-------------|--------|
| `DashboardEmptyState` | `FeatureEmptyState` | Thin wrapper retained |
| `EmptyStateIllustrated` | `EmptyState variant="compact"` | Thin wrapper retained |
| `MockTestEmptyState` | `MockEmptyState` | Wrapper with actions |
| `analytics-empty-state` (mock-tests) | `AnalyticsEmptyStatePanel` | Richer structure |

---

## Readiness

Audit complete. Implementation tracked in:

- `src/lib/design/empty-state-inventory.ts`
- `src/lib/design/empty-state-guidelines.ts`
- `docs/u8-3-implementation-report.md`
