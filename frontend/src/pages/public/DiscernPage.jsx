import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Quote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../components/SiteButton.jsx";
import { listPublicReviews } from "../../services/api.js";
import { magnificImages } from "./home/homeContent.js";

const costPoints = [
  "You get compared on credentials.",
  "You get compared on services.",
  "You get compared on price.",
  "You create more content hoping visibility will solve a positioning problem.",
  "People respect your work, but don't necessarily remember your name when the opportunity arises."
];

const transformationRows = [
  ["Credible but comparable", "Distinctively positioned"],
  ["Experienced but difficult to articulate", "Clear authority"],
  ["Stories without strategic purpose", "Lived experience that strengthens trust"],
  ["Posting for visibility", "Thought leadership that builds reputation"],
  ["Known for several things", "Associated with a clear position"],
  ["Explaining why you're different", "A brand that communicates the difference"],
  ["Expertise people respect", "A reputation people remember"]
];

const methodMovements = [
  {
    title: "DISCERN",
    heading: "Uncover What You've Already Earned.",
    text: "We extract the expertise, lived experience, stories, proof, beliefs and perspectives shaping your authority."
  },
  {
    title: "POSITION",
    heading: "Give People a Reason to Choose You.",
    text: "We clarify what you should become known for, who your authority matters to and why your positioning is difficult to compare."
  },
  {
    title: "EXPRESS",
    heading: "Make Your Authority Visible.",
    text: "We translate the strategy into messaging, story, thought leadership and your LinkedIn presence."
  },
  {
    title: "ESTABLISH",
    heading: "Build the Reputation Around It.",
    text: "We create the strategic consistency required for people to associate your name with a clear position, perspective and body of work."
  }
];

const workAreas = [
  ["Authority Positioning", "What you should become known for and why it matters."],
  ["Earned Credibility™", "The Expertise + Lived Experience already strengthening your authority."],
  ["Strategic Story", "The stories that explain why you see and do the work differently."],
  ["Messaging", "Language that makes your value easier to understand and remember."],
  ["LinkedIn Positioning", "A profile and presence aligned with the authority you're building."],
  ["Thought Leadership", "Ideas, perspectives and intellectual property that make your thinking recognisable."],
  ["Proof & Trust", "The evidence that reduces uncertainty around choosing you."],
  ["Reputation Strategy", "How these elements work together to build preference over time."]
];

const fitPoints = [
  "You've already built meaningful expertise in wellness.",
  "Your current brand doesn't reflect the level you're operating at.",
  "You're good at what you do, but struggle to articulate what makes your authority distinctive.",
  "You've accumulated stories, experience, accomplishments and ideas that aren't being strategically used.",
  "Your visibility has grown, but your positioning hasn't matured with it.",
  "You're entering a bigger season of your work and don't want your old positioning following you into it.",
  "You aren't looking for another content hack.",
  "You're ready to build the reputation your work deserves."
];

const proofPoints = [
  "Favikon Ambassador",
  "#1 Wellness Personal Brand",
  "Top 1% Personal Branding & Thought Leadership",
  "33K+ LinkedIn Community"
];

const programDeliverables = [
  {
    title: "6 Private Advisory Sessions",
    text: "We begin with a 90-minute strategic deep-dive, followed by five 60-minute advisory sessions across the engagement."
  },
  {
    title: "Between-Session Access",
    text: "Private access for strategic questions and feedback throughout our work together."
  },
  {
    title: "Strategic Direction",
    text: "Authority positioning, messaging and reputation strategy shaped around what you need to become known for."
  },
  {
    title: "Writing & Editorial Support",
    text: "Hands-on support translating your positioning into messaging and authority-building content."
  },
  {
    title: "Implementation",
    text: "We build collaboratively, with clear decisions about what I develop and what you implement between sessions."
  }
];

function CheckList({ items, dark = false, className = "" }) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base leading-relaxed">
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

