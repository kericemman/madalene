import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postContactMessage } from "../../services/api.js";
import SiteButton from "../../components/SiteButton.jsx";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  profession: z.string().optional(),
  reason: z.string().optional(),
  message: z.string().min(10, "Tell us a little more."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required." })
  })
});

const reasons = [
  { value: "assessment", label: "Assessment or results" },
  { value: "offer", label: "Offer or package" },
  { value: "booking", label: "Booking or availability" },
  { value: "collaboration", label: "Collaboration" }
];

const contactNotes = [
  {
    icon: ShieldCheck,
    title: "Fit before pressure",
    text: "Share what feels unclear about your credibility, positioning, or next step."
  },
  {
    icon: MessageSquareText,
    title: "Context helps",
    text: "A few honest lines about where you are now will help me respond with care."
  },
  {
    icon: Clock,
    title: "Clear next step",
    text: "You will receive a confirmation email and your enquiry will be reviewed."
  }
];

export default function ContactPage() {
  const [formOpen, setFormOpen] = useState(false);
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
        message: response.message || "Your message has been received."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Your message could not be sent right now. Please try again."
      });
    }
  };

  const openForm = () => {
    setStatus({ type: "idle", message: "" });
    setFormOpen(true);
  };

  useEffect(() => {
    if (!formOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setFormOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [formOpen]);

  return (
    <main className="bg-mistWhite">
      <section className="border-b border-sage bg-white py-14 sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-deepEmerald">
              <span className="h-px w-8 bg-deepEmerald" aria-hidden="true" />
              Contact
            </p>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight text-balance sm:text-5xl lg:text-6xl">
              Start with the conversation that makes the next step clearer.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/72">
              I'm here to help you navigate your journey and provide the support you need.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openForm}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite shadow-[0_12px_28px_rgba(11,110,79,0.18)] transition hover:border-charcoal hover:bg-charcoal"
              >
                Write a message
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <SiteButton to="/assessment" variant="lightSecondary" className="w-full sm:w-auto">
                Start the assessment first
              </SiteButton>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {contactNotes.map((note) => {
              const Icon = note.icon;
              return (
                <article key={note.title} className="border border-sage bg-mistWhite p-5 shadow-[0_14px_30px_rgba(34,34,34,0.04)]">
                  <Icon className="text-deepEmerald" size={22} aria-hidden="true" />
                  <h2 className="mt-4 font-serif text-2xl leading-tight">{note.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{note.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="border border-charcoal bg-charcoal p-6 text-mistWhite shadow-[0_24px_58px_rgba(34,34,34,0.16)]">
            <Sparkles className="text-mutedMint" size={24} aria-hidden="true" />
            <h2 className="mt-5 font-serif text-3xl leading-tight">Before you send</h2>
            <p className="mt-4 text-sm leading-7 text-mistWhite/70">
              The most useful messages name where you are now, what you are trying to become known
              for, and what feels unclear about how people currently understand your value.
            </p>
            <div className="mt-7 space-y-4 border-t border-mistWhite/14 pt-6">
              {[
                "What kind of work do you do?",
                "What credibility challenge are you noticing?",
                "What would a helpful next step look like?"
              ].map((prompt) => (
                <p key={prompt} className="flex gap-3 text-sm leading-6 text-mistWhite/76">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-mutedMint" size={17} aria-hidden="true" />
                  <span>{prompt}</span>
                </p>
              ))}
            </div>
          </aside>

          <div className="border border-sage bg-white p-6 shadow-[0_22px_50px_rgba(34,34,34,0.06)] sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
              Send an enquiry
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-charcoal text-balance">
              Tell me what you are building when you are ready.
            </h2>
            
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Assessment questions", "Offer enquiries", "Booking requests", "Collaborations"].map((item) => (
                <p key={item} className="flex gap-3 border border-sage bg-mistWhite px-4 py-3 text-sm font-semibold text-charcoal/72">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={17} aria-hidden="true" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={openForm}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite shadow-[0_12px_28px_rgba(11,110,79,0.18)] transition hover:border-charcoal hover:bg-charcoal sm:w-auto"
            >
              Write a message
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {formOpen && (
        <ContactFormModal
          errors={errors}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onClose={() => setFormOpen(false)}
          onSubmit={onSubmit}
          register={register}
          status={status}
        />
      )}
    </main>
  );
}

function ContactFormModal({
  errors,
  handleSubmit,
  isSubmitting,
  onClose,
  onSubmit,
  register,
  status
}) {
  return (
    <div className="fixed inset-0 z-50 grid min-h-dvh place-items-center overflow-y-auto bg-charcoal/72 px-4 py-6 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close contact form"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative w-full max-w-3xl overflow-hidden border border-sage bg-white shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-sage bg-mistWhite px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
              Send an enquiry
            </p>
            <h2 id="contact-modal-title" className="mt-2 font-serif text-3xl leading-tight text-charcoal">
              Tell me what you are building.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/62">
              A confirmation email will be sent after submission.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-sage bg-white text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
            aria-label="Close contact form"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[calc(100dvh-170px)] overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" error={errors.name?.message}>
              <input
                className="input"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                {...register("name")}
              />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
              />
            </Field>
            <Field label="Profession" error={errors.profession?.message}>
              <input
                className="input"
                type="text"
                autoComplete="organization-title"
                placeholder="Coach, clinician, founder..."
                {...register("profession")}
              />
            </Field>
            <Field label="Reason for enquiry" error={errors.reason?.message}>
              <select className="input" {...register("reason")}>
                <option value="">Select one</option>
                {reasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Message" error={errors.message?.message} className="sm:col-span-2">
              <textarea
                className="input min-h-44 resize-y"
                placeholder="Tell me what prompted you to reach out, what you need clarity on, or what kind of support you are considering."
                {...register("message")}
              />
            </Field>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex gap-3 border border-sage bg-mistWhite px-4 py-3 text-sm leading-6 text-charcoal/75">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-deepEmerald"
                {...register("consent")}
              />
              <span>I consent to being contacted about this enquiry.</span>
            </label>
            {errors.consent?.message && (
              <p className="text-sm font-semibold text-charcoal">{errors.consent.message}</p>
            )}

            {status.type === "success" && (
              <p className="flex items-start gap-3 rounded bg-mutedMint px-4 py-3 text-sm font-semibold text-charcoal">
                <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={18} aria-hidden="true" />
                <span>{status.message}</span>
              </p>
            )}

            {status.type === "error" && (
              <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite shadow-[0_12px_28px_rgba(11,110,79,0.18)] transition hover:border-charcoal hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send size={18} aria-hidden="true" />
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-extrabold text-charcoal">{label}</span>
      {children}
      {error && <span className="text-sm font-semibold text-charcoal">{error}</span>}
    </label>
  );
}
