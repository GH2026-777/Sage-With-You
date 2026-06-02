/**
 * Cookie banner - `cookie_consent` storage key aligned with other SageÉlan properties (e.g. SagePanthers).
 * Optional analytics hook via onConsentChange when you add measurement tags.
 */

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Cookie, X } from "lucide-react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  getCookieConsent,
  setCookieConsent,
  type CookieConsentStored,
} from "../../lib/cookieConsent";

export type CookieConsentBannerProps = {
  onConsentChange?: (accepted: boolean) => void;
};

export function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [pendingBanner, setPendingBanner] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setPendingBanner(getCookieConsent() === null);
    sync();
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!pendingBanner) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(t);
  }, [pendingBanner]);

  const persist = useCallback(
    (value: CookieConsentStored) => {
      setCookieConsent(value);
      setVisible(false);
      onConsentChange?.(value === "accepted");
    },
    [onConsentChange],
  );

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-[60] p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl rounded-xl border-2 border-sage-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sage-700">
            <Cookie className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-lg font-medium text-gray-900">We use cookies</h3>
              <button
                type="button"
                onClick={() => persist("declined")}
                className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Dismiss (essential cookies only)"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Essential cookies keep sign-in and security working. We do <strong>not</strong> load third-party
              analytics scripts today; if you accept, that records your choice so we can turn on measurement later under
              the same notice (storage key{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">cookie_consent</code>). Read the{" "}
              <Link to="/privacy" className="font-medium text-sage-700 underline-offset-2 hover:underline">
                Privacy policy
              </Link>{" "}
              and change preferences anytime on{" "}
              <Link to="/account#cookies" className="font-medium text-sage-700 underline-offset-2 hover:underline">
                Account → Cookies
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => persist("declined")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={() => persist("accepted")}
                className="rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white hover:bg-sage-700"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
