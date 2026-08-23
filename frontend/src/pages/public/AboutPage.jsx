import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpenText,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Compass,
  HeartHandshake,
  Plus,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  X
} from "lucide-react";
import SiteButton from "../../components/SiteButton.jsx";
import { listPublicMediaAssets, listPublicReviews } from "../../services/api.js";
import { imageUrl, toSrcSet } from "../../utils/cloudinaryImage.js";
import { magnificImages } from "./home/homeContent.js";
import { MagnificImage, SectionEyebrow } from "./home/HomeShared.jsx";

const storySections = [
  {
    title: "Where It Began",
    preview:
      "I did not build my authority by becoming more impressive. I built it by finally recognising the credibility I had already earned.",
    paragraphs: [
      "I did not build my authority by becoming more impressive.",
      "I built it by finally recognising the credibility I had already earned.",
      "When I came to LinkedIn, I did what many experts do. I looked around. Other people seemed further ahead. More certifications. More established careers. More reasons, at least on paper, to be taken seriously.",
      "For a while, I thought the answer was to catch up."
    ]
  },
  {
    title: "What I Had Been Measuring Wrong",
    preview:
      "I realised I had been measuring credibility by what could be written after someone's name, while overlooking everything life had written into mine.",
    paragraphs: [
      "I realised I had been measuring credibility by what could be written after someone's name, while overlooking everything life had written into mine.",
      "My understanding of wellness was not formed by expertise alone.",
      "It was shaped by grief. By living in a body that had known the exhaustion of anaemia. By experiences that changed how I understood resilience, identity, wellbeing, and what it means to be seen."
    ]
  },
  {
    title: "The Split That Did Not Belong",
    preview:
      "For years, I thought lived experience belonged on one side and professional credibility belonged on the other. They do not.",
    paragraphs: [
      "For years, I thought those experiences belonged on one side and professional credibility belonged on the other.",
      "They do not.",
      "The experiences that build us influence how we listen, what we notice, the questions we ask, and the work we become uniquely equipped to do.",
      "That realisation changed the way I positioned myself."
    ]
  },
  {
    title: "The Shift",
    preview:
      "I stopped treating my story as something separate from my authority and started recognising the credibility inside it.",
    paragraphs: [
      "Instead of trying to look like everybody else's version of an expert, I began bringing my expertise and lived experience together.",
      "I stopped treating my story as something separate from my authority.",
      "I recognised the credibility inside it.",
      "And people responded."
    ]
  },
  {
    title: "The Evidence",
    preview:
      "The recognition did not become the philosophy. It became evidence of the philosophy.",
    paragraphs: [
      "Today, I have built a community of 33,000+ people on LinkedIn.",
      "I became a Favikon Ambassador, ranked #1 in Personal Branding and Thought Leadership in Kenya, and was named the #1 Wellness Personal Brand globally.",
      "I have also been recognised among the Top 20 Most Influential Personal Brands on LinkedIn in Kenya in 2025 and 2026.",
      "I have been recognised among Kenya's leading personal brands and received a nomination for Exceptional Content Creator of the Year.",
      "But those are not the philosophy. They are evidence of it."
    ],
    highlights: [
      "33,000+ LinkedIn community",
      "#1 Wellness Personal Brand globally",
      "Top 20 LinkedIn Personal Brands in Kenya"
    ]
  },
  {
    title: "The Philosophy",
    preview:
      "You may not need more credibility. You may need to position the credibility you have already earned.",
    paragraphs: [
      "The philosophy is much simpler:",
      "You may not need more credibility.",
      "You may need to position the credibility you have already earned.",
      "That is now the work I do with practitioners and experts."
    ]
  },
  {
    title: "What I Help Experts Do",
    preview:
      "I help experts see the expertise, experiences, and stories that shaped how they work, then position those assets clearly.",
    paragraphs: [
      "I help practitioners and experts see the expertise, experiences, and stories that have shaped how they work.",
      "Then I help them position those assets into a personal brand that makes their value easier to understand, their authority easier to trust, and their name easier to remember when it is time to choose.",
      "I do not believe your personal brand should be a polished version of somebody else's playbook.",
      "It should make visible what already makes your perspective difficult to replicate."
    ]
  },
  {
    title: "Why Earned Credibility Exists",
    preview:
      "Earned Credibility, The Code of Resonance, and DISCERN were built from the system I had to learn for myself first.",
    paragraphs: [
      "That is the thinking behind Earned Credibility™.",
      "It is why I write The Code of Resonance.",
      "And it is the foundation of my work inside DISCERN™.",
      "I built this system because I had to learn it for myself first.",
      "Now I use it to help other experts stop hiding the very things that could make them the Trusted Choice™."
    ]
  },
  {
    title: "Beyond The Work",
    preview:
      "Outside work, you will probably find me near water, journaling, cooking, or returning to the simple things that bring me back to myself.",
    paragraphs: [
      "If you are looking for me outside work, start somewhere near water.",
      "The beach is one of my favourite places to be. And when I am home, I am probably journaling or in the kitchen cooking something I love.",
      "I am drawn to the simple things that bring me back to myself: water, words, good food, and quiet moments.",
      "Because there is a life beyond the work. And I intend to enjoy mine."
    ]
  }
];

