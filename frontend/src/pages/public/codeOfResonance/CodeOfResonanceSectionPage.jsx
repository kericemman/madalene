import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, Clock, Loader2, Mail, Sparkles } from "lucide-react";
import { listPublicCodeOfResonanceEntries } from "../../../services/api.js";
import { imageUrl, toSrcSet } from "../../../utils/cloudinaryImage.js";
import CodeSubscribeModal from "./CodeSubscribeModal.jsx";
import { codeSectionList, codeSections, sectionForType, typeLabels } from "./codeSections.js";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

function SectionPills({ activeKey }) {
  return (
    <nav className="flex w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Code sections">
      {codeSectionList.map((section) => {
        const isActive = activeKey === section.key;
        return (
          <Link
            key={section.key}
            to={section.path}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              isActive
                ? "bg-deepEmerald text-mistWhite shadow-sm ring-1 ring-deepEmerald"
                : "bg-sage/30 text-charcoal/70 hover:bg-sage/60 hover:text-charcoal"
            }`}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}

function FeaturedHeroCard({ entry }) {
  const section = sectionForType(entry.contentType);
  const Icon = section.icon;
  const coverSrc = imageUrl(entry.coverImage, section.fallbackImage?.src);
  const label = typeLabels[entry.contentType] || "Framework Note";
  const targetUrl = `/code-of-resonance/read/${entry.slug}`;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-xl transition-all hover:shadow-2xl">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(145deg,#0F4D3E_0%,#1A1A1A_58%,#B8D8C5_145%)] sm:min-h-[420px] lg:min-h-[520px]">
          <img
            src={coverSrc}
            srcSet={toSrcSet(entry.coverImage)}
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt={entry.coverImage?.altText || entry.title}
            loading="eager"
            className="absolute inset-0 h-full w-full object-contain p-3 transition duration-500 ease-out group-hover:brightness-105 sm:p-5"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent lg:hidden" />
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mutedMint/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-deepEmerald">
                <Icon size={13} aria-hidden="true" />
                {label}
              </span>
              {entry.readingTimeMinutes && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal/50">
                  <Clock size={13} />
                  {entry.readingTimeMinutes} min read
                </span>
              )}
            </div>

            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-charcoal">
              <Link to={targetUrl} className="hover:text-deepEmerald transition-colors focus:outline-none">
                <span className="absolute inset-0 z-10" aria-hidden="true" />
                {entry.title}
              </Link>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-charcoal/75 line-clamp-3">
              {entry.excerpt || entry.seo?.description || entry.strategicGoal?.readerShift}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-sage/60 pt-6">
            <span className="text-xs font-semibold text-charcoal/50">
              {formatDate(entry.publishedAt || entry.updatedAt)}
            </span>
            <Link
              to={targetUrl}
              className="relative z-20 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-xs font-extrabold text-deepEmerald transition-transform hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-deepEmerald focus-visible:ring-offset-2 sm:text-sm"
            >
              <span>Read insight</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function StandardCard({ entry }) {
  const section = sectionForType(entry.contentType);
  const Icon = section.icon;
  const coverSrc = imageUrl(entry.coverImage, section.fallbackImage?.src);
  const label = typeLabels[entry.contentType] || "Framework Note";
  const targetUrl = `/code-of-resonance/read/${entry.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-sage/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-deepEmerald/50 hover:shadow-md">
      <div className="relative h-52 w-full overflow-hidden bg-sage/30">
        <img
          src={coverSrc}
          srcSet={toSrcSet(entry.coverImage)}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          alt={entry.coverImage?.altText || entry.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-deepEmerald">
              <Icon size={12} />
              {label}
            </span>
            {entry.readingTimeMinutes && (
              <span className="text-charcoal/45 font-medium">{entry.readingTimeMinutes}m</span>
            )}
          </div>

          <h3 className="mt-3 font-serif text-base sm:text-lg font-bold leading-snug text-charcoal group-hover:text-deepEmerald transition-colors">
            <Link to={targetUrl} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {entry.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-xs leading-relaxed text-charcoal/65 line-clamp-2">
            {entry.excerpt || entry.seo?.description || entry.strategicGoal?.readerShift}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-sage/40 pt-4">
          <span className="text-[11px] font-semibold text-charcoal/45">
            {formatDate(entry.publishedAt || entry.updatedAt)}
          </span>
          <Link
            to={targetUrl}
            className="relative z-20 inline-flex min-h-11 items-center gap-1 rounded-full px-1 text-xs font-bold text-deepEmerald transition-transform hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-deepEmerald focus-visible:ring-offset-2"
          >
            <span>Read</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ section }) {
  return (
    <div className="rounded-3xl border border-dashed border-sage/80 bg-white/50 p-12 text-center backdrop-blur-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/30 text-deepEmerald">
        <Sparkles size={20} />
      </div>
      <h3 className="mt-4 font-serif text-2xl font-bold text-charcoal">No notes available in this stream yet</h3>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-charcoal/60">
        New perspectives and field guides for {section.title.toLowerCase()} are currently in progress.
      </p>
    </div>
  );
}

function SubscribeBlock({ sectionTitle, onOpen }) {
  return (
    <aside className="mt-16 overflow-hidden rounded-3xl bg-charcoal p-8 sm:p-10 text-mistWhite shadow-xl relative">
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The Resonance Dispatch</span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold">Ground your positioning in earned clarity.</h2>
          <p className="mt-2 text-xs leading-relaxed text-mistWhite/70">
            Bi-weekly philosophical frameworks, real case proof, and field prompts from Magdalene delivered straight to your inbox.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-mutedMint px-6 py-3.5 text-xs font-extrabold text-charcoal transition-transform duration-200 hover:scale-[1.02] hover:bg-white active:scale-95 shrink-0"
        >
          <Mail size={15} />
          <span>Subscribe to the Code</span>
        </button>
      </div>
    </aside>
  );
}

export default function CodeOfResonanceSectionPage({ sectionKey = "all" }) {
  const section = codeSections[sectionKey] || codeSections.all;
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const Icon = section.icon;

  const query = useMemo(() => {
    const params = { limit: 24 };
    if (section.contentType) params.contentType = section.contentType;
    return params;
  }, [section.contentType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sectionKey]);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError("");

    listPublicCodeOfResonanceEntries(query)
      .then((response) => {
        if (!active) return;
        setEntries(response.data?.items || []);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "Could not load Code of Resonance entries.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [query]);

  useEffect(() => {
    if (searchParams.get("subscribe") !== "1") return;

    setSubscribeOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("subscribe");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Deterministic featured selection: explicit flag first, fallback to newest
  const { featuredEntry, gridEntries } = useMemo(() => {
    if (!entries.length) return { featuredEntry: null, gridEntries: [] };
    const explicitIndex = entries.findIndex((e) => e.featured);

    if (explicitIndex > -1) {
      const hero = entries[explicitIndex];
      const rest = entries.filter((_, idx) => idx !== explicitIndex);
      return { featuredEntry: hero, gridEntries: rest };
    }

    return { featuredEntry: entries[0], gridEntries: entries.slice(1) };
  }, [entries]);

  return (
    <section className="min-h-screen bg-[#FAF9F6] py-8 sm:py-10 lg:py-15 text-charcoal">
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
        
        {/* Header Section */}
        <header className="border-b border-sage/60 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mutedMint/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-deepEmerald">
                <Icon size={14} aria-hidden="true" />
                <span>{section.eyebrow}</span>
              </span>
              <h1 className="mt-7 font-serif text-xl sm:text-3xl font-bold tracking-tight text-charcoal text-balance">
                {section.title}
              </h1>
            </div>
            <div className="w-full lg:w-auto">
              <SectionPills activeKey={section.key} />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="mt-10">
          {status === "loading" && (
            <div className="grid min-h-[360px] place-items-center">
              <div className="flex items-center gap-3 text-sm font-extrabold text-deepEmerald">
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                <span>Loading entries...</span>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {status === "ready" && entries.length === 0 && (
            <div className="mt-10">
              <EmptyState section={section} />
            </div>
          )}

          {status === "ready" && entries.length > 0 && (
            <div className="space-y-10">
              {featuredEntry && <FeaturedHeroCard entry={featuredEntry} />}
              {gridEntries.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gridEntries.map((entry) => (
                    <StandardCard key={entry._id} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <SubscribeBlock sectionTitle={section.title} onOpen={() => setSubscribeOpen(true)} />

        <CodeSubscribeModal
          open={subscribeOpen}
          onClose={() => setSubscribeOpen(false)}
          source={`code_of_resonance_${section.key}`}
          title={`Subscribe to ${section.title}`}
        />
      </div>
    </section>
  );
}
