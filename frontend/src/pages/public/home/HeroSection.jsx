import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { magnificImages } from "./homeContent.js";
import { DarkTexture } from "./HomeShared.jsx";

const trustStats = [
  { value: "33K+", label: "LinkedIn audience", ariaLabel: "33K+ LinkedIn audience" },
  { value: "#1", label: "Global wellness personal brand", ariaLabel: "Number one global wellness personal brand" },
  { value: "Top 20", label: "LinkedIn Kenya + top 1% thought leadership", ariaLabel: "Top 20 LinkedIn Kenya and top 1% thought leadership" }
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-mistWhite/10 bg-charcoal text-mistWhite">
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#1A1A1A_0%,#0F4D3E_72%,#B8D8C5_135%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.96)_0%,rgba(26,26,26,0.76)_43%,rgba(15,77,62,0.18)_100%)]" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-full bg-[linear-gradient(118deg,transparent_0%,rgba(184,216,197,0.11)_48%,rgba(247,248,246,0.18)_100%)] lg:w-[58%]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,248,246,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(247,248,246,0.03)_1px,transparent_1px)] bg-[size:92px_92px] opacity-35" aria-hidden="true" />
      <DarkTexture />

      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6 relative grid gap-12 py-16 sm:py-20 lg:min-h-[780px] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
        
        {/* Left Column: Copy & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mutedMint/30 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-mutedMint">
            <span>Your expertise has already earned credibility</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] text-balance">
            Your Brand Should <span className="text-mutedMint">Show It</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-mistWhite/80">
            I help experienced wellness practitioners position the authority behind their work, so the right people understand why them, why trust them, and why choose them.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <SiteButton
              to="/assessment"
              variant="brandOnDark"
              className="px-6 py-3.5 text-xs font-bold justify-center shadow-lg"
            >
              <span>Take the Earned Credibility™ Assessment</span>
              <ArrowRight size={15} aria-hidden="true" />
            </SiteButton>
            <SiteButton
              href="#earned-credibility"
              variant="darkSecondary"
              className="px-6 py-3.5 text-xs font-bold justify-center"
            >
              See How Earned Credibility Works
            </SiteButton>
          </div>

          {/* Trust Metrics Grid */}
          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
            {trustStats.map((stat) => (
              <div
                key={stat.ariaLabel}
                aria-label={stat.ariaLabel}
                className="rounded-2xl border border-mutedMint/40 bg-white p-2 text-center shadow-md flex flex-col justify-center"
              >
                <p className="font-serif text-xl sm:text-2xl font-bold leading-none text-deepEmerald">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[6px] sm:text-[11px] font-extrabold uppercase tracking-wider text-charcoal leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Visual Frame & Accents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-3xl border border-mutedMint/30 bg-white/5 p-1 shadow-2xl backdrop-blur-sm">
            <img
              src={magnificImages.hero.src}
              alt={magnificImages.hero.alt}
              loading="eager"
              fetchpriority="high"
              className="h-[420px] sm:h-[520px] lg:h-[580px] w-full rounded-2xl object-cover"
              style={{ objectPosition: magnificImages.hero.objectPosition }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-charcoal/80 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

            {/* Float Card Inside Frame */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div className="rounded-2xl border border-mutedMint/30 bg-charcoal/90 p-4 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-mutedMint">
                  Magdalene Wambui
                </p>
                <p className="mt-1 font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                  Earned, not manufactured.
                </p>
              </div>
              
              
            </div>
          </div>

          {/* Accent Float Badges
          <div className="mt-4 hidden sm:grid absolute -left-6 bottom-12 w-52 rounded-2xl border border-sage/60 bg-white p-3 text-charcoal shadow-xl">
            <img
              src={magnificImages.heroAccent.src}
              alt={magnificImages.heroAccent.alt}
              loading="lazy"
              className="h-24 w-full rounded-xl object-cover"
              style={{ objectPosition: magnificImages.heroAccent.objectPosition }}
            />
            <p className="mt-2 text-xs font-bold leading-snug px-1">
              Presence people feel before they choose.
            </p>
          </div> */}

          <div className="mt-4 hidden sm:grid absolute -right-4 top-8 w-56 rounded-2xl border border-mutedMint/30 bg-charcoal/90 p-4 text-mistWhite shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-mutedMint">
              <BadgeCheck size={15} aria-hidden="true" />
              <span>Trust Architecture</span>
            </div>
            <p className="mt-1 font-serif text-xl font-bold">Clarity. Proof. Resonance.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
