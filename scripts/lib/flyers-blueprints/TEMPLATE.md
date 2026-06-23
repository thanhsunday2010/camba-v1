# Flyers Unit Blueprint Template (Gold Standard: Unit 1)

**Reference implementation:** Unit 1 — Family and Friends (`unit-01/` + `shared/family-and-friends-extended-content.mjs`)

**Output:** `data/content/flyers/unit-XX-<slug>.json` — **18 lessons × 90 exercises**

**Curriculum source:** `data/curriculum/cambridge-curriculum-map.json` → `levels.flyers.units[]`

**Movers parallel:** Same pipeline shape as `scripts/lib/movers-blueprints/TEMPLATE.md` — Flyers is A2, minWords 25, speaking 120s.

---

## Flyers unit plan (U1–U12)

| Unit | Slug | Title |
|------|------|-------|
| 1 ✅ | `family-and-friends-extended` | Family and Friends |
| 2 | `environment-and-nature` | Environment and Nature |
| 3 | `culture-and-festivals` | Culture and Festivals |
| 4 | `feelings-and-opinions` | Feelings and Opinions |
| 5 | `rules-and-responsibilities` | Rules and Responsibilities |
| 6 | `travel-and-geography` | Travel and Geography |
| 7 | `media-and-entertainment` | Media and Entertainment |
| 8 | `science-and-discovery` | Science and Discovery |
| 9 | `past-experiences` | Past Experiences |
| 10 | `future-plans-and-stories` | Future Plans and Stories |
| 11+ | See curriculum map | … |

Read full brief per unit: `vocabulary`, `grammar`, `readingSkill`, `listeningSkill`.

---

## File layout

```
scripts/lib/flyers-blueprints/
  unit-XX.mjs
  unit-XX/
    vocabulary.mjs | grammar.mjs | reading.mjs | listening.mjs | writing.mjs | speaking.mjs
  shared/
    <unit-slug>-content.mjs
    exercise-helpers.mjs   # createFlyersFactory()
```

---

## Flyers-specific settings

| Setting | Value |
|---------|-------|
| CEFR | A2 |
| `levelTag` | `"flyers"` |
| Writing min words | 25 |
| Speaking max duration | 120s |
| Difficulty | Mostly `difficultyRating` 1–3 |
| Character | Minh (11, Hanoi) — continue from Movers arc |

---

## Pipeline

```bash
node scripts/generate-cambridge-units.mjs flyers <N>
npm run validate:flyers
npm run generate:listening-audio -- flyers <N>
npm run seed:flyers -- --from <N> --to <N> --unlock-test-student
```

---

## Quality checklist (same as Movers gold)

- [ ] 18 lessons × 5 exercises (Learn → Review)
- [ ] AI only on Writing/Speaking **Check**
- [ ] Review ≠ Check (hand-crafted)
- [ ] Vietnamese explanations + MCQ distractorNotes
- [ ] `topicTag` = unit slug
- [ ] Listening audio generated
- [ ] `sentence_ordering` via `buildSentenceOrdering` (items + correctOrder in JSON)

---

## Request prompt examples

- *"Tạo Flyers U2 Environment and Nature theo flyers-blueprints/TEMPLATE.md"*
- *"Generate Flyers unit 3 from template"*
