import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_10 } from "../starters-gold/hand/unit-10.mjs";

export function expandUnit(original) {
  return expandFromHandContent(10, HAND_UNIT_10, original);
}
