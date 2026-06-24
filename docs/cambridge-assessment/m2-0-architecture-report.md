# M2.0 — Cambridge Assessment Architecture Report

**Milestone:** M2.0 — Cambridge Exam Architecture Foundation  
**Status:** Architecture complete — no content generation, no runtime changes  
**Date:** June 2026

---

## Executive summary

CAMBA is redesigning its assessment layer from first principles to support **Pre A1 Starters through B1 PET**, including **AI-evaluated Writing and Speaking** via Gemini. Mock content was intentionally removed (commit `b042974`); this milestone establishes the canonical domain model, task taxonomy, exam blueprints, AI contracts, and migration path.

**Decision:** Introduce `src/lib/cambridge-assessment/` as the new assessment authority. Legacy `mock-blueprints/`, `mock-tests/`, and `item-bank/` remain during migration but are **subordinate** to the Cambridge model for all new work.

---

## 1. Codebase audit

### 1.1 Reusable pieces (keep and build on)

| Layer | Path | Reuse rationale |
|-------|------|-----------------|
| Auto-scoring engine | `src/lib/learning/scoring.ts` | MCQ, matching, gap-fill, sentence ordering — covers receptive tasks |
| Mock skill aggregation | `src/lib/learning/mock-test-scoring.ts` | Section breakdown pattern; extend for 4-skill weighting |
| Shield / scale math | `src/lib/learning/shields.ts`, `placement-scoring.ts` | YLE shields + Cambridge scale 100–170 |
| Grammar/vocab taxonomies | `src/lib/learning/grammar-taxonomy.ts`, `vocabulary-taxonomy.ts` | Extend for KET/PET tags in M2.1 |
| Learner analytics | `src/lib/learning/learner-skill-analytics.ts` | Tag-based strengths/weaknesses — level-agnostic |
| Mock analytics UI | `src/lib/mock-tests/mock-test-analytics.ts`, `components/mock-tests/analytics/*` | Reuse for post-exam insights |
| U6 view models | `src/lib/mock-tests/mock-test-types.ts`, `mock-test-page.ts`, `mock-test-hub.ts` | Hub/detail/take shell survives with extended VMs |
| Context panels | `src/lib/mock-tests/mock-test-context.ts` | Listening/reading stimulus display |
| Session UX | `mock-test-ui-utils.ts`, `mock-test-session-storage.ts` | Progress, display state, review modes |
| YLE blueprint schema | `src/lib/mock-blueprints/*` | Part/slug patterns map to M2 blueprints |
| Item bank foundation | `src/lib/item-bank/*` | Strict validation pattern; extend to 4 skills |
| Lesson AI (Gemini) | `src/lib/ai/gemini-client.ts`, `actions/ai/writing.ts`, `speaking.ts` | Production AI path — refactor into M2 contracts |
| AI schemas | `src/types/ai.ts` | Bridge to `cambridge-writing-ai-contracts.ts` |
| Curriculum authority | `data/curriculum/cambridge-curriculum-map.json` | Official weights, task types, scale ranges |
| Placement precedent | `src/actions/placement.ts` | Cambridge scale on multi-skill submit |

### 1.2 Must replace

| Current | Reason |
|---------|--------|
| YLE-only level types (`YleLevelSlug`) | Cannot represent KET/PET |
| Hardcoded format flags (`includesSpeaking: false` in `mock-test-format.ts`) | Blocks truthful full-exam UX |
| Writing/speaking → 0 points in `scoring.ts` default branch | Full exam requires AI score path |
| DB-only mock loading without assembly | Needs blueprint + item-bank → exam instance |
| Gap-fill proxies for writing parts (M1 practice subset) | Not exam-faithful for M2 mocks |
| Duplicate format derivation (3 implementations) | Consolidate under Cambridge layer |
| `ItemBankQuestionType` (9 auto-scored types only) | Cannot represent writing/speaking tasks |

### 1.3 Must extend

