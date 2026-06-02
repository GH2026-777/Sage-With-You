import { describe, expect, it } from "vitest";
import {
  authErrorMessage,
  isEmailNotConfirmed,
  isExistingUserSignup,
} from "../utils/authErrorMessage";

describe("authErrorMessage", () => {
  it("maps email_not_confirmed code from plain objects", () => {
    const msg = authErrorMessage({ code: "email_not_confirmed" }, "fallback");
    expect(msg).toContain("confirm your email");
  });

  it("detects email not confirmed from message text", () => {
    expect(isEmailNotConfirmed(new Error("Email not confirmed"))).toBe(true);
  });

  it("maps weak_password to 8 character guidance", () => {
    const msg = authErrorMessage({ code: "weak_password" }, "fallback");
    expect(msg).toContain("8 characters");
  });

  it("detects existing user signup via empty identities", () => {
    expect(isExistingUserSignup({ user: { identities: [] } })).toBe(true);
    expect(isExistingUserSignup({ user: { identities: [{}] } })).toBe(false);
  });

  it("falls back for unknown errors", () => {
    expect(authErrorMessage(null, "Something went wrong")).toBe("Something went wrong");
  });
});
