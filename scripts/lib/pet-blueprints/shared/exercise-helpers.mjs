/**
 * Shared helpers for PET gold blueprints.
 * Template: ../TEMPLATE.md
 */
import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export function createPetFactory() {
  return createCambridgeUnitBuilder("pet");
}

export function acceptableWord(word) {
  return [word, word.charAt(0).toUpperCase() + word.slice(1)];
}
