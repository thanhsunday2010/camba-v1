# PET Unit Blueprint Template (Gold Standard: Unit 1)

**Reference implementation:** Unit 1 — Education and Future Plans (`unit-01/` + `shared/education-and-future-plans-content.mjs`)

**Output:** `data/content/pet/unit-XX-<slug>.json` — **18 lessons × 90 exercises** (6 skills × 3 lessons × 5 exercises)

**Curriculum source:** `data/curriculum/cambridge-curriculum-map.json` → `levels.pet.units[]`

**Parallel:** Same modular pipeline as `scripts/lib/ket-blueprints/TEMPLATE.md` and `scripts/lib/flyers-blueprints/TEMPLATE.md`.

---

## PET unit plan (U1–U14)

| Unit | Slug | Title |
|------|------|-------|
| 1 ✅ | `education-and-future-plans` | Education and Future Plans |
| 2 | `careers-and-employment` | Careers and Employment |
| 3 | `global-issues` | Global Issues |
| 4 | `science-and-technology` | Science and Technology |
| 5 | `arts-culture-and-literature` | Arts, Culture and Literature |
| 6 | `sports-and-competition` | Sports and Competition |
| 7+ | See curriculum map | … |

Read full brief per unit: `vocabulary`, `grammar`, `readingSkill`, `listeningSkill`.

---

## File layout

```
scripts/lib/pet-blueprints/
  unit-XX.mjs
  unit-XX/
    vocabulary.mjs | grammar.mjs | reading.mjs | listening.mjs | writing.mjs | speaking.mjs
  shared/
    <unit-slug>-content.mjs
    exercise-helpers.mjs   # createPetFactory()
```

**Gold reference (U1):** `unit-01.mjs`, `unit-01/*.mjs`, `shared/education-and-future-plans-content.mjs`

---

## PET-specific settings

| Setting | Value |
|---------|-------|
| CEFR | B1 |
| `levelTag` | `"pet"` |
| Writing min words | **40** |
| Speaking max duration | **150s** |
| Difficulty | Mostly `difficultyRating` 1–3 |
| Character | Minh (15, Hanoi International School) — continue from Flyers/Movers arc |

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

- **Writing:** `exerciseType: "writing"`, `minWords: 40`, `targetLevel: "pet"`, `taskDescription`, `prompts[]`, `rubric`
- **Speaking:** `exerciseType: "speaking"`, `maxDurationSeconds: 150`, `targetLevel: "pet"`, `prompt`, `followUpQuestions[]`

Learn / Practice / Apply / Review must **not** use AI exercise types.

### Reading (PET)

- Longer texts (~200–350 words); use `assessmentType`: `detail`, `opinion`, `attitude`, `purpose`, `inference`, `main_idea`
- Focus: **detail and opinion in longer texts**

### Listening (PET)

- Two scripts in `shared/<slug>-content.mjs` (e.g. career talk + scholarship info)
- `listeningAnswerKeys` keyed by script name
- Focus: **speaker attitude and purpose**
- `buildListeningExercise` auto-sets `audioUrl` from slug

### Grammar (PET U1 pattern)

- Second conditional: `If I got/received…, I would…`
- Present perfect vs past simple: `since`/`this year` vs `last year`/`in March`

### Question quality

- `skillTag`, `topicTag` (= unit slug), `levelTag: "pet"`
- `explanation` in **Vietnamese**
- MCQ: 3 choices, `distractorNotes` array on each wrong choice
- `sentence_ordering` via `buildSentenceOrdering` (items + correctOrder in JSON)

---

## Step-by-step: migrate PET Unit N (N = 2…14)

### Phase 1 — Shared content

1. Read unit N from curriculum map.
2. Create `shared/<slug>-content.mjs`:
   - `TOPIC`, `vocabularyBank` (~8 words), `grammarReference`, `unit`
   - `passage*` for reading (longer text with opinions)
   - `listeningScript*` (2 scripts), `listeningAnswerKeys`
   - `writingChecks` (3, `minWords: 40`), `speakingChecks` (3, `maxDurationSeconds: 150`)

### Phase 2 — Skill blueprints (18 × 5)

3. Copy `unit-01/` structure → `unit-0N/`, rewrite all six `*.mjs` for new topic.
4. Create `unit-0N.mjs` (mirror `unit-01.mjs` with `createPetFactory()`).
5. Each skill file exports `vocabularyLessons(shared)`, etc.

### Phase 3 — Generate & validate

```bash
node scripts/generate-cambridge-units.mjs pet <N>
npm run validate:pet
```

Expected: `18 lessons, 90 exercises`, validation passes.

### Phase 4 — Audio & seed

```bash
npm run generate:listening-audio -- pet <N>
npm run seed:pet -- --from <N> --to <N> --unlock-test-student
```

---

## `unit-XX.mjs` assembler pattern

```javascript
import { vocabularyBank, grammarReference, unit, TOPIC, /* passages, scripts, checks */ }
  from "./shared/<slug>-content.mjs";
import { createPetFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-0N/vocabulary.mjs";
// ... other skills

const factory = createPetFactory();
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
- [ ] Writing Check: `minWords: 40`
- [ ] Speaking Check: `maxDurationSeconds: 150`
- [ ] Vietnamese explanations + MCQ distractorNotes
- [ ] `topicTag` = unit slug
- [ ] Listening audio generated
- [ ] Legacy monolithic `unit-0N.mjs` replaced by modular folder

---

## Do not

- Copy U1 Education and Future Plans content into other units
- Use PET template for Starters / Movers / Flyers / KET
- Duplicate Check content in Review exercises
- Skip listening audio generation
- Use `minWords: 25` (that is KET/Flyers; PET uses 40)

---

## Request prompt examples

- *"Tạo PET U2 Careers and Employment theo pet-blueprints/TEMPLATE.md"*
- *"Generate PET unit 3 from template"*
