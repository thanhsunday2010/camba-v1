# Starters Unit Blueprint Template (Gold Standard: Unit 1)

**Reference implementation:** Unit 1 — Family and Friends (`unit-01/` + `shared/family-and-friends-content.mjs`)

**Output:** `data/content/starters/unit-XX-<slug>.json` — **18 lessons × 90 exercises** (6 skills × 3 lessons × 5 exercises)

**Curriculum source:** `data/curriculum/cambridge-curriculum-map.json` → `levels.starters.units[]`

**Scope:** This template is for **Starters U2–U10**. Unit 1 is the gold reference; do not reuse its content for Movers, Flyers, KET, or PET.

---

## Starters unit plan (U1–U10)

| Unit | Slug | Title | Core grammar |
|------|------|-------|--------------|
| 1 ✅ | `family-and-friends` | Family and Friends | am/is/are, possessives, who |
| 2 | `numbers-and-time` | Numbers and Time | Numbers 1–20, how many/how old |
| 3 | `colours-and-clothes` | Colours and Clothes | Adjective + noun, verb be |
| 4 | `animals` | Animals | this/that, plural -s |
| 5 | `toys-and-weather` | Toys and Weather | It's + weather, these/those |
| 6 | `food-and-drink` | Food and Drink | like, some/any (intro) |
| 7 | `the-home` | The Home | There is/are, prepositions |
| 8 | `school` | School | Present simple (intro), classroom |
| 9 | `sports-and-leisure` | Sports and Leisure | can, like + -ing |
| 10 | `transport-and-places` | Transport and Places | prepositions, where |

Read the full unit brief from the curriculum map before writing: `vocabulary`, `grammar`, `readingSkill`, `listeningSkill`.

---

## File layout (copy for each new unit)

```
scripts/lib/starters-blueprints/
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
    exercise-helpers.mjs                 # createStartersFactory() — shared across all Starters units
```

**Gold reference files (do not delete — copy structure from these):**

- `unit-01.mjs`
- `unit-01/*.mjs`
- `shared/family-and-friends-content.mjs`

---

## Shared libraries (do not duplicate)

| Library | Role |
|---------|------|
| `scripts/lib/cambridge-unit-builder.mjs` | `buildMcq`, `buildGapFill`, `buildPassage`, `buildWritingCheck`, `buildSpeakingCheck`, Starters meta (Pre-A1, minWords 5, speaking 60s) |
| `scripts/lib/unit-assembler.mjs` | Assembles lessons, exercise normalization, skill order |
| `scripts/lib/content-ids.mjs` | Deterministic UUIDs (`levelSeries=2` for Starters) |
| `scripts/lib/curriculum-map.mjs` | `getCurriculumUnit("starters", n)` |
| `scripts/lib/validate-unit-structure.mjs` | Structure validation |

---

## Content conventions (from U1)

### Character & setting

- **Protagonist:** Mai, 8 — reuse across Starters units for continuity (legacy gold standard).
- **Supporting cast:** Nam (brother), Anna (friend), parents; listening scripts may use Minh/Hoa as speakers.
- **Tone:** Very short sentences, familiar YLE Starters contexts (family, school, face words).

### Per-lesson exercise template (5 phases)

| sortOrder | Title prefix | Purpose | Typical types |
|-----------|--------------|---------|---------------|
| 0 | `Learn:` | Introduce | MCQ, matching (easy) |
| 1 | `Practice:` | Guided use | matching, gap_fill |
| 2 | `Check:` | Harder / AI | MCQ, listening, **writing** or **speaking** (AI only here) |
| 3 | `Apply:` | Context use | gap_fill, sentence_ordering, matching |
| 4 | `Review:` | Mixed recall | MCQ, gap_fill — **hand-crafted**, not copy of Check |

### AI exercises (Check only)

- **Writing:** `exerciseType: "writing"`, `minWords: 5`, `targetLevel: "starters"`, `taskDescription`, `prompts[]`, `rubric`
- **Speaking:** `exerciseType: "speaking"`, `maxDurationSeconds: 60`, `targetLevel: "starters"`, `prompt`, `followUpQuestions[]`

