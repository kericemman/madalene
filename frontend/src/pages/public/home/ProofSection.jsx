import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { listPublicCodeOfResonanceEntries } from "../../../services/api.js";
import { magnificImages, proofCaseStudies } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const excerpt = (value = "", maxLength = 360) => {
  const clean = String(value).replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}...`;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
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
    objectPosition: magnificImages.proof.objectPosition
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
    <article className="group flex w-[82vw] max-w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-sage bg-mistWhite shadow-[0_18px_42px_rgba(26,26,26,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,26,26,0.09)] sm:w-[62vw] lg:w-auto lg:max-w-none">
      <a href={caseStudy.href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deepEmerald">
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
          <img
            src={caseStudy.image.src}
            alt={caseStudy.image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            style={{ objectPosition: caseStudy.image.objectPosition }}
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0)_34%,rgba(26,26,26,0.58)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-mutedMint/35 bg-charcoal/82 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-mutedMint backdrop-blur">
              Case Study {String(index + 1).padStart(2, "0")}
            </span>
            {caseStudy.publishedLabel && (
              <span className="rounded-full border border-mutedMint/35 bg-charcoal/82 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-mistWhite backdrop-blur">
                {caseStudy.publishedLabel}
              </span>
            )}
          </div>
        </div>
      </a>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">
          {caseStudy.clientName}
        </p>
        <h3 className="mt-3 font-serif text-xl leading-tight text-charcoal text-balance">
          {caseStudy.title}
        </h3>
        {/* <p className="mt-4 text-sm leading-7 text-charcoal/72">
          {excerpt(caseStudy.summary, 220)}
        </p> */}

        {/* {caseStudy.proofPoints.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {caseStudy.proofPoints.slice(0, 2).map((point) => (
              <span key={point} className="rounded-full border border-sage bg-white px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-charcoal/58">
                {point}
              </span>
            ))}
          </div>
        )} */}

        <a
          href={caseStudy.href}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-extrabold text-deepEmerald transition hover:text-charcoal"
        >
          Read Full Case Study
          <ArrowRight size={16} aria-hidden="true" />
        </a>
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
    <section className="border-y border-sage bg-white py-16 sm:py-20 lg:py-28">
      <div className="container-shell">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <SectionEyebrow>Latest Case Studies</SectionEyebrow>
            <h2 className="max-w-5xl font-serif text-xl font-bold leading-tight text-charcoal text-balance md:text-2xl lg:text-3xl">
              What changes when the right expertise becomes easier to recognise?
            </h2>
          </div>
          {/* <p className="max-w-2xl text-sm leading-7 text-charcoal/70 md:text-base md:leading-8 lg:justify-self-end">
            Real proof from the work: clearer positioning, stronger trust signals, and stories that make expertise easier to choose.
          </p> */}
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overscroll-x-contain lg:grid lg:grid-cols-3 lg:gap-5">
            {latestCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard key={getCardKey(caseStudy, index)} caseStudy={caseStudy} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-start lg:justify-end">
          <a
            href="/code-of-resonance/case-studies"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-extrabold text-mutedMint transition hover:border-deepEmerald hover:bg-deepEmerald hover:text-mistWhite sm:w-auto"
          >
            Explore Code of Resonance
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
