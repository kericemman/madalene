import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { offerPreviewSlugs } from "./homeContent.js";
import { mergeOffer } from "../offers/offerContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const previews = offerPreviewSlugs.map((slug) => mergeOffer({ slug }));

const homeOfferCopy = {
  "credibility-audit": {
    name: "Credibility Clarity Audit™",
    description:
      "For the expert who knows something is being lost between the quality of their work and how others perceive it. We identify what is already working, where credibility is being lost, and what needs to change next."
  },
  "earned-credibility-intensive": {
    name: "DISCERN™ Intensive",
    description:
      "For the expert who needs sharper positioning around what makes their expertise valuable and distinct. We turn what you know about your work into positioning other people can understand and remember."
  },
  discern: {
    name: "Trusted Choice Positioning™",
    description:
      "For established practitioners whose reputation no longer represents the level of work they are capable of. This is the deeper partnership for building the authority system around the expert you have become."
  }
};

const ctaBySlug = {
  "credibility-audit": "Explore the Credibility Clarity Audit™",
  "earned-credibility-intensive": "Explore DISCERN™",
  discern: "Explore Trusted Choice Positioning™"
};

export default function OffersSection() {
  return (
    <section id="offers" className="relative overflow-hidden border-y border-charcoal bg-charcoal py-8 sm:py-10 lg:py-15 text-mistWhite">
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#1A1A1A_0%,#1e2825_42%,#0F4D3E_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.96)_0%,rgba(26,26,26,0.72)_52%,rgba(15,77,62,0.24)_100%)]" aria-hidden="true" />

      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6 relative z-10">
        
        {/* Top Header Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <SectionEyebrow light>Work With Magdalene</SectionEyebrow>
            <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white leading-[1.15] text-balance">
              When your expertise has outgrown the way you are positioned.
            </h2>
          </div>
          <div>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mutedMint hover:text-white transition group"
            >
              <span>Not sure where you fit? Take the Assessment</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Offers Grid Cards */}
        <div className="mt-12 lg:mt-16 grid gap-6 md:grid-cols-3 items-stretch">
          {previews.map((offer) => (
            <article
              key={offer.slug}
              className="flex flex-col justify-between rounded-3xl border border-mutedMint/20 bg-white/5 p-8 sm:p-9 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-mutedMint/40 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <span className="font-serif text-2xl font-bold text-mutedMint">
                    {offer.number}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-mutedMint">
                    {offer.phase}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="font-serif text-2xl font-bold text-white leading-snug">
                    {homeOfferCopy[offer.slug]?.name || offer.name}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-mistWhite/75">
                    {homeOfferCopy[offer.slug]?.description || offer.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Link
                  to={offer.slug === "discern" ? "/discern" : `/offers/${offer.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mutedMint hover:text-white transition group/link"
                >
                  <span>{ctaBySlug[offer.slug] || "Explore the offer"}</span>
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
