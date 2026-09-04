import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Quote,
  ShieldCheck,
  Star,
  Waves
} from "lucide-react";
import SiteButton from "../../components/SiteButton.jsx";
import { listPublicMediaAssets, listPublicReviews } from "../../services/api.js";
import { imageUrl, toSrcSet } from "../../utils/cloudinaryImage.js";
import { magnificImages } from "./home/homeContent.js";
import { MagnificImage } from "./home/HomeShared.jsx";

const chapters = [
  {
    id: "origin",
    num: "01",
    label: "The Beginning",
    title: "Where It Began",
    lead: "I did not build my authority by becoming more impressive. I built it by finally recognising the credibility I had already earned.",
    content: [
      "When I came to LinkedIn, I did what many experts do: I looked around. Other people seemed further ahead. More certifications. More established careers. More reasons, at least on paper, to be taken seriously.",
      "For a while, I thought the answer was to catch up. I thought credibility was something you had to collect from institutions before you had permission to speak."
    ]
  },
  {
    id: "shift",
    num: "02",
    label: "The Realisation",
    title: "What I Had Been Measuring Wrong",
    lead: "I had been measuring credibility by what could be written after someone's name, while overlooking everything life had written into mine.",
    content: [
      "My understanding of wellness was not formed by academic theory alone. It was shaped by grief. By living in a body that had known the exhaustion of severe anaemia. By experiences that forced me to understand resilience, identity, and what it truly takes to be seen.",
      "For years, I believed lived experience belonged on one side and professional credibility belonged on the other. They do not. The friction that builds us influences how we listen, what we diagnose, and the work we become uniquely equipped to deliver."
    ]
  },
  {
    id: "evidence",
    num: "03",
    label: "The Proof",
    title: "The Recognition",
    lead: "The accolades did not become the philosophy. They became tangible proof of it.",
    content: [
      "Instead of trying to look like everybody else's version of an expert, I brought lived depth and strategic rigor into alignment. When you stop mimicking playbooks and position what is already true, resonance is inevitable.",
      "Today, that perspective has built a global community of 33,000+ practitioners, placed me as the #1 Wellness Personal Brand globally, and established my ranking as Kenya's leading personal brand voice. Those titles are not trophies—they are evidence that earned clarity works."
    ]
  },
  {
    id: "philosophy",
    num: "04",
    label: "The Mission",
    title: "Why Earned Credibility Exists",
    lead: "You may not need more credentials. You need to position the credibility you have already earned.",
    content: [
      "That is the premise behind Earned Credibility™, The Code of Resonance, and my advisory work inside DISCERN™. I built this framework because I had to uncover it for myself first.",
      "Now, my focus is helping experienced practitioners stop hiding the very lived depth and singular insights that make them the natural Trusted Choice™."
    ]
  }
];

const prestigeMetrics = [
  { value: "33K+", label: "LinkedIn Audience", detail: "Global executive & expert readership" },
  { value: "#1", label: "Global Wellness Brand", detail: "Ranked #1 Personal Brand globally" },
  { value: "Top 20", label: "Most Influential", detail: "Kenya's leading personal brands (2025–2026)" },
  { value: "Favikon", label: "Brand Ambassador", detail: "Thought leadership & creator authority" }
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Trust First",
    text: "Visibility captures initial attention. Earned trust is what makes people confidently invest."
  },
  {
    icon: ShieldCheck,
    title: "Singular Story",
    text: "Your lived experience isn't background noise—it provides the diagnostic edge that competitors can't replicate."
  },
  {
    icon: ShieldCheck,
    title: "Concrete Proof",
    text: "True authority doesn't rely on hype. It points to tangible outcomes, client breakthroughs, and rigorous frameworks."
  },
  {
    icon: ShieldCheck,
    title: "Clarity over Noise",
    text: "When positioning is precise, you don't need to shout to be remembered when decision-time comes."
  }
];