Learn / Practice / Apply / Review must **not** use AI exercise types.

### Question quality (every question)

- `skillTag`, `topicTag` (= unit slug), `levelTag: "starters"`
- `explanation` in **Vietnamese** — explain why, not just the answer
- MCQ: 3 choices, each wrong choice has `distractorNote`
- `qualityScores`: quality ≥ 0.90, curriculumAlignment ≥ 0.96, `needsReview: false`

### Listening

- Scripts in `shared/<slug>-content.mjs` with `speakers`, `lines`
- `cambridge-unit-builder` auto-sets `audioUrl` when `content.script` is present
- After generate: `npm run generate:listening-audio -- starters <unitNumber>`

### Sentence ordering

- Use `words` + `correctOrder` (index array) — see `cambridge-unit-builder.mjs` → `buildSentenceOrdering`

---

## Step-by-step: create Starters Unit N (N = 2…10)

### Phase 1 — Unit brief & shared content

1. Read unit N from `cambridge-curriculum-map.json` (`slug`, `title`, `vocabulary`, `grammar`, skills).
2. Create `shared/<slug>-content.mjs`:
   - `export const TOPIC = "<slug>"`
   - `vocabularyBank` (~12 words from curriculum)
   - `grammarReference` (3 items with `commonMistakes`)
   - `unit` metadata block (learning objectives)
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
node scripts/generate-cambridge-units.mjs starters <N>
npm run validate:starters
```

Expected: `18 lessons, 90 exercises`, validation passes.

### Phase 4 — Audio & seed

```bash
npm run generate:listening-audio -- starters <N>
npm run seed:starters -- --from <N> --to <N> --unlock-test-student
```

### Phase 5 — Audit checklist

- [ ] All explanations in Vietnamese (no bare English answer strings)
- [ ] Review exercises differ from Check (not duplicate question sets)
- [ ] No orphan MP3s in `public/audio/listening/starters/unit-0N/`
- [ ] `sentence_ordering` uses `words` + `correctOrder`
- [ ] Only Check exercises use `writing` / `speaking` types
- [ ] `topicTag` matches unit slug everywhere
- [ ] Test in app: `student@camba.me` / `camba123`, Writing Check + Speaking Check (AI + mic)

---

## npm scripts

| Command | Purpose |
|---------|---------|
| `node scripts/generate-cambridge-units.mjs starters 2` | Generate unit 2 JSON |
| `node scripts/generate-cambridge-units.mjs starters 2 5` | Generate units 2–5 |
| `npm run generate:starters-units -- 2` | Same via npm (legacy path; prefer generate-cambridge-units) |
| `npm run validate:starters` | Validate all Starters JSON |
| `npm run generate:listening-audio -- starters 2` | TTS for unit 2 listening scripts |
| `npm run seed:starters -- --from 2 --to 2 --unlock-test-student` | Seed unit 2 to DB |

---

## `unit-XX.mjs` assembler pattern

```javascript
import { vocabularyBank, grammarReference, unit, TOPIC, /* passages, scripts, checks */ }
  from "./shared/<slug>-content.mjs";
import { createStartersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-0N/vocabulary.mjs";
// ... other skills

const factory = createStartersFactory();
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

- *"Tạo Starters U2 At School theo TEMPLATE.md"*
- *"Generate Starters unit 3 from starters-blueprints template"*

Always point the agent to:

1. This file (`scripts/lib/starters-blueprints/TEMPLATE.md`)
2. Gold reference `unit-01/`
3. Curriculum map entry for unit N

---

## Do not

- Copy U1 Family and Friends text into other units
- Use Starters template for Movers / Flyers / KET / PET
- Duplicate Check content in Review exercises
- Skip listening audio generation
- Publish with `needsReview: true` without explicit approval
- Use legacy `starters-rich-unit-generator` or `expand-starters-unit-01.mjs` for new units (reference only)
