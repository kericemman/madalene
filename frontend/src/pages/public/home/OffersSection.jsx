import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { offerPreviewSlugs } from "./homeContent.js";
import { mergeOffer } from "../offers/offerContent.js";

const previews = offerPreviewSlugs.map((slug) => mergeOffer({ slug }));

export default function OffersSection() {
  return (
    <section id="offers" className="border-y border-mistWhite/10 bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-mutedMint">
              <span className="h-px w-8 bg-mutedMint" aria-hidden="true" />
              Offers
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] text-balance sm:text-5xl">
              Choose the support your brand needs now.
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-lg leading-8 text-mistWhite/72">You do not need more visibility. You need the right people to understand your value, trust your authority, and know why they should choose you.</p>
            <Link to="/offers" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-mutedMint transition hover:gap-3 hover:text-mistWhite">
              Learn more about the offers
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid divide-y divide-mistWhite/15 border-y border-mistWhite/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {previews.map((offer) => (
            <article key={offer.slug} className="flex min-h-[290px] flex-col px-0 py-8 first:pt-0 md:px-7 md:py-0 md:first:pl-0 md:last:pr-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">{offer.number} | {offer.phase}</p>
              <h3 className="mt-5 font-serif text-3xl leading-tight">{offer.name}</h3>
              <p className="mt-4 text-sm leading-7 text-mistWhite/72">{offer.description}</p>
              <Link to={offer.slug === "discern" ? "/discern" : `/offers/${offer.slug}`} className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-extrabold text-mutedMint transition hover:gap-3 hover:text-mistWhite">
                Learn more
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
