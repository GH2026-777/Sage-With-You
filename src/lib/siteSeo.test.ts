import { describe, expect, it } from "vitest";
import { fullTitle, getSeoForPath, ogImageAbsoluteUrl } from "./siteSeo";

describe("getSeoForPath", () => {
  it("returns home defaults for /", () => {
    const s = getSeoForPath("/");
    expect(s.title).toBe("Sage With You");
    expect(s.description.length).toBeGreaterThan(20);
    expect(s.noindex).toBeUndefined();
  });

  it("matches privacy route", () => {
    const s = getSeoForPath("/privacy");
    expect(s.title).toContain("Privacy");
    expect(s.noindex).toBeUndefined();
  });

  it("marks unknown paths as noindex", () => {
    const s = getSeoForPath("/this-route-does-not-exist");
    expect(s.noindex).toBe(true);
    expect(s.title).toContain("not found");
  });
});

describe("fullTitle", () => {
  it("formats page titles", () => {
    expect(fullTitle("Contact")).toContain("Contact");
    expect(fullTitle("Contact")).toContain("Sage With You");
  });
});

describe("ogImageAbsoluteUrl", () => {
  it("ends with og-image.png on default origin", () => {
    expect(ogImageAbsoluteUrl()).toMatch(/\/og-image\.png$/);
  });
});
