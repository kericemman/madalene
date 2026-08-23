import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { magnificImages } from "./homeContent.js";
import { MagnificImage, SectionEyebrow } from "./HomeShared.jsx";

const ctaNotes = [
  "See what already makes you credible",
  "Find the trust gaps holding your message back",
  "Choose the next move with more confidence"
];

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-bg-mistWhite py-16 text-charcoal sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-sage" aria-hidden="true" />
      <div className="container-shell grid gap-10 lg:grid-cols-[1.04fr_0.76fr] lg:items-center">
        <div className="max-w-3xl">
          <SectionEyebrow>Ready For The Next Step</SectionEyebrow>
          <h2 className="font-serif text-4xl leading-[1.04] text-balance sm:text-5xl lg:text-6xl">
            Make the credibility you have earned easier to see, trust, and choose.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/72">
            If people already value your work, the next step is not louder marketing. I help you
            name the credibility already present in your story, then turn it into positioning people
            can understand and remember.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SiteButton to="/assessment" variant="lightPrimary" className="w-full sm:w-auto">
              Start the 7-minute assessment
              <ArrowRight size={18} aria-hidden="true" />
            </SiteButton>
            <SiteButton href="#offers" variant="lightSecondary" className="w-full sm:w-auto">
              Compare ways to work together
            </SiteButton>
          </div>

          {/* <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {ctaNotes.map((note) => (
              <div key={note} className="border-t border-sage pt-4">
                <CheckCircle2 className="text-deepEmerald" size={19} aria-hidden="true" />
                <p className="mt-3 text-sm leading-6 text-charcoal/70">{note}</p>
              </div>
            ))}
          </div> */}
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-10 hidden h-28 w-1 bg-deepEmerald lg:block" aria-hidden="true" />
          <MagnificImage
            image={magnificImages.finalCta}
            size="tall"
            className="border-sage shadow-[0_22px_50px_rgba(34,34,34,0.1)]"
          />
         
        </div>
      </div>
    </section>
  );
}
