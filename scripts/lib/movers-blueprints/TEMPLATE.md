# Movers Unit Blueprint Template (Gold Standard: Unit 1)

**Reference implementation:** Unit 1 — Daily Routines (`unit-01/` + `shared/daily-routines-content.mjs`)

**Output:** `data/content/movers/unit-XX-<slug>.json` — **18 lessons × 90 exercises** (6 skills × 3 lessons × 5 exercises)

**Curriculum source:** `data/curriculum/cambridge-curriculum-map.json` → `levels.movers.units[]`

**Scope:** This template is for **Movers U2–U10 only**. Do not reuse Movers U1 content for Starters, Flyers, KET, or PET (different level, topic, and grammar scope).

---

## Movers unit plan (U1–U10)

| Unit | Slug | Title | Core grammar |
|------|------|-------|--------------|
| 1 ✅ | `daily-routines` | Daily Routines | Present simple, frequency adverbs |
| 2 | `the-body-and-health` | The Body and Health | Have got, should for advice |
| 3 | `weather-and-seasons` | Weather and Seasons | Past simple was/were, weather present |
| 4 | `hobbies-and-free-time` | Hobbies and Free Time | Present continuous, like + -ing |
| 5 | `holidays-and-travel` | Holidays and Travel | Going to, past simple went/saw/had |
| 6 | `shopping-and-money` | Shopping and Money | Comparatives, some/any |
| 7 | `jobs-and-work` | Jobs and Work | Present simple 3rd person, wh- questions |
| 8 | `materials-and-objects` | Materials and Objects | Made of, superlatives (intro) |
| 9 | `technology` | Technology | Object pronouns, can |
| 10 | `the-world-around-us` | The World Around Us | because/when/then, comparatives |

Read the full unit brief from the curriculum map before writing: `vocabulary`, `grammar`, `readingSkill`, `listeningSkill`.

---

## File layout (copy for each new unit)

```
scripts/lib/movers-blueprints/
  unit-XX.mjs                          # assembler — imports shared + 6 skill modules
  unit-XX/
    vocabulary.mjs                     # 3 lessons × 5 exercises
    grammar.mjs
    reading.mjs
    listening.mjs
    writing.mjs
    speaking.mjs
  shared/
    <unit-slug>-content.mjs            # vocabularyBank, grammarReference, passages, scripts, AI checks
    exercise-helpers.mjs                 # createMoversFactory() — shared across all Movers units
```

**Gold reference files (do not delete — copy structure from these):**

- `unit-01.mjs`
- `unit-01/*.mjs`
- `shared/daily-routines-content.mjs`

---

## Shared libraries (do not duplicate)

| Library | Role |
|---------|------|
| `scripts/lib/cambridge-unit-builder.mjs` | `buildMcq`, `buildGapFill`, `buildPassage`, `buildWritingCheck`, `buildSpeakingCheck`, Movers meta (A1, minWords 15, speaking 90s) |
| `scripts/lib/unit-assembler.mjs` | Assembles lessons, exercise normalization, skill order |
| `scripts/lib/content-ids.mjs` | Deterministic UUIDs (`levelSeries=3` for Movers) |
| `scripts/lib/curriculum-map.mjs` | `getCurriculumUnit("movers", n)` |
| `scripts/lib/validate-unit-structure.mjs` | Structure validation |

---

## Content conventions (from U1)

### Character & setting

- **Protagonist:** Minh, 9, Hanoi — reuse across all Movers units for continuity.
- **Supporting cast:** Mum, Linh (friend), teacher/doctor as needed per unit topic.
- **Tone:** Simple present-tense narratives, familiar YLE Movers contexts.

### Per-lesson exercise template (5 phases)

| sortOrder | Title prefix | Purpose | Typical types |
|-----------|--------------|---------|---------------|
| 0 | `Learn:` | Introduce | MCQ, matching (easy) |
| 1 | `Practice:` | Guided use | matching, gap_fill |
| 2 | `Check:` | Harder / AI | MCQ, listening, **writing** or **speaking** (AI only here) |
| 3 | `Apply:` | Context use | gap_fill, sentence_ordering, matching |
| 4 | `Review:` | Mixed recall | MCQ, gap_fill — **hand-crafted**, not copy of Check |

### AI exercises (Check only)

- **Writing:** `exerciseType: "writing"`, `minWords: 15`, `targetLevel: "movers"`, `taskDescription`, `prompts[]`, `rubric`
- **Speaking:** `exerciseType: "speaking"`, `maxDurationSeconds: 90`, `targetLevel: "movers"`, `prompt`, `followUpQuestions[]`

Learn / Practice / Apply / Review must **not** use AI exercise types.

### Question quality (every question)

- `skillTag`, `topicTag` (= unit slug), `levelTag: "movers"`
- `explanation` in **Vietnamese** — explain why, not just the answer
- MCQ: 3 choices, each wrong choice has `distractorNote`
- `qualityScores`: quality ≥ 0.90, curriculumAlignment ≥ 0.96, `needsReview: false`

