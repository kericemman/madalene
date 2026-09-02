import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarCheck2, CheckCircle2, ExternalLink, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { getPublicOffer, submitBooking } from "../../../services/api.js";
import { getOfferPath, mergeOffer, offerContent } from "./offerContent.js";

const createKey = () => globalThis.crypto?.randomUUID?.() || `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function OfferBookingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { offerSlug } = useParams();
  const fallback = offerContent[offerSlug] ? mergeOffer({ slug: offerSlug }) : null;
  const [offer, setOffer] = useState(fallback);
  const [catalogueReady, setCatalogueReady] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "", consent: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const idempotencyKey = useRef(createKey());

  useEffect(() => {
    if (!fallback) return undefined;
    let live = true;
    getPublicOffer(offerSlug)
      .then((response) => {
        if (!live) return;
        const loaded = mergeOffer(response.data.offer);
        if (loaded.ctaType !== "booking") throw new Error("This offer uses a different next step.");
        setOffer(loaded);
        setCatalogueReady(true);
      })
      .catch((requestError) => {
        if (live) setError(requestError.response?.data?.message || "This booking request is currently being prepared. Please return shortly.");
      });
    return () => { live = false; };
  }, [offerSlug]);

  if (!fallback) return <Navigate to="/offers" replace />;

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.firstName.trim() || !/\S+@\S+\.\S+/.test(form.email) || !form.consent) {
      setError("Please add your name, a valid email address, and consent to proceed.");
      return;
    }
    if (!catalogueReady) return;
    setSubmitting(true);
    setError("");
    try {
      await submitBooking({ ...form, offerSlug, source: "public_offer_booking_request", idempotencyKey: idempotencyKey.current });
      setComplete(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your request could not be sent right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] py-16 sm:py-24 text-charcoal flex items-center justify-center">
        <div className="container-shell mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-sage/80 bg-white p-8 sm:p-12 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-deepEmerald/10 text-deepEmerald mb-6">
              <CheckCircle2 size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Request Confirmed</span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Thank you. I will be in touch shortly.
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/70">
              A confirmation email is on its way, and your booking request has been securely added to the advisory schedule.
            </p>
            <div className="mt-8">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-6 py-3 text-xs font-bold text-mistWhite transition hover:bg-charcoal"
              >
                <span>Return to Engagements</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-charcoal selection:bg-mutedMint/60 py-12 sm:py-20">
      <div className="container-shell mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to={getOfferPath(offerSlug)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-deepEmerald hover:text-charcoal transition mb-8"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to {offer.name}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:items-start">
          
          {/* Sidebar Context Card */}
          <aside className="rounded-3xl border border-charcoal/10 bg-charcoal p-7 sm:p-9 text-mistWhite shadow-xl lg:sticky lg:top-8 space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-mutedMint">
              <CalendarCheck2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-mutedMint">{offer.phase}</span>
              <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                {offer.formTitle}
              </h1>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-mistWhite/75">
                {offer.formDescription}
              </p>
            </div>

            {offer.externalBookingUrl && (
              <div className="border-t border-white/10 pt-5">
                <a
                  href={offer.externalBookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-mutedMint px-5 py-3 text-xs font-extrabold text-charcoal transition hover:bg-white shadow-sm"
                >
                  <span>Choose a time on calendar</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </aside>

          {/* Main Booking Form */}
          <div className="rounded-3xl border border-sage/80 bg-white p-6 sm:p-10 shadow-sm">
            <div className="border-b border-sage/40 pb-5 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-deepEmerald">Secure Request</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Share your context to begin.
              </h2>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-charcoal/80">First Name <span className="text-deepEmerald">*</span></span>
                  <input
                    className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                    name="firstName"
                    value={form.firstName}
                    onChange={update}
                    autoComplete="given-name"
                    required
                    placeholder="e.g. Eleanor"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-charcoal/80">Last Name</span>
                  <input
                    className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                    name="lastName"
                    value={form.lastName}
                    onChange={update}
                    autoComplete="family-name"
                    placeholder="e.g. Vance"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-charcoal/80">Email Address <span className="text-deepEmerald">*</span></span>
                  <input
                    className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update}
                    autoComplete="email"
                    required
                    placeholder="eleanor@domain.com"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-charcoal/80">Phone Number</span>
                  <input
                    className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    autoComplete="tel"
                    placeholder="+254..."
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-charcoal/80">What would you like clarity on?</span>
                <textarea
                  className="input w-full min-h-[140px] rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm p-4 resize-y leading-relaxed"
                  name="message"
                  value={form.message}
                  onChange={update}
                  placeholder="Share a little background on your current positioning challenges to help me prepare."
                />
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={update}
                  className="mt-1 size-4 rounded border-sage text-deepEmerald focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-charcoal/70 leading-relaxed">
                  I agree that my details can be securely processed to respond to this booking request.
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !catalogueReady}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-deepEmerald px-8 py-3.5 text-xs font-bold text-mistWhite transition-all hover:bg-charcoal hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
                  <span>{submitting ? "Sending Request..." : "Send booking request"}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}