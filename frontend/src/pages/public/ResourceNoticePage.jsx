import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, BookOpenText, Loader2, LockKeyhole, Sparkles } from "lucide-react";
import ResponsiveImage from "../../components/ResponsiveImage.jsx";
import { getRecommendedResource } from "../../services/api.js";

const oneToOneBookingUrl =
  import.meta.env.VITE_ONE_TO_ONE_BOOKING_URL ||
  "https://calendly.com/wambui-magdalene/content-that-connects";

const resolveHref = (value) => {
  const rawValue = String(value || oneToOneBookingUrl).trim();
  if (/^(https:|mailto:|tel:)/i.test(rawValue)) return rawValue;
  return rawValue.startsWith("/") ? rawValue : `/${rawValue}`;
};

const isExternalHref = (value) => /^(https:|mailto:|tel:)/i.test(String(value || ""));

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const textToHtml = (value = "") =>
  String(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");

function ReaderAction({ href, children, variant = "primary" }) {
  const className =
    variant === "secondary"
      ? "inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald/20 px-5 py-3 text-sm font-extrabold text-deepEmerald transition hover:border-deepEmerald hover:bg-sage"
      : "inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal";

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

function LockedResource({ message }) {
  return (
    <section className="bg-mistWhite py-16 sm:py-24">
      <div className="container-shell grid min-h-[58vh] place-items-center">
        <div className="max-w-2xl rounded border border-sage bg-white p-7 text-center shadow-[0_18px_44px_rgba(26,26,26,0.06)] sm:p-10">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-mutedMint text-deepEmerald">
            <LockKeyhole size={22} aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
            Private assessment resource
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-charcoal sm:text-5xl">
            This resource opens after the assessment recommends it.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-charcoal/68">
            {message ||
              "Take the Earned Credibility assessment first. Your result will show the resource links that match your score and your biggest credibility gaps."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ReaderAction href="/assessment">
              Take the assessment
              <ArrowRight size={16} aria-hidden="true" />
            </ReaderAction>
            <ReaderAction href="/code-of-resonance/subscribe" variant="secondary">
              Subscribe to the Code
            </ReaderAction>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResourceNoticePage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [resource, setResource] = useState(null);
  const [status, setStatus] = useState(token ? "loading" : "locked");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!token) {
      setStatus("locked");
      return;
    }

    let active = true;
    setStatus("loading");
    setError("");

    getRecommendedResource(slug, token)
      .then((response) => {
        if (!active) return;
        setResource(response.data.resource);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "This private resource link is unavailable.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [slug, token]);

  const content = resource?.content || {};
  const articleHtml = useMemo(
    () => content.bodyHtml || textToHtml(content.text || ""),
    [content.bodyHtml, content.text]
  );
  const ctaHref = resolveHref(content.ctaUrl || resource?.relatedOffer?.ctaUrl || oneToOneBookingUrl);
  const resultHref = token ? `/results/${encodeURIComponent(token)}` : "/assessment";

  if (status === "locked") return <LockedResource />;

  if (status === "loading") {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16">
        <div className="flex items-center gap-3 text-sm font-extrabold text-deepEmerald">
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          Loading your resource...
        </div>
      </section>
    );
  }

  if (status === "error" || !resource) {
    return <LockedResource message={error} />;
  }

  return (
    <section className="bg-mistWhite py-10 sm:py-14 lg:py-20">
      <div className="container-shell">
        <Link
          to={resultHref}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-deepEmerald underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to your result
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <main className="min-w-0">
            <div className="rounded border border-sage bg-white p-5 shadow-[0_18px_44px_rgba(26,26,26,0.045)] sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-mutedMint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  <BookOpenText size={15} aria-hidden="true" />
                  Recommended Resource
                </span>
                {resource.relatedWeakestCategory && (
                  <span className="rounded-full border border-sage px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/58">
                    {resource.relatedWeakestCategory} gap
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-serif text-4xl leading-tight text-charcoal text-balance sm:text-5xl lg:text-6xl">
                {content.title || resource.title}
              </h1>
              {(content.intro || resource.description) && (
                <p className="mt-5 max-w-3xl text-base leading-8 text-charcoal/70 sm:text-lg">
                  {content.intro || resource.description}
                </p>
              )}

              {articleHtml ? (
                <article
                  className="resource-content mt-9 border-t border-sage pt-8"
                  dangerouslySetInnerHTML={{ __html: articleHtml }}
                />
              ) : (
                <div className="mt-9 border-t border-sage pt-8">
                  <div className="flex gap-3 rounded border border-sage bg-mistWhite p-4 text-sm text-charcoal/68">
                    <AlertCircle className="mt-0.5 shrink-0 text-deepEmerald" size={18} aria-hidden="true" />
                    <p>This resource has been created, but its reader content has not been added yet.</p>
                  </div>
                </div>
              )}
            </div>
          </main>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded border border-sage bg-white shadow-[0_18px_44px_rgba(26,26,26,0.06)]">
              {resource.coverImage ? (
                <ResponsiveImage
                  media={resource.coverImage}
                  alt={resource.coverImage.altText || resource.title}
                  className="aspect-[4/5] w-full object-cover"
                  sizes="(min-width: 1024px) 340px, 100vw"
                />
              ) : (
                <div className="grid aspect-[4/5] place-items-end bg-[linear-gradient(150deg,#0F4D3E_0%,#174C41_48%,#B8D8C5_100%)] p-6 text-mistWhite">
                  <div>
                    <Sparkles size={24} aria-hidden="true" />
                    <p className="mt-4 font-serif text-3xl leading-tight">Your next credibility move.</p>
                  </div>
                </div>
              )}

              <div className="p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  Why you are seeing this
                </p>
                <p className="mt-3 text-sm leading-7 text-charcoal/68">
                  This resource was matched to your assessment result so you can work on the gap with the highest strategic value first.
                </p>
                <div className="mt-5 grid gap-3">
                  <ReaderAction href={ctaHref}>
                    {content.ctaText || "Book a 1:1 Call"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </ReaderAction>
                  <ReaderAction href={resultHref} variant="secondary">
                    View full result
                  </ReaderAction>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
