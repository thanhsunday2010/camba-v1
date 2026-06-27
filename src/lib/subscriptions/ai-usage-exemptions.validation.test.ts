import { afterEach, describe, expect, it } from "vitest";
import {
  getAiUnlimitedEmails,
  isAiUnlimitedEmail,
  resetAiUnlimitedEmailsCacheForTests,
} from "@/lib/subscriptions/ai-usage-exemptions";

describe("ai usage exemptions", () => {
  afterEach(() => {
    delete process.env.AI_UNLIMITED_USER_EMAILS;
    resetAiUnlimitedEmailsCacheForTests();
  });

  it("treats configured emails as unlimited (case-insensitive)", () => {
    process.env.AI_UNLIMITED_USER_EMAILS = "student@camba.me, Admin@Camba.me";
    expect(isAiUnlimitedEmail("Student@camba.me")).toBe(true);
    expect(isAiUnlimitedEmail("admin@camba.me")).toBe(true);
    expect(isAiUnlimitedEmail("other@example.com")).toBe(false);
  });

  it("returns empty set when env is unset", () => {
    expect(getAiUnlimitedEmails().size).toBe(0);
    expect(isAiUnlimitedEmail("student@camba.me")).toBe(false);
  });
});
