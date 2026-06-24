# Gold Mock Authoring Standard (M4.1)

Permanent CAMBA assessment authoring authority for all Gold Mock exams.

## Purpose

Gold Mocks are the **only** academic source of truth for:
- Item bank extraction (M4.2)
- Mock generation benchmarks
- Certification baselines
- Adaptive practice and placement (future)

Generated mocks never replace Gold Mocks.

---

## Registry

Every Gold Mock is registered in `src/lib/cambridge-assessment/gold-mock-registry.ts`:

| Field | Requirement |
|-------|-------------|
| `goldMockId` | `{level}-gold-mock-{1\|2\|3}` |
| `level` | starters \| movers \| flyers \| ket \| pet |
| `version` | 1, 2, or 3 |
| `author` | Human author name |
| `reviewer` | Academic reviewer |
| `certificationStatus` | Must be `gold` before publication |
| `sourceBlueprint` | M2.0 blueprint ID |
| `publicationReady` | true only after certification |

**Total inventory:** 15 mocks (3 per level).

---

## Question Authoring Rules

1. **One learning objective per item** — grammar + vocabulary tags must reflect the tested skill.
2. **No placeholder stems** — reject patterns like "Question 1", "Writing task:", "architecture validation".
3. **Age-appropriate** — vocabulary and themes match CEFR band and target age.
4. **Authentic progression** — parts follow Cambridge task flow within each paper.
5. **No cross-mock duplication** — stems, prompts, and passages must be unique across all 3 mocks at the same level.

### Required metadata (every question)

- `questionRef` — stable deterministic ID
- `partSlug` — blueprint part
- `sectionSlug` — listening \| reading-writing \| reading \| speaking
- `difficulty` — easy \| medium \| hard
- `grammarTags[]` — canonical slugs from `grammar-taxonomy.ts`
- `vocabularyTopics[]` — canonical slugs from `vocabulary-taxonomy.ts`
- `skillTag` — listening \| reading \| writing \| speaking
- `blueprintQuestionType` — from M2.0 taxonomy
- `points` — matches blueprint weighting

---

## Difficulty Calibration

| Level | Easy | Medium | Hard | Tolerance |
|-------|------|--------|------|-----------|
| Starters | ~35% | ~45% | ~20% | ±12% |
| Movers | ~30% | ~45% | ~25% | ±12% |
| Flyers | ~25% | ~45% | ~30% | ±12% |
| KET | ~25% | ~50% | ~25% | ±12% |
| PET | ~20% | ~50% | ~30% | ±12% |

Writing and speaking items are excluded from auto-scored difficulty distribution.

---

## Vocabulary Calibration

- Minimum distinct topics per mock: level-specific (see `getCoverageRequirementsForLevel`)
- Maximum single-topic share: 20–25%
- Themes rotate across mock versions (e.g. Mock 1: school, Mock 2: animals, Mock 3: travel)

---

## Grammar Calibration

- Minimum distinct grammar tags per mock: 4 (Starters) → 10 (PET)
- Tags must map to `YLE_GRAMMAR_TAGS` registry
- Each part should test grammar appropriate to task type

---

## Writing Standards (M2.2)

Every writing item must include:

```typescript
{
  cambaQuestionType: "writing",
  content: {
    cambridgeTaskType: "write_sentence" | "write_note" | "write_email" | "write_story" | "picture_description",
    prompt: string,           // ≥20 chars, non-placeholder
    taskDescription?: string,
    minWords?: number,
    maxWords?: number,
    requiredPoints?: string[],
    rubricId: "gold-{taskType}-v1"
  }
}
```

Use `goldWriting()` helper only. Do not invent alternate writing schemas.

| Level | Task types | Word guidance |
|-------|------------|---------------|
| Starters | write_sentence, picture_description | 3–25 |
| Movers | + write_note | 3–35 |
| Flyers | write_note, write_story | 25–50 |
| KET | write_email, write_story | email 25–35; story 35+ |
| PET | write_email, write_story | ~80–120 |

---

## Speaking Standards (M2.3)

