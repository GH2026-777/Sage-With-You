import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { PasswordGate } from "./components/PasswordGate";
import ErrorBoundary from "./components/ErrorBoundary";

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-gray-500 text-sm">
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PasswordGate>
        <Suspense fallback={<RouteLoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </PasswordGate>
    </ErrorBoundary>
  );
}