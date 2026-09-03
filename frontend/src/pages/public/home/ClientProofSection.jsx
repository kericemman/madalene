import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { listPublicReviews } from "../../../services/api.js";
import { imageUrl, toSrcSet } from "../../../utils/cloudinaryImage.js";

const ratingStars = (rating = 5) =>
  Array.from({ length: Math.max(Math.min(Number(rating) || 5, 5), 1) });

const initialsFor = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "MW";

export default function ClientProofSection() {
  const sliderRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    listPublicReviews({ limit: 8 })
      .then((response) => {
        if (!active) return;
        setReviews(response.data?.reviews || []);
      })
      .catch(() => {
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const slideCards = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    slider.scrollBy({
      left: direction * Math.max(slider.clientWidth * 0.84, 280),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  if (!loading && reviews.length === 0) return null;

  return (
    <section id="client-proof" className="border-t border-sage/50 bg-[#FAF9F6] py-10 sm:py-18 lg:py-20">
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Earned Evidence</span>
            <h2 className="mt-1 font-serif text-xl font-bold text-charcoal sm:text-2xl lg:text-3xl text-balance">
              Reflections from practitioners who did the work.
            </h2>
          </div>

          {(loading || reviews.length > 1) && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => slideCards(-1)}
                className="grid size-11 place-items-center rounded-full border border-sage bg-white text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Show previous testimonial"
                disabled={loading}
              >
                <ArrowLeft size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => slideCards(1)}
                className="grid size-11 place-items-center rounded-full border border-charcoal bg-charcoal text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Show next testimonial"
                disabled={loading}
              >
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-44 animate-pulse rounded-2xl border border-sage/50 bg-white/50" />
            <div className="h-44 animate-pulse rounded-2xl border border-sage/50 bg-white/50" />
          </div>
        ) : (
          <div className="-mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div
              ref={sliderRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
              aria-label="Client proof testimonials"
            >
              {reviews.map((review) => {
                  const portraitSrc = imageUrl(review.image);

                  return (
                    <article
                      key={review._id || review.name}
                      className="flex min-h-[22rem] shrink-0 basis-[86%] snap-start flex-col justify-between rounded-2xl border border-sage/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(26,26,26,0.08)] sm:basis-[calc((100%-1.5rem)/2)] sm:p-7 lg:basis-[calc((100%-3rem)/3)]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-sage bg-mutedMint/35 text-sm font-extrabold text-deepEmerald">
                              {portraitSrc ? (
                                <img
                                  src={portraitSrc}
                                  srcSet={toSrcSet(review.image)}
                                  sizes="64px"
                                  alt={review.image?.altText || `${review.name} testimonial image`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span>{initialsFor(review.name)}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-charcoal">{review.name}</p>
                              {review.role && <p className="mt-0.5 text-xs text-charcoal/55">{review.role}</p>}
                            </div>
                          </div>
                          <Quote className="shrink-0 text-deepEmerald opacity-60" size={20} aria-hidden="true" />
                        </div>

                        <p className="mt-5 font-serif text-sm leading-relaxed text-charcoal/80 italic sm:text-base">
                          "{review.review}"
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-sage/40 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-deepEmerald">
                          Client Proof
                        </span>
                        <div className="flex text-deepEmerald" aria-label={`${review.rating || 5} star review`}>
                          {ratingStars(review.rating).map((_, index) => (
                            <Star key={index} size={13} fill="currentColor" aria-hidden="true" />
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