| Target | Extension |
|--------|-----------|
| `submitMockTest` | Score router: auto + async AI channels |
| `MockTestPlayer` / `QuestionRenderer` | Route writing/speaking to AI components |
| `mock-blueprints/` | KET/PET blueprints; align with `cambridge-exam-blueprints.ts` |
| `item-bank/` | Discriminated reading/listening/writing/speaking items |
| Taxonomies | KET/PET grammar and vocabulary slugs |
| `mock_test_attempts` schema (JSON) | AI evaluation refs, pending AI status |
| AI actions | Decouple from lesson unlock; callable from exam submit |

### 1.4 U6 runtime (unchanged in M2.0)

U6 = mock product runtime (`/mock-tests/*`, `submitMockTest`, player). M1 docs deferred speaking/writing to M2. U6 shells remain valid; scoring and content layers evolve underneath.

---

## 2. Recommended folder structure

```
src/lib/cambridge-assessment/          ← NEW (M2.0 authority)
  cambridge-assessment-types.ts        Exam levels, skills, assessment types
  cambridge-task-taxonomy.ts           Single source of truth for task types
  cambridge-exam-blueprints.ts         Starters → PET structure matrix
  cambridge-writing-ai-contracts.ts    Writing AI request/result contracts
  cambridge-speaking-ai-contracts.ts   Speaking pipeline contracts
  cambridge-item-bank-proposal.ts      Future 4-skill item bank types
  index.ts
  cambridge-assessment.validation.test.ts

src/lib/cambridge-assessment/          ← FUTURE (M2.1+)
  cambridge-score-router.ts            Auto + AI scoring orchestration
  cambridge-exam-assembler.ts          Blueprint + bank → exam instance
  cambridge-writing-ai-service.ts      Gemini implementation
  cambridge-speaking-ai-service.ts     Transcription + rubric pipeline

src/lib/mock-tests/                    ← LEGACY (migrate gradually)
src/lib/mock-blueprints/               ← LEGACY YLE (wrap or deprecate)
src/lib/item-bank/                     ← LEGACY M1.8 (extend to cambridge-item-bank)

data/cambridge-item-bank/              ← FUTURE (M2.1+)
  {level}/items.json | {skill}.json

docs/cambridge-assessment/             ← Architecture docs
  m2-0-architecture-report.md          This document
```

---

## 3. TypeScript domain model proposal

Implemented in `src/lib/cambridge-assessment/cambridge-assessment-types.ts`:

```typescript
CambridgeExamLevel = "starters" | "movers" | "flyers" | "ket" | "pet"
CambridgeSkill = "reading" | "writing" | "listening" | "speaking"
CambridgeAssessmentType = "practice" | "mock" | "placement"
CambridgeScoringMode = "auto" | "ai" | "human" | "hybrid"
CambridgeScoreReportingModel = "yle_shields" | "cambridge_scale"
```

**Assessment session** (`CambridgeAssessmentSession`) tracks lifecycle including `awaiting_ai` for async Gemini evaluation.

**Relationship to legacy types:**

| Legacy | Cambridge |
|--------|-----------|
| `YleLevelSlug` | Subset of `CambridgeExamLevel` |
| `ItemSkill` (+ `reading_writing`) | Split into `reading` + `writing` |
| `YleMockRuntimeSupport` | Replaced by `CambridgeScoringMode` + `aiRequired` on tasks |
| `MockTestFormatMetadata` | Derive from `CambridgeExamBlueprint` |

---

## 4. Task taxonomy (single source of truth)

**File:** `src/lib/cambridge-assessment/cambridge-task-taxonomy.ts`

21 task types across 4 skills. Each defines:

- `skill`, `aiRequired`, `autoScored`, `scoringMode`
- `minimumLevel`, `maximumLevel`
- `responseShape`, `legacyCambaQuestionType`

| Skill | Auto-scored tasks | AI-evaluated tasks |
|-------|-------------------|-------------------|
| Reading | multiple_choice, matching, true_false, sentence_ordering, reading_comprehension, open_cloze, gapped_text | — |
| Listening | audio_multiple_choice, audio_matching, audio_gap_fill, audio_true_false | — |
| Writing | — | write_sentence, write_note, write_email, write_story, picture_description_writing |
| Speaking | — | short_answer, picture_description_speaking, story_telling, conversation |

