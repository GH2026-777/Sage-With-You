/**
 * Optional email communication preferences (stored on the Supabase auth user).
 * Legacy flat keys `swy_email_program_updates` / `swy_email_resource_digest` remain in sync.
 */

export const COMMUNICATION_PREF_METADATA_KEY = "swy_communication_preferences";

export type CommunicationPreferences = {
  programUpdates: boolean;
  resourceDigest: boolean;
  assessmentReminders: boolean;
  caregiverTips: boolean;
  sageBadgeNews: boolean;
  foundationNews: boolean;
  partnerOffers: boolean;
};

export const DEFAULT_COMMUNICATION_PREFS: CommunicationPreferences = {
  programUpdates: true,
  resourceDigest: true,
  assessmentReminders: true,
  caregiverTips: true,
  sageBadgeNews: false,
  foundationNews: true,
  partnerOffers: false,
};

export type CommunicationPrefField = {
  key: keyof CommunicationPreferences;
  title: string;
  description: string;
};

/** Visitor-facing labels for Account → Communication (aligned with org account patterns). */
export const COMMUNICATION_PREF_FIELDS: CommunicationPrefField[] = [
  {
    key: "programUpdates",
    title: "Program updates",
    description: "Newsletters and news about Sage With You and living in place programs.",
  },
  {
    key: "resourceDigest",
    title: "Resources & library highlights",
    description: "Occasional digests when new guides, checklists, or library materials are published.",
  },
  {
    key: "assessmentReminders",
    title: "Assessment & wellbeing reminders",
    description: "Friendly nudges to revisit self-assessments and wellbeing tools on the site.",
  },
  {
    key: "caregiverTips",
    title: "Caregiver support tips",
    description: "Practical ideas and encouragement for family and professional caregivers.",
  },
  {
    key: "sageBadgeNews",
    title: "Sage Badge & verified organizations",
    description: "Updates about the Sage Badge program and Sage Verified companies.",
  },
  {
    key: "foundationNews",
    title: "SageÉlan Foundation news",
    description: "Broader foundation announcements beyond Sage With You alone.",
  },
  {
    key: "partnerOffers",
    title: "Partner offers & invitations",
    description: "Optional invitations to events, surveys, or partner programs (off by default).",
  },
];

export function normalizeCommunicationPreferences(raw: unknown): CommunicationPreferences {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_COMMUNICATION_PREFS };
  }
  const o = raw as Record<string, unknown>;
  return {
    programUpdates: o.programUpdates !== false,
    resourceDigest: o.resourceDigest !== false,
    assessmentReminders: o.assessmentReminders !== false,
    caregiverTips: o.caregiverTips !== false,
    sageBadgeNews: Boolean(o.sageBadgeNews),
    foundationNews: o.foundationNews !== false,
    partnerOffers: Boolean(o.partnerOffers),
  };
}

export function readCommunicationPreferences(
  meta: Record<string, unknown> | undefined,
): CommunicationPreferences {
  const nested = meta?.[COMMUNICATION_PREF_METADATA_KEY];
  if (nested && typeof nested === "object") {
    return normalizeCommunicationPreferences(nested);
  }
  return {
    ...DEFAULT_COMMUNICATION_PREFS,
    programUpdates: meta?.swy_email_program_updates !== false,
    resourceDigest: meta?.swy_email_resource_digest !== false,
  };
}

export function communicationPreferencesToMetadata(
  comm: CommunicationPreferences,
): Record<string, unknown> {
  return {
    [COMMUNICATION_PREF_METADATA_KEY]: comm,
    swy_email_program_updates: comm.programUpdates,
    swy_email_resource_digest: comm.resourceDigest,
  };
}
