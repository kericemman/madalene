import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicReviews } from "../../../services/api.js";
import { magnificImages } from "../home/homeContent.js";

const recognitionQuotes = [
  "My experience.",
  "My approach.",
  "I really care about my clients.",
  "My qualifications.",
  "My method is holistic."
];

const buriedDifferentiators = [
  "The experiences that changed how you see your work.",
  "The patterns you've noticed after years of practice.",
  "The stories that shaped your philosophy.",
  "The results you've repeatedly created.",
  "The beliefs you hold that others in your industry don't.",
  "The things you know now that you couldn't have known when you started."
];

const costPoints = [
  "You use the same language as your industry.",
  "You describe yourself through qualifications and job titles.",
  "Your content sounds useful but familiar.",
  "Your stories remain personal stories instead of becoming strategic authority.",
  "Your strongest experiences stay invisible because you've never considered them brand assets."
];

const coreIpPoints = [
  "Your expertise tells us what you've learned.",
  "Your lived experience tells us what life has taught you.",
  "Your proof tells us what you've demonstrated.",
  "Your perspective tells us what you now believe.",
  "Your stories show us how that authority was formed."
];

const assets = [
  {
    title: "Expertise",
    question: "What do you know because you've done the work?",
    text: "We identify the knowledge, patterns, skills and insights you've accumulated through your profession."
  },
  {
    title: "Lived Experience",
    question: "What do you know because you've lived it?",
    text: "We uncover experiences that have shaped how you understand your work, clients and field."
  },
  {
    title: "Story",
    question: "What happened that shaped the authority you have today?",
    text: "We identify the stories worth strategically associating with your brand."
  },
  {
    title: "Proof",
    question: "What have you earned the right to claim?",
    text: "Results, accomplishments, recognition, client outcomes and evidence that strengthen belief in your authority."
  },
  {
    title: "Perspective",
    question: "What do you see differently because of everything above?",
    text: "Your beliefs, contrarian ideas, philosophies and point of view."
  }
];

const transformationRows = [
  ["I have a lot of experience, but I don't know what matters.", "I know what I've earned."],
  ["I struggle to explain what makes me different.", "I can articulate what makes my authority different."],
  ["My story feels disconnected from my expertise.", "I know which stories strengthen my positioning."],
  ["I don't know which accomplishments to talk about.", "I know which proof deserves visibility."],
  ["My content could have been written by anyone in my field.", "I can see the ideas and perspectives my brand can own."],
  ["I know there's something distinctive here. I just can't articulate it.", "I know what my positioning should be built around."]
];

const deliverables = [
  ["Your Core Expertise Assets", "The knowledge and patterns strengthening your authority."],
  ["Your Lived Experience Assets", "The experiences that give your work depth and context."],
  ["Your Strategic Stories", "The stories worth associating with your brand."],
  ["Your Proof Assets", "The evidence that makes your authority believable."],
  ["Your Perspective Assets", "The beliefs and ideas that can make your thinking recognisable."],
  ["Your Positioning Direction", "Where these assets point strategically."]
];

const notThis = [
  "We're not redesigning your entire brand.",
  "We're not rebuilding your complete LinkedIn presence.",
  "We're not creating months of content.",
  "We're not doing 90 days of strategic repositioning."
];

const whoItsFor = [
  "You have years of professional expertise but struggle to communicate what makes it distinctive.",
  "Your lived experience has profoundly shaped your work, but you haven't strategically integrated it into your authority.",
  "You have stories, ideas, accomplishments and insights scattered everywhere.",
  "Your current positioning feels accurate but generic.",
  "You're entering a new season of your work and want clarity about what should come with you.",
  "You're tired of trying to manufacture a differentiator.",
  "You want to understand the authority you've already earned."
];

