import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Quote, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicReviews } from "../../../services/api.js";
import { magnificImages } from "../home/homeContent.js";

const recognitionPoints = [
  "Clients visit your profile but don't take the next step.",
  "Your content gets attention, but the opportunities don't reflect the quality of your expertise.",
  "People understand what you do without understanding why YOU should be the person they choose.",
  "You keep changing pieces of your brand (headline, content, offer) without knowing which problem you are solving."
];

const wrongFixes = [
  "You rewrite your headline.",
  "You post more.",
  "You change your colours.",
  "You add another qualification.",
  "You rework your offer.",
  "You try another content strategy."
];

const diagnosisAreas = [
  {
    title: "Positioning",
    text: "Can the right person quickly understand what you should be known for and why your work is distinct?"
  },
  {
    title: "Story",
    text: "Is your lived experience strengthening how people understand your expertise, or simply sitting in your biography?"
  },
  {
    title: "Authority",
    text: "Does your brand make the actual depth of your expertise visible?"
  },
  {
    title: "Messaging",
    text: "Does your language communicate the value of your work clearly enough to matter to the people you want to reach?"
  },
  {
    title: "LinkedIn Presence",
    text: "Does your profile reinforce your positioning, or create gaps between who you are and how you are perceived?"
  }
];

const deliverables = [
  {
    title: "Where the gap is",
    text: "The parts of your brand currently underselling or confusing your expertise."
  },
  {
    title: "Why it's happening",
    text: "The positioning or communication issue underneath what you're seeing."
  },
  {
    title: "What matters most",
    text: "Which problems deserve attention now and which ones can wait."
  },
  {
    title: "What to do next",
    text: "A clear strategic direction based on what we uncover, plus your personalised Credibility Clarity Audit™ findings."
  }
];

const whoItsFor = [
  "Your expertise is established, but your brand feels behind it.",
  "You know the quality of your work but cannot clearly identify why your positioning is not producing the perception you expect.",
  "You've been changing your content, profile or messaging without being certain which problem you're actually solving."
];

const sessionAgenda = [
  "Review what you're currently communicating and your brand signals.",
  "Identify where perception is falling behind your expertise.",
  "Examine what's contributing to the gap in your positioning.",
  "Determine what deserves your attention first.",
  "Define your next strategic move."
];

