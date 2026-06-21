import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_07 } from "../starters-gold/hand/unit-07.mjs";

export function expandUnit(original) {
  return expandFromHandContent(7, HAND_UNIT_07, original);
}
