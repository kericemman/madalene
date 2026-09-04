import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicReviews } from "../../../services/api.js";
import earnedInsightImage from "../../../assets/home/earned.avif";
import { magnificImages } from "../home/homeContent.js";

const recognitionQuotes = [
  "My experience.",
  "My approach.",
  "I really care about my clients.",
  "My qualifications.",
  "My method is holistic."
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
  ["What makes your authority meaningfully different", "The distinct qualities and depth that set you apart from others."],
  ["Which parts of your experience strengthen that distinction", "The foundational moments and patterns that back up your expertise."],
  ["What proof deserves greater visibility", "The evidence and accomplishments that make your authority undeniable."],
  ["The direction your future positioning should build from", "A clear roadmap for expressing your true value in the market."]
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
  ["Strategic pre-work", "You complete a focused intake before our session so I can understand your body of work before we meet."],
  ["Private deep-dive", "We work together to uncover the authority assets with the strongest strategic value."],
  ["Earned Credibility™ Map", "I distil the findings into your written Map, including the direction your positioning should build from next."]
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

export default function EarnedCredibilityIntensivePage({ actionPath, loading, offer }) {
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
                <Sparkles size={14} aria-hidden="true" />
                <span>Earned Credibility™ Intensive</span>
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.1]">
                You've Earned More Credibility Than You're <span className="text-deepEmerald">Using.</span>
              </h1>
              
              <div className="mt-6 space-y-4 font-serif text-lg sm:text-xl text-charcoal/80 leading-relaxed">
                <p>
                  You have years of expertise behind your work. But your positioning may still make that expertise sound more ordinary than it is.
                </p>
                <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
                  The Earned Credibility™ Intensive uncovers what is distinctly valuable in your body of work, so you know what your positioning deserves to be built from.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <SiteButton to={actionPath} variant="lightPrimary" className="justify-center px-6 py-3.5 text-xs font-bold shadow-md">
                  <span>Uncover What Sets Me Apart</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </SiteButton>
                
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <EditorialImage image={magnificImages.assessment} priority className="aspect-[4/5]" />
              <p className="mt-3 border-l-2 border-deepEmerald pl-3 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                Your authority should not sound like everyone else's version of expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Recognition</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-snug text-balance">
                You know you're different. Explaining why is the hard part.
              </h2>
            </div>
            <div>
          
              <div className="mt-8 space-y-4 font-serif text-base sm:text-lg text-charcoal/75 leading-relaxed">
                <p>You can point to your experience. Your qualifications may establish that you know what you're doing.</p>
                <p>But neither explains why your authority is distinctly yours.</p>
                <p>That's how experienced professionals end up with positioning that is accurate, yet interchangeable.</p>
                <p className="font-serif text-xl sm:text-2xl font-bold text-charcoal pt-2">
                  You don't need to manufacture a differentiator. You need to uncover what your years of work have already earned you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Section (Dark Theme) */}
      <section className="bg-charcoal py-8 sm:py-10 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">The Cost</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-white leading-snug text-balance">
                When you haven't extracted your credibility, you borrow positioning.
              </h2>
              
              {/* Cropped Image Below Cost H2 */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 shadow-lg">
                <img
                  src={earnedInsightImage}
                  alt="Earned credibility strategy insight"
                  className="w-full h-48 sm:h-56 object-cover object-top"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-md">
              <CheckList items={costPoints} dark className="text-mistWhite/80" />
              <div className="mt-8 border-t border-white/10 pt-6 space-y-3 font-serif text-base sm:text-lg text-mistWhite/90">
                <p>Eventually, years of depth get compressed into standard industry language.</p>
                <p className="font-serif text-xl font-bold text-white">The problem isn't that you lack distinction. You simply haven't extracted it yet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core IP Section (Deep Emerald Theme) */}
      <section className="bg-deepEmerald py-8 sm:py-10 text-mistWhite">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">We find what your brand should be built from</span>
            <h2 className="mt-3 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug text-balance">
              Inside the Intensive, I examine your body of work to identify the experiences and evidence carrying the most strategic weight.
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-mistWhite/80">
              We look beyond what you've done to uncover what it has taught you, how it has shaped your judgement and what you have earned the right to be known for. Not everything we uncover belongs in your positioning. Part of the value is knowing what does.
            </p>
          </div>
          
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {coreIpPoints.map((point, index) => (
              <article key={point} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <span className="font-serif text-xl font-bold text-mutedMint">0{index + 1}</span>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-mistWhite/85">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Assets Section */}
      <section className="bg-white py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The Five Assets</span>
            <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-tight">
              The 5 Earned Credibility™ Assets
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset, index) => (
              <article key={asset.title} className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-7 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald block mb-2">
                    0{index + 1}. {asset.title}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal leading-snug">
                    {asset.question}
                  </h3>
                </div>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                  {asset.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Table Section */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">The Transformation</span>
            <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-tight">
              Stop searching for your differentiation. Start recognising what you've already earned.
            </h2>
          </div>
          
          <div className="mt-12 overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-sm">
            <div className="grid bg-charcoal text-xs font-bold uppercase tracking-wider text-mutedMint sm:grid-cols-2">
              <p className="border-b border-white/10 px-6 py-4 sm:border-b-0 sm:border-r border-white/10">Before the Intensive</p>
              <p className="px-6 py-4">After the Intensive</p>
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

      {/* What You Leave With Section */}
      <section className="bg-white py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">What You Leave With</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-tight">
                Your Earned Credibility™ Map.
              </h2>
            </div>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-charcoal/75">
              Your Map distils the strongest authority assets we uncover and shows you what deserves to shape your positioning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {deliverables.map(([title, text]) => (
              <article key={title} className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-7 sm:p-8 shadow-sm">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal leading-snug">{title}</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/70">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <SiteButton to={actionPath} variant="lightPrimary" className="px-8 py-3.5 text-xs font-bold shadow-md">
              <span>Uncover My Earned Credibility™</span>
              <ArrowRight size={15} aria-hidden="true" />
            </SiteButton>
          </div>
        </div>
      </section>

      

      {/* Who It's For Section */}
      <section className="bg-[#FAF9F6] py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditorialImage image={magnificImages.offers} className="aspect-[4/5] max-w-md mx-auto w-full" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Who It's For</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-tight text-balance">
                This is for you if your expertise has outgrown generic positioning.
              </h2>
              
              <div className="mt-6 space-y-4 font-serif text-base sm:text-lg text-charcoal/80 leading-relaxed">
                <p>You've done enough work to know there is depth behind what you do.</p>
                <p className="font-sans text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                  The problem is that you cannot yet articulate what makes that depth strategically valuable, or decide which parts of it should become visible. This Intensive gives you that clarity.
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-sage/80 bg-white p-4 sm:p-8 shadow-sm">
                <CheckList items={whoItsFor} className="text-charcoal/75 " />
              </div>

              <div className="mt-8 rounded-3xl border border-deepEmerald/30 bg-deepEmerald/5 p-6 sm:p-8">
                <span className="text-xs font-bold uppercase tracking-wider text-deepEmerald block mb-1">
                  Looking for a complete 90-day repositioning?
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-charcoal/75">
                  If you're looking for a complete 90-day repositioning of your brand and reputation, DISCERN™ is the better fit.
                </p>
                <div className="mt-4">
                  <Link to="/discern" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-deepEmerald hover:text-charcoal transition">
                    <span>Explore DISCERN™</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
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
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">Why Work With Magdalene</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-white leading-snug text-balance">
                What have you already earned that the market isn't seeing?
              </h2>
              
              <div className="mt-6 space-y-4 font-serif text-base sm:text-lg text-mistWhite/80 leading-relaxed">
                <p>My work is built around one question: What have you already earned that the market isn't seeing?</p>
                <p className="font-sans text-xs sm:text-sm text-mistWhite/70 leading-relaxed">
                  I look for what is strategically significant inside your body of work, then help you recognise what deserves to become part of the authority you're known for.
                </p>
              </div>

              <div className="mt-8 grid gap-3 border-y border-white/15 py-6 sm:grid-cols-2">
                <p className="text-xs sm:text-sm font-bold text-mutedMint">#1 Wellness Personal Brand · Favikon</p>
                <p className="text-xs sm:text-sm font-bold text-mutedMint">Top 1% Personal Branding & Thought Leadership</p>
              </div>

              <div className="mt-8">
                <Link to="/about" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-mutedMint hover:text-white transition group">
                  <span>See Client Transformations</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Investment Section */}
      <section className="bg-white py-8 sm:py-10">
        <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">How It Works</span>
              <h2 className="mt-2 font-serif text-xl sm:text-3xl font-bold text-charcoal leading-tight">
                A clear path from extraction to positioning direction.
              </h2>
            </div>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-charcoal/75">
              The exact delivery details are confirmed before booking, but the work follows a clear extraction-to-positioning path.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {processSteps.map(([title, text], index) => (
              <article key={title} className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-7 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald block mb-2">
                    0{index + 1}. {title}
                  </span>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Final Conversion Card */}
        <div className="container-shell mx-auto max-w-5xl px-1 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-3xl border border-sage/80 bg-[#FAF9F6] p-8 sm:p-12 text-center shadow-md">
            <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">Ready to see what your expertise has already earned you?</span>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-charcoal">Earned Credibility™ Intensive</h2>
            
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-charcoal/75">
              <span>✓ Private strategic pre-work</span>
              <span>✓ Private deep-dive with Magdalene</span>
              <span>✓ Written Earned Credibility™ Map with positioning direction</span>
            </div>

            <div className="mt-8">
              <SiteButton to={actionPath} variant="lightPrimary" className="px-8 py-3.5 text-xs font-bold shadow-md">
                <span>Uncover What Sets Me Apart</span>
                <ArrowRight size={15} aria-hidden="true" />
              </SiteButton>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
