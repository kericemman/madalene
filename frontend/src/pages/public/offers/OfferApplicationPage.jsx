import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { getPublicOffer, submitApplication } from "../../../services/api.js";
import { getOfferPath, mergeOffer, offerContent } from "./offerContent.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  profession: "",
  industry: "",
  businessStage: "",
  website: "",
  linkedInProfile: "",
  country: "",
  primaryChallenge: "",
  desiredOutcome: "",
  readinessToInvest: "",
  whyNow: "",
  supportNeeded: "",
  consent: false
};

const steps = ["About you", "Your work", "The right next step"];
const newKey = () => globalThis.crypto?.randomUUID?.() || `application-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function Field({ label, children, hint }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-charcoal">{label}</span>
      {children}
      {hint && <span className="text-xs leading-5 text-charcoal/55">{hint}</span>}
    </label>
  );
}

export default function OfferApplicationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { offerSlug } = useParams();
  const fallback = offerContent[offerSlug] ? mergeOffer({ slug: offerSlug }) : null;
  const [offer, setOffer] = useState(fallback);
  const [catalogueReady, setCatalogueReady] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const idempotencyKey = useRef(newKey());

  useEffect(() => {
    if (!fallback) return undefined;
    let live = true;
    getPublicOffer(offerSlug)
      .then((response) => {
        if (!live) return;
        const loaded = mergeOffer(response.data.offer);
        if (loaded.ctaType !== "application") throw new Error("This offer uses a different next step.");
        setOffer(loaded);
        setCatalogueReady(true);
      })
      .catch((requestError) => {
        if (live) setError(requestError.response?.data?.message || "This application is being prepared. Please return shortly.");
      });
    return () => {
      live = false;
    };
  }, [offerSlug]);

  if (!fallback) return <Navigate to="/offers" replace />;

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const validateCurrentStep = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
        setError("Please add your first name and a valid email address.");
        return false;
      }
    }
    if (step === 1 && (!form.primaryChallenge.trim() || !form.desiredOutcome.trim())) {
      setError("Please share the challenge you are facing and what you want to change.");
      return false;
    }
    if (step === 2 && (!form.whyNow.trim() || !form.consent)) {
      setError("Please tell me why now and confirm that I may use your details to respond.");
      return false;
    }
    setError("");
    return true;
  };

  const next = () => {
    if (validateCurrentStep()) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validateCurrentStep() || !catalogueReady) return;
    setSubmitting(true);
    setError("");
    try {
      await submitApplication({
        ...form,
        offerSlug,
        source: "public_offer_application",
        idempotencyKey: idempotencyKey.current
      });
      setComplete(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your application could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <main className="bg-mistWhite py-14 sm:py-20 lg:py-24">
        <div className="container-shell max-w-3xl">
          <section className="border border-charcoal bg-charcoal p-7 text-mistWhite shadow-[0_26px_60px_rgba(34,34,34,0.18)] sm:p-10">
            <CheckCircle2 className="text-mutedMint" size={30} aria-hidden="true" />
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Application received</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-balance">Thank you for sharing where you are.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-mistWhite/76">I will review your application for {offer.name} and follow up with the most appropriate next step.</p>
            <Link to="/offers" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-mutedMint transition hover:gap-3">
              Explore the offers <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-mistWhite py-10 sm:py-14 lg:py-20">
      <div className="container-shell max-w-5xl">
        <Link to={getOfferPath(offerSlug)} className="inline-flex items-center gap-2 text-sm font-bold text-deepEmerald transition hover:text-charcoal">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to {offer.name}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <aside className="border border-charcoal bg-charcoal p-6 text-mistWhite sm:p-7 lg:sticky lg:top-28">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">{offer.phase}</p>
            <h1 className="mt-4 font-serif text-3xl leading-tight">{offer.formTitle}</h1>
            <p className="mt-4 text-sm leading-6 text-mistWhite/72">{offer.formDescription}</p>
            <div className="mt-8 grid gap-3 border-t border-mistWhite/15 pt-6">
              {steps.map((label, index) => (
                <p key={label} className={`flex items-center gap-3 text-sm font-bold ${index === step ? "text-mutedMint" : index < step ? "text-mistWhite" : "text-mistWhite/45"}`}>
                  <span className={`grid size-6 place-items-center border text-xs ${index <= step ? "border-mutedMint" : "border-mistWhite/25"}`}>{index + 1}</span>
                  {label}
                </p>
              ))}
            </div>
          </aside>

          <form onSubmit={submit} className="border border-sage bg-white p-5 shadow-[0_18px_42px_rgba(34,34,34,0.055)] sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-sage pb-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Step {step + 1} of {steps.length}</p>
                <h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">{steps[step]}</h2>
              </div>
              <div className="flex gap-1.5 lg:hidden" aria-label={`Step ${step + 1} of ${steps.length}`}>
                {steps.map((label, index) => <span key={label} className={`h-2 w-7 ${index <= step ? "bg-deepEmerald" : "bg-sage"}`} />)}
              </div>
            </div>

            {error && (
              <div className="mt-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-7">
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name"><input className="input bg-mistWhite" name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" required /></Field>
                  <Field label="Last name"><input className="input bg-mistWhite" name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" /></Field>
                  <Field label="Email"><input className="input bg-mistWhite" type="email" name="email" value={form.email} onChange={update} autoComplete="email" required /></Field>
                  <Field label="Phone"><input className="input bg-mistWhite" name="phone" value={form.phone} onChange={update} autoComplete="tel" /></Field>
                  <Field label="Profession"><input className="input bg-mistWhite" name="profession" value={form.profession} onChange={update} placeholder="Coach, clinician, founder..." /></Field>
                  <Field label="Country"><input className="input bg-mistWhite" name="country" value={form.country} onChange={update} autoComplete="country-name" /></Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Field or industry"><input className="input bg-mistWhite" name="industry" value={form.industry} onChange={update} /></Field>
                    <Field label="Business stage"><select className="input bg-mistWhite" name="businessStage" value={form.businessStage} onChange={update}><option value="">Select a stage</option><option value="starting">Starting or clarifying</option><option value="growing">Growing</option><option value="established">Established</option><option value="transitioning">Transitioning</option></select></Field>
                  </div>
                  <Field label="Website"><input className="input bg-mistWhite" name="website" value={form.website} onChange={update} placeholder="https://" inputMode="url" /></Field>
                  <Field label="LinkedIn profile"><input className="input bg-mistWhite" name="linkedInProfile" value={form.linkedInProfile} onChange={update} placeholder="https://linkedin.com/in/..." inputMode="url" /></Field>
                  <Field label="What is the credibility challenge you are facing?"><textarea className="input min-h-32 resize-y bg-mistWhite" name="primaryChallenge" value={form.primaryChallenge} onChange={update} required /></Field>
                  <Field label="What would you like to be different after this work?"><textarea className="input min-h-32 resize-y bg-mistWhite" name="desiredOutcome" value={form.desiredOutcome} onChange={update} required /></Field>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5">
                  <Field label="Why is this important now?"><textarea className="input min-h-32 resize-y bg-mistWhite" name="whyNow" value={form.whyNow} onChange={update} required /></Field>
                  <Field label="What kind of support would be most useful?"><textarea className="input min-h-28 resize-y bg-mistWhite" name="supportNeeded" value={form.supportNeeded} onChange={update} /></Field>
                  <Field label="Your readiness"><select className="input bg-mistWhite" name="readinessToInvest" value={form.readinessToInvest} onChange={update}><option value="">Select an option</option><option value="learning">I am learning and clarifying my options</option><option value="ready">I am ready for a focused next step</option><option value="ready_for_strategic_support">I am ready for strategic support</option></select></Field>
                  <label className="flex gap-3 border border-sage bg-mistWhite p-4 text-sm leading-6 text-charcoal/74">
                    <input type="checkbox" name="consent" checked={form.consent} onChange={update} className="mt-1 size-4 shrink-0 accent-deepEmerald" />
                    <span>I agree that my details can be used to respond to this application.</span>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-sage pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => { setError(""); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0} className="inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-extrabold text-charcoal/64 transition hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
              {step < steps.length - 1 ? (
                <button type="button" onClick={next} className="inline-flex items-center justify-center gap-2 border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite shadow-[0_12px_28px_rgba(11,110,79,0.18)] transition hover:border-charcoal hover:bg-charcoal">Continue <ArrowRight size={16} aria-hidden="true" /></button>
              ) : (
                <button type="submit" disabled={submitting || !catalogueReady} className="inline-flex items-center justify-center gap-2 border border-charcoal bg-charcoal px-5 py-3 text-sm font-extrabold text-mutedMint shadow-[0_12px_28px_rgba(34,34,34,0.16)] transition hover:bg-deepEmerald hover:text-mistWhite disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : "Send application"}
                  {!submitting && <ArrowRight size={16} aria-hidden="true" />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
