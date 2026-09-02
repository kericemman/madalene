import { useState } from "react";
import { ArrowRight, BookOpenText, FileText, Layers3, Mail, Quote, Sparkles } from "lucide-react";
import CodeSubscribeModal from "../codeOfResonance/CodeSubscribeModal.jsx";
import { codeSectionList } from "../codeOfResonance/codeSections.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const descriptionBySectionKey = {
  essays: "Thinking on credibility, positioning, trust, and becoming easier to choose.",
  "recommended-reading": "Books, ideas, and references shaping the approach to earned authority.",
  "case-studies": "Proof-led stories showing what changes when credibility becomes visible.",
  guides: "Practical resources for clarifying your story, proof, and trusted-choice position.",
  "trust-resonance": "Reflections on building deep resonance and authority with the right clients."
};

export default function ResourcesSection() {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const libraryLinks = codeSectionList.filter((section) => section.key !== "all").slice(0, 5);

  return (
    <section
      id="code-of-resonance"
      className="relative overflow-hidden bg-[#FAF9F6] py-8 sm:py-10 lg:py-15"
    >
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <SectionEyebrow>Continue the Conversation</SectionEyebrow>
          <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal leading-[1.15] text-balance">
            Your assessment is only the beginning.
          </h2>
          <p className="mt-4 font-serif text-lg sm:text-xl leading-relaxed text-charcoal/80">
            These resources will help you uncover your earned credibility more deeply and become the trusted choice in your niche.
          </p>
        </div>

        {/* Main Content Split: Fully Balanced Height Cards */}
        <div className="mt-12 lg:mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          
          {/* Left Column: Full-Height Immersive Editorial Card */}
          <button
            type="button"
            onClick={() => setSubscribeOpen(true)}
            className="group relative overflow-hidden rounded-3xl border border-charcoal/10 bg-charcoal text-left shadow-xl transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-deepEmerald focus:ring-offset-2 flex flex-col justify-between min-h-[460px] lg:min-h-full"
            aria-label="Join The Code of Resonance email publication"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200"
                alt="Minimalist writing desk representing editorial design and the Code of Resonance publication."
                loading="lazy"
                className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-charcoal/10" aria-hidden="true" />
            </div>

            {/* Top Badge */}
            <div className="relative z-10 p-8 sm:p-10">
              <span className="inline-block rounded-full border border-mutedMint/30 bg-charcoal/90 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-mutedMint backdrop-blur-md">
                The Code of Resonance
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-8 sm:p-10 pt-0">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Join the email publication for trust-building notes.
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-mistWhite/80">
                Receive bi-weekly frameworks, real case proof, and field notes on turning your earned depth into visible market authority.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs bg-white p-4 rounded-full  font-bold uppercase tracking-wider text-deepEmerald">
                <span>Get Free Weekly Insights</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Right Column: Library Navigation & Subscribe Sidebars */}
          <aside className="flex flex-col justify-between gap-6">
            
            {/* Library Links Box with Added Descriptions */}
            <div className="rounded-3xl border border-sage/80 bg-white p-7 sm:p-9 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald block mb-1">
                Browse the Library
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-6">
                Explore core insights.
              </h3>

              <div className="divide-y divide-sage/60 border-t border-b border-sage/60">
                {libraryLinks.map((section) => {
                  const Icon = section.icon;
                  const description = descriptionBySectionKey[section.key] || "Explore foundational insights and thinking.";

                  return (
                    <a
                      key={section.key}
                      href={section.path}
                      className="group block py-4 text-charcoal transition hover:pl-1 duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="text-deepEmerald shrink-0 mt-0.5" size={18} aria-hidden="true" />
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider group-hover:text-deepEmerald transition">
                            {section.label}
                          </span>
                        </div>
                        <ArrowRight className="text-charcoal/30 group-hover:translate-x-1 group-hover:text-deepEmerald transition shrink-0" size={16} aria-hidden="true" />
                      </div>
                      <p className="mt-1.5 pl-7 text-xs leading-relaxed text-charcoal/65">
                        {description}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>

          

          </aside>

        </div>

        <CodeSubscribeModal
          open={subscribeOpen}
          onClose={() => setSubscribeOpen(false)}
          source="code_of_resonance_home"
          title="Join The Code of Resonance"
        />
      </div>
    </section>
  );
}