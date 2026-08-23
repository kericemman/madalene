import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Loader2, Mail } from "lucide-react";
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

  return (
    <article className="bg-mistWhite">
      <header className="border-b border-sage py-12 sm:py-16 lg:py-20">
        <div className="container-shell">
          <Link
            to={section.path}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-deepEmerald transition hover:text-charcoal"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {section.label}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-mutedMint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                <Icon size={15} aria-hidden="true" />
                {label}
              </p>
              <h1 className="mt-5 font-serif text-3xl leading-tight text-charcoal text-balance sm:text-4xl">
                {entry.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-charcoal/58">
                <span>{entry.authorName || "Magdalene Wambui"}</span>
                {formatDate(entry.publishedAt || entry.updatedAt) ? <span>{formatDate(entry.publishedAt || entry.updatedAt)}</span> : null}
                {entry.readingTimeMinutes ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} aria-hidden="true" />
                    {entry.readingTimeMinutes} min read
                  </span>
                ) : null}
              </div>
              {entry.excerpt && <p className="mt-6 text-xl leading-9 text-charcoal/72">{entry.excerpt}</p>}
            </div>

            <img
              src={coverSrc}
              srcSet={toSrcSet(entry.coverImage)}
              sizes="(min-width: 1024px) 48vw, 100vw"
              alt={entry.coverImage?.altText || entry.title}
              className="h-[320px] w-full rounded border border-sage object-cover shadow-[0_20px_50px_rgba(34,34,34,0.08)] sm:h-[420px]"
            />
          </div>
        </div>
      </header>

      <div className="container-shell py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_300px] lg:items-start">
          <div>
            {entry.body ? (
              <div
                className="code-entry-content rounded border border-sage bg-white p-6 text-lg leading-8 text-charcoal/78 shadow-[0_16px_36px_rgba(34,34,34,0.035)] sm:p-8"
                dangerouslySetInnerHTML={{ __html: entry.body }}
              />
            ) : (
              <div className="rounded border border-sage bg-white p-6 text-lg leading-8 text-charcoal/78 shadow-[0_16px_36px_rgba(34,34,34,0.035)] sm:p-8">
                {entry.excerpt || "This entry is being prepared."}
              </div>
            )}
          </div>

          <aside className="rounded border border-charcoal bg-charcoal p-5 text-mistWhite shadow-[0_18px_45px_rgba(34,34,34,0.16)] lg:sticky lg:top-28">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">Reader Shift</p>
            <p className="mt-3 text-sm leading-6 text-mistWhite/72">
              {entry.strategicGoal?.readerShift ||
                entry.editorialPlan?.thesis ||
                "Move from quiet expertise to visible, earned credibility."}
            </p>

            {(entry.tags || []).length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-mistWhite/15 px-3 py-1 text-xs font-bold text-mistWhite/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {ctaHref && (
              <a
                href={ctaHref}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mutedMint px-5 py-3 text-sm font-extrabold text-charcoal transition hover:bg-mistWhite"
              >
                {entry.ctaText || "Take the next step"}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-mistWhite/20 px-5 py-3 text-sm font-extrabold text-mutedMint transition hover:border-mutedMint hover:bg-mutedMint hover:text-charcoal"
            >
              <Mail size={16} aria-hidden="true" />
              Subscribe
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
