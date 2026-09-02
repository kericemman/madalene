import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, RefreshCcw, Search } from "lucide-react";
import { getContactMessage, listContactMessages, updateContactMessage } from "../../services/api.js";

const statuses = ["new", "read", "replied", "archived"];

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

const statusClass = (status) =>
  ({
    new: "bg-mutedMint text-deepEmerald",
    read: "bg-sage text-deepEmerald",
    replied: "bg-charcoal text-mutedMint",
    archived: "bg-charcoal/10 text-charcoal/60"
  })[status] || "bg-sage text-deepEmerald";

export default function AdminMessagesPage() {
  const [status, setStatus] = useState("new");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const params = useMemo(
    () => ({
      limit: 60,
      ...(status ? { status } : {}),
      ...(search.trim() ? { search: search.trim() } : {})
    }),
    [search, status]
  );

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listContactMessages(params);
      const items = response.data.items || [];
      setMessages(items);
      if (!selectedId && items[0]?._id) setSelectedId(items[0]._id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    getContactMessage(selectedId)
      .then((response) => {
        if (!active) return;
        setSelected(response.data.message);
      })
      .catch(() => {
        if (!active) return;
        setSelected(null);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const updateStatus = async (message, nextStatus) => {
    setSavingId(message._id);
    setNotice("");
    setError("");
    try {
      const response = await updateContactMessage(message._id, { status: nextStatus });
      const updated = response.data.message;
      setMessages((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setSelected(updated);
      setNotice("Message updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update message.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Inbox</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Messages</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Review contact enquiries, mark follow-ups, and keep inquiry status visible.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
              <input
                className="input bg-mistWhite pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages"
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

          <div className="mt-5 grid max-h-[720px] gap-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="grid min-h-[240px] place-items-center text-sm font-bold text-deepEmerald">
                Loading messages...
              </div>
            ) : messages.length ? (
              messages.map((message) => (
                <button
                  key={message._id}
                  type="button"
                  onClick={() => setSelectedId(message._id)}
                  className={`rounded border p-4 text-left transition ${
                    selectedId === message._id
                      ? "border-deepEmerald bg-mutedMint/60"
                      : "border-sage bg-mistWhite hover:border-deepEmerald/35 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-charcoal">{message.name}</p>
                      <p className="mt-1 truncate text-xs text-charcoal/60">{message.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(message.status)}`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-charcoal/62">{message.message}</p>
                </button>
              ))
            ) : (
              <div className="border border-sage bg-mistWhite p-8 text-center text-sm text-charcoal/60">
                No messages found.
              </div>
            )}
          </div>
        </div>

        <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
          {selected ? (
            <div>
              <div className="flex flex-col gap-4 border-b border-sage pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                    <Mail size={17} aria-hidden="true" />
                    Contact Message
                  </div>
                  <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">{selected.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-charcoal/60">{selected.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(selected.status)}`}>
                  {selected.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="border border-sage bg-mistWhite p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">Reason</p>
                  <p className="mt-2 text-sm font-bold">{selected.reason || "General inquiry"}</p>
                </div>
                <div className="border border-sage bg-mistWhite p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">Profession</p>
                  <p className="mt-2 text-sm font-bold">{selected.profession || "Not recorded"}</p>
                </div>
                <div className="border border-sage bg-mistWhite p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">Received</p>
                  <p className="mt-2 text-sm font-bold">{formatDateTime(selected.createdAt)}</p>
                </div>
              </div>

              <div className="mt-6 border border-sage bg-mistWhite p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Message</p>
                <p className="mt-3 whitespace-pre-line text-lg leading-8 text-charcoal/76">{selected.message}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {statuses.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={savingId === selected._id || selected.status === item}
                    onClick={() => updateStatus(selected, item)}
                    className="rounded-full border border-sage bg-mistWhite px-4 py-2 text-sm font-extrabold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:opacity-50"
                  >
                    Mark {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <Mail className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
                <h2 className="mt-4 font-serif text-3xl">Choose a message</h2>
                <p className="mt-2 text-sm text-charcoal/60">Select a message to read it.</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
