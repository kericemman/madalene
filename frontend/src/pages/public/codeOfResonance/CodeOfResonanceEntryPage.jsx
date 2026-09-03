import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, ExternalLink, FileCheck2, Loader2, Mail, Quote } from "lucide-react";
import { getPublicCodeOfResonanceEntry } from "../../../services/api.js";
import { imageUrl, toSrcSet } from "../../../utils/cloudinaryImage.js";
import CodeSubscribeModal from "./CodeSubscribeModal.jsx";
import { sectionForType, typeLabels } from "./codeSections.js";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

const safeExternalHref = (value) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  return rawValue;
};

const cleanText = (value = "") => String(value).replace(/\s+/g, " ").trim();

const slugifyHeading = (value = "") =>
  cleanText(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "section";

const prepareBodyContent = (body = "") => {
  if (!body || typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    return { html: body, tocItems: [] };
  }

  const doc = new window.DOMParser().parseFromString(`<div>${body}</div>`, "text/html");
  const container = doc.body.firstElementChild || doc.body;
  const headings = Array.from(container.querySelectorAll("h2, h3")).filter((heading) =>
    cleanText(heading.textContent)
  );
  const usedIds = new Map();

  const tocItems = headings.slice(0, 10).map((heading) => {
    const text = cleanText(heading.textContent);
    const baseId = slugifyHeading(heading.id || text);
    const currentCount = usedIds.get(baseId) || 0;
    const id = currentCount ? `${baseId}-${currentCount + 1}` : baseId;

    usedIds.set(baseId, currentCount + 1);
    heading.id = id;

    return {
      id,
      text,
      level: heading.tagName.toLowerCase()
    };
  });

  return {
    html: container.innerHTML,
    tocItems
  };
};

const railContentForEntry = (entry = {}) => {
  const proofPoints = (entry.editorialPlan?.proofPoints || []).filter(Boolean);

  if (entry.contentType === "case_study") {
    return {
      eyebrow: "Case Study Guide",
      primaryLabel: "Result",
      primaryText:
        entry.caseStudy?.result ||
        entry.editorialPlan?.thesis ||
        entry.strategicGoal?.readerShift ||
        entry.excerpt,
      secondaryLabel: "Outcome Highlights",
      secondaryItems: proofPoints,
      tertiaryLabel: entry.caseStudy?.challenge ? "Challenge" : "",
      tertiaryText: entry.caseStudy?.challenge || ""
    };
  }

  if (entry.contentType === "testimonial") {
    return {
      eyebrow: "Story Guide",
      primaryLabel: "After",
      primaryText: entry.testimonial?.after || entry.strategicGoal?.readerShift || entry.excerpt,
      secondaryLabel: "Before",
      secondaryItems: entry.testimonial?.before ? [entry.testimonial.before] : [],
      tertiaryLabel: entry.testimonial?.name ? "Voice" : "",
      tertiaryText: [entry.testimonial?.name, entry.testimonial?.role].filter(Boolean).join(", ")
    };
  }

  if (entry.contentType === "reading_list") {
    return {
      eyebrow: "Reading Guide",
      primaryLabel: "Why It Matters",
      primaryText: entry.editorialPlan?.thesis || entry.strategicGoal?.readerShift || entry.excerpt,
      secondaryLabel: "Core Notes",
      secondaryItems: proofPoints,
      tertiaryLabel: entry.source?.title ? "Source" : "",
      tertiaryText: [entry.source?.title, entry.source?.author].filter(Boolean).join(" by ")
    };
  }

  return {
    eyebrow: entry.contentType === "essay" ? "Essay Guide" : "Entry Guide",
    primaryLabel: "Core Idea",
    primaryText:
      entry.editorialPlan?.thesis ||
      entry.editorialPlan?.angle ||
      entry.strategicGoal?.readerShift ||
      entry.excerpt,
    secondaryLabel: entry.editorialPlan?.proofPoints?.length ? "Proof Signals" : "Reader Shift",
    secondaryItems: proofPoints.length ? proofPoints : [entry.strategicGoal?.readerShift].filter(Boolean),
    tertiaryLabel: entry.editorialPlan?.coreQuestion ? "Core Question" : "",
    tertiaryText: entry.editorialPlan?.coreQuestion || ""
  };
};

function InsightRailSection({ label, children }) {
  if (!children) return null;

  return (
    <section className="border-t border-sage/70 pt-5 first:border-t-0 first:pt-0">
      <p className="break-words text-lg font-extrabold uppercase tracking-[0.16em] text-deepEmerald/76">
        {label}
      </p>
      {children}
    </section>
  );
}

function EntryInsightRail({ entry, tocItems, ctaHref, onSubscribe }) {
  const rail = railContentForEntry(entry);

  return (
    <aside className="hidden min-w-0 xl:sticky xl:top-28 xl:block xl:self-start" aria-label="Entry guide">
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-md border border-sage bg-white p-5 shadow-[0_18px_42px_rgba(26,26,26,0.06)]">
        <p className="break-words text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
          {rail.eyebrow}
        </p>

        {tocItems.length > 0 && (
          <nav className="mt-5 border-t border-sage/70 pt-5" aria-label="Table of contents">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-charcoal/48">
              Table of Contents
            </p>
            <div className="mt-3 grid gap-2">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block border-l border-sage py-1.5 text-sm leading-5 text-charcoal/62 transition hover:border-deepEmerald hover:text-deepEmerald ${
                    item.level === "h3" ? "pl-5" : "pl-3 font-bold"
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className="mt-5 grid gap-5">
          
          <InsightRailSection label={rail.primaryLabel}>
            

            <p className="mt-2 break-words font-serif text-lg leading-tight text-charcoal">
              {rail.primaryText || "Move from quiet expertise to visible, earned credibility."}
            </p>
          </InsightRailSection>

          {rail.secondaryItems.length > 0 && (
            <InsightRailSection label={rail.secondaryLabel}>
              <div className="mt-3 grid gap-2">
                {rail.secondaryItems.slice(0, 5).map((item) => (
                  <div key={item} className="flex min-w-0 gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={15} aria-hidden="true" />
                    <p className="min-w-0 break-words text-sm leading-6 text-charcoal/68">{item}</p>
                  </div>
                ))}
              </div>
            </InsightRailSection>
          )}

          {rail.tertiaryLabel && rail.tertiaryText && (
            <InsightRailSection label={rail.tertiaryLabel}>
              <p className="mt-2 break-words text-sm leading-6 text-charcoal/68">{rail.tertiaryText}</p>
            </InsightRailSection>
          )}

          {(entry.tags || []).length > 0 && (
            <InsightRailSection label="Tags">
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="max-w-full break-words rounded-full border border-sage bg-mistWhite px-3 py-1 text-xs font-bold text-charcoal/58">
                    {tag}
                  </span>
                ))}
              </div>
            </InsightRailSection>
          )}
        </div>

        {ctaHref && (
          <a
            href={ctaHref}
            className="mt-7 inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-center text-sm font-extrabold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
          >
            <span className="min-w-0 break-words">{entry.ctaText || "Take the next step"}</span>
            <ArrowRight className="shrink-0" size={16} aria-hidden="true" />
          </a>
        )}

        <button
          type="button"
          onClick={onSubscribe}
          className="mt-3 inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-sage px-5 py-3 text-center text-sm font-extrabold text-deepEmerald transition hover:border-deepEmerald hover:bg-deepEmerald hover:text-mistWhite"
        >
          <Mail className="shrink-0" size={16} aria-hidden="true" />
          <span className="min-w-0 break-words">Subscribe</span>
        </button>
      </div>
    </aside>
  );
}

function CaseStudyOverview({ entry }) {
  const clientName = entry.caseStudy?.clientName;
  const challenge = entry.caseStudy?.challenge;
  const result = entry.caseStudy?.result;
  const highlights = entry.editorialPlan?.proofPoints || [];

  if (!clientName && !challenge && !result && highlights.length === 0) return null;

  return (
    <section className="mb-8 max-w-full overflow-hidden rounded border border-sage bg-white shadow-[0_18px_42px_rgba(26,26,26,0.055)]">
      <div className="border-b border-charcoal bg-charcoal p-5 text-mistWhite sm:p-6">
        <p className="inline-flex max-w-full flex-wrap items-center gap-2 break-words text-xs font-extrabold uppercase tracking-[0.12em] text-mutedMint sm:tracking-[0.18em]">
          <FileCheck2 size={15} aria-hidden="true" />
          Case study overview
        </p>
        <h2 className="mt-3 break-words font-serif text-xl leading-tight sm:text-2xl">
          {clientName || "Transformation snapshot"}
        </h2>
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)]">
        <div className="min-w-0 p-1 sm:p-4">
          <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald sm:tracking-[0.16em]">Challenge</p>
          <p className="mt-3 break-words text-base leading-7 text-charcoal/72">
            {challenge || "The trust gap needed to be clarified before the work could be easier to choose."}
          </p>
        </div>

        <div className="grid place-items-center border-y border-sage bg-mutedMint/28 px-4 py-3 lg:border-x lg:border-y-0">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-deepEmerald text-mistWhite">
            <ArrowRight className="rotate-90 lg:rotate-0" size={18} aria-hidden="true" />
          </span>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald sm:tracking-[0.16em]">Result</p>
          <p className="mt-3 break-words text-base leading-7 text-charcoal/72">
            {result || "The work created clearer positioning, stronger proof, and a more confident path to trust."}
          </p>
        </div>
      </div>

      {/* {highlights.length > 0 && (
        <div className="min-w-0 border-t border-sage bg-mistWhite p-4 sm:p-6">
          <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/48 sm:tracking-[0.16em]">Outcome highlights</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {highlights.map((highlight) => (
              <div key={highlight} className="min-w-0 flex gap-3 rounded border border-sage bg-white p-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={17} aria-hidden="true" />
                <p className="min-w-0 break-words text-sm leading-6 text-charcoal/70">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </section>
  );
}

function ReadingSource({ entry }) {
  const source = entry.source || {};
  const href = safeExternalHref(source.url);
  if (!source.title && !source.author && !href) return null;

  return (
    <section className="mb-8 max-w-full overflow-hidden rounded border border-sage bg-white p-5 shadow-[0_16px_36px_rgba(34,34,34,0.035)] sm:p-6">
      <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald sm:tracking-[0.16em]">Recommended source</p>
      <h2 className="mt-3 break-words font-serif text-xl leading-tight text-charcoal">{source.title || "Source"}</h2>
      {source.author ? <p className="mt-2 break-words text-sm font-bold text-charcoal/54">{source.author}</p> : null}
      {entry.editorialPlan?.thesis ? (
        <p className="mt-4 break-words text-base leading-7 text-charcoal/70">{entry.editorialPlan.thesis}</p>
      ) : null}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex max-w-full flex-wrap items-center gap-2 break-words text-sm font-extrabold text-deepEmerald transition hover:text-charcoal"
        >
          Visit source
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      ) : null}
    </section>
  );
}

function TransformationSnapshot({ entry }) {
  const testimonial = entry.testimonial || {};
  if (!testimonial.before && !testimonial.after && !testimonial.name) return null;

  return (
    <section className="mb-8 max-w-full overflow-hidden rounded border border-sage bg-white p-5 shadow-[0_16px_36px_rgba(34,34,34,0.035)] sm:p-6">
      <p className="inline-flex max-w-full flex-wrap items-center gap-2 break-words text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald sm:tracking-[0.16em]">
        <Quote size={15} aria-hidden="true" />
        Transformation snapshot
      </p>
      {testimonial.name ? (
        <h2 className="mt-3 break-words font-semibold text-xl leading-tight text-charcoal">
          {testimonial.name}
          {testimonial.role ? <span className="block break-words text-base font-sans font-bold text-charcoal/52">{testimonial.role}</span> : null}
        </h2>
      ) : null}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded border border-sage bg-mistWhite p-4">
          <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">Before</p>
          <p className="mt-3 break-words text-sm leading-6 text-charcoal/70">{testimonial.before || "The starting point before the shift."}</p>
        </div>
        <div className="min-w-0 rounded border border-sage bg-mutedMint/35 p-4">
          <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">After</p>
          <p className="mt-3 break-words text-sm leading-6 text-charcoal/72">{testimonial.after || "The visible change after the work."}</p>
        </div>
      </div>
    </section>
  );
}

export default function CodeOfResonanceEntryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { slug } = useParams();
  const [entry, setEntry] = useState(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError("");

    getPublicCodeOfResonanceEntry(slug)
      .then((response) => {
        if (!active) return;
        setEntry(response.data.entry);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "Could not load this Code of Resonance entry.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const preparedBody = useMemo(() => prepareBodyContent(entry?.body), [entry?.body]);

  if (status === "loading") {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16">
        <div className="flex items-center gap-3 text-sm font-extrabold text-deepEmerald">
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          Loading entry...
        </div>
      </section>
    );
  }

  if (status === "error" || !entry) {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16 text-center">
        <div className="max-w-lg">
          <AlertCircle className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
          <h1 className="mt-4 font-serif text-4xl">Entry not found</h1>
          <p className="mt-3 text-charcoal/66">{error}</p>
          <Link
            to="/code-of-resonance"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to library
          </Link>
        </div>
      </section>
    );
  }

  const section = sectionForType(entry.contentType);
  const Icon = section.icon;
  const coverSrc = imageUrl(entry.coverImage, section.fallbackImage.src);
  const label = typeLabels[entry.contentType] || "The Code of Resonance";
  const ctaHref = safeExternalHref(entry.ctaUrl);

  return (
    <article className="bg-mistWhite">
      <header className="border-b border-sage py-12 sm:py-16 lg:py-20">
        <div className="container-shell min-w-0">
          <Link
            to={section.path}
            className="inline-flex max-w-full items-center gap-2 break-words text-sm font-extrabold text-deepEmerald transition hover:text-charcoal"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {section.label}
          </Link>

          <div className="mt-7 grid min-w-0 gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
            <div className="min-w-0">
              <p className="inline-flex max-w-full flex-wrap items-center gap-2 break-words rounded-full bg-mutedMint px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-deepEmerald sm:px-4 sm:tracking-[0.16em]">
                <Icon size={15} aria-hidden="true" />
                {label}
              </p>
              <h1 className="mt-5 break-words font-semibold text-xl leading-[1.05] text-charcoal text-balance sm:text-2xl lg:text-3xl">
                {entry.title}
              </h1>
              <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-charcoal/58">
                <span className="break-words">{entry.authorName || "Magdalene Wambui"}</span>
                {formatDate(entry.publishedAt || entry.updatedAt) ? <span className="break-words">{formatDate(entry.publishedAt || entry.updatedAt)}</span> : null}
                {entry.readingTimeMinutes ? (
                  <span className="inline-flex items-center gap-1 break-words">
                    <Clock size={14} aria-hidden="true" />
                    {entry.readingTimeMinutes} min read
                  </span>
                ) : null}
              </div>
              {entry.excerpt && <p className="mt-6 break-words text-l leading-8 text-charcoal/72 sm:text-lg sm:leading-9">{entry.excerpt}</p>}
            </div>

            <img
              src={coverSrc}
              srcSet={toSrcSet(entry.coverImage)}
              sizes="(min-width: 1024px) 48vw, 100vw"
              alt={entry.coverImage?.altText || entry.title}
              className="h-64 min-w-0 w-full rounded border border-sage object-cover shadow-[0_20px_50px_rgba(34,34,34,0.08)] sm:h-[360px] lg:h-[420px]"
            />
          </div>
        </div>
      </header>

      <div className="container-shell min-w-0 py-8 lg:py-15">
        <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,760px)_minmax(260px,320px)] xl:items-start">
          <div className="min-w-0">
            {entry.contentType === "case_study" && <CaseStudyOverview entry={entry} />}
            {entry.contentType === "reading_list" && <ReadingSource entry={entry} />}
            {entry.contentType === "testimonial" && <TransformationSnapshot entry={entry} />}

            {entry.body ? (
              <div
                className="code-entry-content text-lg leading-8 text-charcoal/78"
                dangerouslySetInnerHTML={{ __html: preparedBody.html }}
              />
            ) : (
              <div className="code-entry-content text-lg leading-8 text-charcoal/78">
                {entry.excerpt || "This entry is being prepared."}
              </div>
            )}
          </div>

          <EntryInsightRail
            entry={entry}
            tocItems={preparedBody.tocItems}
            ctaHref={ctaHref}
            onSubscribe={() => setSubscribeOpen(true)}
          />
        </div>
      </div>

      <CodeSubscribeModal
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
        source={`code_of_resonance_entry_${entry.contentType}`}
      />
    </article>
  );
}
