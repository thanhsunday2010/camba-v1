import { expandFromHandContent } from "../starters-gold/assemble-hand-content.mjs";
import { HAND_UNIT_02 } from "../starters-gold/hand/unit-02.mjs";

export function expandUnit(original) {
  return expandFromHandContent(2, HAND_UNIT_02, original);
}
