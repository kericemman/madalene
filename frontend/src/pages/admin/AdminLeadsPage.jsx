import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, RefreshCcw, Save, Search, UserRound } from "lucide-react";
import { addAdminLeadNote, getAdminLead, listAdminLeads, updateAdminLead } from "../../services/api.js";

const leadStatuses = [
  "New",
  "Assessment Completed",
  "Nurturing",
  "Guide Downloaded",
  "Audit Interested",
  "Audit Purchased",
  "Session Booked",
  "Applied",
  "Qualified",
  "Client",
  "Completed",
  "Not Ready",
  "Archived"
];

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

const fullName = (lead = {}) =>
  [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unnamed lead";

function StatusPill({ children, tone = "light" }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
        tone === "dark" ? "bg-charcoal text-mutedMint" : "bg-sage text-deepEmerald"
      }`}
    >
      {children}
    </span>
  );
}

export default function AdminLeadsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const params = useMemo(
    () => ({
      limit: 60,
      ...(status ? { status } : {}),
      ...(search.trim() ? { search: search.trim() } : {})
    }),
    [search, status]
  );

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listAdminLeads(params);
      const items = response.data.items || [];
      setLeads(items);
      setPagination(response.data.pagination || null);
      if (!selectedId && items[0]?._id) setSelectedId(items[0]._id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    setDetailLoading(true);
    getAdminLead(selectedId)
      .then((response) => {
        if (!active) return;
        setDetail(response.data);
      })
      .catch(() => {
        if (!active) return;
        setDetail(null);
      })
      .finally(() => {
        if (!active) return;
        setDetailLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectedLead = detail?.lead;

  const changeStatus = async (nextStatus) => {
    if (!selectedLead) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await updateAdminLead(selectedLead._id, { status: nextStatus });
      const updatedLead = response.data.lead;
      setDetail((current) => ({ ...current, lead: updatedLead }));
      setLeads((current) => current.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead)));
      setMessage("Lead status updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update lead.");
    } finally {
      setSaving(false);
    }
  };

  const submitNote = async (event) => {
    event.preventDefault();
    if (!selectedLead || !note.trim()) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await addAdminLeadNote(selectedLead._id, { note: note.trim() });
      setDetail((current) => ({ ...current, lead: response.data.lead }));
      setNote("");
      setMessage("Note added.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not add note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Lead CRM</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Leads</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Track assessment participants, subscribers, applicants, bookings, and contact enquiries in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={loadLeads}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {(message || error) && (
        <div
          className={`mt-6 flex gap-3 rounded border p-4 text-sm ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
          }`}
        >
          {error ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
          <p>{error || message}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
          <div className="grid gap-3 sm:grid-cols-[1fr_210px]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
              <input
                className="input bg-mistWhite pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, profession"
              />
            </label>
            <select className="input bg-mistWhite" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {leadStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 grid max-h-[760px] gap-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="grid min-h-[240px] place-items-center text-sm font-bold text-deepEmerald">
                Loading leads...
              </div>
            ) : leads.length ? (
              leads.map((lead) => (
                <button
                  key={lead._id}
                  type="button"
                  onClick={() => setSelectedId(lead._id)}
                  className={`rounded border p-4 text-left transition ${
                    selectedId === lead._id
                      ? "border-deepEmerald bg-mutedMint/60"
                      : "border-sage bg-mistWhite hover:border-deepEmerald/35 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-charcoal">{fullName(lead)}</p>
                      <p className="mt-1 truncate text-xs text-charcoal/60">{lead.email}</p>
                    </div>
                    <StatusPill>{lead.status}</StatusPill>
                  </div>
                  <p className="mt-3 text-xs text-charcoal/55">
                    {lead.credibilityStage || "No stage"} {lead.assessmentScore !== undefined ? `- ${lead.assessmentScore}` : ""}
                  </p>
                </button>
              ))
            ) : (
              <div className="border border-sage bg-mistWhite p-8 text-center text-sm text-charcoal/60">
                No leads found.
              </div>
            )}
          </div>

          {pagination && (
            <p className="mt-4 text-xs font-semibold text-charcoal/50">
              Showing {leads.length} of {pagination.total} leads.
            </p>
          )}
        </div>

        <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
          {detailLoading ? (
            <div className="grid min-h-[420px] place-items-center text-sm font-bold text-deepEmerald">
              Loading lead profile...
            </div>
          ) : selectedLead ? (
            <div>
              <div className="flex flex-col gap-4 border-b border-sage pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <UserRound className="text-deepEmerald" size={22} aria-hidden="true" />
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Lead Profile</p>
                  </div>
                  <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">{fullName(selectedLead)}</h2>
                  <a href={`mailto:${selectedLead.email}`} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-deepEmerald">
                    <Mail size={15} aria-hidden="true" />
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="dark">{selectedLead.status}</StatusPill>
                  {selectedLead.newsletterConsent && <StatusPill>Subscriber</StatusPill>}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {[
                  ["Profession", selectedLead.profession],
                  ["Business stage", selectedLead.businessStage],
                  ["Score", selectedLead.assessmentScore],
                  ["Stage", selectedLead.credibilityStage],
                  ["Strongest", selectedLead.strongestCategory],
                  ["Weakest", selectedLead.weakestCategory],
                  ["Source", selectedLead.leadSource],
                  ["Last interaction", formatDateTime(selectedLead.lastInteractionAt)],
                  ["Created", formatDateTime(selectedLead.createdAt)]
                ].map(([label, value]) => (
                  <div key={label} className="border border-sage bg-mistWhite p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">{label}</p>
                    <p className="mt-2 text-sm font-bold text-charcoal">{value || "Not recorded"}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                <div className="rounded border border-sage bg-mistWhite p-4">
                  <p className="text-sm font-extrabold text-charcoal">Update status</p>
                  <div className="mt-3 grid gap-2">
                    <select
                      className="input bg-white"
                      value={selectedLead.status}
                      onChange={(event) => changeStatus(event.target.value)}
                      disabled={saving}
                    >
                      {leadStatuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <form onSubmit={submitNote} className="rounded border border-sage bg-mistWhite p-4">
                  <p className="text-sm font-extrabold text-charcoal">Add internal note</p>
                  <textarea
                    className="input mt-3 min-h-28 bg-white"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add context, next action, or follow-up note"
                  />
                  <button
                    type="submit"
                    disabled={saving || !note.trim()}
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-2.5 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                    Save note
                  </button>
                </form>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-3">
                <div className="rounded border border-sage bg-white p-4">
                  <h3 className="font-serif text-2xl">Assessment History</h3>
                  <div className="mt-4 grid gap-3">
                    {detail.assessmentResults?.length ? (
                      detail.assessmentResults.map((result) => (
                        <div key={result._id} className="border-t border-sage pt-3 first:border-t-0 first:pt-0">
                          <p className="text-sm font-bold">{result.credibilityStage?.name || "Result"} - {result.overallScore}</p>
                          <p className="mt-1 text-xs text-charcoal/55">{formatDateTime(result.submittedAt)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-charcoal/60">No assessment history.</p>
                    )}
                  </div>
                </div>

                <div className="rounded border border-sage bg-white p-4">
                  <h3 className="font-serif text-2xl">Contact History</h3>
                  <div className="mt-4 grid gap-3">
                    {detail.contactMessages?.length ? (
                      detail.contactMessages.map((item) => (
                        <div key={item._id} className="border-t border-sage pt-3 first:border-t-0 first:pt-0">
                          <p className="text-sm font-bold">{item.reason || "Message"}</p>
                          <p className="mt-1 text-xs text-charcoal/55">{formatDateTime(item.createdAt)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-charcoal/60">No contact messages.</p>
                    )}
                  </div>
                </div>

                <div className="rounded border border-sage bg-white p-4">
                  <h3 className="font-serif text-2xl">Internal Notes</h3>
                  <div className="mt-4 grid gap-3">
                    {selectedLead.internalNotes?.length ? (
                      [...selectedLead.internalNotes].reverse().map((item) => (
                        <div key={item._id || item.createdAt} className="border-t border-sage pt-3 first:border-t-0 first:pt-0">
                          <p className="text-sm leading-6 text-charcoal/74">{item.note}</p>
                          <p className="mt-1 text-xs text-charcoal/45">{formatDateTime(item.createdAt)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-charcoal/60">No notes yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <UserRound className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
                <h2 className="mt-4 font-serif text-3xl">Choose a lead</h2>
                <p className="mt-2 text-sm text-charcoal/60">Select a lead to see the full profile.</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