const journeyImages = [
  {
    image: magnificImages.heroAccent,
    label: "Presence",
    className: "col-span-12 sm:col-span-7"
  },
  {
    image: magnificImages.assessment,
    label: "Reflection",
    className: "col-span-12 sm:col-span-5 sm:mt-10"
  },
  {
    image: magnificImages.finalCta,
    label: "Authority",
    className: "col-span-12"
  }
];

const storyGroups = journeyImages.map((item, index) => ({
  ...item,
  stories: storySections.slice(index * 3, index * 3 + 3)
}));

const desktopJourneyImages = journeyImages.slice(0, 2);

const principles = [
  {
    title: "Trust First",
    text: "Attention is useful. Trust is what helps people choose you.",
    icon: ShieldCheck
  },
  {
    title: "Clear Story",
    text: "Your story should help people understand your work.",
    icon: BookOpenText
  },
  {
    title: "Real Proof",
    text: "Good work deserves clear examples, outcomes, and evidence.",
    icon: HeartHandshake
  },
  {
    title: "Memorable Message",
    text: "People should quickly understand what you do and why it matters.",
    icon: Sparkles
  }
];

const workAreas = [
  "Clarify what you do and who you help",
  "Name the proof you already have",
  "Turn your story into strategic language",
  "Strengthen your offer message",
  "Choose the next practical step"
];

const ratingStars = (rating = 5) =>
  Array.from({ length: Math.max(Math.min(Number(rating) || 5, 5), 1) });

const assetName = (asset = {}) =>
  asset.displayName || asset.altText || asset.originalFilename?.replace(/\.[^.]+$/, "") || "Featured asset";

function JourneyImageCard({ item, className = "", imageClassName = "h-64 sm:h-72" }) {
  return (
    <div className={`relative overflow-hidden border border-sage bg-white shadow-[0_16px_36px_rgba(34,34,34,0.06)] ${className}`}>
      <img
        src={item.image.src}
        alt={item.image.alt}
        loading="lazy"
        className={`w-full object-cover ${imageClassName}`}
        style={{ objectPosition: item.image.objectPosition }}
      />
      <div className="absolute bottom-3 left-3 border border-mistWhite/35 bg-charcoal/78 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-mutedMint backdrop-blur">
        {item.label}
      </div>
    </div>
  );
}

function StoryCard({ story, index, onOpen }) {
  return (
    <article className="group border border-sage bg-white shadow-[0_16px_34px_rgba(34,34,34,0.045)] transition duration-300 hover:border-deepEmerald/45 hover:shadow-[0_22px_44px_rgba(34,34,34,0.075)]">
      <button type="button" onClick={onOpen} className="w-full p-5 text-left sm:p-6">
        <span className="flex items-start justify-between gap-5">
          <span className="flex min-w-0 items-start gap-4 sm:gap-6">
            {/* <span className="shrink-0 font-serif text-3xl leading-none text-deepEmerald">
              {String(index + 1).padStart(2, "0")}
            </span> */}
            <h2 className="min-w-0 font-serif text-2xl leading-tight text-charcoal text-balance">
              {story.title}
            </h2>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sage bg-mistWhite text-deepEmerald transition group-hover:border-deepEmerald group-hover:bg-deepEmerald group-hover:text-mistWhite">
            <Plus size={20} aria-hidden="true" />
          </span>
        </span>
        <span className="mt-4 block text-base leading-7 text-charcoal/70 sm:pl-[82px]">{story.preview}</span>
      </button>
    </article>
  );
}