---

## 5. Writing AI contract proposal

**File:** `src/lib/cambridge-assessment/cambridge-writing-ai-contracts.ts`

### Evaluation dimensions

1. Grammar  
2. Vocabulary  
3. Task achievement  
4. Organization  
5. Communicative effectiveness  

### Output contract (`WritingAiEvaluationResult`)

| Field | Type | Notes |
|-------|------|-------|
| `overallScore` | 0–100 | Normalized |
| `bandScore` | `yle_shields` \| `cambridge_scale` \| `percent` | Level-appropriate |
| `dimensions` | `WritingDimensionScore[]` | Per-dimension score + feedback |
| `strengths` | `string[]` | |
| `weaknesses` | `string[]` | |
| `feedback` | `string` | Summary |
| `correctedVersion` | `string` | Model suggestion |

### Service interface

```typescript
interface CambridgeWritingAiEvaluator {
  evaluate(request: WritingAiEvaluationRequest): Promise<WritingAiEvaluationResult>;
}
```

**Migration from lessons:** `WritingFeedbackSchema` in `src/types/ai.ts` maps via `LegacyWritingFeedbackBridge`. M2.2 implements Gemini against the new contract.

---

## 6. Speaking AI contract proposal

**File:** `src/lib/cambridge-assessment/cambridge-speaking-ai-contracts.ts`

### Pipeline

```
Audio → Transcription → Language Analysis → Rubric Evaluation
```

### Evaluation dimensions

1. Pronunciation  
2. Grammar  
3. Vocabulary  
4. Fluency  
5. Task achievement  

### Output contract (`SpeakingAiEvaluationResult`)

Includes `transcript`, `pipeline.transcription`, `pipeline.languageAnalysis`, plus same band/score/strengths/weaknesses/feedback pattern as writing.

### Service interface

```typescript
interface CambridgeSpeakingAiEvaluator {
  transcribe(audio): Promise<SpeakingTranscriptionResult>;
  analyzeLanguage(transcript, level): Promise<SpeakingLanguageAnalysis>;
  evaluate(request): Promise<SpeakingAiEvaluationResult>;
}
```

**Migration from lessons:** `SpeakingFeedbackSchema` subscores map to dimension scores. Audio upload/storage reuses `actions/ai/speaking.ts` patterns.

---

## 7. Exam blueprint matrix (Starters → PET)

**File:** `src/lib/cambridge-assessment/cambridge-exam-blueprints.ts`

| Level | Duration | Papers | Auto items | AI items | Score model |
|-------|----------|--------|------------|----------|-------------|
| **Starters** | 45 min | Listening, R&W, Speaking | 25 | 8 | YLE shields |
| **Movers** | 55 min | Same structure | 30 | 9 | YLE shields |
| **Flyers** | 65 min | Same structure | 35 | 10 | YLE shields |
| **KET** | 110 min | R&W, Listening, Speaking | 45 | 4 | Cambridge scale |
| **PET** | 130 min | Reading, Writing, Listening, Speaking | 40 | 6 | Cambridge scale |

Each part specifies: `allowedTaskTypes`, `scoringMode`, `aiEvaluated`, timing, item counts.

**YLE note:** Reading & Writing remain one combined paper (Cambridge official structure). **KET/PET:** Reading and Writing separate at PET; KET combined R&W paper per Key for Schools format.

---

## 8. Future item bank model

**File:** `src/lib/cambridge-assessment/cambridge-item-bank-proposal.ts`

Discriminated union:

- `CambridgeReceptiveBankItem` (reading | listening) — auto-scored content  
- `CambridgeWritingBankItem` — prompt + rubric + word limits  
- `CambridgeSpeakingBankItem` — prompt + stimulus + max duration + rubric  

Mock assembly uses `CambridgeItemReference[]` (item IDs, not inline questions).

**Layout options:** unified `items.json` per level (M1.8 compatible) or split by skill file.

