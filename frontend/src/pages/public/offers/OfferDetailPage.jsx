import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { getPublicOffer } from "../../../services/api.js";
import CredibilityAuditPage from "./CredibilityAuditPage.jsx";
import EarnedCredibilityIntensivePage from "./EarnedCredibilityIntensivePage.jsx";
import { getOfferActionPath, getOfferPath, mergeOffer, offerContent } from "./offerContent.js";

const statusMessage = (error) =>
  error?.response?.status === 404 ? "This offer is being prepared." : "We could not refresh this offer right now.";

export default function OfferDetailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { slug } = useParams();
  const fallback = offerContent[slug] ? mergeOffer({ slug }) : null;
  const [offer, setOffer] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(fallback));
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!fallback) return undefined;
    let live = true;
    setOffer(fallback);
    setLoading(true);
    setNotice("");
    getPublicOffer(slug)
      .then((response) => {
        if (live) setOffer(mergeOffer(response.data.offer));
      })
      .catch((error) => {
        if (live) setNotice(statusMessage(error));
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [slug]);

  if (!fallback) return <Navigate to="/offers" replace />;

  const actionPath = getOfferActionPath(offer);

  if (slug === "credibility-audit") {
    return <CredibilityAuditPage actionPath={actionPath} loading={loading} offer={offer} />;
  }

  if (slug === "earned-credibility-intensive") {
    return <EarnedCredibilityIntensivePage actionPath={actionPath} loading={loading} offer={offer} />;
  }

  const isBooking = offer.ctaType === "booking";

  return (
    <main className="bg-mistWhite">
      <section className="border-b border-mistWhite/10 bg-charcoal text-mistWhite">
        <div className="container-shell py-10 sm:py-14 lg:py-24">
          <Link to="/offers" className="inline-flex items-center gap-2 text-sm font-bold text-mutedMint transition hover:text-mistWhite">
            <ArrowLeft size={16} aria-hidden="true" />
            Offers
          </Link>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
                <span>{offer.number}</span>
                <span className="h-px w-8 bg-mutedMint" aria-hidden="true" />
                <span>{offer.phase}</span>
              </div>
              <h1 className="mt-5 max-w-4xl font-serif text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
                {offer.headline}
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-mistWhite/74">{offer.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <SiteButton to={actionPath} variant="darkPrimary" className="w-full sm:w-auto">
                  {offer.ctaText}
                  <ArrowRight size={16} aria-hidden="true" />
                </SiteButton>
                <SiteButton to="/assessment" variant="darkSecondary" className="w-full sm:w-auto">
                  Take the assessment first
                </SiteButton>
              </div>
              {notice && <p className="mt-5 text-sm text-mistWhite/55">{notice}</p>}
            </div>

            <aside className="border-l border-mistWhite/20 pl-6 sm:pl-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">Best when</p>
              <p className="mt-4 font-serif text-2xl leading-tight">{offer.bestFor}</p>
              <p className="mt-7 border-t border-mistWhite/15 pt-5 text-sm leading-6 text-mistWhite/68">
                {isBooking ? "A focused place to get clarity before making a bigger change." : "A considered next step for work that deserves the right strategic fit."}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">The real work</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal text-balance">It is not about looking more impressive.</h2>
          </div>
          <div className="max-w-3xl text-xl leading-9 text-charcoal/72">
            {(offer.story || []).map((paragraph) => <p key={paragraph} className="mb-6 last:mb-0">{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="border-y border-sage bg-mistWhite py-16 sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">What this helps you do</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal">Make the right credibility move, with less noise.</h2>
          </div>
          <div className="divide-y divide-sage border-y border-sage">
            {offer.features.map((feature, index) => (
              <div key={feature} className="grid gap-4 py-5 sm:grid-cols-[44px_1fr] sm:items-start">
                <p className="font-serif text-3xl leading-none text-deepEmerald">0{index + 1}</p>
                <p className="text-lg leading-8 text-charcoal/78">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-deepEmerald py-16 text-mistWhite sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">The outcome</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">{offer.outcomeTitle || "What becomes possible next."}</h2>
          </div>
          <div className="divide-y divide-mistWhite/20 border-y border-mistWhite/20">
            {offer.outcomes.map((outcome) => <p key={outcome} className="py-4 text-lg leading-7 text-mistWhite/82">{outcome}</p>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-shell flex flex-col gap-6 border-y border-sage py-7 sm:flex-row sm:items-center sm:justify-between sm:py-9">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Ready when you are</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal">{offer.name}</h2>
          </div>
          <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
            {offer.ctaText}
            {loading ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
          </SiteButton>
        </div>
      </section>
    </main>
  );
}
