import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_06 } from "../starters-gold/hand/unit-06.mjs";

export function expandUnit(original) {
  return expandFromHandContent(6, HAND_UNIT_06, original);
}
