# M3.1 — Cambridge Authenticity Audit

Audit date: June 2026  
Scope: mock manifests, item bank, M2.0 blueprints, M2.1–M2.4 assessment contracts

---

## Executive summary

CAMBA’s **architecture** is production-ready (U6 runtime, M1 analytics, M2 Writing/Speaking AI, M2.4 assembly). The **content layer** previously lacked academically authoritative reference exams. M2.4 reference exams were assembly-generated placeholders. M1.8 item banks are empty. M1 mock blueprints use different part slugs than M2.0 Cambridge blueprints.

M3.1 Gold Mocks address the content gap with five manually authored, blueprint-aligned reference exams.

---

## Current assets audited

| Asset | Location | State | Authenticity gap |
|-------|----------|-------|------------------|
| M2.0 exam blueprints | `cambridge-exam-blueprints.ts` | Complete Starters→PET | Structure only — no questions |
| M2.4 assembled exams | `data/cambridge-exams/` | Generated | Placeholder stems, not exam-ready |
| M1.8 item bank | `data/item-bank/` | Empty (`itemCount: 0`) | No reusable items |
| M1 YLE mock blueprints | `yle-mock-blueprints.ts` | YLE only | Part slugs differ from M2.0; speaking/writing marked blueprint-only until M2.1–M2.3 |
| M1.1 example manifest | `starters-practice-mock-manifest.example.ts` | 2 questions | Illustrative only |
| Writing examples | `data/cambridge-writing-examples/` | Task-type fixtures | Not full-form exams |
| Mock runtime | U6 + seed pipeline | Functional | Ready for gold content import |

---

## Task types — gaps vs real Cambridge

| Area | Real Cambridge | Pre-M3.1 CAMBA | M3.1 Gold Mock response |
|------|----------------|----------------|-------------------------|
| YLE Listening P1 | Name–picture linking | Supported (matching) | Authored with transcripts |
| YLE Listening P4 | Colour and draw | MCQ proxy only | MCQ with colour/draw prompts; noted limitation |
| YLE R&W P4 | Copy/complete writing | M2.2 writing runtime | Full write_sentence + picture_description tasks |
| YLE Speaking | Find differences, interview, story | M2.3 speaking runtime | All three parts authored |
| KET/PET open cloze | Single-word gaps | gap_fill mapped | Authored gap-fill templates |
| KET/PET gapped text | Sentence insertion | partial | Authored via reading comprehension passages |
| KET/PET email/story | Extended writing | M2.2 AI evaluation | write_email / write_story with rubrics |

---

## Timing — gaps vs real Cambridge

| Level | Official duration | M2.0 blueprint | Gold Mock |
|-------|-------------------|----------------|-----------|
| Starters | ~45 min | 45 min | 45 min |
| Movers | ~55 min | 55 min | 55 min |
| Flyers | ~65 min | 65 min | 65 min |
| KET | ~110 min | 110 min | 110 min |
| PET | ~130 min | 130 min | 130 min |

Per-part minutes follow M2.0 blueprint. CAMBA runtime uses section `timeLimitMinutes` — aligned.

---

## Skill balance

| Level | Official model | Gold Mock |
|-------|----------------|-----------|
| Starters–Flyers | Listening + R&W + Speaking (no separate Writing paper) | 4 skills via rw-part-4 + speaking |
| KET | R&W combined + Listening + Speaking | Matches M2.0 KET blueprint |
| PET | Reading + Writing + Listening + Speaking (4 papers) | Matches M2.0 PET blueprint |

Pre-M3.1: assembly engine could produce counts but not quality balance. Gold Mocks enforce topic/grammar spread via validation.

---

## Writing expectations

| Level | Cambridge expectation | Pre-M3.1 | Gold Mock |
|-------|----------------------|----------|-----------|
| Starters | Short sentences, picture support | Fixture only | 5 tasks: sentences + picture description |
| Movers | Notes, sentences | Fixture only | write_sentence, write_note, picture_description |
| Flyers | Notes, short stories | Fixture only | write_note, write_story, picture_description |
| KET | Email + story (15 marks each) | No full mock | rw-part-6/7 with M2.2 shapes |
| PET | Email + article/story (20 marks each) | No full mock | writing-part-1/2 with M2.2 shapes |

All writing tasks include `cambridgeTaskType`, `prompt`, word limits, `rubricId` for M2.2 Gemini evaluation.

---

## Speaking expectations

| Level | Cambridge expectation | Pre-M3.1 | Gold Mock |
|-------|----------------------|----------|-----------|
| YLE | Find differences, personal Qs, picture story | M2.3 runtime ready | 3 parts × 1 task, 5 shields each |
| KET | Interview + collaborative | No full mock | conversation + picture description |
| PET | Interview + long turn + discussion | No full mock | 3 speaking parts authored |

All speaking tasks include `maxDurationSeconds`, prompts, M2.3 runtime task aliases.

---

## Listening expectations

| Gap | Detail | M3.1 status |
|-----|--------|-------------|
| Audio assets | Real exams use recorded audio | Transcripts authored; audio paths `/audio/gold-mocks/` (TTS/recording deferred) |
| Part context | Shared audio per part | `parts[]` with `listeningAudio` contexts |
| Gap-fill spelling | Exact word/number | `correctAnswers` on gap_fill items |
| Part 4 colouring | Physical drawing | MCQ proxy documented as known limitation |

---

## Scoring expectations

| Level | Model | Gold Mock |
|-------|-------|-----------|
| YLE | 5 shields per skill | Points per item; hybrid AI for writing/speaking |
| KET/PET | Cambridge scale | High-weight writing/speaking parts (15–20 pts) |

Gold Mocks enforce `totalScore === sum(points)`. AI tasks use hybrid scoring via M2.2/M2.3 (not `isCorrect: true`).

---

## Priority gaps closed by M3.1

1. No academically credible full-form reference exam → **5 Gold Mocks**
2. Empty item bank → **extraction proof from Gold Mocks**
3. Assembly placeholders as “golden” reference → **Gold tier supersedes M2.4 reference**
4. No content QA standard → **authoring guide + QA checklist + validation**

---

## Remaining gaps (post-M3.1)

- Recorded listening audio (not TTS placeholders)
- YLE Listening Part 4 true colouring UI
- KET/PET `levelSlug` type extension at strict YLE import boundary
- Human examiner calibration of AI rubric thresholds
- Multiple gold forms per level (B, C) — deferred to M3.2+
