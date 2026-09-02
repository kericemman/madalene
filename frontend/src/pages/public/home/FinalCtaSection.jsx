import { ArrowRight } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { magnificImages } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] py-8 sm:py-10 lg:py-15 text-charcoal">
      <div className="absolute inset-x-0 top-0 h-px bg-sage/60" aria-hidden="true" />
      
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
        
        {/* Main CTA Container Card */}
        <div className="overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-xl lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center p-8 sm:p-12 lg:p-16">
          
          {/* Left Column: Copy & Action CTAs */}
          <div className="max-w-2xl">
            <SectionEyebrow>Ready For The Next Step</SectionEyebrow>
            <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal leading-[1.15] text-balance">
              Your expertise has changed. Has your reputation caught up?
            </h2>
            
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-charcoal/75 font-serif">
              If the answer is no, don't start by adding more. Start by understanding what the right people aren't seeing yet.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SiteButton to="/assessment" variant="lightPrimary" className="justify-center px-6 py-3.5 text-xs font-bold shadow-md">
                <span>Take the Earned Credibility™ Assessment</span>
              </SiteButton>
              <SiteButton href="#offers" variant="lightSecondary" className="justify-center px-6 py-3.5 text-xs font-bold">
                Work With Magdalene
              </SiteButton>
            </div>
          </div>

          {/* Right Column: Visual Frame with Custom Bottom Crop */}
          <div className="mt-10 lg:mt-0 relative">
            <div className="overflow-hidden rounded-2xl border border-sage/80 shadow-md">
              <img
                src={magnificImages.finalCta.src}
                alt={magnificImages.finalCta.alt}
                loading="lazy"
                className="w-full h-[360px] sm:h-[420px] object-cover object-top"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}