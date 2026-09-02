import { ArrowRight, BookOpenText, Compass } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { magnificImages } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

export default function FounderStorySection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#FAF9F6] py-8 sm:py-10 lg:py-15">
      <div className="absolute inset-x-0 top-0 h-px bg-sage/60" aria-hidden="true" />
      
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-4 lg:px-6">
        <SectionEyebrow>Meet Magdalene</SectionEyebrow>
        
        {/* Main Founder Card Container */}
        <div className="overflow-hidden rounded-3xl border border-sage/80 bg-white shadow-xl lg:grid lg:grid-cols-[0.95fr_1.05fr]">
       
          
          {/* Left Column: Founder Photo & Name Overlay */}
          <div className="relative min-h-[440px] bg-charcoal sm:min-h-[580px] lg:min-h-full">
            
            <img
              src={magnificImages.founder.src}
              alt={magnificImages.founder.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: magnificImages.founder.objectPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" aria-hidden="true" />
            
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-mutedMint/30 bg-charcoal/90 p-5 text-mistWhite backdrop-blur-md shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-mutedMint">
                Earned Credibility™
              </span>
              <h3 className="mt-1 font-serif text-xl md:text-2xl font-bold text-white">Magdalene Wambui</h3>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-mistWhite/70">
                Personal Brand Positioning & Authority Expert.
              </p>
            </div>
          </div>

          {/* Right Column: Bio Copy, Signals & CTAs */}
          <div className="p-4 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              
              <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-charcoal leading-[1.15] text-balance">
                What have you already earned that the market isn't seeing?
              </h2>
              
              <div className="mt-6 space-y-4 font-serif text-base sm:text-lg leading-relaxed text-charcoal/75">
                <p>
                  I didn't arrive at this work through personal branding. My background is in nursing and psychology, two fields that taught me to pay attention to what people carry beneath what is immediately visible.
                </p>
                <p className="text-sm sm:text-base font-sans text-charcoal/65 leading-relaxed">
                  Over time, I began noticing the same thing in experienced professionals: some of their most valuable credibility was missing from the way they presented their work. Not because they lacked expertise, but because nobody had helped them recognise what their experiences had taught them to see.
                </p>
                <p className="text-sm sm:text-base font-sans text-charcoal/65 leading-relaxed">
                  Today, I help experienced professionals answer that question through positioning, with a particular focus on wellness practitioners.
                </p>
              </div>

              

              {/* Philosophy & Full Story Highlights */}
              <div className="mt-8 grid gap-6 border-t border-b border-sage/60 py-6 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deepEmerald">
                    <Compass size={15} aria-hidden="true" />
                    <span>Philosophy</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/65">
                    Your credibility may already be present. The work is making it easier for the right people to understand.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deepEmerald">
                    <BookOpenText size={15} aria-hidden="true" />
                    <span>Full Story</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/65">
                    Read how nursing, psychology, lived experience, and positioning shaped the work behind Earned Credibility™.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SiteButton to="/about" variant="lightPrimary" className="justify-center px-6 py-3.5 text-xs font-bold shadow-md">
                <span>Read Magdalene's Story</span>
                <ArrowRight size={15} aria-hidden="true" />
              </SiteButton>
              <SiteButton to="/offers" variant="lightSecondary" className="justify-center px-6 py-3.5 text-xs font-bold">
                Explore Ways to Work Together
              </SiteButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
