import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Lightbulb, Loader2, Mail } from "lucide-react";
import { getAssessmentResultByToken } from "../../services/api.js";

const oneToOneBookingUrl =
  import.meta.env.VITE_ONE_TO_ONE_BOOKING_URL ||
  "https://calendly.com/wambui-magdalene/content-that-connects";

const clampScore = (value, max = 100) => Math.min(max, Math.max(0, Number(value || 0)));
const scoreMaxFor = (result) => Number(result?.overallMaxScore || result?.scoringSnapshot?.overallMaxScore || 100);
const scorePercent = (score, max = 100) => Math.round((clampScore(score, max) / Math.max(max, 1)) * 100);

const resolveHref = (value) => {
  const rawValue = String(value || "/assessment").trim();
  if (/^(https:|mailto:|tel:)/i.test(rawValue)) return rawValue;
  return rawValue.startsWith("/") ? rawValue : `/${rawValue}`;
};

const isExternalHref = (value) => /^(https:|mailto:|tel:)/i.test(String(value || ""));

const scoreTone = (score, max = 100) => {
  const numericScore = scorePercent(score, max);
  if (numericScore >= 71) return "bg-deepEmerald text-mistWhite";
  if (numericScore >= 51) return "bg-mutedMint text-deepEmerald";
  if (numericScore >= 31) return "bg-sage text-deepEmerald";
  return "bg-charcoal text-mistWhite";
};

