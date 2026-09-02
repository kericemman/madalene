import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
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
      <span className="text-xs font-bold uppercase tracking-wider text-charcoal">{label}</span>
      {children}
      {hint && <span className="text-xs leading-relaxed text-charcoal/55">{hint}</span>}
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
      <main className="min-h-screen bg-[#FAF9F6] py-16 sm:py-24 text-charcoal flex items-center justify-center">
        <div className="container-shell mx-auto max-w-2xl px-4">
          <section className="overflow-hidden rounded-3xl border border-sage/80 bg-charcoal p-8 sm:p-12 text-mistWhite shadow-2xl relative">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-deepEmerald/20 blur-2xl pointer-events-none" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mutedMint/20 text-mutedMint mb-6">
              <CheckCircle2 size={28} aria-hidden="true" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">Application received</span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
              Thank you for sharing where you are.
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-mistWhite/75 font-serif">
              I will review your application for {offer.name} and follow up with the most appropriate next step.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link to="/offers" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mutedMint hover:text-white transition group">
                <span>Explore all offers</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 sm:py-20 text-charcoal">
      <div className="container-shell mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link to={getOfferPath(offerSlug)} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/70 transition hover:text-deepEmerald">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Back to {offer.name}</span>
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          
          {/* Left Sidebar Info Card */}
          <aside className="overflow-hidden rounded-3xl border border-sage/80 bg-charcoal p-8 text-mistWhite shadow-xl lg:sticky lg:top-28">
            <span className="inline-block rounded-full bg-mutedMint/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-mutedMint mb-3">
              {offer.phase}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-snug text-white">
              {offer.formTitle}
            </h1>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-mistWhite/75">
              {offer.formDescription}
            </p>
            
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6">
              {steps.map((label, index) => {
                const isActive = index === step;
                const isCompleted = index < step;
                return (
                  <div key={label} className={`flex items-center gap-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? "text-mutedMint" : isCompleted ? "text-white" : "text-white/40"}`}>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${isActive ? "border-mutedMint bg-mutedMint/10 text-mutedMint" : isCompleted ? "border-white bg-white text-charcoal" : "border-white/20 text-white/40"}`}>
                      {index + 1}
                    </span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Form Card */}
          <form onSubmit={submit} className="overflow-hidden rounded-3xl border border-sage/80 bg-white p-8 sm:p-10 shadow-xl">
            <div className="flex items-center justify-between border-b border-sage/60 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-deepEmerald">
                  Step {step + 1} of {steps.length}
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  {steps[step]}
                </h2>
              </div>
              <div className="flex gap-1.5 lg:hidden" aria-label={`Step ${step + 1} of ${steps.length}`}>
                {steps.map((label, index) => (
                  <span key={label} className={`h-1.5 w-6 rounded-full ${index <= step ? "bg-deepEmerald" : "bg-sage/50"}`} />
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8">
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" required />
                  </Field>
                  <Field label="Last name">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" />
                  </Field>
                  <Field label="Email">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" type="email" name="email" value={form.email} onChange={update} autoComplete="email" required />
                  </Field>
                  <Field label="Phone">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="phone" value={form.phone} onChange={update} autoComplete="tel" />
                  </Field>
                  <Field label="Profession">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="profession" value={form.profession} onChange={update} placeholder="Coach, clinician, founder..." />
                  </Field>
                  <Field label="Country">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="country" value={form.country} onChange={update} autoComplete="country-name" />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Field or industry">
                      <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="industry" value={form.industry} onChange={update} />
                    </Field>
                    <Field label="Business stage">
                      <select className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="businessStage" value={form.businessStage} onChange={update}>
                        <option value="">Select a stage</option>
                        <option value="starting">Starting or clarifying</option>
                        <option value="growing">Growing</option>
                        <option value="established">Established</option>
                        <option value="transitioning">Transitioning</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Website">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="website" value={form.website} onChange={update} placeholder="https://" inputMode="url" />
                  </Field>
                  <Field label="LinkedIn profile">
                    <input className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="linkedInProfile" value={form.linkedInProfile} onChange={update} placeholder="https://linkedin.com/in/..." inputMode="url" />
                  </Field>
                  <Field label="What is the credibility challenge you are facing?">
                    <textarea className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] p-4 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none min-h-[120px] resize-y" name="primaryChallenge" value={form.primaryChallenge} onChange={update} required />
                  </Field>
                  <Field label="What would you like to be different after this work?">
                    <textarea className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] p-4 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none min-h-[120px] resize-y" name="desiredOutcome" value={form.desiredOutcome} onChange={update} required />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5">
                  <Field label="Why is this important now?">
                    <textarea className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] p-4 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none min-h-[120px] resize-y" name="whyNow" value={form.whyNow} onChange={update} required />
                  </Field>
                  <Field label="What kind of support would be most useful?">
                    <textarea className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] p-4 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none min-h-[100px] resize-y" name="supportNeeded" value={form.supportNeeded} onChange={update} />
                  </Field>
                  <Field label="Your readiness">
                    <select className="w-full rounded-2xl border border-sage/70 bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-charcoal focus:border-deepEmerald focus:outline-none" name="readinessToInvest" value={form.readinessToInvest} onChange={update}>
                      <option value="">Select an option</option>
                      <option value="learning">I am learning and clarifying my options</option>
                      <option value="ready">I am ready for a focused next step</option>
                      <option value="ready_for_strategic_support">I am ready for strategic support</option>
                    </select>
                  </Field>
                  <label className="flex gap-3 rounded-2xl border border-sage/60 bg-[#FAF9F6] p-4 text-xs leading-relaxed text-charcoal/75">
                    <input type="checkbox" name="consent" checked={form.consent} onChange={update} className="mt-0.5 size-4 shrink-0 accent-deepEmerald rounded" />
                    <span>I agree that my details can be used to respond to this application.</span>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-sage/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => { setError(""); setStep((current) => Math.max(0, current - 1)); }}
                disabled={step === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-charcoal/60 transition hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                <span>Back</span>
              </button>
              
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-6 py-3.5 text-xs font-bold text-mistWhite transition hover:bg-charcoal shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || !catalogueReady}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-xs font-bold text-mistWhite transition hover:bg-deepEmerald shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={15} aria-hidden="true" /> : <span>Send application</span>}
                  {!submitting && <ArrowRight size={15} aria-hidden="true" />}
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}