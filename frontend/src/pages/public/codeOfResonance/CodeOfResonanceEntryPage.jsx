import { useEffect, useState } from "react";
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
        <h2 className="mt-3 break-words font-serif text-2xl leading-tight sm:text-3xl">
          {clientName || "Transformation snapshot"}
        </h2>
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)]">
        <div className="min-w-0 p-4 sm:p-6">
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

      {highlights.length > 0 && (
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
      )}
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
      <h2 className="mt-3 break-words font-serif text-2xl leading-tight text-charcoal">{source.title || "Source"}</h2>
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
        <h2 className="mt-3 break-words font-serif text-2xl leading-tight text-charcoal">
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
  const sidebarLabel =
    entry.contentType === "case_study"
      ? "Result"
      : entry.contentType === "testimonial"
        ? "After"
        : entry.contentType === "reading_list"
          ? "Why it matters"
          : "Reader Shift";
  const sidebarText =
    entry.contentType === "case_study"
      ? entry.caseStudy?.result || entry.strategicGoal?.readerShift
      : entry.contentType === "testimonial"
        ? entry.testimonial?.after || entry.strategicGoal?.readerShift
        : entry.editorialPlan?.thesis || entry.strategicGoal?.readerShift;

  return (
    <article className="overflow-hidden bg-mistWhite">
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
              <h1 className="mt-5 break-words font-serif text-[2rem] leading-[1.05] text-charcoal text-balance sm:text-4xl lg:text-5xl">
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
              {entry.excerpt && <p className="mt-6 break-words text-lg leading-8 text-charcoal/72 sm:text-xl sm:leading-9">{entry.excerpt}</p>}
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

      <div className="container-shell min-w-0 py-10 lg:py-16">
        <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,760px)_minmax(260px,320px)] xl:items-start">
          <div className="min-w-0">
            {entry.contentType === "case_study" && <CaseStudyOverview entry={entry} />}
            {entry.contentType === "reading_list" && <ReadingSource entry={entry} />}
            {entry.contentType === "testimonial" && <TransformationSnapshot entry={entry} />}

            {entry.body ? (
              <div
                className="code-entry-content text-lg leading-8 text-charcoal/78"
                dangerouslySetInnerHTML={{ __html: entry.body }}
              />
            ) : (
              <div className="code-entry-content text-lg leading-8 text-charcoal/78">
                {entry.excerpt || "This entry is being prepared."}
              </div>
            )}
          </div>

          <aside className="min-w-0 rounded border border-charcoal bg-charcoal p-5 text-mistWhite shadow-[0_18px_45px_rgba(34,34,34,0.16)] xl:sticky xl:top-28">
            <p className="break-words text-xs font-extrabold uppercase tracking-[0.14em] text-mutedMint sm:tracking-[0.16em]">{sidebarLabel}</p>
            <p className="mt-3 break-words text-sm leading-6 text-mistWhite/72">
              {sidebarText ||
                "Move from quiet expertise to visible, earned credibility."}
            </p>

            {(entry.tags || []).length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="max-w-full break-words rounded-full border border-mistWhite/15 px-3 py-1 text-xs font-bold text-mistWhite/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {ctaHref && (
              <a
                href={ctaHref}
                className="mt-7 inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full bg-mutedMint px-5 py-3 text-center text-sm font-extrabold text-charcoal transition hover:bg-mistWhite"
              >
                <span className="min-w-0 break-words">{entry.ctaText || "Take the next step"}</span>
                <ArrowRight className="shrink-0" size={16} aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="mt-3 inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-mistWhite/20 px-5 py-3 text-center text-sm font-extrabold text-mutedMint transition hover:border-mutedMint hover:bg-mutedMint hover:text-charcoal"
            >
              <Mail className="shrink-0" size={16} aria-hidden="true" />
              <span className="min-w-0 break-words">Subscribe</span>
            </button>
          </aside>
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
