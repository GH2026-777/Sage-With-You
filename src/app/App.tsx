import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouteFallback } from "./components/RouteFallback";

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}