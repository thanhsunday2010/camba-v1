# M1.2 — YLE Practice Mock Authoring & Seed Pipeline

**Depends on:** [M1.1 blueprint foundation](./m1-yle-blueprint-foundation.md), U6 mock-test runtime (unchanged)

---

## Manifest location

Authored practice mocks live under:

```
data/mock-tests/{level}/{stable-slug}.json
```

**Practice mock bank (M1.3):** 9 tests total — 3 Starters, 3 Movers, 3 Flyers under `data/mock-tests/{level}/`.

Authoring source for M1.3 mocks: `scripts/lib/m1-3-mock-bank.mjs` → run `npm run write:m1-3-mock-manifests` to regenerate JSON.

Manifests are JSON (not runtime code) so seed scripts can load them without a TS build step. TypeScript tests import the same JSON via `resolveJsonModule`.

---

## Runtime-supported question types (M1.2 seeding)

These types are **approved** for seeded playable practice mocks:

| Blueprint key | CAMBA `question_type` | Notes |
|---------------|----------------------|--------|
| `mcq_single` | `multiple_choice` | 3–4 choices, one correct |
| `reading_comprehension` | `reading_comprehension` | Prefer shared passage via `parts[]` (M1.2b+) |
| `matching` | `matching` | `pairs[]` with left/right text |
| `gap_fill` | `gap_fill` | `content.template` + `content.correctAnswers` |

**Excluded from seeding** (blueprint-only or unsafe):

- `mcq_listening` — use `matching` / `gap_fill` + `parts[].audio` until native listening type ships
- `mcq_image` / `image_selection` — needs image assets
- `writing_*`, `speaking_*` — not auto-scored in U6 submit path
- `listening-part-4-colour` and other `blueprint_only` parts

---

## Part context blocks (M1.2b+)

Add optional `parts[]` to attach shared listening/reading context. The seed pipeline stores this as `questions.content.mockContext` (no new DB tables).

```json
{
  "partSlug": "listening-part-1-link",
  "sectionSlug": "listening",
  "partNumber": 1,
  "title": "Listening Part 1 — Link",
  "instructions": "Listen and match each person to what they have.",
  "contextType": "listening",
  "groupKey": "listening-part-1",
  "audio": {
    "src": "/audio/listening/starters/unit-01/listening-home-practice.mp3",
    "caption": "Listen carefully."
  }
}
```

**Per-question passages** (e.g. three dialogues in one blueprint part): use `questionRefs: ["rw-07"]` on separate `parts[]` entries sharing `partSlug` but different `groupKey` / `passage`.

**Runtime:** `getMockTestTakeViewModel()` exposes `questions[].context`; `MockTestQuestionContextPanel` renders above the question in take + review modes.

Old M1.2 manifests without `parts[]` still validate and seed — context panel simply stays hidden.

---

## Authoring a new Starters mock

1. Copy `starters-practice-test-1.json` → `starters-practice-test-2.json`
2. Update `metadata.manifestId`, `stableSlug`, `title`, `seedIds` (new UUIDs — use `scripts/lib/mock-test-ids.mjs` helpers)
3. Map sections/questions to M1.1 blueprint part slugs (`listening-part-*`, `rw-part-*`)
4. Author 15–25 questions — only supported types above
5. Set `metadata.totalScore` = sum of `questions[].points`
6. Fill `coverageAchieved` for topic/grammar/difficulty tracking

---

## Commands

```bash
# Inspect + validate all manifests
npm run generate:mock-tests

# Validate one manifest
npm run validate:mock-tests -- starters starters-practice-test-1

# Seed into Supabase (requires .env.local service role)
npm run seed:mock-tests -- starters starters-practice-test-1

# Seed entire YLE practice bank (all levels)
npm run seed:all-mock-tests
```

**TypeScript validation (CI):**

```bash
npm run test:validation -- src/lib/mock-blueprints/yle-mock-blueprint.validation.test.ts
```

---

## Seed architecture

```
data/mock-tests/.../manifest.json
        ↓ validateManifestForSeeding (scripts/lib/validate-mock-test-manifest.mjs)
        ↓ seedMockTestFromManifest (scripts/lib/seed-mock-test.mjs)
        ├── mock question bank (unit/lesson/exercise container — not on learning path)
        ├── mock_tests
        ├── mock_test_sections
        ├── questions + choices + question_pairs
        └── mock_test_questions (junction)
```

**Deterministic IDs** in `metadata.seedIds` — re-running seed upserts the same mock (idempotent).

**Question container:** Each mock uses a dedicated `exercises` row (`is_active: true`, `metadata.mockOnly`) under an inactive lesson — not on the learning path.

---

## Production deployment

Vercel deploys **code only**; mock content lives in Supabase. After each release:

1. Apply migrations on production Supabase (required: `011_mock_test_question_rls.sql`).
2. Seed with production credentials in `.env.local`:

```bash
npm run seed:all-mock-tests
```

If learners see **"Bài thi thử chưa sẵn sàng"** (`questionCount: 0`), production is missing question rows or RLS is blocking mock-bank questions — run the steps above.

---

## After seeding

1. Open `/mock-tests` — all seeded YLE practice tests appear for Cambridge English program users
2. Detail → **Take test** — context panels show instructions/passages (Starters T1 also has audio from M1.2b)
3. Submit uses existing `submitMockTest` + scoring (unchanged)

---

## M1.3 bank targets

| Level | Tests | Questions | Minutes | Sections |
|-------|-------|-----------|---------|----------|
| Starters | 3 | 20 each | 30 | Listening + Reading & Writing |
| Movers | 3 | 26 each | 40 | Listening (gap-fill) + Reading & Writing |
| Flyers | 3 | 32 each | 50 | Listening (gap-fill) + Reading & Writing |

Movers/Flyers listening uses `listening-part-2-fill` with text-simulated prompts (no `mcq_listening` / images).

---

## Deferred (M1.4+)

- `mcq_image` with picture assets
- Per-question listening audio clips for Movers/Flyers
- Admin CMS import from manifest JSON
- Speaking / free-writing runtime mocks
