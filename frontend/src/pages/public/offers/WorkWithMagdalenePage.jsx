import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicOffers } from "../../../services/api.js";
import { fallbackOffers, getOfferPath, mergeOffer, offerContent } from "./offerContent.js";

export default function WorkWithMagdalenePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [offers, setOffers] = useState(fallbackOffers);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let live = true;
    listPublicOffers()
      .then((response) => {
        const publicOffers = response.data.offers || [];
        const savedOffers = new Map(
          publicOffers
            .filter((item) => offerContent[item.slug])
            .map((item) => [item.slug, mergeOffer(item)])
        );
        if (!savedOffers.size) throw new Error("No current offers");
        if (live) {
          setOffers(fallbackOffers.map((fallback) => savedOffers.get(fallback.slug) || fallback));
        }
      })
      .catch(() => {
        if (live) setNotice("The offer details below are being refreshed. You can still explore each engagement.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-charcoal selection:bg-mutedMint/60">
      
      {/* 1. Cinematic Studio Header */}
      <header className="relative bg-charcoal text-mistWhite pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,rgba(184,216,197,0.25),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-mutedMint/30 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-mutedMint">
              <Sparkles size={14} />
              <span>Advisory Engagements</span>
            </div>

            <h1 className="mt-6 font-serif text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              Three deliberate pathways to make your earned credibility visible.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-mistWhite/75 font-serif italic">
              "You don't need a louder megaphone. You need structural positioning that makes your expertise self-evident to the right clients."
            </p>
          </div>
        </div>
      </header>

      {/* 2. Offers Matrix Section */}
      <section className="py-8 sm:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b border-sage/60 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Choose Your Next Move</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Engagements designed for your current positioning stage.
              </h2>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs font-bold text-deepEmerald">
                <Loader2 className="animate-spin" size={15} />
                <span>Syncing live offerings...</span>
              </div>
            )}
          </div>

          {notice && (
            <div className="mb-8 rounded-xl border border-sage bg-white p-4 text-xs font-semibold text-charcoal/70 shadow-sm">
              {notice}
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid gap-8 lg:grid-cols-3 items-stretch">
            {offers.map((offer) => {
              const isFeatured = Boolean(offer.featured);
              return (
                <article
                  key={offer.slug}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-4 sm:p-8 transition-all duration-300 ${
                    isFeatured
                      ? "border-deepEmerald bg-deepEmerald text-mistWhite shadow-xl lg:-translate-y-2"
                      : "border-sage/80 bg-white text-charcoal shadow-sm hover:border-deepEmerald hover:shadow-md"
                  }`}
                >
                  <div>
                    {/* Top Row: Number & Phase */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <span className={`font-serif text-4xl font-bold ${isFeatured ? "text-mutedMint" : "text-deepEmerald"}`}>
                        {offer.number}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                        isFeatured ? "bg-white/10 text-mutedMint" : "bg-sage/40 text-deepEmerald"
                      }`}>
                        {offer.phase}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-6">
                      <h3 className={`font-serif text-2xl sm:text-3xl font-bold leading-snug ${isFeatured ? "text-white" : "text-charcoal"}`}>
                        {offer.name}
                      </h3>
                      <p className={`mt-4 text-sm sm:text-base leading-relaxed ${isFeatured ? "text-mistWhite/80" : "text-charcoal/70"}`}>
                        {offer.description}
                      </p>
                    </div>

                    {/* Best For Context Note */}
                    <div className={`mt-6 rounded-2xl p-4 text-xs leading-relaxed ${isFeatured ? "bg-white/5 border border-white/10 text-mistWhite/85" : "bg-[#FAF9F6] border border-sage/50 text-charcoal/75"}`}>
                      <span className="font-bold uppercase tracking-wider text-[10px] block opacity-70 mb-1">Ideal Context</span>
                      {offer.bestFor}
                    </div>
                  </div>

                  {/* Bottom Link Action */}
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <Link
                      to={getOfferPath(offer.slug)}
                      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all group-hover:translate-x-1 ${
                        isFeatured ? "text-mutedMint hover:text-white" : "text-deepEmerald hover:text-charcoal"
                      }`}
                    >
                      <span>Learn More</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Bottom Guidance Closer */}
      <section className="border-t border-sage/60 bg-white py-14 sm:py-20">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6">
          <div className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-8 sm:p-12 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Unsure Where to Begin?</span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Let your diagnostic result guide your next step.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-charcoal/65 leading-relaxed">
                Take the 7-minute Earned Credibility Assessment to pinpoint your exact positioning gaps and receive personalized advisory recommendations.
              </p>
            </div>

            <SiteButton to="/assessment" variant="blackGreen" className="px-7 py-3.5 text-xs font-bold shrink-0 shadow-md">
              <span>Take the Assessment</span>
              <ArrowRight size={15} />
            </SiteButton>
          </div>
        </div>
      </section>

    </main>
  );
}