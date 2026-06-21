import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_03 } from "../starters-gold/hand/unit-03.mjs";

export function expandUnit(original) {
  return expandFromHandContent(3, HAND_UNIT_03, original);
}