---

## 9. Migration plan

### Phase A — Parallel authority (M2.0 ✅)

- Add `cambridge-assessment/` types and contracts  
- Document audit and blueprint matrix  
- No runtime changes  

### Phase B — Blueprint alignment (M2.1)

- Map `yle-mock-blueprints.ts` → import from `cambridge-exam-blueprints.ts`  
- Add KET/PET blueprint entries  
- Extend taxonomies for A2/B1  
- Introduce `data/cambridge-item-bank/` schema  

### Phase C — Score router (M2.2)

- Implement `CambridgeWritingAiEvaluator` with Gemini  
- Extend `submitMockTest` with AI async path  
- Wire writing tasks in player  
- Persist `WritingAiEvaluationResult` on attempts  

### Phase D — Speaking pipeline (M2.3)

- Implement full `CambridgeSpeakingAiEvaluator`  
- Speaking UI in mock take flow  
- Transcription + rubric stages  

### Phase E — Exam assembly (M2.4)

- `assembleExamFromBlueprint(blueprint, bank)`  
- Replace manifest-per-test JSON with item references  
- Seed pipeline reads Cambridge bank  

### Phase F — Product modes (M3)

- Practice vs mock vs placement configs  
- Placement uses subset blueprints + Cambridge scale reporting  

### Phase G — Content scale (M4)

- Authoring tools, coverage CLI, AI-assisted item creation  
- Full exam catalog per level  

### Legacy deprecation timeline

| Module | Deprecate when |
|--------|----------------|
| `data/mock-tests/*.json` | M2.4 assembly live |
| `YleLevelSlug`-only types | M2.1 KET/PET blueprints merged |
| `mock-test-format.ts` constants | M2.2 format derived from blueprint |
| M1.8 `item-bank/` types | M2.1 cambridge-item-bank migration |

---

## 10. Implementation roadmap

| Milestone | Focus | Deliverable |
|-----------|-------|-------------|
| **M2.0** ✅ | Architecture | Domain model, taxonomy, blueprints, AI contracts, this report |
| **M2.1** | Blueprints + bank schema | KET/PET blueprints, cambridge-item-bank on disk, extended taxonomies |
| **M2.2** | Writing AI in exams | `CambridgeWritingAiEvaluator`, player integration, submit router |
| **M2.3** | Speaking AI in exams | Full speaking pipeline in take flow |
| **M2.4** | Exam assembly | Blueprint + bank → DB seed; item references in manifests |
| **M3** | Assessment modes | Practice / mock / placement product differentiation |
| **M4** | Content at scale | Authoring, generation assist, coverage tooling |

---

## 11. Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    cambridge-assessment/ (M2.0)                  │
│  Types │ Task Taxonomy │ Exam Blueprints │ Writing/Speaking AI  │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ cambridge-item- │ │ Exam Assembler  │ │ Score Router    │
│ bank (M2.1)     │ │ (M2.4)          │ │ (M2.2–M2.3)     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              U6 Runtime (mock-tests/*, components/*)             │
│  Hub → Detail → Take → Submit → Results → Analytics             │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Shared: scoring.ts │ Gemini AI │ Supabase │ learner analytics   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Verification

```bash
npm run typecheck
npm run test:validation   # includes cambridge-assessment.validation.test.ts
```

**M2.0 constraints respected:**

- ✅ No mock content generated  
- ✅ No question banks populated  
- ✅ No manifests created  
- ✅ No runtime route/scoring/submit changes  
- ✅ Architecture types and contracts only  

---

## 13. Key decision

> **Can CAMBA support full Cambridge exams (including AI Writing and Speaking) without rewriting the platform?**

**Yes — with a layered migration.** U6 UI shells, auto-scoring, analytics, and lesson AI provide the foundation. M2.0 defines the missing canonical layer. M2.1–M2.4 wire blueprints, AI evaluators, and item bank assembly without discarding M1 investments.

**Generator and content belong to M2.4+ / M4.** This milestone ends with a production-grade architecture decision document ready for implementation.
