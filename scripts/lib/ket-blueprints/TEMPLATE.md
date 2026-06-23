# KET Unit Blueprint Template (Gold Standard: Unit 1)

**Reference implementation:** Unit 1 — Education and Study (`unit-01/` + `shared/education-and-study-content.mjs`)

**Output:** `data/content/ket/unit-XX-<slug>.json` — **18 lessons × 90 exercises** (6 skills × 3 lessons × 5 exercises)

**Curriculum source:** `data/curriculum/cambridge-curriculum-map.json` → `levels.ket.units[]`

**Parallel:** Same modular pipeline as `scripts/lib/flyers-blueprints/TEMPLATE.md` and `scripts/lib/movers-blueprints/TEMPLATE.md`.

---

## KET unit plan (U1–U12)

| Unit | Slug | Title |
|------|------|-------|
| 1 ✅ | `education-and-study` | Education and Study |
| 2 | `work-and-jobs` | Work and Jobs |
| 3 | `health-and-lifestyle` | Health and Lifestyle |
| 4 | `leisure-and-entertainment` | Leisure and Entertainment |
| 5 | `travel-and-transport` | Travel and Transport |
| 6 | `food-and-shopping` | Food and Shopping |
| 7 | `house-and-home` | House and Home |
| 8 | `services` | Services |
| 9+ | See curriculum map | … |

Read full brief per unit: `vocabulary`, `grammar`, `readingSkill`, `listeningSkill`.

---

## File layout

```
scripts/lib/ket-blueprints/
  unit-XX.mjs
  unit-XX/
    vocabulary.mjs | grammar.mjs | reading.mjs | listening.mjs | writing.mjs | speaking.mjs
  shared/
    <unit-slug>-content.mjs
    exercise-helpers.mjs   # createKetFactory()
```

**Gold reference (U1):** `unit-01.mjs`, `unit-01/*.mjs`, `shared/education-and-study-content.mjs`

---

## KET-specific settings

| Setting | Value |
|---------|-------|
| CEFR | A2 |
| `levelTag` | `"ket"` |
| Writing min words | 25 |
| Speaking max duration | 120s |
| Difficulty | Mostly `difficultyRating` 1–3 |
| Character | Linh (13, secondary student) — continue across KET units |

---

## Content conventions (from U1)

### Per-lesson exercise template (5 phases)

| sortOrder | Title prefix | Purpose | Typical types |
|-----------|--------------|---------|---------------|
| 0 | `Learn:` | Introduce | MCQ, matching (easy) |
| 1 | `Practice:` | Guided use | matching, gap_fill, sentence_ordering |
| 2 | `Check:` | Harder / AI | MCQ, listening, **writing** or **speaking** (AI only here) |
| 3 | `Apply:` | Context use | gap_fill, sentence_ordering, matching |
| 4 | `Review:` | Mixed recall | MCQ, gap_fill — **hand-crafted**, not copy of Check |

### AI exercises (Check only)

- **Writing:** `exerciseType: "writing"`, `minWords: 25`, `targetLevel: "ket"`, `taskDescription`, `prompts[]`, `rubric`
- **Speaking:** `exerciseType: "speaking"`, `maxDurationSeconds: 120`, `targetLevel: "ket"`, `prompt`, `followUpQuestions[]`

Learn / Practice / Apply / Review must **not** use AI exercise types.

### Reading (KET)

- Use `assessmentType` where helpful: `detail`, `main_idea`, `vocabulary_in_context`, `inference`, `sequencing`
- Signs/notices: skim for gist + find specific details

### Listening (KET)

- Two scripts in `shared/<slug>-content.mjs` (e.g. library notice + assignment deadline)
- `listeningAnswerKeys` keyed by script name
- `buildListeningExercise` auto-sets `audioUrl` from slug

### Question quality

- `skillTag`, `topicTag` (= unit slug), `levelTag: "ket"`
- `explanation` in **Vietnamese**
- MCQ: 3 choices, `distractorNotes` array on each wrong choice
- `sentence_ordering` via `buildSentenceOrdering` (items + correctOrder in JSON)

---

## Step-by-step: migrate KET Unit N (N = 2…12)

### Phase 1 — Shared content

1. Read unit N from curriculum map.
2. Create `shared/<slug>-content.mjs`:
   - `TOPIC`, `vocabularyBank` (~12 words), `grammarReference`, `unit`
   - `passage*` for reading
   - `listeningScript*` (2 scripts), `listeningAnswerKeys`
   - `writingChecks` (3), `speakingChecks` (3)

### Phase 2 — Skill blueprints (18 × 5)

3. Copy `unit-01/` structure → `unit-0N/`, rewrite all six `*.mjs` for new topic.
4. Create `unit-0N.mjs` (mirror `unit-01.mjs` with `createKetFactory()`).
5. Each skill file exports `vocabularyLessons(shared)`, etc.

### Phase 3 — Generate & validate

```bash
node scripts/generate-cambridge-units.mjs ket <N>
npm run validate:ket
```

Expected: `18 lessons, 90 exercises`, validation passes.

### Phase 4 — Audio & seed

```bash
npm run generate:listening-audio -- ket <N>
npm run seed:ket -- --from <N> --to <N> --unlock-test-student
```

---

## `unit-XX.mjs` assembler pattern

```javascript
import { vocabularyBank, grammarReference, unit, TOPIC, /* passages, scripts, checks */ }
  from "./shared/<slug>-content.mjs";
import { createKetFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-0N/vocabulary.mjs";
// ... other skills

const factory = createKetFactory();
const shared = { ...factory, topicTag: TOPIC, /* content refs */ };

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

## Quality checklist

- [ ] 18 lessons × 5 exercises (Learn → Review)
- [ ] AI only on Writing/Speaking **Check**
- [ ] Review ≠ Check (hand-crafted)
- [ ] Vietnamese explanations + MCQ distractorNotes
- [ ] `topicTag` = unit slug
- [ ] Listening audio generated
- [ ] Legacy monolithic `unit-0N.mjs` replaced by modular folder

---

## Do not

- Copy U1 Education and Study content into other units
- Use KET template for Movers / Flyers / Starters / PET
- Duplicate Check content in Review exercises
- Skip listening audio generation
