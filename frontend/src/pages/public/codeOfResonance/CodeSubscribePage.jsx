import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { subscribeToNewsletter } from "../../../services/api.js";
import { magnificImages } from "../home/homeContent.js";

const fieldNotes = [
  "Positioning prompts for clarifying the credibility you have already earned.",
  "Trust-building notes that connect story, proof, and authority.",
  "Practical resources you can use when your message needs more resonance."
];

const trustNotes = [
  "No spam.",
  "Unsubscribe any time.",
  "Built for thoughtful experts."
];

export default function CodeSubscribePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await subscribeToNewsletter({
        ...form,
        source: "code_of_resonance_subscribe_page",
        consentVersion: "2026-07"
      });

      setStatus("success");
      setMessage(response.message || "You are subscribed to The Code of Resonance.");
      setForm({ name: "", email: "" });
    } catch (requestError) {
      setStatus("error");
      setMessage(requestError.response?.data?.message || "Could not subscribe right now. Please try again.");
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] py-8 text-charcoal sm:py-10 lg:py-15">
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(135deg,#0F4D3E_0%,#1A1A1A_58%,#B8D8C5_140%)]" aria-hidden="true" />

      <div className="container-shell relative z-10 mx-auto max-w-7xl px-1 sm:px-4 lg:px-6">
        <div className="grid overflow-hidden rounded-3xl border border-mistWhite/15 bg-white shadow-[0_28px_80px_rgba(26,26,26,0.14)] lg:min-h-[680px] lg:grid-cols-[0.96fr_1.04fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[linear-gradient(135deg,#0F4D3E_0%,#173B32_40%,#1A1A1A_100%)] text-mistWhite sm:min-h-[440px] lg:min-h-full">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(184,216,197,0.34)_0%,rgba(184,216,197,0)_31%),radial-gradient(circle_at_84%_16%,rgba(247,248,246,0.16)_0%,rgba(247,248,246,0)_26%),linear-gradient(145deg,rgba(15,77,62,0.96)_0%,rgba(26,26,26,0.24)_52%,rgba(26,26,26,0.92)_100%)]"
              aria-hidden="true"
            />
            <img
              src={magnificImages.emailSubscribe.src}
              alt={magnificImages.emailSubscribe.alt}
              loading="eager"
              className="absolute inset-0 h-full w-full object-contain opacity-[0.88] mix-blend-soft-light sm:mix-blend-normal sm:opacity-90 lg:opacity-[0.88]"
              style={{ objectPosition: magnificImages.emailSubscribe.objectPosition }}
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,77,62,0.2)_0%,rgba(26,26,26,0.18)_30%,rgba(26,26,26,0.94)_100%)] lg:bg-[linear-gradient(90deg,rgba(15,77,62,0.1)_0%,rgba(15,77,62,0.18)_36%,rgba(26,26,26,0.92)_100%)]"
              aria-hidden="true"
            />

            <div className="relative flex h-full flex-col justify-between p-2 sm:p-4 lg:p-6">
              <Link
                to="/code-of-resonance"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-mutedMint/35 bg-charcoal/55 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-mutedMint backdrop-blur transition hover:border-mutedMint hover:bg-charcoal"
              >
                <BookOpenText size={15} aria-hidden="true" />
                The Code of Resonance
              </Link>

              <div className="max-w-xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
                  Email Publication
                </p>
                <h1 className="mt-4 font-serif text-2xl font-bold leading-[1.08] text-white text-balance sm:text-3xl lg:text-4xl">
                  Receive new thinking on credibility, positioning, and trust.
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-mistWhite/78 sm:text-base">
                  Join Magdalene's private email publication for reflections and practical prompts that help experts make their earned credibility easier to see.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-mistWhite p-3 sm:p-6 lg:p-8">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-mutedMint/60 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">
                <Mail size={15} aria-hidden="true" />
                Join the list
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold leading-tight text-charcoal sm:text-3xl">
                Start with the trust-building sequence.
              </h2>
              <p className="mt-3 text-sm leading-7 text-charcoal/70 sm:text-base">
                You will receive the Code of Resonance welcome email, then the credibility sequence and ongoing notes when Magdalene publishes.
              </p>

              {/* <div className="mt-7 grid gap-3">
                {fieldNotes.map((note) => (
                  <div key={note} className="flex gap-3 rounded-xl border border-sage/80 bg-white p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={18} aria-hidden="true" />
                    <p className="text-sm font-semibold leading-6 text-charcoal/76">{note}</p>
                  </div>
                ))}
              </div> */}

              <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-sage bg-white p-4 shadow-[0_18px_45px_rgba(26,26,26,0.05)] sm:p-6">
                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-extrabold text-charcoal">Name</span>
                    <input
                      className="input bg-mistWhite"
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      autoComplete="name"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-extrabold text-charcoal">Email</span>
                    <input
                      className="input bg-mistWhite"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={updateField}
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                </div>

                {message && (
                  <div
                    className={`mt-5 flex gap-3 rounded-xl border p-4 text-sm font-semibold leading-6 ${
                      isSuccess
                        ? "border-deepEmerald/20 bg-mutedMint/45 text-deepEmerald"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {isSuccess ? (
                      <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                    ) : (
                      <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                    )}
                    <p>{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-deepEmerald px-6 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}
                  {isLoading ? "Subscribing..." : isSuccess ? "Subscribed" : "Subscribe to The Code"}
                </button>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal/55">
                  {trustNotes.map((note) => (
                    <span key={note} className="inline-flex items-center gap-1.5 rounded-full bg-sage/35 px-3 py-1.5">
                      <ShieldCheck size={13} className="text-deepEmerald" aria-hidden="true" />
                      {note}
                    </span>
                  ))}
                </div>
              </form>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/code-of-resonance"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-deepEmerald/25 px-5 py-2.5 text-sm font-extrabold text-deepEmerald transition hover:border-deepEmerald hover:bg-sage"
                >
                  Browse the library
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  to="/assessment"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-extrabold text-charcoal transition hover:border-charcoal hover:bg-charcoal hover:text-mistWhite"
                >
                  Take the assessment
                  <Sparkles size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
