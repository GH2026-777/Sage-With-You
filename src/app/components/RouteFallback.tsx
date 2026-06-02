/** Shown while lazy routes load (and for React Router hydrate fallback). */
export function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-gray-500 text-sm">
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-sage-600 border-t-transparent" />
      Loading…
    </div>
  );
}
