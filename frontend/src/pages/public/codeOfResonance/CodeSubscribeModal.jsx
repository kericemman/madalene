import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, X } from "lucide-react";
import { subscribeToNewsletter } from "../../../services/api.js";

export default function CodeSubscribeModal({
  open,
  onClose,
  source = "code_of_resonance",
  title = "Subscribe to The Code of Resonance"
}) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const handleChange = (event) => {
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
        source,
        consentVersion: "2026-07"
      });
      setStatus("success");
      setMessage(response.message || "You are subscribed.");
      setForm({ name: "", email: "" });
    } catch (requestError) {
      setStatus("error");
      setMessage(requestError.response?.data?.message || "Could not subscribe right now.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-charcoal/72 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={onClose}
    >
      <div className="flex h-full items-end justify-center sm:items-center">
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded border border-sage bg-mistWhite text-charcoal shadow-[0_28px_70px_rgba(0,0,0,0.26)] sm:max-h-[calc(100dvh-4rem)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-mutedMint px-3 py-1 text-xs font-extrabold uppercase leading-tight tracking-[0.12em] text-deepEmerald">
                  <Mail size={14} aria-hidden="true" />
                  <span className="min-w-0 break-words">The Code of Resonance</span>
                </p>
                <h2 className="mt-4 break-words font-serif text-2xl leading-tight sm:text-3xl">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-charcoal/66">
                  Receive a 6-day trust-building sequence, followed by credibility reflections and practical resources.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-grid size-10 shrink-0 place-items-center rounded-full border border-charcoal/10 text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
                aria-label="Close subscription modal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-extrabold">Name</span>
                <input
                  className="input bg-white"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold">Email</span>
                <input
                  className="input bg-white"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>

            {message && (
              <div
                className={`mt-5 flex gap-3 rounded border p-4 text-sm font-semibold ${
                  status === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
                }`}
              >
                {status === "error" ? (
                  <AlertCircle className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
                )}
                <p>{message}</p>
              </div>
            )}
          </div>

          <div className="grid shrink-0 gap-2 border-t border-sage bg-mistWhite p-3 sm:flex sm:items-center sm:justify-end sm:gap-3 sm:p-4">
            <button
              type="button"
              onClick={onClose}
              className="order-2 inline-flex items-center justify-center rounded-full border border-charcoal/15 px-5 py-3 text-sm font-extrabold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="order-1 inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
            >
              {status === "loading" ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Mail size={16} aria-hidden="true" />}
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
