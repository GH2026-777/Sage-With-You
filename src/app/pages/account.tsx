import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  Cookie,
  Download,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import {
  buildAuthUserExport,
  downloadAccountExport,
} from "@site/account/export-account-data";
import { deleteAccountWithEmailConfirm } from "@site/account/delete-account";
import { displayNameFromMetadata } from "@site/account/display-name";
import { updateDisplayName } from "@site/account/update-display-name";
import { supabase } from "../../utils/supabase";
import { authErrorMessage, userFacingMessage } from "../../utils/authErrorMessage";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  clearCookieConsent,
  getCookieConsent,
  setCookieConsent,
} from "../../lib/cookieConsent";
import {
  COMMUNICATION_PREF_FIELDS,
  DEFAULT_COMMUNICATION_PREFS,
  communicationPreferencesToMetadata,
  readCommunicationPreferences,
  type CommunicationPreferences,
} from "../../lib/communicationPreferences";
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

function formatJoined(iso: string | undefined): string {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function cookiePrefFromStorage(): CookiePref {
  const v = getCookieConsent();
  if (v === "accepted") return true;
  if (v === "declined") return false;
  return null;
}

function displayNameFromUser(meta: Record<string, unknown> | undefined, email: string | null): string {
  return displayNameFromMetadata(meta, email, "Member");
}

export function Account() {
  const navigate = useNavigate();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [joinedAt, setJoinedAt] = useState<string | undefined>(undefined);
  const [userMeta, setUserMeta] = useState<Record<string, unknown>>({});
  const [signedIn, setSignedIn] = useState(false);
  const [cookiePref, setCookiePref] = useState<CookiePref>(null);
  const [comm, setComm] = useState<CommunicationPreferences>(DEFAULT_COMMUNICATION_PREFS);
  const [savedFlash, setSavedFlash] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

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
        setComm(readCommunicationPreferences(session.user.user_metadata as Record<string, unknown>));
        setProfileName(displayNameFromUser(session.user.user_metadata as Record<string, unknown>, session.user.email ?? null));
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
        setComm(readCommunicationPreferences(session.user.user_metadata as Record<string, unknown>));
        setProfileName(displayNameFromUser(session.user.user_metadata as Record<string, unknown>, session.user.email ?? null));
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
      data: communicationPreferencesToMetadata(comm),
    });

    if (error) {
      setErrorMsg(authErrorMessage(error, "We could not save your settings. Please try again."));
      return;
    }
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, [signedIn, cookiePref, comm]);

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    const email = sessionEmail?.trim().toLowerCase() ?? "";
    const typed = deleteConfirmEmail.trim().toLowerCase();
    if (!email || typed !== email) {
      setDeleteError("Type your account email exactly to confirm.");
      return;
    }
    setDeleteLoading(true);
    const result = await deleteAccountWithEmailConfirm(supabase, typed);
    setDeleteLoading(false);

    if (result.ok) {
      setDeleteDialogOpen(false);
      await supabase.auth.signOut();
      navigate("/", { replace: true });
      return;
    }

    setDeleteError(
      userFacingMessage(result.error, "We could not delete your account. Please try again."),
    );
  };

  const handleProfileSave = async () => {
    setErrorMsg(null);
    setProfileSaving(true);
    const { user, error } = await updateDisplayName(supabase, profileName);
    setProfileSaving(false);
    if (error) {
      setErrorMsg(userFacingMessage(error, "We could not update your profile."));
      return;
    }
    if (user) {
      setUserMeta((user.user_metadata ?? {}) as Record<string, unknown>);
      setProfileName(displayNameFromUser(user.user_metadata as Record<string, unknown>, user.email ?? null));
    }
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleExportData = async () => {
    setExportLoading(true);
    setErrorMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to export your data.");
      downloadAccountExport(
        buildAuthUserExport(user, "Sage With You", {
          communication_preferences: readCommunicationPreferences(user.user_metadata as Record<string, unknown>),
        }),
        "sage-with-you",
      );
    } catch (err) {
      setErrorMsg(userFacingMessage(err instanceof Error ? err.message : null, "Export failed. Please try again."));
    } finally {
      setExportLoading(false);
    }
  };

  const displayName = displayNameFromUser(userMeta, sessionEmail);
  const emailMatchesDelete =
    !!sessionEmail && deleteConfirmEmail.trim().toLowerCase() === sessionEmail.trim().toLowerCase();

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage-600 text-white shadow-md">
                <User className="h-7 w-7" aria-hidden />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                  {signedIn ? displayName : "Account & privacy"}
                </h1>
                <p className="mt-2 max-w-2xl text-gray-700">
                  {signedIn
                    ? "Manage your profile, cookie choices, communication preferences, and account security."
                    : "Cookie choices on this device. Sign in to save communication preferences to your account."}
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {savedFlash && (
          <p className="mb-6 rounded-lg border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-900">
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
                  Save communication preferences to your account and reset your password from one place.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild className="bg-sage-600 hover:bg-sage-700">
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
                  <Cookie className="h-5 w-5 text-sage-600" />
                  Cookies
                </CardTitle>
                <CardDescription>
                  Your choice is saved on this browser. The same preference may apply on other SageÉlan
                  Foundation sites you visit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">{cookieRadios(cookiePref, setCookiePref)}</CardContent>
            </Card>
            <Button type="button" className="bg-sage-600 hover:bg-sage-700" onClick={() => void persist()}>
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
              <TabsTrigger value="communication" className="justify-start gap-2 px-3 py-2.5">
                <Bell className="h-4 w-4 shrink-0 opacity-70" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start gap-2 px-3 py-2.5">
                <Shield className="h-4 w-4 shrink-0 opacity-70" />
                Security
              </TabsTrigger>
            </TabsList>

            <div className="min-w-0 flex-1 space-y-6">
              <TabsContent value="profile" className="mt-0 outline-none">
                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Your display name appears in greetings and account summaries across Sage With You.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Display name</Label>
                      <Input
                        id="profile-name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="max-w-md border-gray-300 bg-white"
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium text-gray-800">Email:</span> {sessionEmail}
                      </p>
                      <p>
                        <span className="font-medium text-gray-800">Member since:</span> {formatJoined(joinedAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      className="bg-sage-600 hover:bg-sage-700"
                      disabled={profileSaving || !profileName.trim()}
                      onClick={() => void handleProfileSave()}
                    >
                      {profileSaving ? "Saving…" : "Save profile"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0 outline-none">
                <Card className={cardClass} id="cookies">
                  <CardHeader>
                    <CardTitle>Cookies &amp; privacy</CardTitle>
                    <CardDescription>
                      Controls the site banner and optional analytics when added. Full details:{" "}
                      <Link to="/privacy" className="font-medium text-sage-700 hover:underline">
                        Privacy policy
                      </Link>
                      . Questions?{" "}
                      <Link to="/contact" className="font-medium text-sage-700 hover:underline">
                        Contact us
                      </Link>
                      .
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {cookieRadios(cookiePref, setCookiePref)}
                    <div className="border-t border-gray-100 pt-4">
                      <Button
                        type="button"
                        className="bg-sage-600 hover:bg-sage-700"
                        onClick={() => void persist()}
                      >
                        Save cookie preference
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-sage-600" />
                      Export your data
                    </CardTitle>
                    <CardDescription>
                      Download a JSON copy of your account profile and communication preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300"
                      disabled={exportLoading}
                      onClick={() => void handleExportData()}
                    >
                      {exportLoading ? "Preparing export…" : "Download data export"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communication" className="mt-0 outline-none">
                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle>Communication preferences</CardTitle>
                    <CardDescription>
                      Transactional email (sign-in, password reset, security) may still be sent when required.
                      These toggles control optional messages from Sage With You and the SageÉlan Foundation. We
                      honor your choices when those mailings are sent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {COMMUNICATION_PREF_FIELDS.map((field) => (
                      <ToggleRow
                        key={field.key}
                        title={field.title}
                        description={field.description}
                        on={comm[field.key]}
                        onToggle={() =>
                          setComm((p) => ({
                            ...p,
                            [field.key]: !p[field.key],
                          }))
                        }
                      />
                    ))}
                    <div className="border-t border-gray-100 pt-4">
                      <Button
                        type="button"
                        className="bg-sage-600 hover:bg-sage-700"
                        onClick={() => void persist()}
                      >
                        Save communication preferences
                      </Button>
                    </div>
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
              You will be signed out and your account will be permanently deleted. If you need a copy of any
              data, save it before continuing.
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
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 has-[:checked]:border-sage-400 has-[:checked]:ring-1 has-[:checked]:ring-sage-200"
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
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 has-[:checked]:border-sage-400 has-[:checked]:ring-1 has-[:checked]:ring-sage-200">
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
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-sage-600" : "bg-gray-300"}`}
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
