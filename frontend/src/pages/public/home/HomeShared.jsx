import { ArrowRight, CheckCircle2 } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";

export function SectionEyebrow({ children, light = false }) {
  return (
    <p className={`mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] ${light ? "text-mutedMint" : "text-deepEmerald"}`}>
      <span className={`h-px w-8 ${light ? "bg-mutedMint" : "bg-deepEmerald"}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function DarkTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(207,229,216,0.12),transparent_34%,rgba(34,34,34,0.28)),linear-gradient(180deg,rgba(245,247,244,0.08),transparent_48%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-mistWhite/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-mistWhite/10" />
    </div>
  );
}

const imageSizes = {
  compact: "h-[178px]",
  standard: "h-[280px] sm:h-[340px]",
  hero: "h-[360px] sm:h-[460px] lg:h-[560px]",
  editorial: "h-[320px] sm:h-[420px] lg:h-[500px]",
  tall: "h-[440px] sm:h-[520px]"
};

export function MagnificImage({
  image,
  src,
  alt,
  className = "",
  dark = false,
  priority = false,
  size = "standard",
  objectPosition = "center"
}) {
  const imageSrc = src ?? image?.src;
  const imageAlt = alt ?? image?.alt ?? "";
  const resolvedPosition = image?.objectPosition ?? objectPosition;
  const resolvedSize = imageSizes[size] ?? imageSizes.standard;

  return (
    <div
      className={`group relative overflow-hidden rounded border ${
        dark
          ? "border-mistWhite/20 bg-mistWhite/[0.06] shadow-[0_24px_50px_rgba(0,0,0,0.28)]"
          : "border-sage bg-sage/30 shadow-[0_14px_32px_rgba(34,34,34,0.05)]"
      } ${className}`}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        referrerPolicy="no-referrer"
        className={`${resolvedSize} w-full object-cover transition duration-700 group-hover:scale-[1.025]`}
        style={{ objectPosition: resolvedPosition }}
      />
      <div
        className={`pointer-events-none absolute inset-0 ${
          dark
            ? "bg-[linear-gradient(180deg,rgba(34,34,34,0.04),rgba(34,34,34,0.38)),linear-gradient(115deg,rgba(11,110,79,0.28),transparent_46%)]"
            : "bg-[linear-gradient(180deg,rgba(245,247,244,0),rgba(245,247,244,0.2)),linear-gradient(115deg,rgba(11,110,79,0.16),transparent_45%)]"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

export function ResourceCard({ resource }) {
  const Icon = resource.icon;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_18px_40px_rgba(34,34,34,0.05)]">
      <MagnificImage image={resource.image} size="compact" className="border-0 shadow-none" />
      <div className="flex flex-1 flex-col p-5">
        <Icon className="text-deepEmerald" size={24} aria-hidden="true" />
        <h3 className="mt-4 font-serif text-2xl leading-tight text-balance">{resource.title}</h3>
        <p className="mt-3 text-sm leading-6 text-charcoal/75">{resource.text}</p>
      <a href={resource.href || "#code-of-resonance"} className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-deepEmerald transition group-hover:gap-3">
        {resource.cta}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
      </div>
    </article>
  );
}

export function OfferCard({ offer }) {
  const featured = offer.featured;
  const visibleBullets = offer.bullets.slice(0, 4);
  const remainingBullets = Math.max(offer.bullets.length - visibleBullets.length, 0);

  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded border p-5 shadow-[0_16px_34px_rgba(34,34,34,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(34,34,34,0.09)] sm:p-6 xl:min-h-[620px] ${
      featured
        ? "border-charcoal bg-charcoal text-mistWhite"
        : "border-sage bg-white text-charcoal"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <p className={`text-xs font-extrabold uppercase tracking-[0.14em] ${featured ? "text-mutedMint" : "text-deepEmerald"}`}>
          {offer.investment}
        </p>
        {featured && (
          <p className="shrink-0 rounded-full border border-mutedMint/45 bg-mutedMint/12 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-mutedMint">
            Best next step
          </p>
        )}
      </div>

      <h3 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl">{offer.title}</h3>
      <p className={`mt-3 text-base leading-7 ${featured ? "text-mistWhite/84" : "text-charcoal/76"}`}>{offer.subtitle}</p>

      <div className={`mt-5 border-y py-4 ${featured ? "border-mistWhite/18" : "border-sage"}`}>
        <p className={`text-[0.68rem] font-extrabold uppercase tracking-[0.14em] ${featured ? "text-mistWhite/62" : "text-charcoal/58"}`}>Best fit</p>
        <p className={`mt-2 text-sm leading-6 ${featured ? "text-mistWhite/76" : "text-charcoal/72"}`}>{offer.fit}</p>
      </div>

      <ul className="mt-5 space-y-2.5 pb-6">
        {visibleBullets.map((bullet) => (
          <li key={bullet} className={`flex gap-3 text-sm leading-6 ${featured ? "text-mistWhite/72" : "text-charcoal/75"}`}>
            <CheckCircle2 className={`mt-0.5 shrink-0 ${featured ? "text-mutedMint" : "text-deepEmerald"}`} size={18} aria-hidden="true" />
            <span>{bullet}</span>
          </li>
        ))}
        {remainingBullets > 0 && (
          <li className={`pt-1 text-sm font-semibold ${featured ? "text-mutedMint" : "text-deepEmerald"}`}>
            + {remainingBullets} more roadmap elements
          </li>
        )}
      </ul>

      <div className="mt-auto pt-5">
        <SiteButton
          to={offer.href || "/offers"}
          variant={featured ? "brandOnDark" : "lightPrimary"}
          className="w-full px-4"
        >
          {offer.cta}
          <ArrowRight size={16} aria-hidden="true" />
        </SiteButton>
      </div>
    </article>
  );
}
