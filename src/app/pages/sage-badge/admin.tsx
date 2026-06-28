import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { RequireSignIn } from "../../components/RequireSignIn";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { supabase } from "../../../utils/supabase";
import { userFacingMessage } from "../../../utils/authErrorMessage";
import {
  WPE_CAREGIVER_LABELS,
  WPE_ROLE_LABELS,
  WPE_SUPPORTS_LABELS,
} from "../../../lib/badge";
import { setupUatDemoCompany } from "../../../lib/badgeUatDemo";
import { BadgeAssessorPanel } from "../../components/badge/BadgeAssessorPanel";

type Inquiry = {
  id: string;
  inquiry_type: string;
  company_name: string;
  contact_email: string;
  status: string;
  created_at: string;
};

type CompanyRow = {
  id: string;
  slug: string;
  display_name: string;
  status: string;
};

type WpeSubmission = {
  id: string;
  company_id: string;
  overall_rating: number;
  supports_living_in_place: string;
  caregiver_access: string;
  technology_rating: number;
  submitter_role: string;
  narrative: string | null;
  moderation_status: "pending" | "approved" | "rejected";
  created_at: string;
  badge_companies: { display_name: string; slug: string } | null;
};

function AdminPanel() {
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [wpeSubmissions, setWpeSubmissions] = useState<WpeSubmission[]>([]);
  const [wpeFilter, setWpeFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [pendingTotal, setPendingTotal] = useState(0);
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [adminMsg, setAdminMsg] = useState<string | null>(null);
  const [adminErr, setAdminErr] = useState<string | null>(null);
  const [uatLoading, setUatLoading] = useState(false);

  const loadWpe = useCallback(async () => {
    let query = supabase
      .from("badge_wpe_submissions")
      .select(
        `id, company_id, overall_rating, supports_living_in_place, caregiver_access,
         technology_rating, submitter_role, narrative, moderation_status, created_at,
         badge_companies ( display_name, slug )`,
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (wpeFilter !== "all") {
      query = query.eq("moderation_status", wpeFilter);
    }

    const { data, error } = await query;
    if (error) {
      setAdminErr("Could not load experience submissions.");
      return;
    }
    const rows = (data ?? []).map((row) => {
      const co = row.badge_companies;
      const company = Array.isArray(co) ? co[0] : co;
      return { ...row, badge_companies: company ?? null } as WpeSubmission;
    });
    setWpeSubmissions(rows);

    const { count } = await supabase
      .from("badge_wpe_submissions")
      .select("id", { count: "exact", head: true })
      .eq("moderation_status", "pending");
    setPendingTotal(count ?? 0);
  }, [wpeFilter]);

  const loadAll = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsStaff(false);
      return;
    }
    const { data: roleRow } = await supabase
      .from("badge_staff_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!roleRow) {
      setIsStaff(false);
      return;
    }
    setIsStaff(true);

    const [{ data: inq }, { data: cos }] = await Promise.all([
      supabase
        .from("badge_company_inquiries")
        .select("id, inquiry_type, company_name, contact_email, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("badge_companies")
        .select("id, slug, display_name, status")
        .order("display_name")
        .limit(100),
    ]);
    setInquiries((inq ?? []) as Inquiry[]);
    setCompanies((cos ?? []) as CompanyRow[]);
    await loadWpe();
  }, [loadWpe]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (isStaff) void loadWpe();
  }, [isStaff, loadWpe]);

  const moderateWpe = async (id: string, status: "approved" | "rejected") => {
    setModeratingId(id);
    setAdminErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("badge_wpe_submissions")
      .update({
        moderation_status: status,
        moderated_by: user?.id ?? null,
        moderated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setModeratingId(null);
    if (error) {
      setAdminErr(userFacingMessage(error.message, "Could not update submission."));
      return;
    }
    setAdminMsg(status === "approved" ? "Submission approved." : "Submission rejected.");
    await loadWpe();
  };

  const handleUatDemo = async () => {
    setUatLoading(true);
    setAdminErr(null);
    setAdminMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAdminErr("Sign in required.");
      setUatLoading(false);
      return;
    }
    const result = await setupUatDemoCompany(user.id);
    setUatLoading(false);
    if (!result.ok) {
      setAdminErr(result.message);
      return;
    }
    setAdminMsg(result.message);
    const { data: cos } = await supabase
      .from("badge_companies")
      .select("id, slug, display_name, status")
      .order("display_name")
      .limit(100);
    setCompanies((cos ?? []) as CompanyRow[]);
  };

  if (isStaff === null) {
    return <p className="py-20 text-center text-gray-500">Loading…</p>;
  }

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Staff access only</h1>
        <p className="mt-3 text-sm text-gray-600">
          This area is for Sage Badge staff only. If you should have access, contact the Sage With
          You team at info@sageelan.org.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/sage-badge">Back to Sage Badge</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold text-gray-900">Sage Badge admin</h1>
      <p className="mt-2 text-sm text-gray-600">
        Review organization inquiries, moderate community experience submissions, and manage company
        records.
      </p>

      {(adminMsg || adminErr) && (
        <p
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            adminErr
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-sage-200 bg-sage-50 text-sage-900"
          }`}
        >
          {adminErr ?? adminMsg}
        </p>
      )}

      <BadgeAssessorPanel
        companies={companies}
        onCompaniesChange={() => void loadAll()}
        onMessage={setAdminMsg}
        onError={setAdminErr}
      />

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Experience submissions (WPE)</h2>
          <div className="flex flex-wrap gap-2">
            {(["pending", "approved", "rejected", "all"] as const).map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={wpeFilter === f ? "default" : "outline"}
                className={wpeFilter === f ? "bg-sage-600 hover:bg-sage-700" : ""}
                onClick={() => setWpeFilter(f)}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && pendingTotal > 0 ? ` (${pendingTotal})` : ""}
              </Button>
            ))}
          </div>
        </div>

        {wpeSubmissions.length === 0 ? (
          <p className="text-sm text-gray-500">No submissions in this filter.</p>
        ) : (
          <div className="space-y-4">
            {wpeSubmissions.map((w) => (
              <Card key={w.id} className="border-gray-200">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {w.badge_companies?.display_name ?? "Company"}
                    </CardTitle>
                    <span
                      className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded ${
                        w.moderation_status === "pending"
                          ? "bg-amber-100 text-amber-900"
                          : w.moderation_status === "approved"
                            ? "bg-sage-100 text-sage-900"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {w.moderation_status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(w.created_at).toLocaleString()} · {WPE_ROLE_LABELS[w.submitter_role] ?? w.submitter_role}
                  </p>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>
                    Overall {w.overall_rating}/5 · Tech {w.technology_rating}/5 · Supports living in
                    place: {WPE_SUPPORTS_LABELS[w.supports_living_in_place] ?? w.supports_living_in_place}{" "}
                    · Caregiver: {WPE_CAREGIVER_LABELS[w.caregiver_access] ?? w.caregiver_access}
                  </p>
                  {w.narrative && (
                    <p className="rounded-lg bg-gray-50 p-3 text-gray-800">{w.narrative}</p>
                  )}
                  {w.moderation_status === "pending" && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-sage-600 hover:bg-sage-700"
                        disabled={moderatingId === w.id}
                        onClick={() => void moderateWpe(w.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={moderatingId === w.id}
                        onClick={() => void moderateWpe(w.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 rounded-lg border border-dashed border-sage-300 bg-sage-50/50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">UAT: demo company</h2>
        <p className="mt-2 text-sm text-gray-600">
          Creates a published demo company so testers can use the Share your experience form before
          real assessments are live.
        </p>
        <Button
          type="button"
          className="mt-4 bg-sage-600 hover:bg-sage-700"
          disabled={uatLoading}
          onClick={() => void handleUatDemo()}
        >
          {uatLoading ? "Setting up…" : "Publish UAT demo company"}
        </Button>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent inquiries</h2>
        {inquiries.length === 0 ? (
          <p className="text-sm text-gray-500">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Company</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(i.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {i.inquiry_type === "community_nomination"
                        ? "Community nomination"
                        : i.inquiry_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2">{i.company_name}</td>
                    <td className="px-4 py-2">{i.contact_email}</td>
                    <td className="px-4 py-2">{i.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Companies</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {companies.map((c) => (
            <Card key={c.id} className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{c.display_name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Status: {c.status}</p>
                {c.status === "published" && (
                  <Link
                    to={`/sage-badge/companies/${c.slug}`}
                    className="text-sage-700 underline text-xs mt-2 inline-block"
                  >
                    Public profile
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function SageBadgeAdmin() {
  return (
    <>
      <SageBadgeNav />
      <RequireSignIn redirectTo="/sage-badge/admin" title="Staff sign in">
        <AdminPanel />
      </RequireSignIn>
    </>
  );
}
