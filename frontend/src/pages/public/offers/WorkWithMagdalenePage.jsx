import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicOffers } from "../../../services/api.js";
import gardensPortrait from "../../../assets/home/maggy-gardens-00330.jpg";
import { fallbackOffers, getOfferPath, mergeOffer, offerContent } from "./offerContent.js";

export default function WorkWithMagdalenePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
        if (live) setNotice("The offer details below are being refreshed. You can still explore each offer.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="bg-mistWhite">
      

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container-shell">
          <div className="mb-10 grid gap-5 border-b border-sage pb-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Choose your next move</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-charcoal sm:text-4xl">Three ways to make earned credibility visible.</h2>
            </div>
            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <p className="max-w-md text-sm leading-6 text-charcoal/62">Begin with the support that meets the reputation you are building now.</p>
              {loading && <Loader2 className="shrink-0 animate-spin text-deepEmerald" size={18} aria-label="Loading offers" />}
            </div>
          </div>
          {notice && <p className="mb-6 text-sm text-charcoal/55">{notice}</p>}
          <div className="divide-y divide-sage border-y border-sage">
            {offers.map((offer) => (
              <article
                key={offer.slug}
                className={`group grid gap-6 py-8 transition sm:py-10 lg:grid-cols-[88px_minmax(0,1fr)_190px] lg:gap-10 ${offer.featured ? "bg-deepEmerald px-5 text-mistWhite sm:px-7" : "hover:bg-sage/45"}`}
              >
                <p className={`font-serif text-5xl leading-none ${offer.featured ? "text-mutedMint" : "text-deepEmerald"}`}>{offer.number}</p>
                <div>
                  <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${offer.featured ? "text-mutedMint" : "text-deepEmerald"}`}>{offer.phase}</p>
                  <h3 className={`mt-4 font-serif text-4xl leading-tight ${offer.featured ? "text-mistWhite" : "text-charcoal"}`}>{offer.name}</h3>
                  <p className={`mt-4 max-w-2xl text-lg leading-8 ${offer.featured ? "text-mistWhite/82" : "text-charcoal/72"}`}>{offer.description}</p>
                  <p className={`mt-5 max-w-2xl text-sm leading-6 ${offer.featured ? "text-mistWhite/68" : "text-charcoal/58"}`}>{offer.bestFor}</p>
                </div>
                <Link
                  to={getOfferPath(offer.slug)}
                  className={`inline-flex items-center gap-2 self-start text-sm font-extrabold transition hover:gap-3 lg:mt-8 lg:self-center ${offer.featured ? "text-mutedMint hover:text-mistWhite" : "text-deepEmerald hover:text-charcoal"}`}
                >
                  Learn more
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-sage bg-mistWhite py-14 sm:py-18">
        <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Not sure where to start?</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal">Let your assessment result make the first move clearer.</h2>
          </div>
          <SiteButton to="/assessment" variant="blackGreen" className="w-full sm:w-auto">Take the assessment <ArrowRight size={16} aria-hidden="true" /></SiteButton>
        </div>
      </section>
    </main>
  );
}
