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
    expect(phoneToAuthEmail("84901234567")).toBe("84901234567@phone.camba.app");
    expect(isAuthEmailAddress("84901234567@phone.camba.app")).toBe(true);
  });

  it("formats phone for display", () => {
    expect(formatPhoneForDisplay("84901234567")).toBe("090 123 4567");
  });

  it("resolves phone identity from form data by default", () => {
    const formData = new FormData();
    formData.set("phone", "0901234567");
    const result = resolveAuthIdentity(formData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.method).toBe("phone");
      expect(result.authEmail).toBe("84901234567@phone.camba.app");
      expect(result.phone).toBe("84901234567");
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
