import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { listPublicReviews } from "../../../services/api.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const ratingStars = (rating = 5) => Array.from({ length: Math.max(Math.min(Number(rating) || 5, 5), 1) });

export default function ProofSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    listPublicReviews({ limit: 3 })
      .then((response) => {
        if (!active) return;
        setReviews(response.data.reviews || []);
      })
      .catch(() => {
        if (!active) return;
        setReviews([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="border-y border-sage bg-sage/40 py-16 sm:py-20 lg:py-28">
      <div className="container-shell">
        <div className="max-w-3xl">
          <SectionEyebrow>Latest Proof</SectionEyebrow>
          <h2 className="font-serif text-4xl leading-tight text-balance sm:text-5xl lg:text-6xl">
            You do not have to take my word for it.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review, index) => (
            <article
              key={review._id || `${review.name}-${review.createdAt}`}
              className="flex min-h-[420px] flex-col border border-sage bg-mistWhite shadow-[0_16px_36px_rgba(34,34,34,0.05)]"
            >
              <div className="flex items-center justify-between bg-charcoal px-5 py-4 text-mistWhite">
                <p className="font-serif text-3xl text-mutedMint">0{index + 1}</p>
                <Quote className="text-mutedMint" size={24} aria-hidden="true" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-1 text-deepEmerald" aria-label={`${review.rating || 5} star review`}>
                  {ratingStars(review.rating).map((_, starIndex) => (
                    <Star key={starIndex} size={15} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>

                {review.headline && (
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-charcoal text-balance">
                    {review.headline}
                  </h3>
                )}

                <p className="mt-4 text-lg leading-8 text-charcoal">
                  "{review.review}"
                </p>

                <div className="mt-auto border-t border-sage pt-5">
                  <p className="font-semibold">{review.name}</p>
                  {review.role && <p className="text-sm text-charcoal/70">{review.role}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
