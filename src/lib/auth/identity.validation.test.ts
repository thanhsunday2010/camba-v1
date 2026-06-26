import { describe, expect, it } from "vitest";
import {
  formatPhoneForDisplay,
  isAuthEmailAddress,
  normalizePhoneNumber,
  phoneToAuthEmail,
  resolveAuthIdentity,
} from "@/lib/auth/identity";

describe("auth identity", () => {
  it("normalizes Vietnamese phone numbers", () => {
    expect(normalizePhoneNumber("0901234567")).toBe("84901234567");
    expect(normalizePhoneNumber("+84 901 234 567")).toBe("84901234567");
    expect(normalizePhoneNumber("84901234567")).toBe("84901234567");
    expect(normalizePhoneNumber("123")).toBeNull();
  });

  it("maps phone to internal auth email", () => {
    expect(phoneToAuthEmail("84901234567")).toBe("phone+84901234567@camba.app");
    expect(isAuthEmailAddress("phone+84901234567@camba.app")).toBe(true);
    expect(isAuthEmailAddress("84901234567@phone.camba.app")).toBe(true);
    expect(isAuthEmailAddress("student@example.com")).toBe(false);
  });

  it("formats phone for display", () => {
    expect(formatPhoneForDisplay("84901234567")).toBe("090 123 4567");
  });

  it("rejects phone sign-in when phone auth is disabled", () => {
    const formData = new FormData();
    formData.set("authMethod", "phone");
    formData.set("phone", "0901234567");
    const result = resolveAuthIdentity(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorKey).toBe("phoneDisabled");
    }
  });

  it("resolves email identity by default", () => {
    const formData = new FormData();
    formData.set("email", "student@example.com");
    const result = resolveAuthIdentity(formData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.method).toBe("email");
      expect(result.authEmail).toBe("student@example.com");
    }
  });

  it("resolves email identity when selected", () => {
    const formData = new FormData();
    formData.set("authMethod", "email");
    formData.set("email", "Student@Example.com");
    const result = resolveAuthIdentity(formData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.method).toBe("email");
      expect(result.authEmail).toBe("student@example.com");
      expect(result.contactEmail).toBe("student@example.com");
    }
  });
});
