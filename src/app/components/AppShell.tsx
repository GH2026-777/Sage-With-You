import { useEffect } from "react";
import { Outlet } from "react-router";
import { PasswordGate } from "./PasswordGate";
import { initSupabaseAuth } from "../../utils/authSession";

/** Site-wide staging gate; must render inside RouterProvider (Outlet uses router context). */
export function AppShell() {
  useEffect(() => {
    void initSupabaseAuth();
  }, []);

  return (
    <PasswordGate>
      <Outlet />
    </PasswordGate>
  );
}
