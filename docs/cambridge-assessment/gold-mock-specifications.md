# Gold Mock Specifications

Canonical specifications for M3.1 Gold Mocks. Programmatic source: `src/lib/cambridge-assessment/gold-mock-specifications.ts`.

---

## Starters (Pre A1)

| Attribute | Value |
|-----------|-------|
| CEFR | pre-a1 |
| Age | 7–9 |
| Duration | 45 minutes |
| Blueprint | `cambridge-starters-v1` |
| Total items | 43 |
| Max score | 55 |

### Papers

**Listening (15 min, 25%)**

| Part | Task | Items | Points |
|------|------|-------|--------|
| P1 | Link names to pictures | 5 | 1 each |
| P2 | Write words/numbers heard | 5 | 1 each |
| P3 | Tick correct picture | 5 | 1 each |
| P4 | Colour and draw (MCQ proxy) | 5 | 1 each |

**Reading & Writing (20 min, 50%)**

| Part | Task | Items | Points |
|------|------|-------|--------|
| P1 | Match words to pictures | 5 | 1 each |
| P2 | Read sentences → choose picture | 5 | 1 each |
| P3 | Read and choose answers | 5 | 1 each |
| P4 | Copy/complete writing (AI) | 5 | 1 each |

**Speaking (10 min, 25%)**

| Part | Task | Items | Points |
|------|------|-------|--------|
| P1 | Find differences | 1 | 5 |
| P2 | Personal questions | 1 | 5 |
| P3 | Picture story | 1 | 5 |

### Difficulty

60% easy · 30% medium · 10% hard (auto-scored items)

### Writing tasks

`write_sentence`, `picture_description` — 3–25 words, picture prompts

### Speaking tasks

`speaking_picture_description`, `speaking_personal_questions`, `speaking_storytelling`

---

## Movers (A1)

| Attribute | Value |
|-----------|-------|
| Duration | 55 minutes |
| Total items | 51 |
| Auto items per part | 6 |

Same paper structure as Starters with 6 items per auto part.

### Difficulty

35% easy · 45% medium · 20% hard

### Writing

`write_sentence`, `write_note`, `picture_description`

---

## Flyers (A2)

| Attribute | Value |
|-----------|-------|
| Duration | 65 minutes |
| Total items | 59 |
| Auto items per part | 7 |

### Difficulty

25% easy · 50% medium · 25% hard

### Writing

`write_note`, `write_story`, `picture_description`

---

## KET (A2 Key for Schools)

| Attribute | Value |
|-----------|-------|
| Duration | 110 minutes |
| Total items | 59 |
| Score reporting | Cambridge scale |

### Reading & Writing (60 min)

| Part | Task | Items | Points |
|------|------|-------|--------|
| P1 | MCQ signs/messages | 6 | 1 |
| P2 | Multiple matching | 7 | 1 |
| P3 | MCQ long text | 5 | 1 |
| P4 | MCQ cloze | 6 | 1 |
| P5 | Open cloze | 6 | 1 |
| P6 | Writing message (AI) | 1 | 15 |
| P7 | Writing story (AI) | 1 | 15 |

### Listening (30 min)

5 parts × 5 items

### Speaking (12 min)

2 parts × 1 item (20 pts each)

### Writing AI

`write_email`, `write_story` — 25–100 words, bullet points

---

## PET (B1 Preliminary for Schools)

| Attribute | Value |
|-----------|-------|
| Duration | 130 minutes |
| Total items | 64 |

### Reading (45 min)

6 parts, 34 items total including gapped text

### Writing (45 min)

| Part | Task | Points |
|------|------|--------|
| P1 | Write email (AI) | 20 |
| P2 | Write story (AI) | 20 |

### Listening (30 min)

5 parts × 5 items (same structure as KET)

### Speaking (14 min)

3 parts × 1 item (25 pts each)

### Difficulty

25% easy · 55% medium · 20% hard

---

## Coverage targets (all levels)

Defined in `GoldMockCoverageTarget` per level:

- Minimum distinct grammar tags (4–10 by level)
- Minimum distinct vocabulary topics (5–10)
- All four skills required
- Writing + speaking required
- Max 20–25% items from single vocabulary topic

---

## Validation rules

See `GoldMockValidationRules` in `gold-mock-format.ts`:

- Blueprint part counts enforced
- M2.2/M2.3 AI task compatibility
- Score integrity
- Unique question refs
- No placeholder stems
- Difficulty tolerance ±12%
