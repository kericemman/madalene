import { CheckCircle2 } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { dimensions, reportItems } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

export default function AssessmentSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] py-8 sm:py-10 lg:py-15">
      <div className="absolute inset-x-0 top-0 h-px bg-sage/60" aria-hidden="true" />
      
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6">
        
        {/* Header Title */}
        <div className="max-w-3xl">
          <SectionEyebrow>The Diagnostic</SectionEyebrow>
          <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal leading-[1.15] text-balance">
            How visible is the credibility you've already earned?
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-charcoal/75 font-serif">
            You can be highly credible and still be difficult to choose. Not because your expertise is lacking, but because some of what makes you credible may still be invisible to the people deciding whether to trust you.
          </p>
        </div>

        {/* Main Assessment Showcase Card */}
        <div className="mt-12 lg:mt-16 mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-xl lg:grid-cols-[1fr_1fr]">
          
          {/* Left Column: What it Evaluates */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-deepEmerald">
                Evaluation Matrix
              </span>
              <h3 className="mt-2 font-serif text-xl md:text-2xl font-bold text-charcoal">
                The Credibility Gap™ Assessment examines five areas of your professional reputation.
              </h3>
              
              <div className="mt-8 space-y-6">
                {dimensions.map((dimension, index) => (
                  <div key={dimension.title} className="flex items-start gap-4">
                    <span className="font-serif text-xl md:text-2xl font-bold text-deepEmerald shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-serif text-base font-bold text-charcoal leading-snug">{dimension.title}</h4>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-charcoal/65">{dimension.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: What You Receive (Dark Theme Contrast) */}
          <div className="flex flex-col justify-between bg-charcoal p-8 sm:p-10 lg:p-12 text-mistWhite">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mutedMint">
                Your Diagnostic Report
              </span>
              <h3 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-snug text-balance">
                A personalised view of where perception may still be falling behind your expertise.
              </h3>
              
              <div className="mt-8 space-y-5">
                {reportItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <CheckCircle2 className="mt-0.5 text-mutedMint shrink-0" size={18} aria-hidden="true" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{item.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-mistWhite/65">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t border-mutedMint/20 pt-6">
              <SiteButton
                to="/assessment"
                variant="brandOnDark"
                className="w-full justify-center px-6 py-3.5 text-xs shadow-md"
              >
                <span>Discover My Credibility Gaps</span>
              
              </SiteButton>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
