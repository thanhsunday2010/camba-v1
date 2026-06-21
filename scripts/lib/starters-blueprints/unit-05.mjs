import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_05 } from "../starters-gold/hand/unit-05.mjs";

export function expandUnit(original) {
  return expandFromHandContent(5, HAND_UNIT_05, original);
}
