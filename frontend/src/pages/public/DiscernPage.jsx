import { useEffect, useState } from "react";
import { ArrowRight, Check, Quote, ShieldCheck } from "lucide-react";
import SiteButton from "../../components/SiteButton.jsx";
import { listPublicReviews } from "../../services/api.js";
import { magnificImages } from "./home/homeContent.js";

const recognitionPoints = [
  "You've built the expertise.",
  "You've done the work.",
  "You have the experience, stories, results and perspective to prove it.",
  "But your brand still doesn't communicate the full weight of what you've earned."
];

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

const experienceQuestions = [
  "Private advisory cadence",
  "Between-session access",
  "What I personally review",
  "Strategic assets and frameworks",
  "Implementation responsibilities"
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
    <main className="bg-mistWhite text-charcoal">
      <section className="border-b border-sage bg-mistWhite">
        <div className="container-shell py-8 sm:py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.74fr)] lg:items-center lg:gap-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 border-y border-sage py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
                DISCERN™ | 90-Day Private Advisory
              </div>
              <h1 className="mt-6 font-serif text-2xl font-bold leading-[1.04] text-balance sm:text-6xl lg:text-4xl">
                Your Expertise Has Grown. <span className="text-deepEmerald">Your Reputation Should Catch Up.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-charcoal/72 sm:text-xl sm:leading-9">
                DISCERN™ is a private advisory for established wellness practitioners ready to position their Expertise + Lived Experience into a brand people Trust, Remember & Choose.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SiteButton to="/application/discern" variant="blackGreen" className="w-full sm:w-auto">
                  Apply for DISCERN™
                  <ArrowRight size={16} aria-hidden="true" />
                </SiteButton>
                <p className="text-sm leading-6 text-charcoal/58">Private advisory. Strategic repositioning. 90 days.</p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <EditorialImage image={magnificImages.finalCta} priority className="aspect-[4/5]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Recognition</p>
            <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight text-balance sm:text-5xl">
              You're Credible. But Are You the Trusted Choice?
            </h2>
          </div>
          <div>
            {/* <CheckList items={recognitionPoints} className="border-y border-sage py-6 text-charcoal/76" /> */}
            <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72">
              <p>People can see what you do.</p>
              <p>They may even trust that you're good at it.</p>
              <p className="font-serif text-3xl leading-tight text-charcoal">But they don't immediately understand why you.</p>
              <p>And when that difference isn't clear, even exceptional experts become comparable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-8 text-mistWhite sm:py-10 lg:py-15">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">The real cost</p>
            <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight text-balance sm:text-5xl">
              When Your Reputation Undersells Your Expertise...
            </h2>
          </div>
          <div>
            <CheckList items={costPoints} dark className="border-y border-mistWhite/20 py-6 text-mistWhite/78" />
            <p className="mt-8 max-w-2xl font-serif text-3xl leading-tight text-mistWhite">
              The problem isn't always credibility. Sometimes, it's that your credibility isn't being perceived.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-deepEmerald py-12 text-mistWhite sm:py-16 lg:py-20">
        <div className="container-shell text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">My core belief</p>
          <h2 className="mx-auto mt-6 max-w-5xl font-serif text-2xl leading-none text-balance sm:text-4xl lg:text-5xl">
            Expertise + Lived Experience = Earned Credibility™
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-mistWhite/78">
            Your authority isn't built from credentials alone. It's also shaped by what you've experienced, what you've overcome, what you've observed, what you've proven and the perspective you've earned along the way.
          </p>
          <p className="mx-auto mt-6 max-w-3xl font-serif text-3xl leading-tight">
            DISCERN™ uncovers that credibility and positions it intentionally.
          </p>
        </div>
      </section>

      <section className="bg-mistWhite py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
          <EditorialImage image={magnificImages.assessment} className="aspect-[4/5] max-w-md" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Introduce DISCERN™</p>
            <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              This Is Where DISCERN™ Begins.
            </h2>
            <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72">
              <p>DISCERN™ is not about manufacturing authority you haven't earned.</p>
              <p>It's about uncovering what's already there, identifying what makes it distinctive and building the positioning around it.</p>
              <p>Over 90 days, we work together privately to close the gap between the expertise you've built and the reputation people currently perceive.</p>
              <p className="font-serif text-3xl leading-tight text-charcoal">
                So the market doesn't simply see another credible wellness practitioner. They understand why you are the Trusted Choice™.
              </p>
            </div>
            <SiteButton to="/application/discern" variant="blackGreen" className="mt-9 w-full sm:w-auto">
              Apply for DISCERN™
              <ArrowRight size={16} aria-hidden="true" />
            </SiteButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">The transformation</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              From Credible to the Trusted Choice™
            </h2>
          </div>
          <div className="mt-12 overflow-hidden border border-sage">
            <div className="grid bg-charcoal text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint sm:grid-cols-2">
              <p className="border-b border-mistWhite/14 px-5 py-4 sm:border-b-0 sm:border-r">Before</p>
              <p className="px-5 py-4">After</p>
            </div>
            {transformationRows.map(([before, after]) => (
              <div key={before} className="grid border-t border-sage bg-mistWhite sm:grid-cols-2">
                <p className="border-b border-sage px-5 py-5 text-base leading-7 text-charcoal/70 sm:border-b-0 sm:border-r">{before}</p>
                <p className="px-5 py-5 font-serif text-2xl leading-tight text-charcoal">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-8 text-mistWhite sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">The DISCERN™ method</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              The Work Happens Across Four Movements.
            </h2>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-0 border-y border-mistWhite/18 lg:grid-cols-2">
            {methodMovements.map((movement, index) => (
              <article key={movement.title} className="border-b border-mistWhite/18 py-7 last:border-b-0 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-mutedMint">0{index + 1}. {movement.title}</p>
                <h3 className="mt-4 font-serif text-2xl leading-tight">{movement.heading}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-mistWhite/72">{movement.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center font-serif text-3xl leading-tight text-mutedMint sm:text-4xl">
            DISCERN → POSITION → EXPRESS → ESTABLISH
          </p>
        </div>
      </section>

      <section className="bg-mistWhite py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">What we may work on</p>
              <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
                Your Brand Doesn't Need More Things.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-charcoal/70">
              It needs the right things working together. Depending on where the credibility gap exists, our work may include:
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workAreas.map(([title, text]) => (
              <article key={title} className="border border-sage bg-white p-5 shadow-[0_14px_32px_rgba(34,34,34,0.04)]">
                <h3 className="font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-charcoal/68">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 max-w-2xl border-l-2 border-deepEmerald pl-4 text-sm font-semibold leading-6 text-charcoal/62">
            These are not fixed deliverables. DISCERN™ is private advisory, and different clients will have different credibility gaps.
          </p>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(290px,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16">
          <EditorialImage image={magnificImages.proof} className="aspect-[4/5] max-w-md" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Who it's for</p>
            <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-tight text-balance lg:text-3xl">
              DISCERN™ Is for the Practitioner Who Has Outgrown Their Brand.
            </h2>
            <p className="mt-6 text-lg leading-8 text-charcoal/70">This is likely for you if:</p>
            <CheckList items={fitPoints} className="mt-8 max-w-2xl text-charcoal/74" />
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <EditorialImage image={magnificImages.offers} className="aspect-[16/10] max-w-xl border-mistWhite/20" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Why Magdalene</p>
            <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              I Built This Philosophy From the Inside Out.
            </h2>
            <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-mistWhite/76">
              <p>I did not build my authority by becoming more impressive. I built it by recognising the credibility I had already earned.</p>
              <p>That is why my work is not about helping you perform authority. It is about helping you position the expertise, lived experience, proof and perspective already shaping the way you work.</p>
            </div>
            <div className="mt-8 grid gap-3 border-y border-mistWhite/18 py-5 sm:grid-cols-2">
              {proofPoints.map((point) => (
                <p key={point} className="text-sm font-bold leading-6 text-mutedMint">{point}</p>
              ))}
            </div>
            {testimonials.length > 0 && (
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
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
        <div className="container-shell grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">The experience</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
              What 90 Days With Magdalene Looks Like.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-charcoal/68">
              DISCERN™ is intentionally private. The exact delivery details are confirmed through the application and fit conversation so the advisory reflects the credibility gap we are solving.
            </p>
          </div>
          <div className="border-y border-sage">
            {experienceQuestions.map((item) => (
              <div key={item} className="grid gap-5 border-b border-sage py-6 last:border-b-0 sm:grid-cols-[190px_1fr]">
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">{item}</p>
                <p className="text-base leading-7 text-charcoal/74">Aligned privately before the advisory begins.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="container-shell mt-12 border-t border-sage pt-12">
          <div className="border border-charcoal bg-charcoal p-7 text-mistWhite sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Apply for DISCERN™</p>
              <h2 className="mt-4 max-w-3xl font-serif text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl">
                Build the reputation your work deserves.
              </h2>
            </div>
            <SiteButton to="/application/discern" variant="brandOnDark" className="mt-8 w-full lg:mt-0 lg:w-auto">
              Apply for DISCERN™
              <ArrowRight size={16} aria-hidden="true" />
            </SiteButton>
          </div>
        </div>
      </section>
    </main>
  );
}
