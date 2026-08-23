import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, Clock, Loader2, Mail } from "lucide-react";
import { listPublicCodeOfResonanceEntries } from "../../../services/api.js";
import { imageUrl, toSrcSet } from "../../../utils/cloudinaryImage.js";
import CodeSubscribeModal from "./CodeSubscribeModal.jsx";
import { codeSectionList, codeSections, sectionForType, typeLabels } from "./codeSections.js";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

function SectionTabs({ activeKey }) {
  return (
    <nav className="mt-8 flex w-full min-w-0 gap-2 overflow-x-auto pb-2" aria-label="Code of Resonance sections">
      {codeSectionList.map((section) => (
        <Link
          key={section.key}
          to={section.path}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold transition ${
            activeKey === section.key
              ? "border-deepEmerald bg-deepEmerald text-mistWhite"
              : "border-charcoal/12 bg-mistWhite text-charcoal/70 hover:border-deepEmerald hover:text-deepEmerald"
          }`}
        >
          {section.label}
        </Link>
      ))}
    </nav>
  );
}

function EntryCard({ entry, featured = false }) {
  const section = sectionForType(entry.contentType);
  const Icon = section.icon;
  const coverSrc = imageUrl(entry.coverImage, section.fallbackImage.src);
  const label = typeLabels[entry.contentType] || "The Code of Resonance";

  return (
    <article
      className={`group overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_16px_36px_rgba(34,34,34,0.04)] transition hover:border-deepEmerald/40 hover:bg-white ${
        featured ? "lg:grid lg:grid-cols-[0.95fr_1.05fr]" : ""
      }`}
    >
      <Link to={`/code-of-resonance/read/${entry.slug}`} className="block overflow-hidden bg-sage">
        <img
          src={coverSrc}
          srcSet={toSrcSet(entry.coverImage)}
          sizes={featured ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 31vw, 100vw"}
          alt={entry.coverImage?.altText || entry.title}
          loading={featured ? "eager" : "lazy"}
          className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
            featured ? "h-full min-h-[340px]" : "h-56"
          }`}
        />
      </Link>
      <div className={featured ? "p-7 sm:p-9" : "p-5"}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">
          <span className="inline-flex items-center gap-1 rounded-full bg-mutedMint px-3 py-1">
            <Icon size={13} aria-hidden="true" />
            {label}
          </span>
          {entry.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1 text-charcoal/45">
              <Clock size={13} aria-hidden="true" />
              {entry.readingTimeMinutes} min
            </span>
          ) : null}
        </div>
        <Link to={`/code-of-resonance/read/${entry.slug}`} className="mt-5 block">
          <h2 className={`font-serif leading-tight text-charcoal text-balance ${featured ? "text-2xl sm:text-3xl" : "text-2xl"}`}>
            {entry.title}
          </h2>
        </Link>
        <p className={`mt-4 leading-7 text-charcoal/70 ${featured ? "text-lg" : "text-sm"}`}>
          {entry.excerpt || entry.seo?.description || entry.strategicGoal?.readerShift || "A new trust-building note is ready to read."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {(entry.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-sage px-3 py-1 text-xs font-bold text-charcoal/58">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-charcoal/45">{formatDate(entry.updatedAt || entry.publishedAt)}</p>
          <Link
            to={`/code-of-resonance/read/${entry.slug}`}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-deepEmerald transition hover:text-charcoal"
          >
            Read
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ section }) {
  return (
    <div className="rounded border border-sage bg-sage/45 p-8 text-center">
      <AlertCircle className="mx-auto text-deepEmerald" size={30} aria-hidden="true" />
      <h2 className="mt-4 font-serif text-3xl">No public entries yet.</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-charcoal/66">
        When the admin marks {section.title.toLowerCase()} entries as ready, they will appear here automatically.
      </p>
    </div>
  );
}

function SubscribeBand({ section, onSubscribe }) {
  return (
    <div className="mt-10 flex flex-col gap-5 rounded border border-charcoal bg-charcoal p-5 text-mistWhite shadow-[0_24px_58px_rgba(34,34,34,0.18)] lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Stay with the work</p>
        <h2 className="mt-2 font-serif text-2xl leading-tight">Receive new {section.title} notes.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-mistWhite/62">
          Join The Code of Resonance for trust-building essays, resources, and practical credibility prompts.
        </p>
      </div>
      <button
        type="button"
        onClick={onSubscribe}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mutedMint bg-mutedMint px-5 py-3 text-sm font-extrabold text-charcoal transition hover:border-mistWhite hover:bg-mistWhite sm:w-max"
      >
        <Mail size={16} aria-hidden="true" />
        Subscribe
      </button>
    </div>
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
    let active = true;
    setStatus("loading");
    setError("");

    listPublicCodeOfResonanceEntries(query)
      .then((response) => {
        if (!active) return;
        setEntries(response.data.items || []);
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

  const [featured, ...supportingEntries] = entries;

  return (
    <section className="bg-mistWhite py-14 sm:py-18 lg:py-24">
      <div className="container-shell">
        <div className="grid gap-8 border-b border-sage pb-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-mutedMint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
              <Icon size={15} aria-hidden="true" />
              {section.eyebrow}
            </p>
            <h1 className="mt-5 font-serif text-3xl leading-tight text-charcoal text-balance sm:text-4xl">
              {section.title}
            </h1>
          </div>
          <div className="min-w-0">
            {/* <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
            >
              <Mail size={16} aria-hidden="true" />
              Subscribe
            </button> */}
            <SectionTabs activeKey={section.key} />
          </div>
        </div>

        {status === "loading" && (
          <div className="grid min-h-[360px] place-items-center">
            <div className="flex items-center gap-3 text-sm font-extrabold text-deepEmerald">
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              Loading entries...
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-10 rounded border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {status === "ready" && entries.length === 0 && (
          <div className="mt-10">
            <EmptyState section={section} />
          </div>
        )}

        {status === "ready" && entries.length > 0 && (
          <div className="mt-10">
            <EntryCard entry={featured} featured />
            {supportingEntries.length > 0 && (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {supportingEntries.map((entry) => (
                  <EntryCard key={entry._id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}

        <SubscribeBand section={section} onSubscribe={() => setSubscribeOpen(true)} />
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
