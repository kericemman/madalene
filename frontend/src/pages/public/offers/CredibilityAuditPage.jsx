import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Quote, Search, ShieldCheck, Sparkles } from "lucide-react";
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
        <li key={item} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
          <Check className={`mt-1 shrink-0 ${dark ? "text-mutedMint" : "text-deepEmerald"}`} size={17} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EditorialImage({ image, className = "", priority = false }) {
  return (
    <figure className={`overflow-hidden rounded-3xl border border-sage/80 bg-sage shadow-md ${className}`}>
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
    <main className="bg-[#FAF9F6] text-charcoal">
      
      {/* Hero Section */}
      <section className="border-b border-sage/60 bg-[#FAF9F6] py-12 sm:py-16 lg:py-24">
        <div className="container-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/offers" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/70 transition hover:text-deepEmerald">
            <ArrowLeft size={15} aria-hidden="true" />
            <span>All offers</span>
          </Link>

          <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mutedMint/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-deepEmerald">
                <Search size={14} aria-hidden="true" />
                <span>Credibility Clarity Audit™</span>
              </span>
              <h1 className="mt-4 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal leading-[1.1]">
                Something isn't landing. Let's find out <span className="text-deepEmerald">what.</span>
              </h1>

              <div className="mt-6 space-y-4 font-serif text-base sm:text-lg text-charcoal/80 leading-relaxed">
                <p>You've built real expertise.</p>
                <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
                  But somewhere between what you know, how you're positioned, and what people see online, some of that value may be getting lost. The Credibility Clarity Audit™ is a private diagnostic designed to identify where your brand is weakening trust, why it's happening, and what deserves your attention first.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <SiteButton to={actionPath} variant="lightPrimary" className="justify-center px-6 py-3.5 text-xs font-bold shadow-md">
                  <span>Book Your Credibility Clarity Audit™</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </SiteButton>
                <p className="text-xs font-semibold text-charcoal/60 text-center sm:text-left">
                  $99 USD · Private 1:1 Audit
                </p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <EditorialImage image={magnificImages.assessment} priority className="aspect-[4/5]" />
              <p className="mt-3 border-l-2 border-deepEmerald pl-3 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                Your expertise deserves a brand people can understand, trust and choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-8 sm:py-10 lg:py-15 bg-white">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">02. Recognition</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-snug text-balance">
                You know the quality of your work. But something about the way it is being perceived feels off.
              </h2>
            </div>
            <div>
              <div className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-6 sm:p-8 shadow-sm">
                <CheckList items={recognitionPoints} className="text-charcoal/80" />
              </div>
              <div className="mt-8 space-y-4 font-serif text-base sm:text-lg text-charcoal/75 leading-relaxed">
                <p>So you start changing things. Your headline. Your content. Your offer. Maybe the whole brand.</p>
                <p>But if you don't know what is weakening perception, you can spend months fixing things that were never the problem.</p>
                <p className="font-serif text-lg sm:text-xl font-bold text-charcoal pt-2">
                  That is where the Credibility Clarity Audit™ begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Cost Section (Dark Theme) */}
      <section className="bg-charcoal py-8 sm:py-10 lg:py-15 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The Cost</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-white leading-snug text-balance">
                When you don't know what's weakening trust, you fix the wrong things.
              </h2>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-md">
              <ul className="grid gap-4 sm:grid-cols-2">
                {wrongFixes.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs sm:text-sm text-mistWhite/85">
                    <CircleAlert className="shrink-0 text-mutedMint mt-0.5" size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem We Are Diagnosing (Deep Emerald Theme) */}
      <section className="bg-deepEmerald py-8 sm:py-10 lg:py-15 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">03. The Problem We Are Diagnosing</span>
            <h2 className="mt-3 font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug text-balance">
              Your expertise and the perception of it are not always the same thing.
            </h2>
            
            <div className="my-8 rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-md">
              <p className="font-serif text-xl sm:text-2xl font-bold text-white">The Credibility Gap™</p>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-mistWhite/80">
                The distance between the credibility you've earned and the credibility other people can perceive.
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-mistWhite/80">
              The Audit looks at your brand from the outside in, through the same signals people encounter when deciding whether to understand you, trust you, and take the next step. Then I identify where that gap is showing up and what is contributing to it.
            </p>

            <div className="mt-8">
              <Link to="/offers/earned-credibility-intensive" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-mutedMint hover:text-white transition group">
                <span>Learn About the Credibility Gap™</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What I Diagnose Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">04. What I Diagnose</span>
              <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-charcoal leading-tight text-balance">
                We'll find where your credibility is getting lost in translation.
              </h2>
              <p className="mt-4 font-serif text-base sm:text-lg text-charcoal/75">
                I review five areas of your brand:
              </p>

              <div className="mt-8 overflow-hidden rounded-3xl border border-sage/80 shadow-md">
                <img src="/src/assets/home/diag.jpg" alt="Magnific Credibility Audit Diagnosis" className="w-full h-auto object-cover" />
              </div>
            </div>

            <div className="space-y-4">
              {diagnosisAreas.map((area, index) => (
                <article key={area.title} className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-2xl font-bold text-deepEmerald">0{index + 1}</span>
                    <h3 className="font-serif text-xl font-bold text-charcoal">{area.title}</h3>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/70 pl-10">
                    {area.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Walk Away Knowing Section */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">05. What You Walk Away Knowing</span>
            <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-charcoal leading-tight">
              You won't leave with more things to think about. You'll know what deserves your attention.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {deliverables.map((item, index) => (
              <article key={item.title} className="rounded-3xl border border-sage/80 bg-white p-7 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald block mb-2">
                    0{index + 1}. {item.title}
                  </span>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <SiteButton to={actionPath} variant="lightPrimary" className="px-8 py-3.5 text-xs font-bold shadow-md">
              <span>Book My Credibility Audit</span>
              <ArrowRight size={15} aria-hidden="true" />
            </SiteButton>
          </div>
        </div>
      </section>

      {/* Assessment vs Audit Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">06. Free Assessment vs Paid Audit</span>
              <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-charcoal leading-tight text-balance">
                Already taken the Earned Credibility™ Assessment? This goes deeper.
              </h2>
            </div>
            
            <div className="grid gap-6 rounded-3xl border border-sage/80 bg-[#FAF9F6] p-8 sm:p-10 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Assessment</span>
                <p className="mt-1 font-serif text-lg sm:text-xl font-bold text-charcoal">Where might my credibility gap be?</p>
              </div>
              <div className="border-t border-sage/80 pt-6">
                <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Audit</span>
                <p className="mt-1 font-serif text-lg sm:text-xl font-bold text-charcoal">What is causing it in my brand, and what should I do about it?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditorialImage image={magnificImages.proof} className="aspect-[4/5] max-w-md mx-auto w-full" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">08. Who This Is For</span>
              <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-charcoal leading-tight text-balance">
                This is for you if your expertise is established, but your brand feels behind it.
              </h2>

              <div className="mt-8 rounded-3xl border border-sage/80 bg-white p-6 sm:p-8 shadow-sm">
                <CheckList items={whoItsFor} className="text-charcoal/75" />
              </div>

              <div className="mt-8 space-y-3 rounded-3xl border border-deepEmerald/20 bg-deepEmerald/5 p-6 sm:p-8 text-xs sm:text-sm leading-relaxed text-charcoal/80 font-medium">
                <p>This is not a brand makeover.</p>
                <p>And it is not for someone looking for a few quick LinkedIn tips.</p>
                <p className="font-serif text-base sm:text-lg font-bold text-charcoal pt-2">
                  It is a strategic diagnosis for someone who wants to understand the problem before deciding how deeply to solve it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Magdalene Section (Dark Theme) */}
      <section className="bg-charcoal py-8 sm:py-10 lg:py-15 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <EditorialImage image={magnificImages.offers} className="aspect-[4/5] max-w-md mx-auto w-full border-white/20" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">09. Why Magdalene</span>
              <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-white leading-snug text-balance">
                I look for what your brand is failing to reveal.
              </h2>
              
              <div className="mt-6 space-y-4 font-serif text-base sm:text-lg text-mistWhite/80 leading-relaxed">
                <p>My work sits at the intersection of personal brand positioning and authority. I pay particular attention to the expertise people have earned through experience, the judgement behind their work, and whether any of that is visible in the way they are positioned.</p>
                <p className="font-sans text-xs sm:text-sm text-mistWhite/70 leading-relaxed">
                  Because sometimes the problem isn't that you need a stronger brand. The brand simply hasn't caught up with the expert behind it.
                </p>
              </div>

              <div className="mt-8 grid gap-2 border-y border-white/15 py-6 sm:grid-cols-2">
                <p className="text-xs font-bold text-mutedMint">33K+ LinkedIn Audience</p>
                <p className="text-xs font-bold text-mutedMint">#1 Globally Wellness Personal Brand · Favikon</p>
                <p className="text-xs font-bold text-mutedMint">Favikon Top 20 Most Influential Personal Brands · LinkedIn Kenya</p>
                <p className="text-xs font-bold text-mutedMint">Top 1% Personal Branding & Thought Leadership</p>
                <p className="text-xs font-bold text-mutedMint sm:col-span-2">Favikon Ambassador</p>
              </div>

              {testimonial && (
                <blockquote className="mt-8 border-l-2 border-mutedMint pl-4">
                  <Quote className="text-mutedMint" size={18} aria-hidden="true" />
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-mistWhite/80">&ldquo;{testimonial.review}&rdquo;</p>
                  <cite className="mt-3 block text-xs not-italic text-mistWhite/60">
                    {testimonial.name}{testimonial.role ? `, ${testimonial.role}` : ""}
                  </cite>
                </blockquote>
              )}

              <div className="mt-8">
                <Link to="/about" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-mutedMint hover:text-white transition group">
                  <span>Read Magdalene's Story</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Session Details Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">10. Investment</span>
              <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-charcoal leading-tight">
                Get clear before you change another thing.
              </h2>
              <p className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-charcoal/75">
                Before we meet, you'll complete a short intake so I can review your current brand and arrive ready to diagnose rather than spend the session gathering context.
              </p>
              <div className="mt-8">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-deepEmerald">{investment}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-charcoal/60">USD · 45-minute private 1:1 session</p>
              </div>
            </div>

            <div className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-8 sm:p-10 shadow-sm space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-deepEmerald mb-4">What we do</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-charcoal/75">
                  Identify where perception is falling behind your expertise, examine what's contributing to it, and determine what deserves your attention first.
                </p>
              </div>
              <div className="border-t border-sage/80 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-deepEmerald mb-4">You leave knowing</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-charcoal/75">
                  What is actually wrong. What matters most. What to do next.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-sage/80 pt-16 lg:grid-cols-2">
            <div className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-8 sm:p-10 shadow-sm">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-6">During our time together, we'll:</h3>
              <CheckList items={sessionAgenda} className="text-charcoal/75" />
            </div>
            
            <div className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-8 sm:p-10 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-6">You leave knowing:</h3>
                <CheckList items={sessionTakeaways} className="text-charcoal/75" />
              </div>
              <div className="mt-8 pt-6 border-t border-sage/80 text-center sm:text-left">
                <SiteButton to={actionPath} variant="lightPrimary" className="px-8 py-3.5 text-xs font-bold shadow-md w-full sm:w-auto justify-center">
                  <span>Book Your Credibility Clarity Audit™</span>
                 
                </SiteButton>
                <p className="mt-3 text-xs text-charcoal/60">Already taken the Assessment? Bring your results with you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Close Section (Dark Theme Card) */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10 lg:py-15">
        <div className="container-shell mx-auto max-w-4xl px-1 sm:px-3 lg:px-6 text-center">
          <div className="rounded-3xl border border-charcoal bg-charcoal p-8 sm:p-12 text-mistWhite shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-mutedMint/10 blur-2xl pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint block mb-2">11. Final Close</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Before you rebuild your brand, diagnose the problem.</h2>
            <p className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-mistWhite/80 max-w-xl mx-auto">
              You may not need to change everything. You need to know which change will actually matter.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <SiteButton to={actionPath} variant="brandOnDark" className="px-8 py-3.5 text-xs font-bold shadow-md">
                <span>Book Your Credibility Clarity Audit™</span>
                
              </SiteButton>
              <p className="text-xs text-mistWhite/60">Already taken the Assessment? Bring your results with you.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}