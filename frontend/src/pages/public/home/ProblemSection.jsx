import { CheckCircle2, BadgeCheck} from "lucide-react";
import { magnificImages } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const problemRows = [
  {
    number: "01",
    icon: CheckCircle2,
    title: "People compare you on price.",
    text: "Not because your work lacks value, but because the value is not immediately visible."
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Your expertise is clear to you.",
    text: "The right clients still need a story, proof, and language that makes it easy to trust you."
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Invisible credibility cannot become trusted credibility.",
    text: "People cannot choose what they cannot see, name, remember, or repeat."
  }
];

const credibilityAssets = ["Expertise", "Care", "Experience"];

export default function ProblemSection() {
  return (
    <section
      id="earned-credibility"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F5F7F4_0%,#FFFFFF_52%,#DCE8DF_100%)] py-16 sm:py-20 lg:py-28"
    >
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionEyebrow>The Problem</SectionEyebrow>
            <h2 className="max-w-3xl font-serif text-2xl leading-tight text-charcoal text-balance sm:text-3xl lg:text-4xl">
              You are not struggling because you are unqualified.
            </h2>
          </div>

          <div className=" bg-mistWhite px-5 py-5 shadow-[0_16px_36px_rgba(34,34,34,0.06)] sm:px-7">
            <p className="text-lg leading-8 text-charcoal/78 sm:text-lg sm:leading-9">
              You have the expertise. You care deeply about the people you serve. You have invested
              years learning, growing, and becoming exceptional at what you do.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="relative min-h-[460px] overflow-hidden rounded-md border border-sage bg-charcoal shadow-[0_24px_55px_rgba(34,34,34,0.14)]">
            <img
              src={magnificImages.problem.src}
              alt={magnificImages.problem.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: magnificImages.problem.objectPosition }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,34,34,0.02)_34%,rgba(34,34,34,0.78)_100%),linear-gradient(115deg,rgba(11,110,79,0.26),transparent_58%)]" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <div className="max-w-sm border border-mutedMint/30 bg-charcoal/88 px-5 py-4 text-mistWhite backdrop-blur">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
                  The real issue
                </p>
                <p className="mt-3 font-serif text-3xl leading-tight">
                  Your credibility has been earned. It just has not been made visible yet.
                </p>
              </div>
            </div>
          </div>

          <div className="grid content-between gap-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {credibilityAssets.map((asset) => (
                <div key={asset} className="border border-sage bg-mistWhite px-3 py-4 text-center shadow-[0_14px_28px_rgba(34,34,34,0.04)]">
                  <BadgeCheck className="mx-auto text-deepEmerald" size={20} aria-hidden="true" />
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.08em] text-charcoal">
                    {asset}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              {problemRows.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.number}
                    className="grid gap-4 rounded-md border border-sage bg-white p-5 shadow-[0_18px_38px_rgba(34,34,34,0.055)] sm:grid-cols-[48px_1fr]"
                  >
                    <div className="flex items-center gap-3 sm:block">
                      {/* <span className="grid size-11 place-items-center rounded-full bg-sage text-deepEmerald">
                        <Icon size={19} aria-hidden="true" />
                      </span> */}
                      <p className="font-serif text-2xl text-deepEmerald sm:mt-4">{item.number}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold leading-tight text-charcoal text-balance sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-charcoal/70 sm:text-lg sm:leading-8">
                        {item.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className=" border-deepEmerald bg-charcoal px-5 py-5 font-serif text-2xl leading-8 text-mistWhite shadow-[0_18px_42px_rgba(34,34,34,0.12)] sm:text-3xl sm:leading-10">
              People cannot trust what they cannot see.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
