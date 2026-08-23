import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenText, FileText, Layers3, Mail, Quote, Sparkles } from "lucide-react";
import { listPublicCodeOfResonanceEntries } from "../../../services/api.js";
import { imageUrl } from "../../../utils/cloudinaryImage.js";
import CodeSubscribeModal from "../codeOfResonance/CodeSubscribeModal.jsx";
import { codeSectionList } from "../codeOfResonance/codeSections.js";
import { magnificImages, resources } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const fallbackIconByType = {
  guide: FileText,
  trust_resonance: Sparkles,
  essay: BookOpenText,
  reading_list: Layers3,
  case_study: Quote,
  testimonial: Quote
};

const labelByType = {
  guide: "Credibility Shift Guide",
  trust_resonance: "Trust & Resonance",
  essay: "Latest Essay",
  reading_list: "Recommended Reading",
  case_study: "Case Study",
  testimonial: "Transformation Story"
};

const fallbackImageByType = {
  guide: magnificImages.problem,
  trust_resonance: magnificImages.proof,
  essay: magnificImages.assessment,
  reading_list: magnificImages.problem,
  case_study: magnificImages.finalCta,
  testimonial: magnificImages.hero
};

const fallbackResourceMeta = [
  { label: "Guide", href: "/code-of-resonance/guides" },
  { label: "The Code of Resonance", href: "/code-of-resonance" },
  { label: "Essay", href: "/code-of-resonance/essays" },
  { label: "Reading List", href: "/code-of-resonance/recommended-reading" },
  { label: "Case Study", href: "/code-of-resonance/case-studies" }
];

const fallbackResources = resources.map((resource, index) => ({
  ...resource,
  label: fallbackResourceMeta[index]?.label || "Resource",
  href: fallbackResourceMeta[index]?.href || "/code-of-resonance"
}));

const entryToResource = (entry) => {
  const fallbackImage = fallbackImageByType[entry.contentType] || magnificImages.proof;
  return {
    title: entry.title,
    text: entry.excerpt || entry.seo?.description || entry.strategicGoal?.readerShift || "A new Code of Resonance entry is ready to read.",
    cta: entry.ctaText || "Read entry",
    href: entry.slug ? `/code-of-resonance/read/${entry.slug}` : entry.ctaUrl || "#code-of-resonance",
    icon: fallbackIconByType[entry.contentType] || Sparkles,
    image: {
      src: imageUrl(entry.coverImage, fallbackImage.src),
      alt: entry.coverImage?.altText || entry.title,
      objectPosition: "center"
    },
    label: labelByType[entry.contentType] || "The Code of Resonance"
  };
};

const uniqueByTitle = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.title?.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function ResourcesSection() {
  const [entries, setEntries] = useState([]);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    let active = true;
    listPublicCodeOfResonanceEntries({ limit: 5 })
      .then((response) => {
        if (!active) return;
        setEntries(response.data.items || []);
      })
      .catch(() => {
        if (!active) return;
        setEntries([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const connectedResources = useMemo(() => {
    const dynamicResources = entries.map(entryToResource);
    return uniqueByTitle([...dynamicResources, ...fallbackResources]).slice(0, 5);
  }, [entries]);
  const [featured = fallbackResources[0], ...supportingResources] = connectedResources;
  const libraryLinks = codeSectionList.filter((section) => section.key !== "all").slice(0, 5);

  return (
    <section
      id="code-of-resonance"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F5F7F4_0%,#FFFFFF_48%,#DCE8DF_100%)] py-16 sm:py-20 lg:py-28"
    >
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            <SectionEyebrow>Continue the Conversation</SectionEyebrow>
            <h2 className="max-w-5xl font-serif text-4xl leading-tight text-charcoal text-balance sm:text-4xl lg:text-5xl">
              Your assessment is only the beginning.
            </h2>
          </div>
          <p className="border-deepEmerald bg-white px-5 py-5 text-xl leading-9 text-charcoal/75 shadow-[0_16px_34px_rgba(34,34,34,0.045)] sm:px-7">
            These resources will help you uncover your earned credibility more deeply and become the trusted choice in your niche.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="overflow-hidden border border-charcoal bg-charcoal text-mistWhite shadow-[0_28px_68px_rgba(34,34,34,0.18)]">
            <div className="grid min-h-full lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[340px] lg:min-h-full">
                <img
                  src={featured.image.src}
                  alt={featured.image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: featured.image.objectPosition }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,34,34,0.02)_24%,rgba(34,34,34,0.66)_100%)]" aria-hidden="true" />
                <p className="absolute bottom-5 left-5 border border-mutedMint/30 bg-charcoal/86 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint backdrop-blur">
                  Featured resource
                </p>
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
                    {featured.label || "The Code of Resonance"}
                  </p>
                  <h3 className="mt-6 font-serif text-4xl leading-tight text-balance sm:text-5xl">
                    {featured.title}
                  </h3>
                  <p className="mt-5 text-lg leading-8 text-mistWhite/72">{featured.text}</p>
                </div>

                <div className="mt-8 border-t border-mutedMint/18 pt-6">
                  <a
                    href={featured.href || "/code-of-resonance"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mutedMint bg-mutedMint px-5 py-3 text-sm font-extrabold text-charcoal transition hover:border-mistWhite hover:bg-mistWhite sm:w-auto"
                  >
                    {featured.cta || "Read featured"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="border border-sage bg-white p-6 shadow-[0_18px_42px_rgba(34,34,34,0.055)] sm:p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                Browse the library
              </p>
              <div className="mt-5 divide-y divide-sage border-y border-sage">
                {libraryLinks.map((section) => {
                  const Icon = section.icon;

                  return (
                    <a
                      key={section.key}
                      href={section.path}
                      className="group grid grid-cols-[34px_1fr_20px] items-center gap-3 py-3 text-charcoal transition hover:text-deepEmerald"
                    >
                      <Icon className="text-deepEmerald" size={20} aria-hidden="true" />
                      <span className="text-sm font-extrabold uppercase tracking-[0.06em]">
                        {section.label}
                      </span>
                      <ArrowRight className="transition group-hover:translate-x-1" size={16} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="bg-deepEmerald p-6 text-mistWhite shadow-[0_24px_58px_rgba(11,110,79,0.18)] sm:p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
                The Code of Resonance
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight">
                Receive new trust-building notes.
              </h3>
              <p className="mt-3 text-sm leading-6 text-mistWhite/74">
                Subscribe for essays, reading notes, and practical prompts on earned credibility.
              </p>
              <button
                type="button"
                onClick={() => setSubscribeOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-charcoal bg-white px-5 py-3 text-sm font-bold text-gray-900 transition hover:border-mistWhite hover:bg-mistWhite hover:text-charcoal"
              >
                <Mail size={16} aria-hidden="true" />
                Subscribe
              </button>
            </div>
          </aside>
        </div>

 
        <CodeSubscribeModal
          open={subscribeOpen}
          onClose={() => setSubscribeOpen(false)}
          source="code_of_resonance_home"
        />
      </div>
    </section>
  );
}
