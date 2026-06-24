# Gold Mock QA Checklist

Version: 1.0.0 (aligned with `GOLD_MOCK_QA_CHECKLIST_VERSION`)

Use before publishing a Gold Mock. All items must pass.

---

## Authenticity

- [ ] Exam structure matches official Cambridge format for level
- [ ] Part titles and task types match M2.0 blueprint
- [ ] Timing matches specification (total + section limits)
- [ ] No placeholder or assembly-generated stems
- [ ] Language is age-appropriate and exam-authentic

---

## Coverage

- [ ] Minimum grammar tag count met
- [ ] Minimum vocabulary topic count met
- [ ] All four skills represented
- [ ] No vocabulary topic exceeds max share (20–25%)
- [ ] `validateGoldMock()` returns valid

---

## Difficulty

- [ ] Every item tagged easy/medium/hard
- [ ] Auto-scored distribution within ±12% of level targets
- [ ] No cluster of 3+ hard items in sequence
- [ ] Productive tasks appropriately weighted (not all easy)

---

## Age suitability

- [ ] Topics match target age band
- [ ] No inappropriate themes (violence, adult content)
- [ ] Visual/audio references suitable for children/teens
- [ ] Instructions readable by target age

---

## Writing quality

- [ ] Every writing item has clear prompt + task type
- [ ] Word limits appropriate for level
- [ ] Rubric ID present
- [ ] M2.2 `isWritingQuestion()` passes
- [ ] Bullet points / picture stimulus where required

---

## Speaking quality

- [ ] Every speaking item has prompt + duration limit
- [ ] Follow-up questions for interview-style tasks
- [ ] Picture/sequence stimulus where required
- [ ] M2.3 `isSpeakingQuestion()` passes
- [ ] Realistic `maxDurationSeconds`

---

## Listening quality

- [ ] Part-level audio context with transcript
- [ ] Gap-fill answers spelled correctly
- [ ] MCQ listening has plausible picture/text options
- [ ] Transcripts match question demands
- [ ] Audio path convention documented

---

## Reading quality

- [ ] Passages length-appropriate for level
- [ ] MCQ/matching/gap-fill unambiguous
- [ ] Flyers/KET/PET inference items fair from text
- [ ] No trick questions or outside knowledge required

---

## Grammar

- [ ] Tags from canonical taxonomy only
- [ ] Grammar tested matches level scope
- [ ] Tags reflect actual item demand (not decorative)

---

## Vocabulary

- [ ] Topics from canonical taxonomy only
- [ ] Lexis within CEFR band
- [ ] Balanced topic spread across mock

---

## AI compatibility

- [ ] Writing: `cambridgeTaskType` + prompt + limits
- [ ] Speaking: runtime task alias + duration
- [ ] Hybrid scoring respected (AI tasks not auto-correct)
- [ ] Rubric IDs consistent with evaluation pipeline

---

## Technical

- [ ] `totalScore === sum(question.points)`
- [ ] Unique `questionRef` values
- [ ] Blueprint part counts match
- [ ] `validateRuntimeManifestCompatibility()` passes
- [ ] JSON export synced with TypeScript source
- [ ] `gold.tier === "gold"` and `authoringMethod === "manual"`

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Content author | | |
| Academic reviewer | | |
| Technical validation | | |

Run: `npm run analyze:gold-mock -- {level}` and attach report.
