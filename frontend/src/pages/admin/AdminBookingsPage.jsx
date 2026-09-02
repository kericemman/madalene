import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarClock, CheckCircle2, RefreshCcw, Search } from "lucide-react";
import { listBookings, updateBooking } from "../../services/api.js";

const statuses = ["requested", "scheduled", "rescheduled", "completed", "cancelled", "no_show", "archived"];

const statusClass = (status) =>
  ({
    requested: "bg-mutedMint text-deepEmerald",
    scheduled: "bg-deepEmerald text-mistWhite",
    rescheduled: "bg-sage text-deepEmerald",
    completed: "bg-charcoal text-mutedMint",
    cancelled: "bg-red-50 text-red-700",
    no_show: "bg-amber-50 text-amber-800",
    archived: "bg-charcoal/10 text-charcoal/60"
  })[status] || "bg-sage text-deepEmerald";

const formatDateTime = (value) => {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const fullName = (item = {}) =>
  [item.firstName, item.lastName].filter(Boolean).join(" ") || "Unnamed booking";

export default function AdminBookingsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
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

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listBookings(params);
      setBookings(response.data.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateRecord = async (booking, payload) => {
    setSavingId(booking._id);
    setNotice("");
    setError("");
    try {
      const response = await updateBooking(booking._id, payload);
      const updated = response.data.booking;
      setBookings((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setNotice("Booking updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update booking.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Scheduling</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Bookings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Manage fit calls, audit sessions, booking status, and meeting links.
          </p>
        </div>
        <button
          type="button"
          onClick={loadBookings}
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
            placeholder="Search bookings"
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
          <div className="border border-sage bg-white p-8 text-sm font-bold text-deepEmerald">Loading bookings...</div>
        ) : bookings.length ? (
          bookings.map((booking) => (
            <article key={booking._id} className="grid gap-5 border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(26,26,26,0.045)] xl:grid-cols-[1fr_340px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">
                    {booking.offerSnapshot?.name || booking.sessionName || "Session"}
                  </span>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <CalendarClock className="mt-1 shrink-0 text-deepEmerald" size={22} aria-hidden="true" />
                  <div>
                    <h2 className="font-serif text-3xl leading-tight text-charcoal">{fullName(booking)}</h2>
                    <p className="mt-1 text-sm font-semibold text-charcoal/60">{booking.email}</p>
                    <p className="mt-2 text-sm font-bold text-deepEmerald">{formatDateTime(booking.scheduledFor)}</p>
                  </div>
                </div>
                {booking.message && (
                  <div className="mt-5 border-t border-sage pt-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Message</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{booking.message}</p>
                  </div>
                )}
              </div>

              <div className="grid content-start gap-4 border-t border-sage pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Status</span>
                  <select
                    className="input bg-mistWhite"
                    value={booking.status}
                    disabled={savingId === booking._id}
                    onChange={(event) => updateRecord(booking, { status: event.target.value })}
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Scheduled for</span>
                  <input
                    className="input bg-mistWhite"
                    type="datetime-local"
                    defaultValue={toInputDateTime(booking.scheduledFor)}
                    onBlur={(event) => {
                      const nextValue = event.target.value ? new Date(event.target.value).toISOString() : null;
                      if (nextValue !== (booking.scheduledFor || null)) {
                        updateRecord(booking, { scheduledFor: nextValue, status: booking.status === "requested" ? "scheduled" : booking.status });
                      }
                    }}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Meeting URL</span>
                  <input
                    className="input bg-mistWhite"
                    defaultValue={booking.meetingUrl || ""}
                    onBlur={(event) => {
                      if (event.target.value !== (booking.meetingUrl || "")) {
                        updateRecord(booking, { meetingUrl: event.target.value });
                      }
                    }}
                  />
                </label>
                <textarea
                  className="input min-h-28 bg-mistWhite"
                  defaultValue={booking.internalNote || ""}
                  placeholder="Internal note"
                  onBlur={(event) => {
                    if (event.target.value !== (booking.internalNote || "")) {
                      updateRecord(booking, { internalNote: event.target.value });
                    }
                  }}
                />
              </div>
            </article>
          ))
        ) : (
          <div className="border border-sage bg-white p-8 text-center text-sm text-charcoal/60">
            No bookings found.
          </div>
        )}
      </div>
    </section>
  );
}
