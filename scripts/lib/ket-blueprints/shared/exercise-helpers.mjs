/**
 * Shared helpers for KET gold blueprints (Unit 1+ modular).
 * Template: ./TEMPLATE.md
 */
import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export function createKetFactory() {
  return createCambridgeUnitBuilder("ket");
}

export function acceptableWord(word) {
  return [word, word.charAt(0).toUpperCase() + word.slice(1)];
}
