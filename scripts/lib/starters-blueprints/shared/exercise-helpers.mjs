/**
 * Shared helpers for Starters gold blueprints.
 * Template & U2–U10 guide: ../TEMPLATE.md
 */
import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export function createStartersFactory() {
  return createCambridgeUnitBuilder("starters");
}

export function acceptableWord(word) {
  return [word, word.charAt(0).toUpperCase() + word.slice(1)];
}
