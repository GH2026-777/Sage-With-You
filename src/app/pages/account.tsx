import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  Cookie,
  LogOut,
  Mail,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { supabase } from "../../utils/supabase";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  clearCookieConsent,
  getCookieConsent,
  setCookieConsent,
} from "../../lib/cookieConsent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const cardClass = "border-gray-200 shadow-sm";

type CookiePref = boolean | null;

type CommPrefs = {
  emailProgramUpdates: boolean;
  emailResourceDigest: boolean;
};

function formatJoined(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function cookiePrefFromStorage(): CookiePref {
  const v = getCookieConsent();
  if (v === "accepted") return true;
  if (v === "declined") return false;
  return null;
}

function readCommFromMetadata(meta: Record<string, unknown> | undefined): CommPrefs {
  return {
    emailProgramUpdates: meta?.swy_email_program_updates !== false,
    emailResourceDigest: meta?.swy_email_resource_digest !== false,
  };
}

function displayNameFromUser(meta: Record<string, unknown> | undefined, email: string | null): string {
  const full = typeof meta?.full_name === "string" ? meta.full_name.trim() : "";
  if (full) return full;
  const first = typeof meta?.first_name === "string" ? meta.first_name.trim() : "";
  const last = typeof meta?.last_name === "string" ? meta.last_name.trim() : "";
  const combined = [first, last].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  if (email) return email.split("@")[0] ?? "Member";
  return "Member";
}

export function Account() {
  const navigate = useNavigate();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [joinedAt, setJoinedAt] = useState<string | undefined>(undefined);
  const [userMeta, setUserMeta] = useState<Record<string, unknown>>({});
  const [signedIn, setSignedIn] = useState(false);
  const [cookiePref, setCookiePref] = useState<CookiePref>(null);
  const [comm, setComm] = useState<CommPrefs>({
    emailProgramUpdates: true,
    emailResourceDigest: true,
  });
  const [savedFlash, setSavedFlash] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const syncCookieFromStorage = useCallback(() => {
    setCookiePref(cookiePrefFromStorage());
  }, []);

  useEffect(() => {
    syncCookieFromStorage();
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, syncCookieFromStorage);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, syncCookieFromStorage);
  }, [syncCookieFromStorage]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setSignedIn(true);
        setSessionEmail(session.user.email ?? null);
        setJoinedAt(session.user.created_at);
        setUserMeta((session.user.user_metadata ?? {}) as Record<string, unknown>);
        setComm(readCommFromMetadata(session.user.user_metadata as Record<string, unknown>));
      } else {
        setSignedIn(false);
        setSessionEmail(null);
        setJoinedAt(undefined);
        setUserMeta({});
      }
    };
    void load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setSignedIn(true);
        setSessionEmail(session.user.email ?? null);
        setJoinedAt(session.user.created_at);
        setUserMeta((session.user.user_metadata ?? {}) as Record<string, unknown>);
        setComm(readCommFromMetadata(session.user.user_metadata as Record<string, unknown>));
      } else {
        setSignedIn(false);
        setSessionEmail(null);
        setJoinedAt(undefined);
        setUserMeta({});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#cookies") {
      window.requestAnimationFrame(() => {
        document.getElementById("cookies")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const persist = useCallback(async () => {
    setErrorMsg(null);
    if (cookiePref === true) setCookieConsent("accepted");
    else if (cookiePref === false) setCookieConsent("declined");
    else clearCookieConsent();

    if (!signedIn) {
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        swy_email_program_updates: comm.emailProgramUpdates,
        swy_email_resource_digest: comm.emailResourceDigest,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, [signedIn, cookiePref, comm]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    const email = sessionEmail?.trim().toLowerCase() ?? "";
    const typed = deleteConfirmEmail.trim().toLowerCase();
    if (!email || typed !== email) {
      setDeleteError("Type your account email exactly to confirm.");
      return;
    }
    setDeleteLoading(true);
    const { data, error: fnError } = await supabase.functions.invoke("delete-account", {
      body: { confirmEmail: typed },
    });
    setDeleteLoading(false);

    const body = data as { ok?: boolean; error?: string; detail?: string } | null;
    if (body?.ok === true) {
      setDeleteDialogOpen(false);
      await supabase.auth.signOut();
      navigate("/", { replace: true });
      return;
    }

    const fromBody = body?.detail || body?.error;
    setDeleteError(fromBody || fnError?.message || "Could not delete account.");
  };

  const displayName = displayNameFromUser(userMeta, sessionEmail);
  const emailMatchesDelete =
    !!sessionEmail && deleteConfirmEmail.trim().toLowerCase() === sessionEmail.trim().toLowerCase();

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
                <User className="h-7 w-7" aria-hidden />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                  {signedIn ? displayName : "Account & privacy"}
                </h1>
                <p className="mt-2 max-w-2xl text-gray-700">
                  {signedIn
                    ? "Profile, cookies, email preferences, and security — aligned with other SageÉlan sites (shared cookie_consent storage)."
                    : "Cookie choices on this device. Sign in to sync email preferences to your profile."}
                </p>
                {signedIn && sessionEmail && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{sessionEmail}</span>
                    <span className="mx-2 text-gray-400">·</span>
                    Since {formatJoined(joinedAt)}
                  </p>
                )}
              </div>
            </div>
            {signedIn && (
              <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                <Button type="button" className="bg-teal-600 hover:bg-teal-700" onClick={() => void persist()}>
                  Save changes
                </Button>
                <Button type="button" variant="outline" className="border-gray-300" onClick={() => void signOut()}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {savedFlash && (
          <p className="mb-6 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            Your settings were saved.
          </p>
        )}
        {errorMsg && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{errorMsg}</p>
        )}

        {!signedIn && (
          <div className="mx-auto max-w-xl space-y-8">
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle>Sign in for more</CardTitle>
                <CardDescription>
                  Save email preferences to your Supabase profile and manage password reset from one place.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300">
                  <Link to="/join">Create account</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className={cardClass} id="cookies">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-teal-600" />
                  Cookies
                </CardTitle>
                <CardDescription>
                  Shared <code className="rounded bg-gray-100 px-1 text-xs">cookie_consent</code> key with other
                  SageÉlan sites (e.g. Sage Panthers) so your choice can stay consistent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">{cookieRadios(cookiePref, setCookiePref)}</CardContent>
            </Card>
            <Button type="button" className="bg-teal-600 hover:bg-teal-700" onClick={() => void persist()}>
              Save cookie choice
            </Button>
          </div>
        )}

        {signedIn && (
          <Tabs defaultValue="profile" className="flex flex-col gap-8 md:flex-row md:items-start">
            <TabsList className="flex h-auto w-full flex-col gap-1 rounded-xl border border-gray-200 bg-gray-50 p-2 md:sticky md:top-20 md:w-56 md:shrink-0">
              <TabsTrigger value="profile" className="justify-start gap-2 px-3 py-2.5">
                <User className="h-4 w-4 shrink-0 opacity-70" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="privacy" className="justify-start gap-2 px-3 py-2.5">
                <Cookie className="h-4 w-4 shrink-0 opacity-70" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="email" className="justify-start gap-2 px-3 py-2.5">
                <Bell className="h-4 w-4 shrink-0 opacity-70" />
                Email
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start gap-2 px-3 py-2.5">
                <Shield className="h-4 w-4 shrink-0 opacity-70" />
                Security
              </TabsTrigger>
            </TabsList>

            <div className="min-w-0 flex-1 space-y-6">
              <TabsContent value="profile" className="mt-0 space-y-6 outline-none">
                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle>Your profile</CardTitle>
                    <CardDescription>Information from your Sage With You account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
                        <dt className="flex items-center gap-1.5 text-gray-500">
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900 break-all">{sessionEmail ?? "—"}</dd>
                      </div>
                      <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
                        <dt className="text-gray-500">Member since</dt>
                        <dd className="mt-1 font-medium text-gray-900">{formatJoined(joinedAt)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0 outline-none">
                <Card className={cardClass} id="cookies">
                  <CardHeader>
                    <CardTitle>Cookies &amp; privacy</CardTitle>
                    <CardDescription>
                      Controls the site banner and optional analytics when added. Full details:{" "}
                      <Link to="/privacy" className="font-medium text-teal-700 hover:underline">
                        Privacy policy
                      </Link>
                      . Questions?{" "}
                      <Link to="/contact" className="font-medium text-teal-700 hover:underline">
                        Contact us
                      </Link>
                      .
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">{cookieRadios(cookiePref, setCookiePref)}</CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="mt-0 outline-none">
                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle>Email preferences</CardTitle>
                    <CardDescription>
                      Transactional mail (sign-in, password reset) may still be sent. These toggles are for optional
                      updates when those mailings exist.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <ToggleRow
                      title="Program & Sage With You updates"
                      description="Newsletters and general news from the foundation."
                      on={comm.emailProgramUpdates}
                      onToggle={() => setComm((p) => ({ ...p, emailProgramUpdates: !p.emailProgramUpdates }))}
                    />
                    <ToggleRow
                      title="Resources & library highlights"
                      description="Occasional digests when new materials are published."
                      on={comm.emailResourceDigest}
                      onToggle={() => setComm((p) => ({ ...p, emailResourceDigest: !p.emailResourceDigest }))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0 space-y-6 outline-none">
                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>We will email a reset link to your account address.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="border-gray-300">
                      <Link
                        to={
                          sessionEmail
                            ? `/forgot-password?email=${encodeURIComponent(sessionEmail)}`
                            : "/forgot-password"
                        }
                      >
                        Reset password
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/40 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <Trash2 className="h-5 w-5" />
                      Delete account
                    </CardTitle>
                    <CardDescription className="text-red-900/80">
                      Permanently removes your sign-in for Sage With You. This cannot be undone. Contact submissions you
                      sent while logged out are not tied to your account and are not deleted by this action.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delete-email-confirm">Type your email to enable deletion</Label>
                      <Input
                        id="delete-email-confirm"
                        type="email"
                        autoComplete="off"
                        placeholder={sessionEmail ?? "your@email.com"}
                        value={deleteConfirmEmail}
                        onChange={(e) => {
                          setDeleteConfirmEmail(e.target.value);
                          setDeleteError(null);
                        }}
                        className="max-w-md border-gray-300 bg-white"
                      />
                    </div>
                    {deleteError && <p className="text-sm text-red-800">{deleteError}</p>}
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={!emailMatchesDelete || deleteLoading}
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      {deleteLoading ? "Working…" : "Delete my account…"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </section>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteError(null);
        }}
      >
        <AlertDialogContent className="border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              You will be signed out and your profile will be removed from Supabase Auth. If you need a copy of any
              data, export or save it before continuing.
            </AlertDialogDescription>
            {deleteError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{deleteError}</p>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
              onClick={() => void handleDeleteAccount()}
            >
              {deleteLoading ? "Deleting…" : "Yes, delete my account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function cookieRadios(cookiePref: CookiePref, setCookiePref: (v: CookiePref) => void) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Cookie preference</legend>
      {(
        [
          {
            value: false as const,
            label: "Essential only",
            hint: "Decline optional analytics (matches “Essential only” on the banner).",
          },
          {
            value: true as const,
            label: "Accept all",
            hint: "Essential plus optional analytics when we add them.",
          },
        ] as const
      ).map(({ value, label, hint }) => (
        <label
          key={String(value)}
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 has-[:checked]:border-teal-400 has-[:checked]:ring-1 has-[:checked]:ring-teal-200"
        >
          <input
            type="radio"
            name="cookie-pref"
            className="mt-1"
            checked={cookiePref === value}
            onChange={() => setCookiePref(value)}
          />
          <span>
            <span className="font-medium text-gray-900">{label}</span>
            <span className="mt-0.5 block text-sm text-gray-600">{hint}</span>
          </span>
        </label>
      ))}
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 has-[:checked]:border-teal-400 has-[:checked]:ring-1 has-[:checked]:ring-teal-200">
        <input
          type="radio"
          name="cookie-pref"
          className="mt-1"
          checked={cookiePref === null}
          onChange={() => setCookiePref(null)}
        />
        <span>
          <span className="font-medium text-gray-900">Not set yet</span>
          <span className="mt-0.5 block text-sm text-gray-600">
            The cookie banner will appear again until you choose.
          </span>
        </span>
      </label>
    </fieldset>
  );
}

function ToggleRow({
  title,
  description,
  on,
  onToggle,
}: {
  title: string;
  description: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-teal-600" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            on ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
