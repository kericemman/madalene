import { ArrowRight, Flag, MoveRight } from "lucide-react";
import { stages } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const destinationSteps = [
  "See your current trust stage",
  "Name the credibility gap",
  "Choose the next clear move"
];

export default function StagesSection() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#222222_0%,#1f2925_45%,#0B6E4F_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,34,34,0.98)_0%,rgba(34,34,34,0.78)_56%,rgba(11,110,79,0.22)_100%)]" aria-hidden="true" />
      <div className="container-shell">
        <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <SectionEyebrow light>Credibility Stages</SectionEyebrow>
            <h2 className="max-w-3xl font-serif text-2xl leading-tight text-mistWhite text-balance sm:text-3xl lg:text-4xl">
            Your score reveals where trust is visible and where it still needs clarity.
          </h2>
          </div>
          <p className="max-w-2xl text-xl leading-9 text-mistWhite/72">
            Each stage gives language to what is happening in your positioning, proof, and story.
            The goal is not to judge where you are. It is to see the next move clearly.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden border border-mutedMint/20 bg-mistWhite text-charcoal shadow-[0_30px_70px_rgba(0,0,0,0.18)]">
          <div className="grid gap-6 border-b border-sage bg-white p-6 sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                RQ stage map
              </p>
              <p className="mt-3 font-serif text-5xl leading-none text-charcoal sm:text-6xl">
                0-100
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-charcoal/68">
                Your result lands in one of five clarity stages.
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative grid grid-cols-5 gap-0">
                <div className="absolute left-[10%] right-[10%] top-[22px] h-px bg-sage" aria-hidden="true" />
                {stages.map((stage, index) => (
                  <div key={stage.name} className="relative text-center">
                    <span
                      className={`mx-auto grid size-11 place-items-center rounded-full border text-sm font-extrabold ${
                        index === stages.length - 1
                          ? "border-charcoal bg-charcoal text-mutedMint"
                          : "border-deepEmerald bg-mistWhite text-deepEmerald"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className="mt-3 text-xs font-extrabold uppercase leading-tight tracking-[0.08em] text-charcoal">
                      {stage.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-deepEmerald">{stage.score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="divide-y divide-sage">
              {stages.map((stage, index) => (
                <article key={stage.name} className="grid gap-4 px-5 py-5 sm:grid-cols-[92px_1fr] sm:px-7">
                  <div>
                    <p className="w-max border border-deepEmerald/20 bg-sage px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-deepEmerald">
                      {stage.score}
                    </p>
                    <p className="mt-3 font-serif text-3xl leading-none text-deepEmerald">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-3xl leading-tight text-charcoal text-balance">
                      {stage.name}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-charcoal/70">{stage.text}</p>
                    {/* <p className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-deepEmerald">
                      {stage.cta}
                      <MoveRight size={16} aria-hidden="true" />
                    </p> */}
                  </div>
                </article>
              ))}
            </div>

            <aside className="bg-charcoal p-6 text-mistWhite sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
                <Flag size={17} aria-hidden="true" />
                Destination
              </div>
              <h3 className="mt-6 font-serif text-4xl leading-tight text-mistWhite text-balance sm:text-5xl">
                Becoming the trusted choice is a progression.
              </h3>
              <p className="mt-5 text-lg leading-8 text-mistWhite/70">
                You do not need to perform authority. You need to make your earned credibility easier
                to see, understand, remember, and repeat.
              </p>
              <a
                href="/assessment"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-mutedMint bg-mutedMint px-5 py-3 text-center text-sm font-extrabold text-charcoal transition hover:border-mistWhite hover:bg-mistWhite sm:w-auto"
              >
                Find My Stage
                <ArrowRight size={17} aria-hidden="true" />
              </a>

              <div className="mt-10 hidden border-t border-mutedMint/20 pt-8 lg:block">
                <p className="font-serif text-3xl leading-tight text-mistWhite">
                  Your stage gives you the language for what to strengthen next.
                </p>
                <div className="mt-7 grid gap-3">
                  {destinationSteps.map((step, index) => (
                    <div
                      key={step}
                      className="grid grid-cols-[34px_1fr] items-center gap-3 border border-mutedMint/18 px-4 py-3"
                    >
                      <span className="font-serif text-2xl text-mutedMint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold leading-5 text-mistWhite/74">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
