import { ArrowRight, CheckCircle2, Gauge } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { dimensions, reportItems } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const rqSnapshot = [
  { label: "Story clarity", value: 76 },
  { label: "Trust signals", value: 68 },
  { label: "Positioning", value: 71 },
  { label: "Proof", value: 63 },
  { label: "Resonance", value: 80 }
];

export default function AssessmentSection() {
  
  return (
    <section className="relative overflow-hidden bg-mistWhite py-8 sm:py-10 lg:py-15">
      <div className="absolute inset-x-0 top-0 h-px bg-sage" aria-hidden="true" />
      <div className="container-shell">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Discover Your Earned Credibility</SectionEyebrow>
          </div>
          <h2 className="font-serif text-2xl leading-tight text-charcoal text-balance sm:text-4xl lg:text-5xl">
            The trusted choice is not always the most qualified.
          </h2>
         
        </div>

        <div className="mx-auto mt-12 max-w-6xl border border-sage bg-white shadow-[0_26px_70px_rgba(34,34,34,0.08)]">
          <div className="p-6 sm:p-8 lg:p-11">
            <div className="flex flex-col gap-6 border-b border-sage pb-8 sm:flex-row sm:items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  <Gauge size={16} aria-hidden="true" />
                  7-minute Resonance Quotient
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-charcoal text-balance">
                  At the end, you receive more than a score.
                </h3>
                <p className="mt-4 text-lg leading-8 text-charcoal/72">
                  You receive a clearer understanding of why clients choose you and what might be
                  stopping them.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 border border-sage bg-sage/35 p-4 sm:grid-cols-[150px_1fr] sm:p-5">
              <div className="bg-charcoal px-5 py-5 text-center text-mistWhite">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
                  RQ Snapshot
                </p>
                <p className="mt-3 font-serif text-6xl leading-none text-mistWhite">18</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-mistWhite/58">
                  out of 25
                </p>
                <p className="mt-4 border-t border-mutedMint/25 pt-4 text-sm font-extrabold text-mutedMint">
                  Resonant Credibility
                </p>
              </div>

              <div className="grid content-center gap-3">
                {rqSnapshot.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.08em] text-charcoal">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-deepEmerald"
                        style={{ width: `${item.value}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
                <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/68">
                  Your report shows what is already working and where trust is leaking.
                </p>
              </div>
            </div>

            <div className="grid gap-8 pt-8 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  What it evaluates
                </p>
                <div className="mt-5 divide-y divide-sage border-y border-sage">
                  {dimensions.map((dimension, index) => (
                    <article key={dimension.title} className="grid gap-3 py-4 sm:grid-cols-[42px_1fr]">
                      <p className="font-serif text-2xl text-deepEmerald">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <h4 className="font-bold leading-tight text-charcoal">{dimension.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-charcoal/66">{dimension.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="bg-charcoal p-5 text-mistWhite sm:p-6">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
                 
                  What you receive
                </div>
                <div className="mt-5 grid gap-4">
                  {reportItems.map((item) => (
                    <div key={item.title} className="grid grid-cols-[22px_1fr] gap-3">
                      <CheckCircle2 className="mt-0.5 text-mutedMint" size={18} aria-hidden="true" />
                      <div>
                        <h4 className="text-sm font-bold leading-tight text-mistWhite">{item.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-mistWhite/62">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-sage pt-7 sm:flex-row sm:items-center sm:justify-between">
              {/* <p className="text-sm font-semibold leading-6 text-charcoal/68">
                Start with the score. Leave with language you can use.
              </p> */}
              <SiteButton to="/assessment" variant="lightPrimary" className="w-full sm:w-auto">
                Check My Earned Credibility Score
                <ArrowRight size={18} aria-hidden="true" />
              </SiteButton>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
}
