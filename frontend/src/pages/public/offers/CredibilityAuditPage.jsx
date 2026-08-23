import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Quote, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicReviews } from "../../../services/api.js";
import { magnificImages } from "../home/homeContent.js";

const recognitionPoints = [
  "Clients visit your profile but do not take the next step.",
  "Your content gets attention without creating meaningful opportunities.",
  "People understand what you do but not why they should choose you.",
  "Your expertise feels stronger than the brand communicating it."
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
    text: "Do people immediately understand what you should be known for and why you are different?"
  },
  {
    title: "Story",
    text: "Is your lived experience strengthening your authority or simply sitting in your biography?"
  },
  {
    title: "Authority",
    text: "Does your brand make the depth of your expertise visible?"
  },
  {
    title: "Messaging",
    text: "Can people quickly understand your value, relevance and point of view?"
  },
  {
    title: "LinkedIn Presence",
    text: "Does your profile reinforce trust from headline to Featured section to About?"
  }
];

const deliverables = [
  {
    title: "Your Credibility Diagnosis",
    text: "Where trust is currently strongest and weakest."
  },
  {
    title: "Your Priority Gaps",
    text: "The issues most likely affecting perception."
  },
  {
    title: "Your Strategic Recommendations",
    text: "What needs to change and why."
  },
  {
    title: "Your Priority Action Plan",
    text: "What to fix first, next and later."
  },
  {
    title: "A Private Review With Me",
    text: "A focused conversation where we walk through the findings together."
  }
];

const beforePoints = [
  "Uncertain what the problem is.",
  "Changing things reactively.",
  "Too close to the brand to diagnose objectively.",
  "Unsure what deserves attention."
];

const afterPoints = [
  "Clear credibility gaps.",
  "Clear priorities.",
  "Clear recommendations.",
  "A clear next move."
];

const whoItsFor = [
  "You are established enough to have real expertise, but your brand does not reflect it.",
  "You are getting visibility without enough trust, inquiries or opportunities.",
  "Your positioning feels unclear, generic or disconnected from your actual work.",
  "You keep changing pieces of your brand without knowing which problem you are solving.",
  "You want an expert outside perspective before investing more time or money."
];

const sessionAgenda = [
  "Review your positioning and what you are currently known for.",
  "Identify where your credibility is being lost or misunderstood.",
  "Map the gap between your expertise and the perception of it.",
  "Prioritise what needs attention first.",
  "Define the next strategic move."
];