export default function DiscernPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;

    listPublicReviews({ limit: 50 })
      .then((response) => {
        if (!active) return;
        const reviews = response.data.reviews || [];
        const relevant = reviews.filter((review) =>
          /position|authority|brand|trust|clar|story|strateg/i.test(`${review.headline || ""} ${review.review || ""}`)
        );
        setTestimonials((relevant.length ? relevant : reviews).slice(0, 3));
      })
      .catch(() => {
        if (active) setTestimonials([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="bg-[#FAF9F6] text-charcoal">
      
      {/* Hero Section */}
      <section className="border-b border-sage/60 bg-[#FAF9F6] py-12 sm:py-16 lg:py-24">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <Link to="/offers" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/70 transition hover:text-deepEmerald">
            <ArrowLeft size={15} aria-hidden="true" />
            <span>All offers</span>
          </Link>

          <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mutedMint/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-deepEmerald">
                <Sparkles size={14} aria-hidden="true" />
                <span>DISCERN™ | 90-Day Private Advisory</span>
              </span>
              <h1 className="mt-4 font-serif text-2xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.1]">
                Turn Your Authority Into a Reputation People <span className="text-deepEmerald">Trust.</span>
              </h1>
              
              <div className="mt-6 space-y-4 font-serif text-lg sm:text-xl text-charcoal/80 leading-relaxed">
                <p>You may already have the expertise. You may even know what makes your work different.</p>
                <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
                  But knowing your authority and having a market that recognises it, remembers it and trusts it are not the same thing. DISCERN™ is a 90-day private advisory where we position your authority and build the strategic communication around it, so your reputation gives the right people a reason to choose you.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <SiteButton to="/application/discern" variant="lightPrimary" className="justify-center px-6 py-3.5 text-xs font-bold shadow-md">
                  <span>Apply for DISCERN™</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </SiteButton>
                
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <EditorialImage image={magnificImages.finalCta} priority className="aspect-[4/5]" />
              <p className="mt-3 border-l-2 border-deepEmerald pl-3 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                Your expertise deserves a reputation that makes choosing you effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Recognition</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl md:text-4xlfont-bold text-charcoal leading-snug text-balance">
                Being credible is not the same as being known for something.
              </h2>
            </div>
            <div className="space-y-5 font-serif text-base sm:text-lg text-charcoal/80 leading-relaxed">
              <ul className="space-y-3 list-disc pl-5">
                <li>People may see your expertise, but struggle to place you.</li>
                <li>Your content may be valuable without building a clear association with your name.</li>
                <li>You can even be visible without becoming the person people think of when the right opportunity appears.</li>
              </ul>
              
              <p className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-deepEmerald pt-2">
                That is no longer simply a visibility problem. It's a reputation problem. DISCERN™ closes that distance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Section (Dark Theme) */}
      <section className="bg-charcoal py-8 sm:py-10 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The Real Cost</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug text-balance">
                When Your Reputation Undersells Your Expertise...
              </h2>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-md">
              <p className="font-serif text-sm sm:text-lg text-white">
                You get compared on credentials, services and price, so you create more content hoping visibility will solve what is actually a positioning problem. People may respect your work and recognize your expertise, but when the right opportunity arises, your name is not always the one they remember. 
              </p>
              <p className="mt-8 border-t border-white/10 pt-6 font-serif text-lg sm:text-xl font-bold text-white">
                The problem isn't always credibility. Sometimes, it's that your credibility isn't being perceived.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core IP Section (Deep Emerald Theme) */}
      <section className="bg-deepEmerald py-8 sm:py-10 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">My Core Belief</span>
            <h2 className="mt-3 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug text-balance">
              Expertise + Lived Experience = Earned Credibility™
            </h2>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-mistWhite/80">
              Your authority isn't built from credentials alone. It's also shaped by what you've experienced, what you've overcome, what you've observed, what you've proven and the perspective you've earned along the way.
            </p>
            <p className="mt-6 font-serif text-xl sm:text-2xl font-bold text-mutedMint">
              DISCERN™ uncovers that credibility and positions it intentionally.
            </p>
          </div>
        </div>
      </section>

      {/* Introduce DISCERN Section */}
      <section className="bg-white py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <EditorialImage image={magnificImages.assessment} className="aspect-[4/5] max-w-md mx-auto w-full" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Introduce DISCERN™</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight text-balance">
                We position the authority. Then we build the reputation around it.
              </h2>
              
              <div className="mt-6 space-y-4 font-serif text-sm sm:text-base text-charcoal/80 leading-relaxed">
                <p>This is where DISCERN™ goes beyond finding what makes you different.</p>
                <p>We decide what your authority should stand for in the market and make that position clear. Then we translate it into the messaging and strategic content people repeatedly experience from you.</p>
                <p className="font-sans text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                  Because positioning that only exists in a strategy document cannot build a reputation. It has to become recognisable in the market.
                </p>
              </div>

              <div className="mt-8">
                <SiteButton to="/application/discern" variant="lightPrimary" className="px-8 py-3.5 text-xs font-bold shadow-md">
                  <span>Apply for DISCERN™</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </SiteButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Table Section */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The Transformation</span>
            <h2 className="mt-2 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
              From Credible to the Trusted Choice™
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-sm">
            <div className="grid bg-charcoal text-xs font-bold uppercase tracking-wider text-mutedMint sm:grid-cols-2">
              <p className="border-b border-white/10 px-6 py-4 sm:border-b-0 sm:border-r border-white/10">Before</p>
              <p className="px-6 py-4">After</p>
            </div>
            {transformationRows.map(([before, after], idx) => (
              <div key={before} className={`grid border-t border-sage/60 ${idx % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]/50"} sm:grid-cols-2`}>
                <p className="border-b border-sage/60 px-6 py-5 text-xs sm:text-sm leading-relaxed text-charcoal/70 sm:border-b-0 sm:border-r">{before}</p>
                <p className="px-6 py-5 font-serif text-lg sm:text-xl font-bold text-charcoal leading-snug flex items-center">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCERN Method Section (Dark Theme) */}
      <section className="bg-charcoal py-8 sm:py-10 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The DISCERN™ Method</span>
            <h2 className="mt-2 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              The Work Happens Across Four Movements.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {methodMovements.map((movement, index) => (
              <article key={movement.title} className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-md">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-mutedMint block mb-2">
                    0{index + 1}. {movement.title}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white leading-snug">{movement.heading}</h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-mistWhite/75">{movement.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center border-t border-white/10 pt-8">
            <p className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-mutedMint">
              DISCERN → POSITION → EXPRESS → ESTABLISH
            </p>
          </div>
        </div>
      </section>

      {/* What We May Work On Section */}
      <section className="bg-white py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">What We May Work On</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
                Your Brand Doesn't Need More Things.
              </h2>
            </div>
            <p className="font-serif text-sm sm:text-base lg:text-lg leading-relaxed text-charcoal/75">
              It needs the right things working together. Depending on where the credibility gap exists, our work may include:
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workAreas.map(([title, text]) => (
              <article key={title} className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-7 sm:p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-charcoal leading-snug">{title}</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/70">{text}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-3xl rounded-2xl border border-deepEmerald/20 bg-deepEmerald/5 p-5 text-xs sm:text-sm font-semibold text-charcoal/75">
            Note: These are not fixed deliverables. DISCERN™ is private advisory, and different clients will have different credibility gaps.
          </p>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditorialImage image={magnificImages.offers} className="aspect-[4/5] max-w-md mx-auto w-full" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Who It's For</span>
              <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal leading-tight text-balance">
                DISCERN™ Is for the Practitioner Who Has Outgrown Their Brand.
              </h2>
              <p className="mt-4 font-serif text-sm sm:text-base lg:text-lg text-charcoal/75">This is likely for you if:</p>

              <div className="mt-6 rounded-3xl border border-sage/80 bg-white p-6 sm:p-8 shadow-sm">
                <CheckList items={fitPoints} className="text-charcoal/75" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Magdalene (Dark Theme) */}
      <section className="bg-charcoal py-8 sm:py-10 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <EditorialImage image={magnificImages.finalCta} className="aspect-[4/5] max-w-md mx-auto w-full border-white/20" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">Why Magdalene</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug text-balance">
                I Built This Philosophy From the Inside Out.
              </h2>

              <div className="mt-6 space-y-4 font-serif text-sm sm:text-base lg:text-lg text-mistWhite/80 leading-relaxed">
                <p>I did not build my authority by becoming more impressive. I built it by recognising the credibility I had already earned.</p>
                <p className="font-sans text-xs sm:text-sm text-mistWhite/70 leading-relaxed">
                  That is why my work is not about helping you perform authority. It is about helping you position the expertise, lived experience, proof and perspective already shaping the way you work.
                </p>
              </div>

              <div className="mt-8 grid gap-3 border-y border-white/15 py-6 sm:grid-cols-2">
                {proofPoints.map((point) => (
                  <p key={point} className="text-xs sm:text-sm font-bold text-mutedMint">{point}</p>
                ))}
              </div>

              {testimonials.length > 0 && (
                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  {testimonials.map((testimonial) => (
                    <blockquote key={testimonial._id || `${testimonial.name}-${testimonial.createdAt}`} className="border-l-2 border-mutedMint pl-4">
                      <Quote className="text-mutedMint" size={18} aria-hidden="true" />
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-mistWhite/80">&ldquo;{testimonial.review}&rdquo;</p>
                      <cite className="mt-3 block text-xs not-italic text-mistWhite/60">
                        {testimonial.name}{testimonial.role ? `, ${testimonial.role}` : ""}
                      </cite>
                    </blockquote>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What 90 Days Looks Like & Conversion Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The Experience</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              What 90 Days With Me Looks Like.
            </h2>
            <p className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-charcoal/75">
              DISCERN™ is intentionally private. The exact delivery details are confirmed through the application and fit conversation so the advisory reflects the credibility gap we are solving.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programDeliverables.map((item) => (
              <article key={item.title} className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-7 sm:p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-charcoal leading-snug">{item.title}</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Final Conversion Card */}
        <div className="container-shell mx-auto max-w-5xl px-1 sm:px-3 lg:px-6 mt-16">
          <div className="rounded-3xl border border-charcoal bg-charcoal p-8 sm:p-12 text-center text-mistWhite shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-mutedMint/10 blur-2xl pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint block mb-2">Apply for DISCERN™</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Build the reputation your work deserves.</h2>
            
            <div className="mt-8 flex justify-center">
              <SiteButton to="/application/discern" variant="brandOnDark" className="px-8 py-3.5 text-xs font-bold shadow-md">
                <span>Apply for DISCERN™</span>
                <ArrowRight size={15} aria-hidden="true" />
              </SiteButton>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}