import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionEyebrow } from "./HomeShared.jsx";

export default function BigIdeaSection() {
  return (
    <section className="relative overflow-hidden border-y border-charcoal bg-charcoal py-8 sm:py-10 lg:py-15 text-mistWhite">
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#1A1A1A_0%,#1e2825_42%,#0F4D3E_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.96)_0%,rgba(26,26,26,0.72)_52%,rgba(15,77,62,0.24)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,248,246,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(247,248,246,0.025)_1px,transparent_1px)] bg-[size:88px_88px] opacity-35" aria-hidden="true" />

      <div className="container-shell mx-auto max-w-5xl px-1 sm:px-3 lg:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-start">
          <SectionEyebrow light>The Big Idea</SectionEyebrow>
          <h2 className="mt-3 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-[1.15] text-balance">
            Some credibility is awarded. Some has to be earned.
          </h2>
        </div>

        {/* Narrative Card Container */}
        <div className="mt-12 rounded-3xl border border-mutedMint/25 bg-white/5 p-6 sm:p-12 shadow-xl backdrop-blur-md space-y-8 font-serif text-base sm:text-lg lg:text-xl leading-relaxed text-mistWhite/85">
          
          <p>
            Qualifications matter. But they cannot fully explain what years of doing the work have taught you.
          </p>

          <p>
            They don't show the judgement you've developed or the perspective that makes your work distinctly yours.
          </p>

          {/* Territory Highlight Box */}
          <div className="rounded-2xl border border-mutedMint/40 bg-charcoal p-7 text-mistWhite shadow-md">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-mutedMint block mb-1">
              That is the territory of Earned Credibility™:
            </span>
            <p className="font-serif text-lg sm:text-xl text-white leading-snug">
              I use Earned Credibility™ to describe the credibility that becomes visible through what experience has taught you to notice and how it has shaped your professional judgement.
            </p>
          </div>

          <p className="font-sans font-semibold text-white">
            The work is not to manufacture authority. It is to recognise the authority you've already earned and position it so other people can see its value.
          </p>

          {/* Bottom Action Callout */}
          <div className="pt-6 border-t border-mutedMint/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-serif text-base sm:text-lg font-bold text-white">
              What have you already earned that your market isn't seeing?
            </p>
            <Link
              to="/offers/earned-credibility-intensive"
              className="inline-flex items-center gap-2 rounded-full bg-mutedMint px-6 py-3.5 text-xs font-bold text-charcoal transition hover:bg-white shrink-0 shadow-md"
            >
              <span>Explore Earned Credibility™</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}