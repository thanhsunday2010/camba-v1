# Phase 11 — Content Management Completion

Production-ready CMS targeting ~80% content schema coverage.

## Features

| Feature | Implementation |
|---------|----------------|
| Edit content | Full update forms for program → exercise hierarchy |
| Delete content | Cascade delete via FK constraints |
| Tree navigation | `ContentTree` — expandable program/level/skill/unit/lesson/exercise |
| Question authoring | Type-specific editors: MC, matching, gap fill, sentence ordering |
| Placement test editor | CRUD + question pool with skill weights |
| Mock test editor | CRUD + sections + question assignment |
| Content workflow | draft → pending_review → published → archived |
| Review workflow | Pending queue with approve/reject |
| Bulk export | JSON bundle per program or all |
| Bulk import | JSON import with ID remapping |

## Admin Routes

- `/admin` — unified CMS dashboard with tabs

## Key Files

```
src/actions/admin/
  _shared.ts          # requireAdmin, helpers
  content.ts          # hierarchy CRUD + tree fetch
  programs.ts         # program/level CRUD
  questions.ts        # question + choices + pairs
  assessments.ts      # placement + mock tests
  bulk.ts             # import/export

src/components/admin/
  cms-dashboard.tsx   # main tabbed UI
  content-tree.tsx    # tree navigation
  entity-editor.tsx   # edit/delete + workflow
  question-authoring.tsx
  workflow-panel.tsx
  placement-test-editor.tsx
  mock-test-editor.tsx
  bulk-import-export.tsx
```

## Schema Coverage (~80%)

**Covered:** programs, levels, skills, units, lessons, exercises, questions, choices, question_pairs, placement_tests, placement_test_questions, mock_tests, mock_test_sections, mock_test_questions, program_settings (auto on create).

**Not in CMS scope:** content_translations (optional i18n), user/runtime tables.

## Workflow States

```
draft → pending_review → published → archived
         ↑__________________|
              (reject)
```

Publish sets `is_active: true`, `approved_by`, `approved_at`.
