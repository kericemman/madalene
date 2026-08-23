import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, RefreshCcw, RotateCcw, Search, XCircle } from "lucide-react";
import {
  cancelScheduledEmail,
  listEmailTemplates,
  listScheduledEmails,
  retryScheduledEmail
} from "../../services/api.js";

const emailStatuses = ["pending", "processing", "sent", "failed", "cancelled"];

const statusClass = (status) =>
  ({
    pending: "bg-sage text-deepEmerald",
    processing: "bg-mutedMint text-deepEmerald",
    sent: "bg-deepEmerald text-mistWhite",
    failed: "bg-red-50 text-red-700",
    cancelled: "bg-charcoal/10 text-charcoal/60"
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

export default function AdminEmailsPage() {
  const [templateSearch, setTemplateSearch] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [templates, setTemplates] = useState([]);
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const templateParams = useMemo(
    () => ({
      limit: 100,
      ...(templateSearch.trim() ? { search: templateSearch.trim() } : {})
    }),
    [templateSearch]
  );

  const emailParams = useMemo(
    () => ({
      limit: 80,
      ...(emailStatus ? { status: emailStatus } : {}),
      ...(emailSearch.trim() ? { email: emailSearch.trim() } : {})
    }),
    [emailSearch, emailStatus]
  );

  const loadEmails = async () => {
    setLoading(true);
    setError("");
    try {
      const [templatesResponse, scheduledResponse] = await Promise.all([
        listEmailTemplates(templateParams),
        listScheduledEmails(emailParams)
      ]);
      setTemplates(templatesResponse.data.items || []);
      setScheduledEmails(scheduledResponse.data.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load emails.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateParams, emailParams]);

  const runAction = async (email, action) => {
    setActionId(email._id);
    setNotice("");
    setError("");
    try {
      const response = action === "retry" ? await retryScheduledEmail(email._id) : await cancelScheduledEmail(email._id);
      const updated = response.data.email;
      setScheduledEmails((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setNotice(action === "retry" ? "Email queued for retry." : "Email cancelled.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update scheduled email.");
    } finally {
      setActionId("");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Email Delivery</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Emails</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Monitor templates, scheduled email jobs, retries, and cancellations across assessment, contact, Code, booking, and application flows.
          </p>
        </div>
        <button
          type="button"
          onClick={loadEmails}
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Templates</p>
              <h2 className="font-serif text-3xl leading-tight text-charcoal">Email Templates</h2>
            </div>
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">
              {templates.length}
            </span>
          </div>
          <label className="relative mt-5 block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
            <input
              className="input bg-mistWhite pl-10"
              value={templateSearch}
              onChange={(event) => setTemplateSearch(event.target.value)}
              placeholder="Search templates"
            />
          </label>
          <div className="mt-5 grid max-h-[720px] gap-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-sm font-bold text-deepEmerald">Loading templates...</div>
            ) : templates.length ? (
              templates.map((template) => (
                <div key={template._id} className="rounded border border-sage bg-mistWhite p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-charcoal">{template.name}</p>
                      <p className="mt-1 text-xs text-charcoal/55">{template.key}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${template.active ? "bg-mutedMint text-deepEmerald" : "bg-sage text-charcoal/50"}`}>
                      {template.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-charcoal/62">{template.subject}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-charcoal/60">No templates found.</p>
            )}
          </div>
        </article>

        <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <div className="flex items-center gap-3">
            <Mail className="text-deepEmerald" size={22} aria-hidden="true" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Queue</p>
              <h2 className="font-serif text-3xl leading-tight text-charcoal">Scheduled Emails</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_190px]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
              <input
                className="input bg-mistWhite pl-10"
                value={emailSearch}
                onChange={(event) => setEmailSearch(event.target.value)}
                placeholder="Search recipient email"
              />
            </label>
            <select className="input bg-mistWhite" value={emailStatus} onChange={(event) => setEmailStatus(event.target.value)}>
              <option value="">All statuses</option>
              {emailStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-sage text-xs uppercase tracking-[0.14em] text-charcoal/48">
                <tr>
                  <th className="py-3 pr-4">Recipient</th>
                  <th className="py-3 pr-4">Template</th>
                  <th className="py-3 pr-4">Scheduled</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage">
                {loading ? (
                  <tr>
                    <td className="py-5 text-deepEmerald" colSpan="5">Loading scheduled emails...</td>
                  </tr>
                ) : scheduledEmails.length ? (
                  scheduledEmails.map((email) => (
                    <tr key={email._id}>
                      <td className="py-4 pr-4">
                        <p className="font-bold text-charcoal">{email.recipient?.name || "Recipient"}</p>
                        <p className="mt-1 text-xs text-charcoal/55">{email.recipient?.email}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-charcoal">{email.template?.name || email.templateKey}</p>
                        <p className="mt-1 text-xs text-charcoal/55">{email.templateKey}</p>
                      </td>
                      <td className="py-4 pr-4 text-charcoal/65">{formatDateTime(email.scheduledFor)}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(email.status)}`}>
                          {email.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {email.status !== "sent" && (
                            <button
                              type="button"
                              disabled={actionId === email._id}
                              onClick={() => runAction(email, "retry")}
                              className="inline-flex items-center gap-1 rounded-full border border-deepEmerald px-3 py-1.5 text-xs font-extrabold text-deepEmerald transition hover:bg-deepEmerald hover:text-mistWhite disabled:opacity-50"
                            >
                              <RotateCcw size={13} aria-hidden="true" />
                              Retry
                            </button>
                          )}
                          {!["sent", "cancelled"].includes(email.status) && (
                            <button
                              type="button"
                              disabled={actionId === email._id}
                              onClick={() => runAction(email, "cancel")}
                              className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-extrabold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircle size={13} aria-hidden="true" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-5 text-charcoal/60" colSpan="5">No scheduled emails found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
