import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_04 } from "../starters-gold/hand/unit-04.mjs";

export function expandUnit(original) {
  return expandFromHandContent(4, HAND_UNIT_04, original);
}
