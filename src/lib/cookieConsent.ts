/**
 * Cookie consent — shared `cookie_consent` storage contract with other SageÉlan sites (e.g. SagePanthers):
 * localStorage `cookie_consent` = `accepted` | `declined`.
 */

export const COOKIE_CONSENT_STORAGE_KEY = "cookie_consent";

export type CookieConsentStored = "accepted" | "declined";

export const COOKIE_CONSENT_CHANGED_EVENT = "sagewithyou-cookie-changed";

function notifyChanged() {
  try {
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
  } catch {
    /* non-browser */
  }
}

export function getCookieConsent(): CookieConsentStored | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === "accepted" || raw === "declined") return raw;
    return null;
  } catch {
    return null;
  }
}

export function setCookieConsent(value: CookieConsentStored) {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
  notifyChanged();
}

export function clearCookieConsent() {
  try {
    localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  notifyChanged();
}

export function analyticsAllowed(): boolean {
  return getCookieConsent() === "accepted";
}
