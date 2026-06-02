import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/AppShell";
import { Layout } from "./components/layout";
import { RouteFallback } from "./components/RouteFallback";

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <RouteFallback />,
    element: <AppShell />,
    children: [
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        lazy: () => import("./pages/home").then((m) => ({ Component: m.Home })),
      },
      {
        path: "about",
        lazy: () => import("./pages/about").then((m) => ({ Component: m.About })),
      },
      {
        path: "programs",
        lazy: () => import("./pages/programs").then((m) => ({ Component: m.Programs })),
      },
      {
        path: "resources",
        lazy: () => import("./pages/resources").then((m) => ({ Component: m.Resources })),
      },
      {
        path: "contact",
        lazy: () => import("./pages/contact").then((m) => ({ Component: m.Contact })),
      },
      {
        path: "assessments",
        lazy: () => import("./pages/assessments").then((m) => ({ Component: m.Assessments })),
      },
      {
        path: "library",
        lazy: () => import("./pages/library").then((m) => ({ Component: m.Library })),
      },
      {
        path: "person-centered-care",
        lazy: () =>
          import("./pages/person-centered-care").then((m) => ({ Component: m.PersonCenteredCare })),
      },
      {
        path: "caregiver-support",
        lazy: () =>
          import("./pages/caregiver-support").then((m) => ({ Component: m.CaregiverSupport })),
      },
      {
        path: "educational-resources",
        lazy: () =>
          import("./pages/educational-resources").then((m) => ({
            Component: m.EducationalResources,
          })),
      },
      {
        path: "living-in-place",
        lazy: () => import("./pages/living-in-place").then((m) => ({ Component: m.LivingInPlace })),
      },
      {
        path: "smart-home-technology",
        lazy: () =>
          import("./pages/smart-home-technology").then((m) => ({
            Component: m.SmartHomeTechnology,
          })),
      },
      {
        path: "accessibility-features",
        lazy: () =>
          import("./pages/accessibility-features").then((m) => ({
            Component: m.AccessibilityFeatures,
          })),
      },
      {
        path: "account",
        lazy: () => import("./pages/account").then((m) => ({ Component: m.Account })),
      },
      {
        path: "privacy",
        lazy: () => import("./pages/privacy").then((m) => ({ Component: m.Privacy })),
      },
      {
        path: "terms",
        lazy: () => import("./pages/terms").then((m) => ({ Component: m.Terms })),
      },
      {
        path: "*",
        lazy: () => import("./pages/not-found").then((m) => ({ Component: m.NotFound })),
      },
    ],
  },
  {
    path: "login",
    lazy: () => import("./pages/login").then((m) => ({ Component: m.Login })),
  },
  {
    path: "join",
    lazy: () => import("./pages/join").then((m) => ({ Component: m.Join })),
  },
  {
    path: "forgot-password",
    lazy: () => import("./pages/forgot-password").then((m) => ({ Component: m.ForgotPassword })),
  },
  {
    path: "reset-password",
    lazy: () => import("./pages/reset-password").then((m) => ({ Component: m.ResetPassword })),
  },
    ],
  },
]);