const sessionTakeaways = [
  "What is actually wrong.",
  "What matters most.",
  "What to do next."
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

export default function CredibilityAuditPage({ actionPath, loading, offer }) {
  const [testimonial, setTestimonial] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;

    listPublicReviews({ limit: 50 })
      .then((response) => {
        if (!active) return;
        const reviews = response.data.reviews || [];
        const targetedReview = reviews.find((review) => /rebecca/i.test(`${review.name || ""}`));
        const fallbackReview = reviews.find((review) =>
          /eye-opening|offer|clar|position|message|brand|strateg|trust/i.test(`${review.headline || ""} ${review.review || ""}`)
        );
        setTestimonial(targetedReview || fallbackReview || reviews[0] || null);
      })
      .catch(() => {
        if (active) setTestimonial(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const investment = useMemo(() => {
    const price = Number(offer?.price);
    return Number.isFinite(price) && price > 0 ? `$${price.toLocaleString("en-US")}` : "$99";
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
                <Search size={15} aria-hidden="true" />
                Credibility Clarity Audit™
              </div>
              <h1 className="mt-6 font-serif text-2xl font-bold leading-[1.04] text-balance sm:text-6xl lg:text-4xl">
                Something isn&apos;t landing. Let&apos;s find out <span className="text-deepEmerald">what.</span>
              </h1>
              <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72 sm:text-xl sm:leading-9">
                <p>You&apos;ve built real expertise.</p>
                <p>
                  But somewhere between what you know, how you&apos;re positioned, and what people see online, some of that value may be getting lost.
                </p>
                <p>The Credibility Clarity Audit™ is a private diagnostic designed to identify where your brand is weakening trust, why it&apos;s happening, and what deserves your attention first.</p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
                  Book Your Credibility Clarity Audit™
                  <ArrowRight size={16} aria-hidden="true" />
                </SiteButton>
                <p className="text-sm leading-6 text-charcoal/58">$99 USD · Private 1:1 Audit</p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <EditorialImage image={magnificImages.assessment} priority className="aspect-[4/5]" />
              <p className="mt-3 border-l-2 border-deepEmerald pl-3 text-sm leading-6 text-charcoal/62">
                Your expertise deserves a brand people can understand, trust and choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">02. Recognition</p>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight text-balance sm:text-5xl">You know the quality of your work. But something about the way it is being perceived feels off.</h2>
          </div>
          <div>
            <CheckList items={recognitionPoints} className="border-y border-sage py-6 text-charcoal/76" />
            <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72">
              <p>So you start changing things. Your headline. Your content. Your offer. Maybe the whole brand.</p>
              <p>But if you don&apos;t know what is weakening perception, you can spend months fixing things that were never the problem.</p>
              <p className="font-serif text-3xl leading-tight text-charcoal">That is where the Credibility Clarity Audit™ begins.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-8 text-mistWhite sm:py-10 lg:py-15">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">The cost</p>
            <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight text-balance sm:text-5xl">When you don&apos;t know what&apos;s weakening trust, you fix the wrong things.</h2>
          </div>
          <div>
            <ul className="grid gap-x-8 border-y border-mistWhite/20 py-6 sm:grid-cols-2">
              {wrongFixes.map((item) => (
                <li key={item} className="flex items-center gap-3 py-4 text-base text-mistWhite/78 last:border-b-0">
                  <CircleAlert className="shrink-0 text-mutedMint" size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-deepEmerald py-8 text-mistWhite sm:py-10 lg:py-15">
        <div className="container-shell text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">03. The Problem We Are Diagnosing</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-3xl leading-tight text-balance sm:text-4xl">
            Your expertise and the perception of it are not always the same thing.
          </h2>
          <div className="mx-auto mt-10 max-w-2xl border-y border-mistWhite/25 py-6">
            <p className="font-serif text-3xl leading-tight sm:text-4xl">The Credibility Gap&trade;</p>
            <p className="mt-3 text-base leading-7 text-mistWhite/80">The distance between the credibility you&apos;ve earned and the credibility other people can perceive.</p>
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-mistWhite/78">
            The Audit looks at your brand from the outside in, through the same signals people encounter when deciding whether to understand you, trust you, and take the next step. Then I identify where that gap is showing up and what is contributing to it.
          </p>
          <div className="mt-8">
            <Link to="/offers/earned-credibility-intensive" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mutedMint hover:text-white transition">
              <span>Learn About the Credibility Gap™</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">04. What I Diagnose</p>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight text-balance sm:text-5xl">We&apos;ll find where your credibility is getting lost in translation.</h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-charcoal/68">I review five areas of your brand:</p>

            <div>
              <img src="/src/assets/home/diag.jpg" alt="Magnific Credibility Audit Diagnosis" className="mt-6 w-full max-w-lg rounded-md border border-sage shadow-[0_16px_36px_rgba(26,26,26,0.06)]" />
            </div>
          </div>
          
          <ol className="divide-y divide-sage border-y border-sage">
            {diagnosisAreas.map((area, index) => (
              <li key={area.title} className="grid gap-4 py-6 sm:grid-cols-[62px_minmax(0,1fr)] sm:gap-6">
                <p className="font-serif text-3xl leading-none text-deepEmerald">0{index + 1}</p>
                <div>
                  <h3 className="font-serif text-2xl leading-tight">{area.title}</h3>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-charcoal/70">{area.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-sage bg-mistWhite py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">05. What You Walk Away Knowing</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-4xl">You won&apos;t leave with more things to think about. You&apos;ll know what deserves your attention.</h2>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-0 border-y border-sage lg:grid-cols-2">
            {deliverables.map((item, index) => (
              <article key={item.title} className="border-b border-sage py-6 last:border-b-0">
                <div className="flex gap-4">
                  <p className="pt-0.5 text-sm font-extrabold text-deepEmerald">0{index + 1}</p>
                  <div>
                    <h3 className="font-serif text-2xl leading-tight">{item.title}</h3>
                    <p className="mt-2 max-w-md text-base leading-7 text-charcoal/68">{item.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
              Book My Audit
              <ArrowRight size={16} aria-hidden="true" />
            </SiteButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">06. Free Assessment vs Paid Audit</p>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-balance sm:text-4xl">Already taken the Earned Credibility™ Assessment? This goes deeper.</h2>
          </div>
          <div className="grid gap-6 rounded-2xl border border-sage bg-mistWhite p-6 sm:p-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-deepEmerald">Assessment</p>
              <p className="mt-1 font-serif text-xl">Where might my credibility gap be?</p>
            </div>
            <div className="border-t border-sage pt-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-deepEmerald">Audit</p>
              <p className="mt-1 font-serif text-xl">What is causing it in my brand, and what should I do about it?</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mistWhite py-16 sm:py-20 lg:py-28">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(290px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
          <EditorialImage image={magnificImages.proof} className="aspect-[4/5] max-w-md" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">08. Who This Is For</p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-balance sm:text-5xl">This is for you if your expertise is established, but your brand feels behind it.</h2>
            <CheckList items={whoItsFor} className="mt-8 max-w-2xl text-charcoal/74" />
            <div className="mt-8 space-y-3 border-l-2 border-deepEmerald pl-4 text-base leading-7 text-charcoal/82 font-medium">
              <p>This is not a brand makeover.</p>
              <p>And it is not for someone looking for a few quick LinkedIn tips.</p>
              <p className="font-serif text-lg text-charcoal">It is a strategic diagnosis for someone who wants to understand the problem before deciding how deeply to solve it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <EditorialImage image={magnificImages.offers} className="aspect-[16/10] max-w-xl border-mistWhite/20" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">09. Why Magdalene</p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-balance sm:text-5xl">I look for what your brand is failing to reveal.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-mistWhite/76">
              My work sits at the intersection of personal brand positioning and authority. I pay particular attention to the expertise people have earned through experience, the judgement behind their work, and whether any of that is visible in the way they are positioned.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-mistWhite/76">
              Because sometimes the problem isn&apos;t that you need a stronger brand. The brand simply hasn&apos;t caught up with the expert behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-mistWhite/18 py-5 text-sm font-bold text-mutedMint">
              <span>33K+ LinkedIn Audience</span>
              <span>#1 Globally Wellness Personal Brand · Favikon</span>
              <span>Favikon Top 20 Most Influential Personal Brands · LinkedIn Kenya</span>
              <span>Top 1% Personal Branding &amp; Thought Leadership</span>
              <span>Favikon Ambassador</span>
            </div>
            {testimonial && (
              <blockquote className="mt-8 border-l-2 border-mutedMint pl-5">
                <Quote className="text-mutedMint" size={20} aria-hidden="true" />
                <p className="mt-3 max-w-2xl font-serif text-2xl leading-tight text-mistWhite">&ldquo;{testimonial.review}&rdquo;</p>
                <cite className="mt-4 block text-sm not-italic text-mistWhite/62">{testimonial.name}{testimonial.role ? `, ${testimonial.role}` : ""}</cite>
              </blockquote>
            )}
            <div className="mt-8">
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-mutedMint hover:text-white transition">
                <span>Read Magdalene&apos;s Story</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">10. Investment</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-balance sm:text-5xl">Get clear before you change another thing.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-charcoal/68">
              Before we meet, you&apos;ll complete a short intake so I can review your current brand and arrive ready to diagnose rather than spend the session gathering context.
            </p>
            <p className="mt-8 font-serif text-5xl leading-none text-deepEmerald">{investment}</p>
            <p className="mt-2 text-sm text-charcoal/58">USD · 45-minute private 1:1 session</p>
          </div>
          <div className="border-y border-sage">
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[170px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">What we do</p>
              <p className="text-base leading-7 text-charcoal/74">Identify where perception is falling behind your expertise, examine what&apos;s contributing to it, and determine what deserves your attention first.</p>
            </div>
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[170px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">You leave knowing</p>
              <p className="text-base leading-7 text-charcoal/74">What is actually wrong. What matters most. What to do next.</p>
            </div>
          </div>
        </div>

        <div className="container-shell mt-12 grid gap-10 border-t border-sage pt-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-serif text-3xl leading-tight">During our time together, we&apos;ll:</h3>
            <CheckList items={sessionAgenda} className="mt-7 text-charcoal/74" />
          </div>
          <div>
            <h3 className="font-serif text-3xl leading-tight">You leave knowing:</h3>
            <CheckList items={sessionTakeaways} className="mt-7 text-charcoal/74" />
            <div className="mt-9">
              <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
                Book Your Credibility Clarity Audit™
                {loading ? <ShieldCheck size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
              </SiteButton>
              <p className="mt-3 text-xs text-charcoal/60">Already taken the Assessment? Bring your results with you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sage bg-mistWhite py-16 sm:py-20 lg:py-24 text-center">
        <div className="container-shell max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">11. Final Close</p>
          <h2 className="mt-5 font-serif text-3xl sm:text-5xl font-bold leading-tight text-balance">Before you rebuild your brand, diagnose the problem.</h2>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-charcoal/72 max-w-2xl mx-auto font-serif">
            You may not need to change everything. You need to know which change will actually matter.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3">
            <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
              Book Your Credibility Clarity Audit™
              <ArrowRight size={16} aria-hidden="true" />
            </SiteButton>
            <p className="text-xs text-charcoal/58">Already taken the Assessment? Bring your results with you.</p>
          </div>
        </div>
      </section>
    </main>
  );
}