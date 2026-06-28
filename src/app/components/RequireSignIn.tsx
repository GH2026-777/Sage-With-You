import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ClipboardCheck } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { initSupabaseAuth } from "../../utils/authSession";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type RequireSignInProps = {
  children: ReactNode;
  /** Where to send the user after sign-in (must be an in-app path). */
  redirectTo: string;
  title?: string;
  description?: string;
};

export function RequireSignIn({
  children,
  redirectTo,
  title = "Sign in to continue",
  description = "Create a free account or sign in to access this section.",
}: RequireSignInProps) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      try {
        await initSupabaseAuth();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!cancelled) {
          setSignedIn(Boolean(session?.user));
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setSignedIn(false);
          setReady(true);
        }
      }
    };

    void sync();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
      setReady(true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sage-600 mx-auto" />
          <p className="text-gray-600 mt-4 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!signedIn) {
    const loginState = { redirectTo };

    return (
      <div className="py-16 md:py-24">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100">
                <ClipboardCheck className="h-7 w-7 text-sage-600" aria-hidden />
              </div>
              <CardTitle className="text-2xl text-gray-900">{title}</CardTitle>
              <CardDescription className="text-base text-gray-600">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="bg-sage-600 hover:bg-sage-700">
                <Link to="/login" state={loginState}>
                  Sign in
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300">
                <Link to="/join" state={loginState}>
                  Create account
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
