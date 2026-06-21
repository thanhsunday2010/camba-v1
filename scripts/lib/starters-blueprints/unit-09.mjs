import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_09 } from "../starters-gold/hand/unit-09.mjs";

export function expandUnit(original) {
  return expandFromHandContent(9, HAND_UNIT_09, original);
}
