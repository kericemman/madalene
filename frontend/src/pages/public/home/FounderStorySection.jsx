import { ArrowRight, BookOpenText, CheckCircle2, Compass, Sparkles } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { magnificImages } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const credibilitySignals = [
  "Clear message",
  "Real proof",
  "Trusted choice"
];

export default function FounderStorySection() {
  return (
    <section id="about" className="relative overflow-hidden bg-mistWhite py-5 sm:py-10 lg:py-15">
      <div className="absolute inset-x-0 top-0 h-px bg-sage" aria-hidden="true" />
      <div className="container-shell">
        <div className="overflow-hidden border border-sage bg-white shadow-[0_28px_70px_rgba(34,34,34,0.08)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[420px] bg-charcoal sm:min-h-[560px] lg:min-h-full">
            <img
              src={magnificImages.founder.src}
              alt={magnificImages.founder.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: magnificImages.founder.objectPosition }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,34,34,0)_38%,rgba(34,34,34,0.74)_100%)]" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 right-5 border border-mutedMint/30 bg-charcoal/88 p-5 text-mistWhite backdrop-blur sm:left-7 sm:right-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
                Founder
              </p>
              <h3 className="mt-2 font-serif text-3xl leading-tight">Magdalene Wambui</h3>
              <p className="mt-3 text-sm leading-6 text-mistWhite/68">
                I help practitioners make their value clear and trusted.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-11">
            <SectionEyebrow>Meet Me</SectionEyebrow>
            <h2 className="font-serif text-2xl leading-tight text-charcoal text-balance sm:text-3xl lg:text-5xl">
              I help practitioners explain why they can be trusted.
            </h2>
            <p className="mt-6 text-lg leading-8 text-charcoal/74 sm:text-xl sm:leading-9">
              I created Earned Credibility for skilled wellness practitioners whose work is strong,
              but whose message is not yet clear.
            </p>
            <p className="mt-5 text-lg leading-8 text-charcoal/70">
              Your story, skill, and care should help people understand why you are the right
              choice.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {credibilitySignals.map((signal) => (
                <div key={signal} className="border border-sage bg-sage/35 p-4">
                  <CheckCircle2 className="text-deepEmerald" size={19} aria-hidden="true" />
                  <p className="mt-3 text-sm font-extrabold uppercase leading-5 tracking-[0.08em] text-charcoal">
                    {signal}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 border-y border-sage py-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  <Compass size={16} aria-hidden="true" />
                  Philosophy
                </div>
                <p className="mt-2 text-sm leading-6 text-charcoal/68">
                  Credibility should be honest, clear, and easy to understand.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  <BookOpenText size={16} aria-hidden="true" />
                  Full story
                </div>
                <p className="mt-2 text-sm leading-6 text-charcoal/68">
                  Read what shaped my work and how I help.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <SiteButton to="/about" variant="lightPrimary">
                Learn more about me
                <ArrowRight size={16} aria-hidden="true" />
              </SiteButton>
              <SiteButton to="/assessment" variant="lightSecondary">
                <Sparkles size={16} aria-hidden="true" />
                Take the assessment
              </SiteButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
