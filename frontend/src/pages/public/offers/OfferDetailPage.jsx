import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles, ShieldCheck, Compass } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { getPublicOffer } from "../../../services/api.js";
import CredibilityAuditPage from "./CredibilityAuditPage.jsx";
import EarnedCredibilityIntensivePage from "./EarnedCredibilityIntensivePage.jsx";
import { getOfferActionPath, mergeOffer, offerContent } from "./offerContent.js";

const statusMessage = (error) =>
  error?.response?.status === 404 ? "This offer is currently being prepared." : "We could not refresh this offer right now.";

export default function OfferDetailPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
        if (live && response.data?.offer) {
          setOffer(mergeOffer(response.data.offer));
        }
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
    <main className="min-h-screen bg-[#FAF9F6] text-charcoal selection:bg-mutedMint/60">
      
      {/* 1. Immersive Editorial Hero */}
      <section className="relative overflow-hidden bg-white border-b border-sage/60 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-10">
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-deepEmerald hover:text-charcoal transition"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Return to Engagements
            </Link>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sage/30 px-3.5 py-1 text-xs font-bold text-deepEmerald">
              <Sparkles size={13} />
              <span>{offer.phase}</span>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-deepEmerald">
                Engagement {offer.number}
              </span>
              <h1 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.12] text-balance">
                {offer.headline}
              </h1>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-charcoal/75 max-w-2xl font-serif">
                {offer.description}
              </p>
            </div>

            {/* Action Summary Card */}
            <div className="rounded-3xl border border-charcoal/10 bg-charcoal p-8 sm:p-10 text-mistWhite shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-deepEmerald/20 blur-2xl pointer-events-none" />
              
              <span className="text-[10px] font-bold uppercase tracking-widest text-mutedMint">Engagement Investment</span>
              <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white">
                {offer.name}
              </p>
              
              <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <div className="flex items-start gap-2.5 text-xs text-mistWhite/80 leading-relaxed">
                  <ShieldCheck size={16} className="text-mutedMint shrink-0 mt-0.5" />
                  <span>{offer.bestFor}</span>
                </div>
              </div>

              <div className="mt-8">
                <SiteButton to={actionPath} variant="darkPrimary" className="w-full justify-center py-3.5 text-xs font-bold bg-mutedMint text-charcoal hover:bg-white shadow-md">
                  <span>{offer.ctaText}</span>
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <ArrowRight size={14} />}
                </SiteButton>
              </div>
              {notice && <p className="mt-3 text-center text-[11px] text-mistWhite/50">{notice}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Real Work Section */}
      <section className="py-20 sm:py-28">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The Core Reality</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                It is never about looking more impressive.
              </h2>
            </div>

            <div className="space-y-6 rounded-3xl border border-sage/80 bg-white p-8 sm:p-12 shadow-sm font-serif text-lg sm:text-xl leading-relaxed text-charcoal/80">
              {(offer.story || []).map((paragraph, idx) => (
                <p key={idx} className="border-l-2 border-deepEmerald/40 pl-6 italic">
                  "{paragraph}"
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Numbered Deliverables Grid */}
      <section className="border-y border-sage/60 bg-white py-20 sm:py-28">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Deliverable Architecture</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Make the right credibility move, with less noise.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offer.features.map((feature, index) => (
              <div
                key={feature}
                className="group rounded-3xl border border-sage/70 bg-[#FAF9F6] p-8 shadow-sm transition hover:border-deepEmerald duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-4xl font-bold text-deepEmerald/40 group-hover:text-deepEmerald transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-6 text-sm sm:text-base leading-relaxed text-charcoal/85 font-medium">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Strategic Outcomes Section */}
      <section className="bg-deepEmerald py-20 sm:py-28 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The Transformation</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {offer.outcomeTitle || "What becomes possible next."}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-mistWhite/75 leading-relaxed max-w-md">
                When your earned authority is structured cleanly, prospective buyers stop hesitating and start recognising your immediate value.
              </p>
            </div>

            <div className="space-y-4">
              {offer.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mutedMint/20 text-mutedMint mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-mistWhite/90 font-medium">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Bottom Action Closer */}
      <section className="py-20 sm:py-24 bg-[#FAF9F6]">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-sage/80 bg-white p-8 sm:p-12 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Begin the Engagement</span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                {offer.name}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-charcoal/65">
                Secure your engagement and begin clarifying your market positioning today.
              </p>
            </div>

            <SiteButton to={actionPath} variant="blackGreen" className="px-8 py-4 text-xs font-bold shrink-0 shadow-md">
              <span>{offer.ctaText}</span>
              {loading ? <Loader2 className="animate-spin" size={15} /> : <ArrowRight size={15} />}
            </SiteButton>
          </div>
        </div>
      </section>

    </main>
  );
}