const sessionTakeaways = [
  "Clarity on what is actually weakening trust.",
  "A prioritised direction for what to change.",
  "Confidence about where to focus next."
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
        const mostRelevant = reviews.find((review) =>
          /clar|position|message|brand|strateg|trust/i.test(`${review.headline || ""} ${review.review || ""}`)
        );
        setTestimonial(mostRelevant || reviews[0] || null);
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
                Credibility Audit
              </div>
              <h1 className="mt-6 font-serif text-2xl font-bold leading-[1.04] text-balance sm:text-6xl lg:text-4xl">
                Find What&apos;s Costing You <span className="text-deepEmerald">Trust.</span>
              </h1>
              <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72 sm:text-xl sm:leading-9">
                <p>You&apos;re credible.</p>
                <p>
                  But if your positioning, messaging or LinkedIn presence is not communicating that clearly, people may never see the full value behind your work.
                </p>
                <p>The Credibility Audit shows you where you lose trust, why it&apos;s happening and what to fix first.</p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SiteButton to={actionPath} variant="blackGreen" className="w-full sm:w-auto">
                  Book Your Credibility Audit
                  <ArrowRight size={16} aria-hidden="true" />
                </SiteButton>
                <p className="text-sm leading-6 text-charcoal/58">Focused diagnosis. Clear next move.</p>
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
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Recognition</p>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight text-balance sm:text-5xl">Something isn&apos;t landing. You just can&apos;t see exactly what.</h2>
          </div>
          <div>
            <CheckList items={recognitionPoints} className="border-y border-sage py-6 text-charcoal/76" />
            {/* <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-charcoal/72">
              <p>Or maybe you&apos;ve changed your headline, About section, content and positioning so many times that you no longer know what actually needs fixing.</p>
              <p>You don&apos;t necessarily need another rebrand.</p>
              <p className="font-serif text-3xl leading-tight text-charcoal">You need the right diagnosis.</p>
            </div> */}
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
                <li key={item} className="flex items-center gap-3  py-4 text-base text-mistWhite/78 last:border-b-0">
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
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Your credibility gap</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-3xl leading-tight text-balance sm:text-4xl">
            The distance between the credibility you&apos;ve earned and the credibility people can currently perceive.
          </h2>
          <div className="mx-auto mt-10 max-w-2xl border-y border-mistWhite/25 py-6">
            <p className="font-serif text-3xl leading-tight sm:text-4xl">Expertise + Lived Experience = Earned Credibility&trade;</p>
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-mistWhite/78">
            The Audit looks at how effectively that credibility is being communicated through the parts of your brand people use to decide whether to trust you.
          </p>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">What we diagnose</p>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight text-balance sm:text-5xl">We&apos;ll find where trust is breaking down.</h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-charcoal/68">I will diagnose your brand across five areas.</p>

          <div>
            <img src="/src/assets/home/diag.jpg" alt="Magnific Credibility Audit Diagnosis" className="mt-6 w-full max-w-lg rounded-md border border-sage shadow-[0_16px_36px_rgba(34,34,34,0.06)]" />
          
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
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">What you receive</p>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-balance sm:text-4xl">You won&apos;t leave wondering what to fix.</h2>
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
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-15">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">The outcome</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-balance sm:text-5xl">Certainty. Not another PDF.</h2>
          </div>
          <div className="mt-12 grid overflow-hidden border border-sage lg:grid-cols-2">
            <section className="bg-mistWhite p-7 sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-charcoal/52">Before</p>
              <h3 className="mt-4 font-serif text-3xl leading-tight">Something isn&apos;t working.</h3>
              <CheckList items={beforePoints} className="mt-8 text-charcoal/74" />
            </section>
            <section className="bg-deepEmerald p-7 text-mistWhite sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">After</p>
              <h3 className="mt-4 font-serif text-3xl leading-tight">Now I know exactly what needs fixing.</h3>
              <CheckList items={afterPoints} dark className="mt-8 text-mistWhite/82" />
            </section>
          </div>
        </div>
      </section>

      <section className="bg-mistWhite py-16 sm:py-20 lg:py-28">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(290px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
          <EditorialImage image={magnificImages.proof} className="aspect-[4/5] max-w-md" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Who this is for</p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-balance sm:text-5xl">The Credibility Audit is for you if...</h2>
            <CheckList items={whoItsFor} className="mt-8 max-w-2xl text-charcoal/74" />
            <p className="mt-8 border-l-2 border-deepEmerald pl-4 text-lg leading-8 text-charcoal/82">
              You don&apos;t need more guessing. You need to know what&apos;s actually wrong.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <EditorialImage image={magnificImages.offers} className="aspect-[16/10] max-w-xl border-mistWhite/20" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Why have me diagnose it?</p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-balance sm:text-5xl">A clear brand needs a clear eye.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-mistWhite/76">
              I help practitioners turn earned expertise, lived experience and proof into a brand people can recognise and trust. My work has been recognised through Favikon, wellness personal-brand leadership and thought-leadership rankings.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-mistWhite/18 py-5 text-sm font-bold text-mutedMint">
              <span>Favikon Ambassador</span>
              <span>#1 Wellness Personal Brand</span>
              <span>Top 1% Personal Branding &amp; Thought Leadership</span>
            </div>
            {testimonial && (
              <blockquote className="mt-8 border-l-2 border-mutedMint pl-5">
                <Quote className="text-mutedMint" size={20} aria-hidden="true" />
                <p className="mt-3 max-w-2xl font-serif text-2xl leading-tight text-mistWhite">&ldquo;{testimonial.review}&rdquo;</p>
                <cite className="mt-4 block text-sm not-italic text-mistWhite/62">{testimonial.name}{testimonial.role ? `, ${testimonial.role}` : ""}</cite>
              </blockquote>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Investment</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-balance sm:text-5xl">A focused, private diagnosis.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-charcoal/68">
              Come prepared to see your brand with more objectivity and leave with a useful direction.
            </p>
            <p className="mt-8 font-serif text-5xl leading-none text-deepEmerald">{investment}</p>
            <p className="mt-2 text-sm text-charcoal/58">USD</p>
          </div>
          <div className="border-y border-sage">
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[170px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Duration</p>
              <p className="text-base leading-7 text-charcoal/74">45-minute private strategy session</p>
            </div>
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[170px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Format</p>
              <p className="text-base leading-7 text-charcoal/74">Live 1:1 personal brand audit</p>
            </div>
            <div className="grid gap-5 border-b border-sage py-6 sm:grid-cols-[170px_1fr]">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Before we meet</p>
              <p className="text-base leading-7 text-charcoal/74">A short intake so I can review your brand properly before our session.</p>
            </div>
          </div>
        </div>

        <div className="container-shell mt-12 grid gap-10 border-t border-sage pt-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-serif text-3xl leading-tight">During our session, we&apos;ll:</h3>
            <CheckList items={sessionAgenda} className="mt-7 text-charcoal/74" />
          </div>
          <div>
            <h3 className="font-serif text-3xl leading-tight">You leave with:</h3>
            <CheckList items={sessionTakeaways} className="mt-7 text-charcoal/74" />
            <SiteButton to={actionPath} variant="blackGreen" className="mt-9 w-full sm:w-auto">
              Book Your Credibility Audit
              {loading ? <ShieldCheck size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            </SiteButton>
          </div>
        </div>
      </section>
    </main>
  );
}
