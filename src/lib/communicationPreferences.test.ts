import { describe, expect, it } from "vitest";
import {
  communicationPreferencesToMetadata,
  normalizeCommunicationPreferences,
  readCommunicationPreferences,
} from "./communicationPreferences";

describe("communicationPreferences", () => {
  it("reads legacy flat metadata keys", () => {
    const prefs = readCommunicationPreferences({
      swy_email_program_updates: false,
      swy_email_resource_digest: true,
    });
    expect(prefs.programUpdates).toBe(false);
    expect(prefs.resourceDigest).toBe(true);
    expect(prefs.assessmentReminders).toBe(true);
  });

  it("prefers nested swy_communication_preferences object", () => {
    const prefs = readCommunicationPreferences({
      swy_communication_preferences: {
        programUpdates: true,
        resourceDigest: false,
        partnerOffers: true,
      },
    });
    expect(prefs.resourceDigest).toBe(false);
    expect(prefs.partnerOffers).toBe(true);
  });

  it("syncs legacy keys when saving metadata", () => {
    const meta = communicationPreferencesToMetadata(
      normalizeCommunicationPreferences({
        programUpdates: false,
        resourceDigest: true,
        partnerOffers: true,
      }),
    );
    expect(meta.swy_email_program_updates).toBe(false);
    expect(meta.swy_email_resource_digest).toBe(true);
    expect(meta.swy_communication_preferences).toMatchObject({ partnerOffers: true });
  });
});
