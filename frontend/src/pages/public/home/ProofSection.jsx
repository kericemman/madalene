import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { listPublicCodeOfResonanceEntries } from "../../../services/api.js";
import { magnificImages, proofCaseStudies } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

const imageForCaseStudy = (entry = {}) => {
  const image = entry.coverImage || {};

  return {
    src: image.optimizedUrl || image.secureUrl || image.thumbnailUrl || magnificImages.proof.src,
    alt: image.altText || magnificImages.proof.alt,
    objectPosition: magnificImages.proof.objectPosition || "center"
  };
};

const fallbackCaseStudyHref = "/code-of-resonance/case-studies";

const normalizeCaseStudy = (entry = {}) => {
  const clientName = entry.caseStudy?.clientName || entry.title || "Case Study";
  const challenge = entry.caseStudy?.challenge || entry.strategicGoal?.readerShift || entry.excerpt || "";
  const result = entry.caseStudy?.result || entry.editorialPlan?.thesis || entry.excerpt || "";

  return {
    clientName,
    challenge,
    result,
    title: entry.title || `${clientName} Case Study`,
    summary: entry.excerpt || result,
    href: entry.slug ? `/code-of-resonance/read/${entry.slug}` : fallbackCaseStudyHref,
    image: imageForCaseStudy(entry),
    proofPoints: (entry.editorialPlan?.proofPoints || []).filter(Boolean).slice(0, 3),
    featured: Boolean(entry.featured),
    publishedLabel: formatDate(entry.publishedAt || entry.updatedAt || entry.createdAt)
  };
};

const getUniqueCaseStudyKey = (caseStudy) => {
  if (caseStudy.href && caseStudy.href !== fallbackCaseStudyHref) return caseStudy.href;
  return caseStudy.title || caseStudy.clientName;
};

const getCardKey = (caseStudy, index) => getUniqueCaseStudyKey(caseStudy) || `${caseStudy.title}-${index}`;

function CaseStudyCard({ caseStudy, index }) {
  return (
    <article className="group relative flex w-[85vw] max-w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-sm transition-all duration-300 hover:border-deepEmerald/50 hover:shadow-md sm:w-[60vw] lg:w-auto lg:max-w-none">
      <Link to={caseStudy.href} className="block overflow-hidden bg-sage/30 focus:outline-none">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={caseStudy.image.src}
            alt={caseStudy.image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: caseStudy.image.objectPosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" aria-hidden="true" />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="rounded-full border border-white/20 bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mutedMint backdrop-blur-md">
              Case Study 0{index + 1}
            </span>
            {caseStudy.publishedLabel && (
              <span className="text-[11px] font-semibold text-mistWhite/80">
                {caseStudy.publishedLabel}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-deepEmerald">
            {caseStudy.clientName}
          </span>
          <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold leading-snug text-charcoal group-hover:text-deepEmerald transition-colors text-balance">
            <Link to={caseStudy.href} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {caseStudy.title}
            </Link>
          </h3>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/70 line-clamp-2">
            {caseStudy.summary}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-sage/60 pt-5">
          <span className="text-xs font-semibold text-charcoal/50">Verified Proof</span>
          <span className="relative z-20 inline-flex items-center gap-1.5 text-xs font-bold text-deepEmerald group-hover:translate-x-1 transition-transform">
            <span>Read Study</span>
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ProofSection() {
  const [backendCaseStudies, setBackendCaseStudies] = useState([]);

  useEffect(() => {
    let active = true;

    listPublicCodeOfResonanceEntries({ contentType: "case_study", limit: 3, sort: "latest" })
      .then((response) => {
        if (!active) return;
        setBackendCaseStudies(response.data?.items || []);
      })
      .catch(() => {
        if (active) setBackendCaseStudies([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const latestCaseStudies = useMemo(() => {
    const normalized = [...backendCaseStudies, ...proofCaseStudies]
      .map(normalizeCaseStudy)
      .filter((item) => item.title || item.clientName);

    const seen = new Set();

    return normalized
      .filter((item) => {
        const key = item.href || item.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3);
  }, [backendCaseStudies]);

  return (
    <section className="relative overflow-hidden border-y border-sage/60 bg-[#FAF9F6] py-8 sm:py-10 lg:py-15 text-charcoal">
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
        
        {/* Section Header Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <SectionEyebrow>Latest Case Studies</SectionEyebrow>
            <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal leading-[1.15] text-balance">
              What changes when the right expertise becomes easier to recognise?
            </h2>
          </div>
          <div>
            <Link
              to="/code-of-resonance/case-studies"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-deepEmerald hover:text-charcoal transition group"
            >
              <span>Explore Code of Resonance</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Case Studies Viewport: Horizontal Scroll on Mobile/Tablet, Grid on Desktop */}
        <div className="mt-12 lg:mt-16 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-none lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {latestCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard key={getCardKey(caseStudy, index)} caseStudy={caseStudy} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}