### Listening

- Scripts in `shared/<slug>-content.mjs` with `speakers`, `lines`
- `cambridge-unit-builder` auto-sets `audioUrl` when `content.script` is present
- After generate: `npm run generate:listening-audio -- movers <unitNumber>`

### Sentence ordering

- Use `items` + `correctOrder` (not `words`) — see `cambridge-unit-builder.mjs` → `buildSentenceOrdering`

---

## Step-by-step: create Movers Unit N (N = 2…10)

### Phase 1 — Unit brief & shared content

1. Read unit N from `cambridge-curriculum-map.json` (`slug`, `title`, `vocabulary`, `grammar`, skills).
2. Create `shared/<slug>-content.mjs`:
   - `export const TOPIC = "<slug>"`
   - `vocabularyBank` (~12 words, expand beyond map minimum where natural)
   - `grammarReference` with `commonMistakes`
   - `unit` metadata block (learning objectives, character note)
   - `passage*` for reading (`title`, `text`, `wordCount` only — no images)
   - `listeningScript*` (2 scripts for L1/L2 listening lessons)
   - `listeningAnswerKeys`
   - `writingChecks` (3 prompts for 3 writing lessons)
   - `speakingChecks` (3 prompts for 3 speaking lessons)

### Phase 2 — Skill blueprints (18 × 5)

3. Copy `unit-01/` → `unit-0N/`, rewrite all six `*.mjs` files for the new topic and grammar.
4. Create `unit-0N.mjs` (mirror `unit-01.mjs` imports).
5. Each skill file exports one function: `vocabularyLessons(shared)`, etc.
6. Pass `topicTag: TOPIC` from the new shared content file in `unit-0N.mjs` `shared` object.

### Phase 3 — Generate & validate

```bash
node scripts/generate-cambridge-units.mjs movers <N>
npm run validate:movers
```

Expected: `18 lessons, 90 exercises`, validation passes.

### Phase 4 — Audio & seed

```bash
npm run generate:listening-audio -- movers <N>
npm run seed:movers -- --from <N> --to <N> --unlock-test-student
```

### Phase 5 — Audit checklist

- [ ] All explanations in Vietnamese (no bare English answer strings)
- [ ] Review exercises differ from Check (not duplicate question sets)
- [ ] No orphan MP3s in `public/audio/listening/movers/unit-0N/`
- [ ] `sentence_ordering` uses `items` + `correctOrder`
- [ ] Only Check exercises use `writing` / `speaking` types
- [ ] `topicTag` matches unit slug everywhere
- [ ] Test in app: `student@camba.me` / `camba123`, Writing Check + Speaking Check (AI + mic)

---

## npm scripts

| Command | Purpose |
|---------|---------|
| `npm run generate:movers-units -- 2` | Generate unit 2 JSON (or `node scripts/generate-cambridge-units.mjs movers 2`) |
| `npm run generate:movers-units -- 2 5` | Generate units 2–5 |
| `npm run validate:movers` | Validate all Movers JSON |
| `npm run generate:listening-audio -- movers 2` | TTS for unit 2 listening scripts |
| `npm run seed:movers -- --from 2 --to 2 --unlock-test-student` | Seed unit 2 to DB |

---

## `unit-XX.mjs` assembler pattern

```javascript
import { vocabularyBank, grammarReference, unit, TOPIC, /* passages, scripts, checks */ }
  from "./shared/<slug>-content.mjs";
import { createMoversFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-0N/vocabulary.mjs";
// ... other skills

const factory = createMoversFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  // passage*, listeningScript*, listeningAnswerKeys, writingChecks, speakingChecks
};

export default {
  vocabularyBank,
  grammarReference,
  unit,
  lessons: {
    vocabulary: vocabularyLessons(shared),
    grammar: grammarLessons(shared),
    reading: readingLessons(shared),
    listening: listeningLessons(shared),
    writing: writingLessons(shared),
    speaking: speakingLessons(shared),
  },
};
```

---

## How to request a new unit (for humans / AI)

Example prompts:

- *"Tạo Movers U2 The Body and Health theo TEMPLATE.md"*
- *"Generate Movers unit 3 from movers-blueprints template"*
- *"Audit và seed Movers U2 sau khi generate"*

Always point the agent to:

1. This file (`scripts/lib/movers-blueprints/TEMPLATE.md`)
2. Gold reference `unit-01/`
3. Curriculum map entry for unit N
4. Cursor rule `.cursor/rules/movers-unit-authoring.mdc`

---

## Do not

- Copy U1 Daily Routines text into other units
- Use Movers template for Flyers / Starters / KET / PET U1
- Duplicate Check content in Review exercises
- Skip listening audio generation
- Publish with `needsReview: true` without explicit approval
- Use legacy `starters-rich-unit-generator` patterns
