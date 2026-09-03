import { useEffect, useState } from "react";
import { CheckCircle2, ImagePlus, Send, ShieldCheck, Star, X } from "lucide-react";
import { submitReview } from "../../services/api.js";

const initialForm = {
  name: "",
  email: "",
  role: "",
  review: "",
  rating: 5,
  image: null,
  consent: false
};

const ratings = [5, 4, 3, 2, 1];
const maxImageSizeMb = 8;

export default function TestimonialRequestPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(form.image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const updateImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > maxImageSizeMb * 1024 * 1024) {
      setError(`Please choose an image under ${maxImageSizeMb}MB.`);
      return;
    }

    setError("");
    setForm((current) => ({
      ...current,
      image: file
    }));
  };

  const removeImage = () => {
    setForm((current) => ({
      ...current,
      image: null
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await submitReview({
        ...form,
        rating: Number(form.rating),
        source: "testimonial_request_link"
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not submit your review right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-mistWhite py-14 sm:py-20 lg:py-24">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <aside className="border border-charcoal bg-charcoal p-6 text-mistWhite shadow-[0_24px_58px_rgba(26,26,26,0.16)] sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
            Testimonial Request
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-balance sm:text-5xl">
            Share your experience with Magdalene.
          </h1>
          <p className="mt-5 text-base leading-7 text-mistWhite/72">
            Thank you for taking a few minutes to share what changed for you. Your response will be
            reviewed by admin before anything appears publicly.
          </p>
          <div className="mt-7 space-y-4 border-t border-mistWhite/14 pt-6">
            {[
              "What changed through the work?",
              "What felt most valuable about the experience?",
              "What would you want someone considering this work to know?"
            ].map((prompt) => (
              <p key={prompt} className="flex gap-3 text-sm leading-6 text-mistWhite/76">
                <CheckCircle2 className="mt-0.5 shrink-0 text-mutedMint" size={17} aria-hidden="true" />
                <span>{prompt}</span>
              </p>
            ))}
          </div>
        </aside>

        <section className="border border-sage bg-white shadow-[0_22px_50px_rgba(26,26,26,0.06)]">
          <div className="border-b border-sage bg-mistWhite px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-deepEmerald" size={22} aria-hidden="true" />
              <div>
                <h2 className="font-serif text-3xl leading-tight text-charcoal">
                  Client testimonial form
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/66">
                  This page is unlisted. Magdalene shares this link directly with clients when she
                  is requesting testimonials.
                </p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="px-5 py-12 text-center sm:px-7">
              <CheckCircle2 className="mx-auto text-deepEmerald" size={44} aria-hidden="true" />
              <h2 className="mt-4 font-serif text-4xl leading-tight">Thank you.</h2>
              <p className="mx-auto mt-3 max-w-md text-lg leading-8 text-charcoal/70">
                Your testimonial has been received and is waiting for admin approval.
              </p>
            </div>
          ) : (
            <form className="grid gap-5 px-5 py-6 sm:px-7" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input className="input bg-white" name="name" value={form.name} onChange={updateField} required />
                </Field>
                <Field label="Email">
                  <input className="input bg-white" type="email" name="email" value={form.email} onChange={updateField} required />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
                <Field label="Role or profession">
                  <input className="input bg-white" name="role" value={form.role} onChange={updateField} placeholder="Wellness practitioner" />
                </Field>
                <Field label="Rating">
                  <select className="input bg-white" name="rating" value={form.rating} onChange={updateField}>
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} stars
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Full testimonial">
                <textarea className="input min-h-36 resize-y bg-white" name="review" value={form.review} onChange={updateField} required placeholder="Share the experience in your own words." />
              </Field>

              <div className="grid gap-2 text-sm font-semibold">
                <span>Image upload optional</span>
                <div className="grid gap-4 border border-sage bg-mistWhite p-4 sm:grid-cols-[128px_1fr] sm:items-center">
                  <div className="flex aspect-square items-center justify-center overflow-hidden border border-sage bg-white">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Selected testimonial upload preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="text-deepEmerald" size={30} aria-hidden="true" />
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <p className="text-base font-bold text-charcoal">Add a client photo or brand image.</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-charcoal/62">
                        JPG, PNG, WebP, AVIF, or GIF. Keep it under {maxImageSizeMb}MB.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-4 py-2.5 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-deepEmerald">
                        <ImagePlus size={16} aria-hidden="true" />
                        {form.image ? "Change image" : "Upload image"}
                        <input className="sr-only" type="file" accept="image/*" onChange={updateImage} />
                      </label>
                      {form.image && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-sage bg-white px-4 py-2.5 text-sm font-bold text-charcoal transition hover:border-charcoal"
                        >
                          <X size={16} aria-hidden="true" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex gap-3 border border-sage bg-mistWhite px-4 py-3 text-sm leading-6 text-charcoal/72">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={updateField}
                  required
                  className="mt-1 size-4 accent-deepEmerald"
                />
                <span>I consent to my name, role, rating, testimonial, and uploaded image if provided being displayed publicly after approval.</span>
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
                  {submitting ? "Submitting..." : "Submit testimonial"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
