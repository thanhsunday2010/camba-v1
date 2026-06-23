/**
 * Shared helpers for Movers gold blueprints.
 * Template & U2–U10 guide: ./TEMPLATE.md
 */
import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";
import { TOPIC } from "./daily-routines-content.mjs";

export function createMoversFactory() {
  const builder = createCambridgeUnitBuilder("movers");
  return { ...builder, topicTag: TOPIC };
}

export function acceptableWord(word) {
  return [word, word.charAt(0).toUpperCase() + word.slice(1)];
}