const processSteps = [
  ["Extract", "Strategic pre-work before the session so the strongest material is already on the table."],
  ["Discover", "A private deep-dive with Magdalene into your expertise, lived experience, proof, story and perspective."],
  ["Distill", "The strongest findings are organised into your Earned Credibility™ Map."],
  ["Position", "A focused follow-up turns those findings into a clear strategic direction."]
];

const proofPoints = [
  "Favikon Ambassador",
  "#1 Wellness Personal Brand",
  "Top 1% Personal Branding & Thought Leadership"
];

function CheckList({ items, dark = false, className = "" }) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base leading-7">
          <Check className={`mt-1 shrink-0 ${dark ? "text-mutedMint" : "text-deepEmerald"}`} size={17} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EditorialImage({ image, className = "", priority = false }) {
  return (
    <figure className={`overflow-hidden border border-sage bg-sage ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: image.objectPosition }}
        loading={priority ? "eager" : "lazy"}
      />
    </figure>
  );
}

export default function EarnedCredibilityIntensivePage({ actionPath, loading, offer }) {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;

    listPublicReviews({ limit: 50 })
      .then((response) => {
        if (!active) return;
        const reviews = response.data.reviews || [];
        const relevant = reviews.filter((review) =>
          /different|position|story|authority|clar|brand|strateg|credib/i.test(`${review.headline || ""} ${review.review || ""}`)
        );
        setTestimonials((relevant.length ? relevant : reviews).slice(0, 2));
      })
      .catch(() => {
        if (active) setTestimonials([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const investment = useMemo(() => {
    const price = Number(offer?.price);
    return Number.isFinite(price) && price > 0 ? `$${price.toLocaleString("en-US")}` : "Confirmed privately";
  }, [offer?.price]);

  return (
    <main className="bg-mistWhite text-charcoal">
      <section className="border-b border-sage bg-mistWhite">
        <div className="container-shell py-8 sm:py-10 lg:py-14">
          <Link to="/offers" className="inline-flex items-center gap-2 text-sm font-bold text-charcoal/72 transition hover:text-deepEmerald">
            <ArrowLeft size={16} aria-hidden="true" />
            All offers
          </Link>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.72fr)] lg:items-center lg:gap-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 border-y border-sage py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
                <Sparkles size={15} aria-hidden="true" />
                Earned Credibility™ Intensive
              </div>
              <h1 className="mt-6 font-serif text-2xl font-bold leading-[1.04] text-balance sm:text-6xl lg:text-4xl">
                You've Earned More Credibility Than You're <span className="text-deepEmerald">Using.</span>
              </h1>
              <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72 sm:text-xl sm:leading-9">
                <p>Your years of expertise, lived experience, stories, accomplishments and perspective carry an authority your brand may not yet be communicating.</p>
                <p>The Earned Credibility™ Intensive helps you uncover the strategic assets that make your authority distinctive, credible and difficult to copy.</p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
                  Book My Earned Credibility™ Intensive
                  <ArrowRight size={16} aria-hidden="true" />
                </SiteButton>
        
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <EditorialImage image={magnificImages.assessment} priority className="aspect-[4/5]" />
              <p className="mt-3 border-l-2 border-deepEmerald pl-3 text-sm leading-6 text-charcoal/62">
                Your authority should not sound like everyone else's version of expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Recognition</p>
            <h2 className="mt-5 max-w-md font-serif text-2xl leading-tight text-balance sm:text-2xl lg:text-3xl">
              You know you're different. Explaining why is the hard part.
            </h2>
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recognitionQuotes.map((quote) => (
                <p key={quote} className="border border-sage bg-mistWhite px-4 py-3 font-serif text-xl leading-tight text-charcoal">
                  “{quote}”
                </p>
              ))}
            </div>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-charcoal/72">
              All of those things may be true. But they're rarely enough to make someone distinctive, because your real differentiation may be buried much deeper.
            </p>
     
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-8 text-mistWhite sm:py-10 lg:py-15">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">The cost</p>
            <h2 className="mt-5 max-w-lg font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              When you haven't extracted your credibility, you borrow positioning.
            </h2>
          </div>
          <div>
            <CheckList items={costPoints} dark className="border-y border-mistWhite/20 py-6 text-mistWhite/78" />
            <div className="mt-8 max-w-2xl space-y-5 text-lg leading-8 text-mistWhite/76">
              <p>Eventually, years of depth get compressed into: “I'm an expert who helps...”</p>
              <p className="font-serif text-xl leading-tight text-mistWhite">The problem isn't that you don't have differentiation. You may simply not have extracted it yet.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-deepEmerald py-12 text-mistWhite sm:py-16 lg:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Your core IP</p>
            <h2 className="mt-6 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              Expertise + Lived Experience = Earned Credibility™
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-mistWhite/78">
              Together, they create something much harder to imitate.
            </p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {coreIpPoints.map((point, index) => (
              <article key={point} className="border border-mistWhite/20 bg-mistWhite/8 p-5">
                <p className="text-sm font-extrabold text-mutedMint">0{index + 1}</p>
                <p className="mt-4 text-base leading-7 text-mistWhite/82">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mistWhite py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(290px,0.76fr)_minmax(0,1.24fr)] lg:items-center lg:gap-16">
          <EditorialImage image={magnificImages.proof} className="aspect-[4/5] max-w-md" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Introduce the Intensive</p>
            <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              We don't invent your differentiation. We uncover it.
            </h2>
            <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72">
              <p>The Earned Credibility™ Intensive is a strategic deep dive into the credibility you've accumulated but may never have intentionally identified, articulated or positioned.</p>
              <p>Together, we uncover the raw strategic assets sitting inside your expertise, lived experience, story, proof and perspective.</p>
              <p>Then we identify which ones deserve to shape the authority your brand becomes known for.</p>
            </div>
            <SiteButton to={actionPath} variant="blackGreen" className="mt-9 w-full sm:w-auto">
              Book Your Intensive
              <ArrowRight size={16} aria-hidden="true" />
            </SiteButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">The five assets</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              The 5 Earned Credibility™ Assets
            </h2>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-0 border-y border-sage lg:grid-cols-2">
            {assets.map((asset, index) => (
              <article key={asset.title} className="border-b border-sage py-7 last:border-b-0 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-deepEmerald">0{index + 1}. {asset.title}</p>
                <h3 className="mt-4 font-serif text-2xl leading-tight">{asset.question}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-charcoal/70">{asset.text}</p>
              </article>
              
            ))}
          </div>
          
        </div>
      </section>

      <section className="bg-mistWhite py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">The transformation</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              Stop searching for your differentiation. Start recognising what you've already earned.
            </h2>
          </div>
          <div className="mt-12 overflow-hidden border border-sage">
            <div className="grid bg-charcoal text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint sm:grid-cols-2">
              <p className="border-b border-mistWhite/14 px-5 py-4 sm:border-b-0 sm:border-r">Before the Intensive</p>
              <p className="px-5 py-4">After the Intensive</p>
            </div>
            {transformationRows.map(([before, after]) => (
              <div key={before} className="grid border-t border-sage bg-white sm:grid-cols-2">
                <p className="border-b border-sage px-5 py-5 text-base leading-7 text-charcoal/70 sm:border-b-0 sm:border-r">{before}</p>
                <p className="px-5 py-5 font-serif text-2xl leading-tight text-charcoal">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">What you leave with</p>
              <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
                Your Earned Credibility™ Map.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-charcoal/70">
              A strategic articulation of the authority assets already inside your body of work, plus a positioning direction so the document has somewhere useful to go.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {deliverables.map(([title, text]) => (
              <article key={title} className="border border-sage bg-mistWhite p-5 shadow-[0_14px_32px_rgba(34,34,34,0.04)]">
                <h3 className="font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-charcoal/68">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-8 text-mistWhite sm:py-10 lg:py-15">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">What this is not</p>
            <h2 className="mt-5 max-w-lg font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              This isn't a personal branding makeover.
            </h2>
          </div>
          <div>
            <CheckList items={notThis} dark className="border-y border-mistWhite/20 py-6 text-mistWhite/78" />
            <p className="mt-8 max-w-2xl font-serif text-xl leading-tight text-mistWhite">
              We're going deeper first: finding what the brand should be built from.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mistWhite py-16 sm:py-20 lg:py-28">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(290px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
          <EditorialImage image={magnificImages.offers} className="aspect-[4/5] max-w-md" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Who it's for</p>
            <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              The Earned Credibility™ Intensive is for you if...
            </h2>
            <CheckList items={whoItsFor} className="mt-8 max-w-2xl text-charcoal/74" />
            <p className="mt-8 border-l-2 border-deepEmerald pl-4 text-lg leading-8 text-charcoal/82">
              You don't need to manufacture a differentiator. You need to understand the authority you've already earned.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <EditorialImage image={magnificImages.finalCta} className="aspect-[16/10] max-w-xl border-mistWhite/20" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Why Magdalene</p>
            <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              This is the work behind Earned Credibility™.
            </h2>
            <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-mistWhite/76">
              <p>I did not build my authority by becoming more impressive. I built it by recognising the credibility I had already earned.</p>
              <p>That is the work I now help other experts do: see the expertise, experiences, proof and perspective already shaping their authority, then position those assets more intentionally.</p>
            </div>
            <div className="mt-8 grid gap-3 border-y border-mistWhite/18 py-5 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <p key={point} className="text-sm font-bold leading-6 text-mutedMint">{point}</p>
              ))}
            </div>
            {testimonials.length > 0 && (
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <blockquote key={testimonial._id || `${testimonial.name}-${testimonial.createdAt}`} className="border-l-2 border-mutedMint pl-5">
                    <Quote className="text-mutedMint" size={20} aria-hidden="true" />
                    <p className="mt-3 text-base leading-7 text-mistWhite/78">&ldquo;{testimonial.review}&rdquo;</p>
                    <cite className="mt-4 block text-sm not-italic text-mistWhite/62">
                      {testimonial.name}{testimonial.role ? `, ${testimonial.role}` : ""}
                    </cite>
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">How it works</p>
              <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
                A focused extraction journey.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-charcoal/70">
              The exact delivery details are confirmed before booking, but the work follows a clear extraction-to-positioning path.
            </p>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-0 border-y border-sage lg:grid-cols-2">
            {processSteps.map(([title, text], index) => (
              <article key={title} className="border-b border-sage py-7 last:border-b-0 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-deepEmerald">0{index + 1}. {title}</p>
                <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/70">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="container-shell mt-12 grid gap-12 border-t border-sage pt-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Investment</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              Earned Credibility™ Intensive
            </h2>
            <p className="mt-8 font-serif text-2xl leading-tight text-deepEmerald sm:text-3xl lg:text-4xl">{investment}</p>
          </div>
          <div className="border-y border-sage">
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[180px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Format</p>
              <p className="text-base leading-7 text-charcoal/74">Strategic pre-work, private deep-dive, distillation and positioning direction.</p>
            </div>
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[180px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Included</p>
              <p className="text-base leading-7 text-charcoal/74">Your written Earned Credibility™ Map.</p>
            </div>
            <div className="grid gap-5 py-6 sm:grid-cols-[180px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Best next step</p>
              <p className="text-base leading-7 text-charcoal/74">Book the Intensive when you want differentiation before a fuller brand repositioning.</p>
            </div>
            <SiteButton to={actionPath} variant="blackGreen" className="mb-2 mt-8 w-full sm:w-auto">
              Book Your Intensive
              {loading ? <ShieldCheck size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            </SiteButton>
          </div>
        </div>
      </section>
    </main>
  );
}