Every speaking item must include:

```typescript
{
  cambaQuestionType: "speaking",
  content: {
    cambridgeTaskType: "speaking_personal_questions" | "speaking_picture_description" | "speaking_storytelling" | "speaking_discussion",
    prompt: string,
    maxDurationSeconds: number,  // > 0
    followUpQuestions?: string[],
    rubricId: "gold-{taskType}-v1"
  }
}
```

Use `goldSpeaking()` helper only. Gemini evaluation uses M2.3 contracts.

---

## Listening Standards

- Part-level `listeningAudio()` context with full transcript
- Per-item `transcriptSnippet` for QA
- Gap-fill items require `template` + `correctAnswers`
- MCQ items require marked correct choice
- Audio paths: `/audio/gold-mocks/{partSlug}.mp3`

---

## Reading Standards

- Reading comprehension requires `passage` ≥ 40 characters
- Matching/gap-fill follow blueprint part task types
- KET/PET use dedicated reading paper slugs

---

## Review Workflow

1. Author manifest in TypeScript (`manifests/{level}-gold-mock-{n}.ts`)
2. Run `validateGoldMock(manifest)` — must pass with zero errors
3. Run `npm run analyze:gold-mock -- {level}`
4. Academic reviewer checks QA checklist (`gold-mock-qa-checklist.md`)
5. Cross-mock duplicate review (no stem overlap across versions)
6. Submit for certification

---

## Certification Workflow

1. Run `npm run certify:mocks -- {level}`
2. **Gold Mocks only accept tier: GOLD** — Silver/Bronze rejected for publication
3. Requirements for GOLD:
   - `validateGoldMock()` passes
   - Blueprint score 100%
   - Writing + speaking present
   - Certification score ≥ 85
   - Zero critical errors
   - Diversity score ≥ 90 (or gold floor with validateGoldMock pass)
4. Update registry `certificationStatus` and `publicationReady`
5. Write JSON to `data/cambridge-gold-mocks/{level}/{level}-gold-mock-{n}.json`

---

## Supabase Publishing (M4.1 → student-facing)

Gold Mocks in the repo are **not** visible on `/mock-tests` until seeded into Supabase.

```bash
# Validate all 15 manifests (no DB writes)
npm run seed:gold-mocks -- --dry-run

# Seed local/staging (.env.local)
npm run seed:gold-mocks

# Seed one level
npm run seed:gold-mocks -- starters

# Staging / production (create .env.staging.local or .env.production.local)
SEED_ENV=staging npm run seed:gold-mocks
SEED_ENV=production npm run seed:gold-mocks
```

Requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the chosen env file.

Deterministic mock test IDs: `{levelSeries}{version}-0000-4000-8000-000000000001`  
(e.g. Starters Mock 1 → `02000001-…`, PET Mock 3 → `06000003-…`).

**Note:** If migration `010_data_model_alignment.sql` is not applied on the target DB, `reading_comprehension` items are stored as `reading` (runtime normalizes via `normalizeQuestionType`).

---

```
src/lib/cambridge-assessment/gold-mocks/manifests/
  {level}-gold-mock-1.ts   # M3.1 baseline
  {level}-gold-mock-2.ts   # M4.1
  {level}-gold-mock-3.ts   # M4.1

data/cambridge-gold-mocks/
  {level}/{level}-gold-mock-{n}.json
```

---

## Authoring Helpers

| Helper | Use |
|--------|-----|
| `goldMatching()` | Listening/reading matching |
| `goldGapFill()` | Gap fill / dictation |
| `goldMcq()` | MCQ listening/reading |
| `goldReadingComprehension()` | Passage + MCQ |
| `goldWriting()` | M2.2 writing tasks |
| `goldSpeaking()` | M2.3 speaking tasks |
| `composeGoldMockManifest()` | Assemble full manifest |
| `buildQuestionsFromSlots()` | Slot-driven authoring (M4.1) |

---

## Non-Goals

- No mass generation
- No LLM bulk authoring
- No assembly-generated gold tier
- No item bank expansion in M4.1