const workPillars = [
  "Unpack your non-obvious credibility assets and lived proof",
  "Translate deep practitioners' expertise into high-resonance language",
  "Bridge the gap between quiet mastery and market positioning",
  "Build high-trust frameworks that justify premium advisory relationships"
];

const ratingStars = (rating = 5) =>
  Array.from({ length: Math.max(Math.min(Number(rating) || 5, 5), 1) });

const initialsFor = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "MW";

const assetName = (asset = {}) =>
  asset.displayName || asset.altText || asset.originalFilename?.replace(/\.[^.]+$/, "") || "Featured Partner";

export default function AboutPage() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [brandAssets, setBrandAssets] = useState([]);
  const [eventAssets, setEventAssets] = useState([]);
  const proofSliderRef = useRef(null);
  const eventSliderRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([
      listPublicReviews({ limit: 6 }),
      listPublicMediaAssets({ usage: "about-brand", resourceType: "image", limit: 20 }),
      listPublicMediaAssets({ usage: "about-event", resourceType: "image", limit: 6 })
    ])
      .then(([revRes, brandRes, eventRes]) => {
        if (!active) return;
        setReviews(revRes.data?.reviews || []);
        setBrandAssets(brandRes.data?.items || []);
        setEventAssets(eventRes.data?.items || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentChapter = chapters.find((c) => c.id === activeChapter) || chapters[0];
  const slideProofCards = (direction) => {
    const slider = proofSliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction * Math.max(slider.clientWidth * 0.82, 280),
      behavior: "smooth"
    });
  };

  const slideEventCards = (direction) => {
    const slider = eventSliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction * Math.max(slider.clientWidth * 0.82, 280),
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal selection:bg-mutedMint/60">
      {/* Inline styles for continuous marquee animations without config changes */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
        .proof-card-slider,
        .event-card-slider {
          scroll-behavior: smooth;
          scrollbar-width: none;
        }
        .proof-card-slider::-webkit-scrollbar,
        .event-card-slider::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-infinite {
            animation: none;
          }
          .proof-card-slider,
          .event-card-slider {
            scroll-behavior: auto;
          }
        }
      `}</style>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-charcoal text-mistWhite py-8 sm:py-10 lg:py-15">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,rgba(184,216,197,0.25),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-mutedMint/30 bg-white/5 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-mutedMint">
                <Compass size={13} />
                <span>The Story of Magdalene Wambui</span>
              </div>

              <h1 className="mt-4 sm:mt-6 font-serif text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] text-balance">
                Authority is not built by looking impressive. It is built by recognising what you have earned.
              </h1>

              <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-mistWhite/75 font-serif italic">
                "For years, I thought lived experience belonged on one side and professional credibility belonged on the other. They do not."
              </p>

              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <SiteButton to="/assessment" variant="darkPrimary" className="px-5 py-3 text-xs font-bold shadow-lg justify-center">
                  <span>Take Credibility Diagnostic</span>
                  <ArrowRight size={14} />
                </SiteButton>
                <SiteButton to="/code-of-resonance" variant="darkSecondary" className="px-5 py-3 text-xs font-bold justify-center">
                  Read The Code of Resonance
                </SiteButton>
              </div>
            </div>

            {/* Visual Frame */}
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl">
                <MagnificImage
                  image={magnificImages.founder}
                  size="hero"
                  dark
                  priority
                  className="rounded-xl sm:rounded-2xl object-cover aspect-[4/5] w-full"
                />
              </div>

              <div className="absolute -bottom-4 left-2 right-2 sm:left-6 sm:right-auto sm:max-w-xs rounded-xl sm:rounded-2xl border border-white/15 bg-charcoal/90 p-3.5 sm:p-5 shadow-2xl backdrop-blur-md">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-mutedMint">
                  Core Premise
                </span>
                <p className="mt-1 font-serif text-xs sm:text-sm leading-snug text-white font-medium">
                  You don't need louder visibility. You need to position the depth you already possess.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Prestige Metric Strip */}
      <section className="border-b border-sage/50 bg-white py-6 sm:py-8 shadow-sm">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
            {prestigeMetrics.map((metric) => (
              <div key={metric.label} className="border-l-2 border-deepEmerald/30 pl-3 sm:pl-5">
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">{metric.value}</p>
                <p className="mt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-deepEmerald">{metric.label}</p>
                <p className="mt-0.5 text-[11px] sm:text-xs text-charcoal/60 leading-normal">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Narrative Chapter Studio */}
      <section className="py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Evolution of Authority</span>
            <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">
              How quiet expertise transformed into undeniable resonance.
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-10 lg:grid-cols-[280px_1fr] items-start">
            {/* Chapter Stepper Buttons */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {chapters.map((chapter) => {
                const isActive = activeChapter === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => setActiveChapter(chapter.id)}
                    className={`flex items-center gap-3 sm:gap-4 rounded-xl px-4 py-3 sm:py-4 text-left transition-all shrink-0 lg:shrink ${
                      isActive
                        ? "bg-deepEmerald text-mistWhite shadow-sm ring-1 ring-deepEmerald"
                        : "bg-white border border-sage/60 text-charcoal/70 hover:border-deepEmerald hover:text-charcoal"
                    }`}
                  >
                    <span className={`font-serif text-xs sm:text-sm font-bold ${isActive ? "text-mutedMint" : "text-charcoal/40"}`}>
                      {chapter.num}
                    </span>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider opacity-75">{chapter.label}</p>
                      <p className="text-xs sm:text-sm font-bold mt-0.5">{chapter.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reading Box */}
            <article className="rounded-2xl sm:rounded-3xl border border-sage/70 bg-white p-5 sm:p-10 shadow-sm">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-deepEmerald">
                Chapter {currentChapter.num} • {currentChapter.label}
              </span>

              <h3 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal">
                {currentChapter.title}
              </h3>

              <div className="mt-4 sm:mt-6 border-l-2 border-deepEmerald/40 pl-4 sm:pl-6">
                <p className="font-serif text-sm sm:text-lg font-medium italic text-charcoal/80 leading-relaxed">
                  "{currentChapter.lead}"
                </p>
              </div>

              <div className="mt-5 sm:mt-7 space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-charcoal/75 font-serif">
                {currentChapter.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {currentChapter.id === "evidence" && (
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t border-sage/50 pt-6">
                  <div className="rounded-lg sm:rounded-xl border border-sage/60 bg-[#FAF9F6] p-3 text-center">
                    <Award className="mx-auto text-deepEmerald" size={18} />
                    <p className="mt-1.5 text-xs font-bold text-charcoal">#1 Wellness Brand Globally</p>
                  </div>
                  <div className="rounded-lg sm:rounded-xl border border-sage/60 bg-[#FAF9F6] p-3 text-center">
                    <Award className="mx-auto text-deepEmerald" size={18} />
                    <p className="mt-1.5 text-xs font-bold text-charcoal">Top 20 LinkedIn Kenya</p>
                  </div>
                  <div className="rounded-lg sm:rounded-xl border border-sage/60 bg-[#FAF9F6] p-3 text-center">
                    <Award className="mx-auto text-deepEmerald" size={18} />
                    <p className="mt-1.5 text-xs font-bold text-charcoal">Creator of the Year Nominee</p>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* 4. Strategic Approach */}
      <section className="border-y border-sage/50 bg-[#F4F2EB] py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The DISCERN™ Framework</span>
            <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">
              A methodology for uncovering non-replicable credibility.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              We do not invent an artificial persona. We structure what you already do with excellence so buyers perceive it effortlessly.
            </p>
          </div>

          <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl sm:rounded-2xl border border-sage/70 bg-white p-5 sm:p-6 shadow-sm transition hover:border-deepEmerald"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-deepEmerald/10 text-deepEmerald">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-3 sm:mt-4 font-serif text-lg sm:text-xl font-bold text-charcoal">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-charcoal/65">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Scope & Fit */}
      <section className="py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="rounded-2xl sm:rounded-3xl bg-charcoal p-6 sm:p-10 text-mistWhite shadow-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The Advisory Scope</span>
              <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Helping practitioners become the singular choice.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-mistWhite/70 leading-relaxed">
                If your work delivers extraordinary transformations in the room, but your public presence fails to communicate that caliber beforehand:
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                {workPillars.map((pillar) => (
                  <div key={pillar} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-mutedMint shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-mistWhite/85 leading-relaxed font-medium">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:pl-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The Profile</span>
                <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  Who this partnership is designed for.
                </h2>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                  Established consultants, clinicians, executive coaches, and founders who have done the real work and refuse to rely on loud, performative internet marketing.
                </p>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-sage/70 bg-white p-5 sm:p-6 shadow-sm">
                <Waves className="text-deepEmerald" size={20} />
                <h3 className="mt-2.5 font-serif text-lg sm:text-xl font-bold text-charcoal">
                  The goal is not to sound impressive.
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-charcoal/65">
                  The goal is to speak with such strategic precision that the right clients recognise you before they even book a consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contained Smooth Marquee for Trusted Brands & Organizations */}
      <section className="border-t border-sage/50 bg-white py-8 sm:py-10 md:py-15 overflow-hidden">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Recognised Authority</span>
              <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-charcoal">
                Organizations & stages that have trusted this work.
              </h2>
            </div>
          </div>
        </div>

        {brandAssets.length > 0 ? (
          <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
            <div className="relative w-full overflow-hidden ">
              {/* Left and Right Visual Faders within the container box */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-[#FAF9F6] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-[#FAF9F6] to-transparent" />

              <div className="animate-marquee-infinite flex items-center gap-6 sm:gap-10">
                {[...brandAssets, ...brandAssets].map((asset, index) => {
                  const src = imageUrl(asset);
                  return (
                    <div
                      key={`${asset._id || asset.publicId}-${index}`}
                      className="flex h-14 sm:h-16 min-w-[120px] sm:min-w-[150px] items-center justify-center  transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                    >
                      {src ? (
                        <img src={src} alt={assetName(asset)} className="max-h-7 sm:max-h-9 w-auto object-contain" loading="lazy" />
                      ) : (
                        <div className="flex items-center gap-1.5 text-deepEmerald">
                          <Building2 size={16} />
                          <span className="text-[11px] font-bold text-charcoal/70 truncate max-w-[90px]">{assetName(asset)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-charcoal/40">
            Industry partner endorsements syncing...
          </div>
        )}

        {/* Invited Events Sub-slider if present */}
        {eventAssets.length > 0 && (
          <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 mt-10">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-deepEmerald">Invited Events</span>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-charcoal/55 sm:text-sm">
                  Selected rooms and stages that I have been invited into the conversation.
                </p>
              </div>

              {eventAssets.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => slideEventCards(-1)}
                    className="grid size-10 place-items-center rounded-full border border-sage bg-white text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald sm:size-11"
                    aria-label="Show previous invited event"
                  >
                    <ArrowLeft size={17} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => slideEventCards(1)}
                    className="grid size-10 place-items-center rounded-full border border-charcoal bg-charcoal text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite sm:size-11"
                    aria-label="Show next invited event"
                  >
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <div className="-mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div
                ref={eventSliderRef}
                className="event-card-slider flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:gap-6"
                aria-label="Invited events"
              >
                {eventAssets.map((asset) => {
                  const src = imageUrl(asset, asset.thumbnailUrl);
                  return (
                    <article
                      key={asset._id || asset.publicId}
                      className="group flex min-h-[20rem] shrink-0 basis-[82%] snap-start flex-col overflow-hidden rounded-xl border border-sage/70 bg-[#FAF9F6] shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(26,26,26,0.07)] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFE8] p-2 sm:p-3">
                        {src && (
                          <img
                            src={src}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl saturate-125"
                            loading="lazy"
                          />
                        )}
                        <div className="relative z-10 flex h-full w-full items-center justify-center">
                          {src ? (
                            <img
                              src={src}
                              alt={assetName(asset)}
                              className="max-h-full max-w-full object-contain drop-shadow-[0_20px_32px_rgba(15,77,62,0.18)] transition duration-500 group-hover:brightness-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-deepEmerald">
                              <CalendarCheck size={24} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 p-3.5 sm:p-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-deepEmerald">Invited Stage</span>
                        <h4 className="mt-0.5 break-words font-serif text-sm font-bold text-charcoal sm:text-base">{assetName(asset)}</h4>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. Client Proof */}
      <section className="border-t border-sage/50 bg-[#FAF9F6] py-10 sm:py-18 lg:py-20">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Earned Evidence</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Reflections from practitioners who did the work.
              </h2>
            </div>

            {reviews.length > 1 && !reviewsLoading && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => slideProofCards(-1)}
                  className="grid size-11 place-items-center rounded-full border border-sage bg-white text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
                  aria-label="Show previous testimonial"
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => slideProofCards(1)}
                  className="grid size-11 place-items-center rounded-full border border-charcoal bg-charcoal text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
                  aria-label="Show next testimonial"
                >
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {reviewsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-44 rounded-2xl border border-sage/50 bg-white/50 animate-pulse" />
              <div className="h-44 rounded-2xl border border-sage/50 bg-white/50 animate-pulse" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-sage p-8 text-center text-charcoal/60 bg-white/40">
              <Quote className="mx-auto text-deepEmerald mb-2" size={24} />
              <p className="font-serif text-base font-bold text-charcoal">Endorsements loading shortly.</p>
            </div>
          ) : (
            <div className="-mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div
                ref={proofSliderRef}
                className="proof-card-slider flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:gap-6"
                aria-label="Client proof testimonials"
              >
                {reviews.map((rev) => {
                  const portraitSrc = imageUrl(rev.image);

                  return (
                    <article
                      key={rev._id || rev.name}
                      className="flex min-h-[22rem] shrink-0 basis-[86%] snap-start flex-col justify-between rounded-2xl border border-sage/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(26,26,26,0.08)] sm:basis-[calc((100%-1.5rem)/2)] sm:p-7 lg:basis-[calc((100%-3rem)/3)]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-sage bg-mutedMint/35 text-sm font-extrabold text-deepEmerald">
                              {portraitSrc ? (
                                <img
                                  src={portraitSrc}
                                  srcSet={toSrcSet(rev.image)}
                                  sizes="64px"
                                  alt={rev.image?.altText || `${rev.name} testimonial image`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span>{initialsFor(rev.name)}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-charcoal">{rev.name}</p>
                              {rev.role && <p className="mt-0.5 text-xs text-charcoal/55">{rev.role}</p>}
                            </div>
                          </div>
                          <Quote className="shrink-0 text-deepEmerald opacity-60" size={20} aria-hidden="true" />
                        </div>

                        <p className="mt-5 font-serif text-sm leading-relaxed text-charcoal/80 italic sm:text-base">
                          "{rev.review}"
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-sage/40 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-deepEmerald">
                          Client Proof
                        </span>
                        <div className="flex text-deepEmerald" aria-label={`${rev.rating || 5} star review`}>
                          {ratingStars(rev.rating).map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" aria-hidden="true" />
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. Conversion Closer */}
      <section className="border-t border-sage/60 bg-deepEmerald py-10 sm:py-16 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">Begin With Clarity</span>
              <h2 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                See what already makes you the trusted choice.
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-mistWhite/80">
                Take the 7-minute Earned Credibility Diagnostic to identify gaps in your positioning signals and receive practical recommendations.
              </p>
            </div>

            <SiteButton
              to="/assessment"
              variant="darkPrimary"
              className="px-6 py-3.5 text-xs font-bold shrink-0 bg-white text-charcoal hover:bg-mutedMint shadow-xl justify-center"
            >
              <span>Start the Assessment</span>
              <ArrowRight size={14} />
            </SiteButton>
          </div>
        </div>
      </section>
    </div>
  );
}
