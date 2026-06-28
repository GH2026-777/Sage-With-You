/**
 * Optional Google Analytics 4 — loads only when cookie consent is accepted and VITE_GA_MEASUREMENT_ID is set.
 */
import { analyticsAllowed } from "../lib/cookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function gaMeasurementId(): string | null {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return id || null;
}

export function analyticsConfigured(): boolean {
  return gaMeasurementId() !== null;
}

/** Load gtag.js once when consent allows. Safe to call repeatedly. */
export function initAnalyticsIfAllowed(): void {
  if (initialized || typeof window === "undefined") return;
  if (!analyticsAllowed()) return;

  const measurementId = gaMeasurementId();
  if (!measurementId) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  initialized = true;
}

export function trackPageView(pathname: string): void {
  if (!initialized || !analyticsAllowed()) return;
  const measurementId = gaMeasurementId();
  if (!measurementId || !window.gtag) return;
  window.gtag("config", measurementId, { page_path: pathname });
}
