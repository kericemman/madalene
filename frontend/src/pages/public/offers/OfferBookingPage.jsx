import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarCheck2, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { getPublicOffer, submitBooking } from "../../../services/api.js";
import { getOfferPath, mergeOffer, offerContent } from "./offerContent.js";

const createKey = () => globalThis.crypto?.randomUUID?.() || `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function OfferBookingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
        if (live) setError(requestError.response?.data?.message || "This booking request is being prepared. Please return shortly.");
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
      setError("Please add your name, a valid email address, and consent for a response.");
      return;
    }
    if (!catalogueReady) return;
    setSubmitting(true);
    setError("");
    try {
      await submitBooking({ ...form, offerSlug, source: "public_offer_booking_request", idempotencyKey: idempotencyKey.current });
      setComplete(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your request could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <main className="bg-mistWhite py-14 sm:py-20 lg:py-24"><div className="container-shell max-w-3xl"><section className="border border-charcoal bg-charcoal p-7 text-mistWhite shadow-[0_26px_60px_rgba(34,34,34,0.18)] sm:p-10"><CheckCircle2 className="text-mutedMint" size={30} aria-hidden="true" /><p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Request received</p><h1 className="mt-4 font-serif text-4xl leading-tight">Thank you. I will be in touch about your Credibility Audit.</h1><p className="mt-5 text-base leading-7 text-mistWhite/76">A confirmation email is on its way, and your request is now visible in my booking dashboard.</p><Link to="/offers" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-mutedMint transition hover:gap-3">Explore the offers <ArrowRight size={16} aria-hidden="true" /></Link></section></div></main>
    );
  }

  return (
    <main className="bg-mistWhite py-10 sm:py-14 lg:py-20">
      <div className="container-shell max-w-5xl">
        <Link to={getOfferPath(offerSlug)} className="inline-flex items-center gap-2 text-sm font-bold text-deepEmerald transition hover:text-charcoal"><ArrowLeft size={16} aria-hidden="true" /> Back to {offer.name}</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <aside className="border border-charcoal bg-charcoal p-6 text-mistWhite sm:p-7 lg:sticky lg:top-28">
            <CalendarCheck2 className="text-mutedMint" size={28} aria-hidden="true" />
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">{offer.phase}</p>
            <h1 className="mt-4 font-serif text-3xl leading-tight">{offer.formTitle}</h1>
            <p className="mt-4 text-sm leading-6 text-mistWhite/72">{offer.formDescription}</p>
            {offer.externalBookingUrl && <a href={offer.externalBookingUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border border-mutedMint/45 px-4 py-3 text-sm font-extrabold text-mutedMint transition hover:bg-mutedMint hover:text-charcoal">Choose a time on the calendar <ExternalLink size={15} aria-hidden="true" /></a>}
          </aside>
          <form onSubmit={submit} className="border border-sage bg-white p-5 shadow-[0_18px_42px_rgba(34,34,34,0.055)] sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Booking request</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal">A clear place to begin.</h2>
            <p className="mt-3 text-sm leading-6 text-charcoal/62">Share what is happening, and I will follow up to arrange your audit.</p>
            {error && <div className="mt-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" /><p>{error}</p></div>}
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2"><span className="text-sm font-extrabold text-charcoal">First name</span><input className="input bg-mistWhite" name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" required /></label>
              <label className="grid gap-2"><span className="text-sm font-extrabold text-charcoal">Last name</span><input className="input bg-mistWhite" name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" /></label>
              <label className="grid gap-2"><span className="text-sm font-extrabold text-charcoal">Email</span><input className="input bg-mistWhite" type="email" name="email" value={form.email} onChange={update} autoComplete="email" required /></label>
              <label className="grid gap-2"><span className="text-sm font-extrabold text-charcoal">Phone</span><input className="input bg-mistWhite" name="phone" value={form.phone} onChange={update} autoComplete="tel" /></label>
              <label className="grid gap-2 sm:col-span-2"><span className="text-sm font-extrabold text-charcoal">What would you like clarity on?</span><textarea className="input min-h-36 resize-y bg-mistWhite" name="message" value={form.message} onChange={update} placeholder="A little context will help me prepare for the conversation." /></label>
              <label className="flex gap-3 border border-sage bg-mistWhite p-4 text-sm leading-6 text-charcoal/74 sm:col-span-2"><input type="checkbox" name="consent" checked={form.consent} onChange={update} className="mt-1 size-4 shrink-0 accent-deepEmerald" /><span>I agree that my details can be used to respond to this booking request.</span></label>
            </div>
            <button type="submit" disabled={submitting || !catalogueReady} className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-charcoal bg-charcoal px-5 py-3 text-sm font-extrabold text-mutedMint shadow-[0_12px_28px_rgba(34,34,34,0.16)] transition hover:bg-deepEmerald hover:text-mistWhite disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{submitting ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : "Send booking request"}{!submitting && <ArrowRight size={16} aria-hidden="true" />}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
