import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postContactMessage } from "../../services/api.js";
import SiteButton from "../../components/SiteButton.jsx";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  profession: z.string().optional(),
  reason: z.string().optional(),
  message: z.string().min(10, "Please share a few lines to give context."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to submit." })
  })
});

const reasons = [
  { value: "assessment", label: "Assessment & Results Discussion" },
  { value: "offer", label: "Offer & Strategic Positioning" },
  { value: "booking", label: "Advisory Booking & Retainers" },
  { value: "collaboration", label: "Partnership or Speaking" }
];

const contactNotes = [
  {
    icon: ShieldCheck,
    title: "Fit before pressure",
    text: "Share what feels unclear about your positioning, authority, or messaging."
  },
  {
    icon: MessageSquareText,
    title: "Context over brevity",
    text: "A few honest lines about your current stage help shape a tailored reply."
  },
  {
    icon: Clock,
    title: "Considered response",
    text: "Enquiries are reviewed directly. Expect a thoughtful response within 48 hours."
  }
];

export default function ContactPage() {
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      reason: "",
      message: "",
      consent: false
    }
  });

  const onSubmit = async (values) => {
    setStatus({ type: "idle", message: "" });
    try {
      const response = await postContactMessage(values);
      reset();
      setStatus({
        type: "success",
        message: response.message || "Your message has been received. I will be in touch shortly."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to send message right now. Please try again shortly."
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-charcoal">
      {/* Editorial Header */}
      <section className="border-b border-sage/50 bg-white/70 backdrop-blur-sm py-12 sm:py-16 lg:py-20">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-deepEmerald">
              Direct Enquiry
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-charcoal leading-[1.15] text-balance">
              Start with the conversation that brings strategic clarity.
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-charcoal/70 max-w-2xl">
              Whether you are uncovering your core credibility narrative, aligning your brand, or exploring advisory work, reach out below.
            </p>
          </div>

          {/* Value Micro-Cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {contactNotes.map((note) => {
              const Icon = note.icon;
              return (
                <div
                  key={note.title}
                  className="rounded-2xl border border-sage/60 bg-white/60 p-5 backdrop-blur-sm shadow-sm"
                >
                  <Icon className="text-deepEmerald" size={20} aria-hidden="true" />
                  <h3 className="mt-3 font-serif text-lg font-bold text-charcoal">{note.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-charcoal/65">{note.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Form & Guidance Split View */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-start">
            
            {/* Direct Form Surface */}
            <div className="rounded-3xl border border-sage/70 bg-white p-6 sm:p-10 shadow-[0_20px_60px_rgba(26,26,26,0.04)]">
              <div className="border-b border-sage/40 pb-6 mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-deepEmerald">
                  Send a Message
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  Tell me what you are working to clarify.
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Your Name" error={errors.name?.message} required>
                    <input
                      className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Eleanor Vance"
                      {...register("name")}
                    />
                  </Field>

                  <Field label="Email Address" error={errors.email?.message} required>
                    <input
                      className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                      type="email"
                      autoComplete="email"
                      placeholder="eleanor@domain.com"
                      {...register("email")}
                    />
                  </Field>

                  <Field label="Role or Profession" error={errors.profession?.message}>
                    <input
                      className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Founder, advisory partner, clinician..."
                      {...register("profession")}
                    />
                  </Field>

                  <Field label="Focus of Conversation" error={errors.reason?.message}>
                    <select
                      className="input w-full rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm py-3"
                      {...register("reason")}
                    >
                      <option value="">Select an area</option>
                      {reasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Context & Objectives" error={errors.message?.message} required>
                  <textarea
                    className="input w-full min-h-[160px] rounded-xl border-sage/80 focus:border-deepEmerald focus:ring-1 focus:ring-deepEmerald text-sm p-4 resize-y leading-relaxed"
                    placeholder="Where are you in your positioning? What feels unclear about how your authority is perceived?"
                    {...register("message")}
                  />
                </Field>

                {/* Consent Checkbox */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 rounded border-sage text-deepEmerald focus:ring-0 cursor-pointer"
                      {...register("consent")}
                    />
                    <span className="text-xs text-charcoal/70 leading-relaxed">
                      I consent to receiving a direct response regarding this enquiry.
                    </span>
                  </label>
                  {errors.consent?.message && (
                    <p className="text-xs font-semibold text-red-600 pl-7">{errors.consent.message}</p>
                  )}
                </div>

                {/* Status Messages */}
                {status.type === "success" && (
                  <div className="flex items-start gap-3 rounded-xl bg-mutedMint/50 border border-mutedMint p-4 text-xs font-semibold text-charcoal">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={17} />
                    <span>{status.message}</span>
                  </div>
                )}

                {status.type === "error" && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                    <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={17} />
                    <span>{status.message}</span>
                  </div>
                )}

                {/* Submission CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-deepEmerald px-8 py-3.5 text-xs font-bold text-mistWhite transition-all hover:bg-charcoal hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={15} aria-hidden="true" />
                  {isSubmitting ? "Delivering..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Strategic Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-8">
              <div className="rounded-3xl border border-sage/80 bg-white p-7 shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-deepEmerald">
                  <Sparkles size={15} />
                  <span>Guidance</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal leading-snug">
                  What makes an enquiry productive?
                </h3>
                <p className="text-xs leading-relaxed text-charcoal/65">
                  The clearest positioning work begins by identifying current misalignments:
                </p>

                <ul className="space-y-3 pt-2 text-xs text-charcoal/75 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-deepEmerald shrink-0" />
                    <span>What you want to be sought out for vs. what you are hired for now.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-deepEmerald shrink-0" />
                    <span>Where your credibility feels obscured or misunderstood.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-deepEmerald shrink-0" />
                    <span>Whether you need high-touch advisory or strategic asset review.</span>
                  </li>
                </ul>
              </div>

              {/* Assessment Alternate Path */}
              <div className="rounded-3xl border border-charcoal/10 bg-white p-7 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/45">
                  Prefer a Structured Baseline?
                </span>
                <h4 className="mt-1.5 font-serif text-lg font-bold text-charcoal">
                  Take the Earned Credibility Diagnostic
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
                  Assess your positioning signals across visibility, message clarity, and authority before reaching out.
                </p>
                <div className="mt-5">
                  <SiteButton
                    to="/assessment"
                    variant="lightSecondary"
                    className="w-full justify-between text-xs py-2.5"
                  >
                    <span>Start Diagnostic</span>
                    <ArrowRight size={14} />
                  </SiteButton>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, required = false, children, className = "" }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="flex items-center gap-1 text-xs font-bold text-charcoal/80">
        {label}
        {required && <span className="text-deepEmerald">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}