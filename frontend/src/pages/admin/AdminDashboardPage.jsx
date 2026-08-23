import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AlertCircle, BarChart3, BookOpenText, CalendarClock, ClipboardCheck, FileText, Mail, UploadCloud, Users } from "lucide-react";
import { getAdminDashboard } from "../../services/api.js";

const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

const emptyDashboard = {
  totals: {},
  charts: {
    leadsByStatus: [],
    resultsByStage: [],
    emailsByStatus: []
  },
  recent: {
    leads: [],
    assessmentResults: [],
    contactMessages: []
  }
};

function StatCard({ label, value, icon: Icon, tone = "light" }) {
  return (
    <article className={`rounded border p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)] ${
      tone === "dark" ? "border-charcoal bg-charcoal text-mistWhite" : "border-sage bg-mistWhite text-charcoal"
    }`}>
      <Icon className={tone === "dark" ? "text-mutedMint" : "text-deepEmerald"} size={23} aria-hidden="true" />
      <p className={`mt-5 text-sm ${tone === "dark" ? "text-mistWhite/62" : "text-charcoal/62"}`}>{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{formatNumber(value)}</p>
    </article>
  );
}

function StatusList({ title, items }) {
  return (
    <article className="rounded border border-sage bg-mistWhite p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)]">
      <h3 className="font-serif text-2xl">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <div key={item._id || "unknown"} className="flex items-center justify-between gap-4 border-t border-sage pt-3 first:border-t-0 first:pt-0">
              <p className="text-sm font-semibold text-charcoal/76">{item._id || "Unassigned"}</p>
              <p className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-deepEmerald">
                {formatNumber(item.count)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-charcoal/60">No records yet.</p>
        )}
      </div>
    </article>
  );
}

export default function AdminDashboardPage() {
  const { admin } = useOutletContext();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then((response) => {
        if (!active) return;
        setDashboard(response.data);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "Could not load the admin dashboard.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const totals = dashboard.totals || {};
  const recent = dashboard.recent || emptyDashboard.recent;
  const charts = dashboard.charts || emptyDashboard.charts;

  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-sage pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Admin Dashboard</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Trust Hub Console</h1>
          <p className="mt-3 text-sm text-charcoal/65">Welcome back, {admin?.name}.</p>
        </div>
        {dashboard.activeAssessment && (
          <div className="rounded border border-sage bg-sage/40 px-4 py-3 text-sm">
            <p className="font-bold text-deepEmerald">Active assessment</p>
            <p className="mt-1 text-charcoal/70">
              {dashboard.activeAssessment.title} v{dashboard.activeAssessment.version}
            </p>
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="mt-6 flex gap-3 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-9">
        <StatCard label="New leads" value={totals.newLeads} icon={Users} tone="dark" />
        <StatCard label="Assessment results" value={totals.assessmentResults} icon={FileText} />
        <StatCard label="Pending emails" value={totals.pendingEmails} icon={Mail} />
        <StatCard label="New messages" value={totals.newMessages} icon={Mail} />
        <StatCard label="Applications" value={totals.applications} icon={ClipboardCheck} />
        <StatCard label="Bookings" value={totals.bookings} icon={CalendarClock} />
        <StatCard label="Media assets" value={totals.mediaAssets} icon={UploadCloud} />
        <StatCard label="Code entries" value={totals.codeOfResonanceEntries} icon={BookOpenText} />
        <StatCard label="Active offers" value={totals.activeOffers} icon={BarChart3} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <StatusList title="Lead Status" items={charts.leadsByStatus || []} />
        <StatusList title="Credibility Stages" items={charts.resultsByStage || []} />
        <StatusList title="Email Queue" items={charts.emailsByStatus || []} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded border border-sage bg-mistWhite p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)]">
          <h2 className="font-serif text-3xl">Recent Leads</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-sage text-xs uppercase tracking-[0.14em] text-charcoal/50">
                <tr>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Stage</th>
                  <th className="py-3 pr-4">Score</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage">
                {recent.leads?.length ? (
                  recent.leads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="py-3 pr-4 font-semibold">
                        {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unnamed"}
                      </td>
                      <td className="py-3 pr-4 text-charcoal/70">{lead.email}</td>
                      <td className="py-3 pr-4 text-charcoal/70">{lead.credibilityStage || "Not assessed"}</td>
                      <td className="py-3 pr-4 text-charcoal/70">{lead.assessmentScore ?? "-"}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-deepEmerald">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-5 text-charcoal/60" colSpan="5">No leads yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded border border-sage bg-mistWhite p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)]">
            <h2 className="font-serif text-3xl">Recent Results</h2>
            <div className="mt-5 grid gap-4">
              {recent.assessmentResults?.length ? (
                recent.assessmentResults.map((result) => (
                  <div key={result._id} className="border-t border-sage pt-4 first:border-t-0 first:pt-0">
                    <p className="font-semibold">
                      {result.participant?.firstName || "Participant"} · {result.overallScore}
                    </p>
                    <p className="mt-1 text-sm text-charcoal/65">
                      {result.credibilityStage?.name || "No stage"} · {formatDate(result.submittedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-charcoal/60">No assessment results yet.</p>
              )}
            </div>
          </article>

          <article className="rounded border border-sage bg-charcoal p-5 text-mistWhite shadow-[0_12px_28px_rgba(34,34,34,0.08)]">
            <h2 className="font-serif text-3xl">New Messages</h2>
            <div className="mt-5 grid gap-4">
              {recent.contactMessages?.length ? (
                recent.contactMessages.map((message) => (
                  <div key={message._id} className="border-t border-mistWhite/12 pt-4 first:border-t-0 first:pt-0">
                    <p className="font-semibold">{message.name}</p>
                    <p className="mt-1 text-sm text-mistWhite/62">{message.reason || "General inquiry"} · {formatDate(message.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-mistWhite/62">No messages yet.</p>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
