# M3.4 — Mock Certification

Academic QA and certification layer for CAMBA mock exams. Converts quality measurements into release decisions.

## Audit Findings (Pre-Implementation)

### Existing strengths
- **M3.1 Gold Mocks** — `validateGoldMock()` provides blueprint, coverage, difficulty, and M2.2/M2.3 shape checks.
- **M2.4 Assembly** — `validateAssemblyResult()` validates manifest + runtime compatibility.
- **M3.2 Item Bank** — `buildCoverageMatrix()`, `detectItemBankDuplicates()`, `scoreItemBankQuality()` measure inventory health.
- **Deterministic validators** — No AI required for certification decisions.

### Gaps identified
- No unified certification tier (Gold/Silver/Bronze/Rejected).
- Quality scores not wired to release gates.
- No cross-mock duplicate/cluster detection at exam level.
- No certification registry or batch pipeline.
- No gold-vs-generated comparison report.
- Student safety checks scattered across validators.

## Certification Model

```
Mock Runtime Manifest
        │
        ▼
┌───────────────────┐
│ Student Safety    │──► Reject if unsafe
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Blueprint Fidelity│──► Reject if part counts wrong
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Academic Quality  │──► Grammar, vocab, writing, speaking, reading, listening
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Duplicate Detection│──► Penalize diversity score
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Level Assignment  │──► gold | silver | bronze | rejected
└───────────────────┘
```

## Certification Levels

| Level | Criteria |
|-------|----------|
| **Gold** | Score ≥85, coverage ≥80, QA ≥85, diversity ≥90, blueprint 100%, writing + speaking present, zero critical errors |
| **Silver** | Score ≥72, coverage ≥65, QA ≥70, diversity ≥75, blueprint 100%, writing + speaking present |
| **Bronze** | Score ≥55, coverage ≥50, QA ≥55, diversity ≥60, blueprint ≥90%, writing + speaking present |
| **Rejected** | Blueprint failure, safety failure, or scores below bronze thresholds — not student-facing |

## Quality Rules

Deterministic rules in `academic-quality-rules.ts`:

- Grammar / vocabulary / skill / task coverage minimums (from M2.4 requirements)
- Blueprint part counts, timing, weighting
- Difficulty distribution (auto-scored items)
- Writing: M2.2 shape, rubricId, word range, non-placeholder prompts
- Speaking: M2.3 shape, rubricId, duration, non-placeholder prompts
- Reading: passage presence and length
- Listening: transcript for QA
- Student safety: malformed prompts, empty passages, missing answer keys, invalid media

## Inventory Workflow

1. Run `npm run analyze:item-bank-gaps` — bank readiness
2. Run `npm run review:mock-inventory -- {level}` — per-level inventory + certification preview
3. Review coverage matrix gaps before generating mocks

## QA Workflow

1. Generate or load mock runtime manifest
2. Run `npm run certify:mocks [-- level]`
3. Review reports in `data/cambridge-certification/reports/{level}/`
4. Check `data/cambridge-certification/gold-mock-certification-report.json`
5. Reject mocks below bronze; publish gold/silver/bronze only

## Release Workflow

1. Batch certify all mocks (`npm run certify:mocks`)
2. Filter registry for `studentFacing === true`
3. Gold mocks must outperform assembled mocks (comparison report)
4. Persist certification registry for inventory tracking
5. Only certified mocks proceed to M4 content production seeding

## Module Reference

| Module | Purpose |
|--------|---------|
| `mock-certification-types.ts` | Types and metrics |
| `mock-certification-engine.ts` | Main certification orchestrator |
| `mock-certification-rules.ts` | Level thresholds |
| `academic-quality-rules.ts` | Deterministic QA rules |
| `mock-certification-duplicates.ts` | Exam-level duplicate detection |
| `mock-certification-registry.ts` | Certification inventory |
| `mock-certification-summary.ts` | Dashboard data layer |
| `mock-certification-report.ts` | Report formatting |

## CLI

```bash
npm run certify:mocks              # Certify all levels (gold + assembled A/B/C)
npm run certify:mocks -- starters  # Single level
npm run review:mock-inventory -- pet
```

## Output Locations

- `data/cambridge-certification/certification-registry.json`
- `data/cambridge-certification/reports/{level}/{mockId}-certification.json`
- `data/cambridge-certification/gold-mock-certification-report.json`

## Non-Goals

- No runtime redesign
- No AI scoring changes
- No new content generation
- No item bank modification
- Evaluation and certification only
