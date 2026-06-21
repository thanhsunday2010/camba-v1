import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_08 } from "../starters-gold/hand/unit-08.mjs";

export function expandUnit(original) {
  return expandFromHandContent(8, HAND_UNIT_08, original);
}
