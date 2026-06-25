# U8.5 — Parent Reporting Audit

**Date:** June 2026  
**Scope:** Existing CAMBA data sources for parent-friendly reporting  
**Status:** Audit complete — implementation follows this document

---

## Executive Summary

CAMBA already aggregates rich student intelligence in **`getStudentPortfolioViewModel`** (U7.5). Parent-facing surfaces previously used only **`getStudentProgressSummary`** (XP, streak, 5 mock scores). U8.5 introduces a **reporting layer** that reuses portfolio + dashboard skill insights without new scoring or analytics engines.

---

## Data Source Audit

### Learning Progress

| Source | Location | Metrics | Parent suitability |
|--------|----------|---------|-------------------|
| Achievement context | `achievement-view-model.ts` | lessons/units completed | **High** — clear counts |
| Next lesson context | `queries/dashboard.ts` | current unit/lesson | **High** — "where they are" |
| Journey summary | `learning-journey-view-model.ts` | completion %, milestones | **High** |
| Weekly stats | `student-dashboard-data.ts` | 7-day XP, lessons | **Moderate** — not yet in report v1 |
| Skill progress snapshot | `queries/dashboard.ts` | per-skill % | **Low for parents** — use aggregated insights instead |

**Reliability:** High for counts; progress % depends on program selection.

### Journey Progress

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| `LearningJourneyViewModel` | levels, milestones, completion % | **High** |
| Milestone keys | i18n-resolved titles | **High** after translation |

**Gap:** None significant — journey VM is report-ready.

### Mock Analytics

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| Mock hub | best/latest scores, attempts | **High** |
| `buildReadinessFromHub` | readiness %, band | **High** with plain-language bands |
| `computeMockTestSkillAnalytics` | grammar/vocab breakdown | **Moderate** — labels OK, percentages too technical alone |
| Skill breakdown JSON | per-skill scores | **Low raw** — use readiness + trends |

**Incomplete:** Grammar/vocab tags expand with content (M1.5) — report uses honest empty states.

### Writing Analytics

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| `ai_feedback` (writing) | overallScore, strengths, weaknesses | **High** |
| `writing-analytics.ts` (M1 adaptive) | internal signals | **Not exposed** — correctly excluded |

### Speaking Analytics

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| `ai_feedback` (speaking) | overall + dimension scores | **High** |
| Transcripts | stored in feedback | **Low for PDF v1** — scores only |

### Achievements

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| `buildAchievementViewModel` | unlocked, recent, next | **High** |
| Rarity/category | internal | **Low** — titles sufficient for parents |

### Certifications

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| Gold mocks completed | hub + certification entries | **High** |
| Level completions | journey levels | **High** |

### Profile Metrics

| Source | Metrics | Parent suitability |
|--------|---------|-------------------|
| `StudentPortfolioViewModel` | all slices | **High** — canonical aggregate |
| `shareReady` | compact snapshot | **High** — now wired to PDF snapshot export |
| Gamification (XP, level) | hero slice | **Moderate** — de-emphasised in parent copy |

---

## Metrics Classification

### Reliable for parents

- Lessons/units completed
- Mock best/latest scores
- Readiness band (plain language)
- Writing/speaking task counts and averages
- Achievement counts and recent titles
- Journey completion % and next milestone
- Learning streak

### Incomplete / expanding

- Grammar/vocabulary analytics (tag coverage growing)
- Skill shield segments (too game-like for parents)

### Too technical without translation

- Raw grammar tag slugs
- AI evaluation dimension jargon
- XP formulas, internal rarity tiers

---

## Parent Page Gap (unchanged by design)

`/parent/[studentId]` still uses legacy `StudentProgressSummary`. U8.5 **does not build a Parent Dashboard** per spec. Reports are exported from **`/profile/report`** (student) with architecture ready for parent access via `verifyParentAccess` in a future milestone.

---

## U8.5 Remediation

| Gap | Solution |
|-----|----------|
| No report VM | `getStudentProgressReport()` |
| No PDF | `@react-pdf/renderer` + `generateProgressReportPdf` |
| `shareReady` unused | Snapshot PDF variant |
| Technical copy | `report` i18n namespace + parent-friendly labels |
| Empty students | Guided empty sections — never blank PDF |

Implementation: `docs/u8-5-implementation-report.md`
