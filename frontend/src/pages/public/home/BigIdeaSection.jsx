import { ArrowDownRight, BadgeCheck, BookOpenCheck, GraduationCap, PenLine, Repeat2, Sparkles } from "lucide-react";
import { SectionEyebrow } from "./HomeShared.jsx";

const authorityTraps = [
  {
    icon: GraduationCap,
    title: "More certificates",
    text: "Adding evidence without showing why it matters."
  },
  {
    icon: PenLine,
    title: "Another bio rewrite",
    text: "Polishing words before clarifying the trust beneath them."
  },
  {
    icon: Repeat2,
    title: "More content",
    text: "Increasing visibility before the message is memorable."
  }
];

const truths = [
  {
    icon: BadgeCheck,
    title: "The experiences you have lived",
    text: "The moments that shaped your lens, your standards, and your way of seeing people."
  },
  {
    icon: BookOpenCheck,
    title: "The lessons you have earned",
    text: "The insight that came through practice, mistakes, courage, and refinement."
  },
  {
    icon: Sparkles,
    title: "The wisdom you have gained",
    text: "The pattern recognition that helps the right people feel safe choosing you."
  }
];

export default function BigIdeaSection() {
  return (
    <section className="relative overflow-hidden border-y border-charcoal bg-charcoal py-16 text-mistWhite sm:py-20 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#222222_0%,#1e2825_42%,#0B6E4F_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,34,34,0.96)_0%,rgba(34,34,34,0.72)_52%,rgba(11,110,79,0.24)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,247,244,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(245,247,244,0.025)_1px,transparent_1px)] bg-[size:88px_88px] opacity-35" aria-hidden="true" />

      <div className="container-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <SectionEyebrow light>The Big Idea</SectionEyebrow>
            <h2 className="max-w-3xl font-serif text-4xl leading-tight text-mistWhite text-balance sm:text-5xl lg:text-6xl">
              Most practitioners build authority backwards.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-mistWhite/74 sm:text-xl sm:leading-9">
              They collect more certifications, refine their logo, rewrite their bio, post more
              content, and hope that trust will follow.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {authorityTraps.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="grid gap-3 border border-mutedMint/18 bg-mistWhite/[0.055] p-4 shadow-[0_18px_38px_rgba(0,0,0,0.1)] sm:min-h-40 lg:min-h-0 lg:grid-cols-[44px_1fr] lg:items-start"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-mutedMint text-charcoal">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold leading-tight text-mistWhite">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-mistWhite/66">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="relative overflow-hidden bg-mistWhite p-7 text-charcoal shadow-[0_24px_58px_rgba(0,0,0,0.16)] sm:p-9">
            <div className="absolute left-0 top-0 h-full w-2" aria-hidden="true" />
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
              The shift
            </p>
            <h3 className="mt-5 font-serif text-3xl leading-tight text-charcoal text-balance sm:text-4xl">
              Trust is not built by adding more.
            </h3>
            <p className="mt-5 text-lg font-semibold leading-8 text-charcoal">
              It is built by revealing what already makes you worth trusting.
            </p>
            <div className="mt-8 flex items-center gap-3 border-t border-sage pt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-deepEmerald">
              <ArrowDownRight size={19} aria-hidden="true" />
              From performance to proof
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {truths.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="flex min-h-[260px] flex-col justify-between border border-mutedMint/22 bg-charcoal/72 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.12)] backdrop-blur"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      {/* <span className="grid size-11 place-items-center rounded-full bg-mutedMint text-charcoal">
                        <Icon size={19} aria-hidden="true" />
                      </span> */}
                      <span className="font-serif text-3xl text-mutedMint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-extrabold leading-tight text-mistWhite text-balance">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-mistWhite/68">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>

        <p className="mt-8 max-w-4xl  bg-mistWhite/[0.06] px-5 py-5 font-serif text-xl leading-9 text-mistWhite sm:text-3xl sm:leading-10">
          These are not just part of your story. They are the foundation of your Earned Credibility.
        </p>
      </div>
    </section>
  );
}