function ScoreBar({ category }) {
  const score = clampScore(category.score);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-charcoal">{category.name || category.key}</p>
        <p className="text-sm font-black text-deepEmerald">{Math.round(score)}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage">
        <div className="h-full rounded-full bg-deepEmerald" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function ActionLink({ href, children }) {
  const className =
    "inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal";

  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

const resourceReadPath = (resource, token) => {
  if (resource?.readPath) return resource.readPath;
  if (!resource?.slug || !token) return "";
  return `/resources/${resource.slug}?token=${encodeURIComponent(token)}`;
};

export default function AssessmentResultPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { token } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [status, setStatus] = useState(location.state?.result ? "ready" : "loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.result) return;

    let active = true;
    setStatus("loading");

    getAssessmentResultByToken(token)
      .then((response) => {
        if (!active) return;
        setResult(response.data.result);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "This result link is invalid or has expired.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [location.state, token]);

  if (status === "loading") {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16">
        <div className="flex items-center gap-3 text-sm font-extrabold text-deepEmerald">
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          Loading your result...
        </div>
      </section>
    );
  }

  if (status === "error" || !result) {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16 text-center">
        <div className="max-w-xl">
          <AlertCircle className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
          <h1 className="mt-4 font-serif text-4xl">Result unavailable</h1>
          <p className="mt-3 text-charcoal/66">{error}</p>
          <Link
            to="/assessment"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
          >
            Retake assessment
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const stage = result.credibilityStage || {};
  const report = stage.report || {};
  const aiReport = result.aiAnalysis?.status === "complete" ? result.aiAnalysis.report || {} : {};
  const nextSteps = aiReport.nextSteps?.length ? aiReport.nextSteps : report.nextSteps || [];
  const gapInsights = aiReport.gapInsights || [];
  const gapResources = result.gapResources || [];
  const stageResource = result.stageResource;
  const resourceToken = result.resultToken || token;
  const recommendation = result.recommendation || {};
  const ctaText = recommendation.ctaText || "Book a 1:1 Call";
  const ctaUrl = resolveHref(recommendation.ctaDestination || oneToOneBookingUrl);
  const scoreMax = scoreMaxFor(result);
  const evidenceScored = result.scoreSource === "evidence_rubric";

  return (
    <section className="bg-mistWhite py-12 sm:py-16 lg:py-20">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-mutedMint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
              <CheckCircle2 size={15} aria-hidden="true" />
              Assessment Complete
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-charcoal text-balance sm:text-6xl">
              {aiReport.headline ||
                (result.participant?.firstName
                  ? `${result.participant.firstName}, here is your score.`
                  : "Here is your Earned Credibility score.")}
            </h1>
          </div>
          <p className="text-lg leading-9 text-charcoal/72">
            {evidenceScored
              ? "Your written evidence has been assessed against the five credibility pillars, with your statement ratings used as a self-reflection cross-check."
              : "Your result currently reflects your statement ratings because the written-evidence review was unavailable."}
            A results email is also queued for your inbox.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className={`rounded border p-7 text-center shadow-[0_18px_45px_rgba(26,26,26,0.12)] ${scoreTone(result.overallScore, scoreMax)}`}>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] opacity-70">Resonance Quotient</p>
            <p className="mt-4 text-7xl font-black">{Math.round(clampScore(result.overallScore, scoreMax))}</p>
            <p className="mt-1 text-sm font-bold opacity-70">out of {scoreMax}</p>
            <div className="mt-7 rounded border border-current/20 bg-white/10 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-70">Credibility Stage</p>
              <p className="mt-2 font-serif text-3xl leading-tight">{stage.name || "Earned Credibility"}</p>
            </div>
            <p className="mt-5 text-xs font-bold leading-5 opacity-75">
              {evidenceScored ? "Evidence-reviewed result" : "Self-assessment fallback"}
            </p>
          </aside>

          <div className="grid gap-6">
            <article className="rounded border border-sage bg-white p-6 shadow-[0_16px_36px_rgba(26,26,26,0.035)]">
              <h2 className="font-serif text-3xl">What this means</h2>
              <p className="mt-4 text-l leading-8 text-charcoal/72">
                {aiReport.summary ||
                  report.whatItMeans ||
                  stage.description ||
                  "Your score shows where your credibility is already visible and where your message can become easier to trust."}
              </p>
            </article>

            <article className="rounded border border-sage bg-white p-6 shadow-[0_16px_36px_rgba(26,26,26,0.035)]">
              <h2 className="font-serif text-3xl">Your biggest opportunity</h2>
              <p className="mt-4 text-l leading-8 text-charcoal/72">
                {aiReport.earnedCredibility ||
                  report.biggestOpportunity ||
                  stage.recommendedAction ||
                  "Use this result to decide where your credibility needs to become clearer, more visible, and easier to trust."}
              </p>
              {nextSteps.length > 0 && (
                <div className="mt-6 rounded border border-sage bg-mistWhite p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Your next three steps</p>
                  <ul className="mt-4 grid gap-3">
                    {nextSteps.map((step) => (
                      <li key={step} className="flex gap-3 text-sm font-semibold leading-6 text-charcoal/72">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={17} aria-hidden="true" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {gapInsights.length > 0 && (
              <article className="rounded border border-sage bg-white p-6 shadow-[0_16px_36px_rgba(26,26,26,0.035)]">
                <div className="flex items-center gap-2 text-deepEmerald">
                  <Lightbulb size={17} aria-hidden="true" />
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em]">Where to focus first</p>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {gapInsights.map((insight) => (
                    <div key={`${insight.categoryKey}-${insight.title}`} className="border-l-2 border-deepEmerald bg-mistWhite px-4 py-4">
                      <h3 className="font-serif text-2xl leading-tight text-charcoal">{insight.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-charcoal/70">{insight.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            )}

            <article className="rounded border border-sage bg-white p-6 shadow-[0_16px_36px_rgba(26,26,26,0.035)]">
              <h2 className="font-serif text-3xl">Your credibility dimensions</h2>
              <div className="mt-6 grid gap-5">
                {(result.categoryScores || []).map((category) => (
                  <ScoreBar key={category.key || category.name} category={category} />
                ))}
              </div>
            </article>

            {stageResource && (
              <article className="border-l-4 border-deepEmerald bg-sage/35 p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Recommended for you</p>
                <h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">{stageResource.title}</h2>
                <p className="mt-3 text-sm leading-7 text-charcoal/72">{stageResource.description}</p>
                {resourceReadPath(stageResource, resourceToken) && (
                  <Link
                    to={resourceReadPath(stageResource, resourceToken)}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
                  >
                    Read recommended resource
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </article>
            )}

            {gapResources.length > 0 && (
              <article className="rounded border border-sage bg-white p-6 shadow-[0_16px_36px_rgba(26,26,26,0.035)]">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Resources selected for your gaps</p>
                <p className="mt-3 text-sm leading-6 text-charcoal/68">
                  These private resources are selected from the categories where your earned credibility needs the most support.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {gapResources.map((resource) => (
                    <div key={resource.categoryKey} className="border border-sage bg-mistWhite p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">{resource.categoryName}</p>
                      <h3 className="mt-2 font-serif text-2xl leading-tight text-charcoal">{resource.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-charcoal/68">{resource.description}</p>
                      {resourceReadPath(resource, resourceToken) && (
                        <Link
                          to={resourceReadPath(resource, resourceToken)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-deepEmerald underline-offset-4 hover:underline"
                        >
                          Read resource
                          <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            )}

            <article className="rounded border border-deepEmerald/20 bg-mutedMint/45 p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Recommended Next Action</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight">{ctaText}</h2>
              {!stageResource && report.recommendedResourceTitle && (
                <p className="mt-3 text-sm font-extrabold text-charcoal">
                  Recommended resource: {report.recommendedResourceTitle}
                </p>
              )}
              <p className="mt-4 text-sm leading-7 text-charcoal/72">
                {recommendation.explanation ||
                  stage.recommendedAction ||
                  "Use this result as a starting point for clarifying the trust signals, proof, and message that help people choose you."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ActionLink href={ctaUrl}>
                  {ctaText}
                  <ArrowRight size={16} aria-hidden="true" />
                </ActionLink>
                <Link
                  to="/code-of-resonance"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald/25 px-5 py-3 text-sm font-extrabold text-deepEmerald transition hover:border-deepEmerald hover:bg-sage"
                >
                  <Mail size={16} aria-hidden="true" />
                  Read the Code
                </Link>
              </div>
            </article>

            {report.finalNote && (
              <article className="rounded border border-charcoal bg-charcoal p-6 text-mistWhite shadow-[0_18px_45px_rgba(26,26,26,0.12)]">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">Your journey starts here</p>
                <p className="mt-4 text-lg leading-8 text-mistWhite/76">{report.finalNote}</p>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
