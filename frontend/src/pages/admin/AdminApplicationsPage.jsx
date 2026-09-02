import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ClipboardCheck, RefreshCcw, Search } from "lucide-react";
import { listApplications, updateApplication } from "../../services/api.js";

const statuses = ["new", "reviewing", "qualified", "not_ready", "accepted", "declined", "archived"];
const priorities = ["normal", "high", "urgent"];

const statusClass = (status) =>
  ({
    new: "bg-mutedMint text-deepEmerald",
    reviewing: "bg-sage text-deepEmerald",
    qualified: "bg-deepEmerald text-mistWhite",
    accepted: "bg-charcoal text-mutedMint",
    not_ready: "bg-amber-50 text-amber-800",
    declined: "bg-red-50 text-red-700",
    archived: "bg-charcoal/10 text-charcoal/60"
  })[status] || "bg-sage text-deepEmerald";

const formatDateTime = (value) => {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const fullName = (item = {}) =>
  [item.firstName, item.lastName].filter(Boolean).join(" ") || "Unnamed applicant";

export default function AdminApplicationsPage() {
  const [status, setStatus] = useState("new");
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const params = useMemo(
    () => ({
      limit: 80,
      ...(status ? { status } : {}),
      ...(search.trim() ? { search: search.trim() } : {})
    }),
    [search, status]
  );

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listApplications(params);
      setApplications(response.data.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateRecord = async (application, payload) => {
    setSavingId(application._id);
    setNotice("");
    setError("");
    try {
      const response = await updateApplication(application._id, payload);
      const updated = response.data.application;
      setApplications((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setNotice("Application updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update application.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Offer Pipeline</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Applications</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Review who is applying, qualify the right fit, and keep lead status aligned with offer readiness.
          </p>
        </div>
        <button
          type="button"
          onClick={loadApplications}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {(notice || error) && (
        <div
          className={`mt-6 flex gap-3 rounded border p-4 text-sm ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
          }`}
        >
          {error ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
          <p>{error || notice}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)] lg:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
          <input
            className="input bg-mistWhite pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applicants"
          />
        </label>
        <select className="input bg-mistWhite" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4">
        {loading ? (
          <div className="border border-sage bg-white p-8 text-sm font-bold text-deepEmerald">Loading applications...</div>
        ) : applications.length ? (
          applications.map((application) => (
            <article key={application._id} className="grid gap-5 border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(26,26,26,0.045)] xl:grid-cols-[1fr_320px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(application.status)}`}>
                    {application.status}
                  </span>
                  <span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">
                    {application.offerSnapshot?.name || "Offer"}
                  </span>
                  {application.priority !== "normal" && (
                    <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-extrabold text-mutedMint">
                      {application.priority}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <ClipboardCheck className="mt-1 shrink-0 text-deepEmerald" size={22} aria-hidden="true" />
                  <div>
                    <h2 className="font-serif text-3xl leading-tight text-charcoal">{fullName(application)}</h2>
                    <p className="mt-1 text-sm font-semibold text-charcoal/60">{application.email}</p>
                    <p className="mt-1 text-sm text-charcoal/60">{application.profession || "Profession not recorded"}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="border-t border-sage pt-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Challenge</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{application.primaryChallenge || "Not recorded"}</p>
                  </div>
                  <div className="border-t border-sage pt-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Desired outcome</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{application.desiredOutcome || "Not recorded"}</p>
                  </div>
                  <div className="border-t border-sage pt-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Why now</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{application.whyNow || "Not recorded"}</p>
                  </div>
                  <div className="border-t border-sage pt-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Support needed</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{application.supportNeeded || "Not recorded"}</p>
                  </div>
                </div>
              </div>

              <div className="grid content-start gap-4 border-t border-sage pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">Submitted</p>
                  <p className="mt-1 text-sm font-bold text-charcoal">{formatDateTime(application.submittedAt)}</p>
                </div>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Status</span>
                  <select
                    className="input bg-mistWhite"
                    value={application.status}
                    disabled={savingId === application._id}
                    onChange={(event) => updateRecord(application, { status: event.target.value })}
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Priority</span>
                  <select
                    className="input bg-mistWhite"
                    value={application.priority}
                    disabled={savingId === application._id}
                    onChange={(event) => updateRecord(application, { priority: event.target.value })}
                  >
                    {priorities.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <textarea
                  className="input min-h-28 bg-mistWhite"
                  defaultValue={application.decisionNote || ""}
                  placeholder="Decision note"
                  onBlur={(event) => {
                    if (event.target.value !== (application.decisionNote || "")) {
                      updateRecord(application, { decisionNote: event.target.value });
                    }
                  }}
                />
              </div>
            </article>
          ))
        ) : (
          <div className="border border-sage bg-white p-8 text-center text-sm text-charcoal/60">
            No applications found.
          </div>
        )}
      </div>
    </section>
  );
}