function StoryModal({ story, onClose }) {
  useEffect(() => {
    if (!story) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, story]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/72 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="Close story modal" onClick={onClose} />
      <article
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_28px_90px_rgba(0,0,0,0.32)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-story-title"
      >
        <div className="flex items-start justify-between gap-5 border-b border-sage bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">About Magdalene</p>
            <h2 id="about-story-title" className="mt-2 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">{story.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sage bg-mistWhite text-charcoal transition hover:border-deepEmerald hover:bg-deepEmerald hover:text-mistWhite"
            aria-label="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
          <div className="space-y-5 text-lg leading-8 text-charcoal/76">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {story.highlights?.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {story.highlights.map((highlight) => (
                <div key={highlight} className="border border-sage bg-white p-4">
                  <Award className="text-deepEmerald" size={18} aria-hidden="true" />
                  <p className="mt-3 text-sm font-extrabold leading-5 text-charcoal">{highlight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function BrandLogoCard({ asset }) {
  const src = imageUrl(asset);

  return (
    <article className="grid min-h-[132px] place-items-center border border-sage bg-white p-5 text-center shadow-[0_16px_34px_rgba(34,34,34,0.04)]">
      {src ? (
        <img
          src={src}
          srcSet={toSrcSet(asset)}
          alt={asset.altText || assetName(asset)}
          className="max-h-16 w-auto max-w-full object-contain"
          loading="lazy"
        />
      ) : (
        <Building2 className="text-deepEmerald" size={28} aria-hidden="true" />
      )}
      <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/55">{assetName(asset)}</p>
    </article>
  );
}

function EventAssetCard({ asset }) {
  const src = imageUrl(asset, asset.thumbnailUrl);

  return (
    <article className="overflow-hidden border border-sage bg-white shadow-[0_18px_38px_rgba(34,34,34,0.05)]">
      {src ? (
        <img
          src={src}
          srcSet={toSrcSet(asset)}
          alt={asset.altText || assetName(asset)}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="grid aspect-[4/3] place-items-center bg-sage text-deepEmerald">
          <CalendarCheck size={32} aria-hidden="true" />
        </div>
      )}
      <div className="p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Invited space</p>
        <h3 className="mt-3 font-serif text-2xl leading-tight text-charcoal">{assetName(asset)}</h3>
        {asset.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {asset.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-charcoal/62">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function BrandsAndEventsSection({ brands, events }) {
  if (!brands.length && !events.length) return null;

  return (
    <section className="border-y border-sage bg-white py-8 sm:py-10 lg:py-15">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <SectionEyebrow>Trusted Spaces</SectionEyebrow>
            <h2 className="font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              Brands & organizations I have worked with.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-charcoal/70">
            Trust is earned. It is not given. The work I do with practitioners and experts is built on the credibility they have already earned, and the spaces where I have been invited to share my work are a reflection of that trust.
          </p>
        </div>

        {brands.length > 0 && (
          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3">
       
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {brands.map((asset) => (
                <BrandLogoCard key={asset._id || asset.publicId} asset={asset} />
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-14">
            <div className="mb-5 flex items-center gap-3">
              <CalendarCheck className="text-deepEmerald" size={20} aria-hidden="true" />
              <h3 className="font-serif text-3xl leading-tight text-charcoal">Invited events and stages</h3>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.map((asset) => (
                <EventAssetCard key={asset._id || asset.publicId} asset={asset} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [brandAssets, setBrandAssets] = useState([]);
  const [eventAssets, setEventAssets] = useState([]);

  useEffect(() => {
    let active = true;

    listPublicReviews({ limit: 50 })
      .then((response) => {
        if (!active) return;
        setReviews(response.data.reviews || []);
      })
      .catch(() => {
        if (!active) return;
        setReviews([]);
      })
      .finally(() => {
        if (!active) return;
        setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([
      listPublicMediaAssets({ usage: "about-brand", resourceType: "image", limit: 24 }),
      listPublicMediaAssets({ usage: "about-event", resourceType: "image", limit: 24 })
    ])
      .then(([brandResponse, eventResponse]) => {
        if (!active) return;
        setBrandAssets(brandResponse.data.items || []);
        setEventAssets(eventResponse.data.items || []);
      })
      .catch(() => {
        if (!active) return;
        setBrandAssets([]);
        setEventAssets([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-mistWhite text-charcoal">
      <section className="relative overflow-hidden border-b border-sage bg-charcoal py-14 text-mistWhite sm:py-18 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(207,229,216,0.14),transparent_42%,rgba(11,110,79,0.26)),linear-gradient(180deg,rgba(245,247,244,0.08),transparent_52%)]" aria-hidden="true" />
        <div className="container-shell relative grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-mutedMint/30 bg-mistWhite/[0.06] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
              <Compass size={15} aria-hidden="true" />
              About Magdalene Wambui
            </p>
            <h1 className="mt-6 font-serif text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
              I built my authority by recognising the credibility I had already earned.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-mistWhite/74">
              My work helps practitioners and experts position the expertise, lived experience,
              proof, and story that make them easier to trust, remember, and choose.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <SiteButton to="/assessment" variant="darkPrimary">
                Start the assessment
                <ArrowRight size={16} aria-hidden="true" />
              </SiteButton>
              <SiteButton to="/code-of-resonance" variant="darkSecondary">
                Read the Code of Resonance
              </SiteButton>
            </div>
          </div>

          <div className="relative">
            <MagnificImage image={magnificImages.founder} size="hero" dark priority />
            <div className="absolute bottom-5 left-5 right-5 border border-mistWhite/18 bg-charcoal/88 p-5 backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">Core belief</p>
              <p className="mt-2 font-serif text-2xl leading-tight">
                You may not need more credibility. You may need to position the credibility you
                have already earned.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="mb-8 max-w-3xl lg:hidden">
            <SectionEyebrow>The Story Behind The Work</SectionEyebrow>
            <h2 className="font-serif text-2xl leading-tight text-balance sm:text-4xl">
              Why do people trust some experts before they even speak to them?
            </h2>
            <p className="mt-5 text-lg leading-8 text-charcoal/72">
              That question shaped the work. The answer was not more polish. It was learning how to
              make earned credibility visible.
            </p>
          </div>

          <div className="space-y-10 lg:hidden">
            {storyGroups.map((group, groupIndex) => (
              <div key={group.label} className="space-y-4">
                <JourneyImageCard item={group} />
                {group.stories.map((story, storyIndex) => {
                  const absoluteIndex = groupIndex * 3 + storyIndex;
                  return (
                    <StoryCard
                      key={story.title}
                      story={story}
                      index={absoluteIndex}
                      onOpen={() => setActiveStory(story)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="hidden gap-12 lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
            <aside className="flex h-full flex-col">
              <div>
                <SectionEyebrow>The Story Behind The Work</SectionEyebrow>
                <h2 className="font-serif text-2xl leading-tight text-balance sm:text-4xl">
                  Why do people trust some experts before they even speak to them?
                </h2>
                <p className="mt-5 text-lg leading-8 text-charcoal/72">
                  That question shaped the work. The answer was not more polish. It was learning how to
                  make earned credibility visible.
                </p>
              </div>

              <div className="mt-8 grid flex-1 grid-rows-2 gap-4">
                {desktopJourneyImages.map((item) => (
                  <JourneyImageCard
                    key={item.label}
                    item={item}
                    className="h-full min-h-0"
                    imageClassName="h-full min-h-[260px]"
                  />
                ))}
              </div>
            </aside>

            <div className="space-y-4">
              {storySections.map((story, index) => (
                <StoryCard
                  key={story.title}
                  story={story}
                  index={index}
                  onOpen={() => setActiveStory(story)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sage bg-sage/42 py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <SectionEyebrow>The Approach</SectionEyebrow>
              <h2 className="font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
                I position what people should already be able to trust.
              </h2>
            </div>
           
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {principles.map((principle) => (
              <article key={principle.title} className="border border-sage bg-mistWhite p-6 shadow-[0_18px_42px_rgba(34,34,34,0.05)]">
                <principle.icon className="text-deepEmerald" size={25} aria-hidden="true" />
                <h3 className="mt-5 font-serif text-2xl leading-tight">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-charcoal/70">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="border border-charcoal bg-charcoal p-7 text-mistWhite shadow-[0_24px_58px_rgba(34,34,34,0.18)] sm:p-9">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">How I Help</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-balance sm:text-5xl">
              I make your value easier to understand.
            </h2>
            <div className="mt-8 grid gap-4">
              {workAreas.map((item) => (
                <div key={item} className="flex gap-3 border-t border-mistWhite/12 pt-4 first:border-t-0 first:pt-0">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-mutedMint" size={19} aria-hidden="true" />
                  <p className="text-sm font-semibold leading-6 text-mistWhite/74">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionEyebrow>Who This Is For</SectionEyebrow>
            <h2 className="font-serif text-4xl leading-tight text-balance sm:text-5xl">
              For practitioners with strong work and unclear positioning.
            </h2>
            <p className="mt-5 text-lg leading-8 text-charcoal/72">
              If people value your work after they experience it, but do not understand it before
              they choose you, this work is for you.
            </p>
            <div className="mt-7 border border-sage bg-white p-6 shadow-[0_16px_36px_rgba(34,34,34,0.04)]">
              <Waves className="text-deepEmerald" size={24} aria-hidden="true" />
              <p className="mt-4 font-serif text-3xl leading-tight">
                The goal is not to sound more impressive.
              </p>
              <p className="mt-4 text-lg leading-8 text-charcoal/72">
                The goal is to become clear enough for the right people to trust you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BrandsAndEventsSection brands={brandAssets} events={eventAssets} />

      <section id="reviews" className="border-y border-sage bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <SectionEyebrow>Reviews</SectionEyebrow>
              <h2 className="font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
                Proof from people who have experienced the work.
              </h2>
            </div>
          </div>

          <div className="mt-10">
            {reviewsLoading && (
              <div className="border border-sage bg-mistWhite p-7 text-charcoal">
                <p className="font-semibold text-charcoal/70">Loading reviews...</p>
              </div>
            )}

            {!reviewsLoading && reviews.length === 0 && (
              <div className="border border-sage bg-mistWhite p-8 text-center shadow-[0_18px_40px_rgba(34,34,34,0.05)]">
                <Quote className="mx-auto text-deepEmerald" size={32} aria-hidden="true" />
                <h3 className="mt-4 font-serif text-4xl leading-tight">No reviews yet.</h3>
                <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-charcoal/70">
                  Approved client reviews will appear here once Magdalene publishes them.
                </p>
              </div>
            )}

            {!reviewsLoading && reviews.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                {reviews.map((review) => (
                  <article
                    key={review._id || `${review.name}-${review.createdAt}`}
                    className="border border-sage bg-mistWhite p-6 shadow-[0_18px_40px_rgba(34,34,34,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <Quote className="shrink-0 text-deepEmerald" size={26} aria-hidden="true" />
                      <div className="flex items-center gap-1 text-deepEmerald" aria-label={`${review.rating || 5} star review`}>
                        {ratingStars(review.rating).map((_, index) => (
                          <Star key={index} size={14} fill="currentColor" aria-hidden="true" />
                        ))}
                      </div>
                    </div>

                    {review.headline && (
                      <h3 className="mt-5 font-serif text-3xl leading-tight text-charcoal text-balance">
                        {review.headline}
                      </h3>
                    )}
                    <p className="mt-4 text-lg leading-8 text-charcoal">"{review.review}"</p>

                    {(review.before || review.after) && (
                      <div className="mt-6 grid gap-4 border-t border-sage pt-5 sm:grid-cols-2">
                        {review.before && (
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-charcoal/55">
                              Before
                            </p>
                            <p className="mt-2 text-sm leading-6 text-charcoal/70">{review.before}</p>
                          </div>
                        )}
                        {review.after && (
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                              After
                            </p>
                            <p className="mt-2 text-sm leading-6 text-charcoal/70">{review.after}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-6 border-t border-sage pt-5">
                      <p className="font-bold text-charcoal">{review.name}</p>
                      {review.role && <p className="text-sm text-charcoal/68">{review.role}</p>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-sage bg-deepEmerald py-8 text-mistWhite sm:py-15">
        <div className="container-shell flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Start Here</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-balance">
              See what already makes you credible.
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-mistWhite/76">
              Take the 7-minute assessment and receive a practical next step based on your current
              message and proof.
            </p>
          </div>
          <SiteButton to="/assessment" variant="darkPrimary">
            Start the assessment
            <ArrowRight size={16} aria-hidden="true" />
          </SiteButton>
        </div>
      </section>

      <StoryModal story={activeStory} onClose={() => setActiveStory(null)} />
    </div>
  );
}
