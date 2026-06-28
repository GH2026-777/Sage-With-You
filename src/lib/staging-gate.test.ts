import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isStagingPasswordGateEnabled,
  shouldNoindexForStaging,
  stagingGatePassword,
} from "./staging-gate";

describe("staging-gate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("enables gate by default", () => {
    vi.stubEnv("VITE_ENABLE_PASSWORD_GATE", "");
    expect(isStagingPasswordGateEnabled()).toBe(true);
    expect(shouldNoindexForStaging()).toBe(true);
  });

  it("disables gate when VITE_ENABLE_PASSWORD_GATE is false", () => {
    vi.stubEnv("VITE_ENABLE_PASSWORD_GATE", "false");
    expect(isStagingPasswordGateEnabled()).toBe(false);
    expect(shouldNoindexForStaging()).toBe(false);
  });

  it("reads password from env", () => {
    vi.stubEnv("VITE_STAGING_GATE_PASSWORD", "secret-staging");
    expect(stagingGatePassword()).toBe("secret-staging");
  });
});
