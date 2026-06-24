# M3.2 Item Bank Expansion

**Milestone:** Cambridge Item Bank Expansion Engine  
**Status:** Complete — quality infrastructure ready; inventory scaling deferred to M3.3

## Coverage Strategy

1. **Gold Mock as source of truth** — M3.1 mocks extracted without content duplication
2. **Manual expansion samples** — +30 items/level, human-authored, no LLM bulk generation
3. **Gap-driven authoring** — `npm run analyze:item-bank-gaps` identifies priority areas
4. **Target framework** — `ITEM_BANK_INVENTORY_TARGETS` defines readiness thresholds
5. **Assembly bridge** — M3.2 banks adapt to M2.4 assembly when pool-sufficient; reference bank fallback otherwise

## Authoring Workflow

```
1. Review gap report     → npm run analyze:item-bank-gaps
2. Select template       → data/cambridge-authoring-templates/
3. Author item           → Follow item-authoring-specification.md
4. Add to expansion batch → src/lib/item-bank/expansion/{level}-expansion-batch.ts
5. Validate              → validateItemBankFile / validateItemBankExtended
6. Rebuild unified bank  → ITEM_BANK_WRITE=1 vitest hook or buildUnifiedItemBank()
7. Write to disk         → data/cambridge-item-banks/{level}/items.json
```

## QA Workflow

| Check | Tool | Pass Criteria |
|-------|------|---------------|
| Schema validation | `validateItemBankFile` | 0 errors |
| Extended validation | `validateItemBankExtended` | 0 errors, warnings reviewed |
| Duplicate detection | `detectItemBankDuplicates` | 0 identical content duplicates |
| Quality scoring | `scoreItemBankQuality` | All items > 0; flags reviewed |
| Coverage matrix | `buildCoverageMatrix` | Critical gaps documented |
| Blueprint readiness | Gap report | Part depth tracked |

Quality scores are **QA-only** — never student-facing.

## Expansion Workflow

### Gold Mock Extraction

```bash
npm run extract:gold-mock-items -- all --write
```

Extracts all five gold mocks → normalized item-bank entries with full traceability (`sourceMock`, `sourcePart`, `sourceQuestion`, `sourceLevel`).

### Unified Bank Build

```
Gold extract + expansion batch → mergeItemBanks (ID + stem dedup) → items.json
```

Path: `data/cambridge-item-banks/{level}/items.json`

### Expansion Batches

| Level | File | Items |
|-------|------|-------|
| Starters | `starters-expansion-batch.ts` | 30 |
| Movers | `movers-expansion-batch.ts` | 30 |
| Flyers | `flyers-expansion-batch.ts` | 30 |
| KET | `ket-expansion-batch.ts` | 30 |
| PET | `pet-expansion-batch.ts` | 30 |

## Validation Workflow

**Validation 2.0** (`item-bank-validation.ts`):

1. Per-item schema (grammar, vocab, content shape, writing/speaking rubric)
2. Duplicate stem detection (content-aware)
3. Coverage gap analysis (inventory, grammar, vocab, difficulty, writing, speaking)
4. Blueprint part presence
5. Difficulty distribution policy

Run via:

```bash
npm run test:validation   # includes M3.2 item-bank.validation.test.ts
npm run typecheck
npm run lint
```

## CLI Commands

| Command | Purpose |
|---------|---------|
| `npm run extract:gold-mock-items` | Extract gold mock → item bank |
| `npm run analyze:item-bank-gaps` | Coverage gap report per level |
| `ITEM_BANK_WRITE=1` + vitest | Write unified banks to disk |

## Architecture

```
data/cambridge-gold-mocks/     → extractItemBankFromGoldMock()
        ↓
src/lib/item-bank/expansion/   → manual +30/level
        ↓
mergeItemBanks()               → stem + ID dedup
        ↓
data/cambridge-item-banks/     → unified JSON banks
        ↓
item-bank-assembly-adapter     → M2.4 assembly (when pool-sufficient)
        ↓
item-bank-coverage-matrix      → gap reports + readiness score
```

## Non-Goals (Confirmed)

- ❌ 50 mock exams generated
- ❌ Adaptive learning
- ❌ Teacher dashboards
- ❌ Runtime / AI evaluation redesign
- ❌ CMS authoring UI
- ❌ LLM mass content generation

## Next: M3.3 Mass Mock Generation

M3.2 delivers **measurement and validation**. M3.3 requires:
- Inventory at `minItems` per level (currently 32–44% readiness)
- Part-depth pools ≥ 6 items per blueprint part
- Writing/speaking volume at target minimums
- Continued human authoring against gap reports

The item bank is now a **managed content asset** with measurable quality — ready for scaled authoring, not yet ready for unconstrained mass generation.
