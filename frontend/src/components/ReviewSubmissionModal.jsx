import { useEffect, useState } from "react";
import { CheckCircle2, Send, Star, X } from "lucide-react";
import { submitReview } from "../services/api.js";

const initialForm = {
  name: "",
  email: "",
  role: "",
  headline: "",
  before: "",
  after: "",
  review: "",
  rating: 5,
  consent: false
};

export default function ReviewSubmissionModal({ open, onClose, onSubmitted }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setSubmitted(false);
  }, [open]);

  if (!open) return null;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await submitReview({
        ...form,
        rating: Number(form.rating),
        source: "about_page_review_modal"
      });
      setSubmitted(true);
      setForm(initialForm);
      onSubmitted?.(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not submit your review right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/72 px-4 py-6 backdrop-blur-sm sm:py-10">
      <div className="mx-auto max-w-3xl border border-sage bg-mistWhite text-charcoal shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between gap-5 border-b border-sage px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
              Share your review
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">
              Tell others what changed.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-sage bg-white text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
            aria-label="Close review form"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-10 text-center sm:px-7">
            <CheckCircle2 className="mx-auto text-deepEmerald" size={42} aria-hidden="true" />
            <h3 className="mt-4 font-serif text-4xl leading-tight">Thank you.</h3>
            <p className="mx-auto mt-3 max-w-md text-lg leading-8 text-charcoal/70">
              Your review has been received. It will appear publicly after admin approval.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center justify-center rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
            >
              Close
            </button>
          </div>
        ) : (
          <form className="grid gap-5 px-5 py-6 sm:px-7" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Name
                <input className="input bg-white" name="name" value={form.name} onChange={updateField} required />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input className="input bg-white" type="email" name="email" value={form.email} onChange={updateField} required />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
              <label className="grid gap-2 text-sm font-semibold">
                Role or profession
                <input className="input bg-white" name="role" value={form.role} onChange={updateField} placeholder="Wellness practitioner" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Rating
                <select className="input bg-white" name="rating" value={form.rating} onChange={updateField}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} stars
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              Short headline
              <input className="input bg-white" name="headline" value={form.headline} onChange={updateField} placeholder="What changed in one sentence?" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Before
                <textarea className="input min-h-28 resize-y bg-white" name="before" value={form.before} onChange={updateField} placeholder="What felt unclear before?" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                After
                <textarea className="input min-h-28 resize-y bg-white" name="after" value={form.after} onChange={updateField} placeholder="What became clearer after?" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              Full review
              <textarea className="input min-h-36 resize-y bg-white" name="review" value={form.review} onChange={updateField} required placeholder="Share the experience in your own words." />
            </label>

            <label className="flex gap-3 text-sm leading-6 text-charcoal/72">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={updateField}
                required
                className="mt-1 size-4 accent-deepEmerald"
              />
              <span>I consent to my name, role, rating, and review being displayed publicly.</span>
            </label>

            {error && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-sage pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1 text-deepEmerald" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Send size={16} aria-hidden="true" />
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
