/**
 * Shared helpers for Flyers gold blueprints.
 * Template & U2–U12 guide: ../TEMPLATE.md
 */
import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export function createFlyersFactory() {
  return createCambridgeUnitBuilder("flyers");
}

export function acceptableWord(word) {
  return [word, word.charAt(0).toUpperCase() + word.slice(1)];
}
