import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import SiteButton from "../../../components/SiteButton.jsx";
import { magnificImages } from "./homeContent.js";
import { DarkTexture } from "./HomeShared.jsx";

const trustStats = [
  { value: "33K+", label: "LinkedIn community", ariaLabel: "33K+ LinkedIn community" },
  { value: "118+", label: "Practitioners supported", ariaLabel: "118+ practitioners supported" },
  { value: "#1", label: "Wellness personal brand", ariaLabel: "Number one wellness personal brand" }
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-mistWhite/10 bg-charcoal text-mistWhite">
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#222222_0%,#1d2f29_38%,#0B6E4F_76%,#083d2e_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,34,34,0.96)_0%,rgba(34,34,34,0.76)_43%,rgba(11,110,79,0.18)_100%)]" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-full bg-[linear-gradient(118deg,transparent_0%,rgba(207,229,216,0.11)_48%,rgba(245,247,244,0.18)_100%)] lg:w-[58%]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,247,244,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(245,247,244,0.03)_1px,transparent_1px)] bg-[size:92px_92px] opacity-35" aria-hidden="true" />
      <DarkTexture />

      <div className="container-shell relative grid gap-10 py-12 sm:py-16 lg:min-h-[760px] lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center lg:gap-14 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="mb-6 inline-flex items-center gap-3 border border-mutedMint/30 bg-mistWhite/[0.06] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-mutedMint">
            <Sparkles size={15} aria-hidden="true" />
            7-minute earned credibility assessment
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-[0.95] tracking-normal text-mistWhite text-balance sm:text-6xl lg:text-5xl xl:text-6xl">
            Become the <span className="text-mutedMint">trusted choice</span>.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-mistWhite/78 sm:text-xl sm:leading-9">
            Discover your Earned Credibility™ and learn how to communicate it so the right people
            trust you before the first conversation.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SiteButton
              to="/assessment"
              variant="brandOnDark"
              className="w-full justify-center text-center sm:w-auto"
            >
              Discover My Earned Credibility Score
              <ArrowRight size={16} aria-hidden="true" />
            </SiteButton>
            <SiteButton
              href="#code-of-resonance"
              variant="darkSecondary"
              className="w-full sm:w-auto"
            >
              The Code of Resonance
            </SiteButton>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
            {trustStats.map((stat) => (
              <div
                key={stat.ariaLabel}
                aria-label={stat.ariaLabel}
                className="grid min-h-[74px] place-items-center rounded-md border border-mutedMint/60 bg-mistWhite px-1 py-2.5 text-center shadow-[0_16px_34px_rgba(0,0,0,0.16)] sm:min-h-20 sm:px-3"
              >
                <div>
                  <p className="font-serif text-xl font-bold leading-none text-deepEmerald sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mx-auto mt-1 max-w-[7.5rem] text-[0.49rem] font-extrabold uppercase leading-[1.12] tracking-[0.02em] text-charcoal sm:text-[0.62rem]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative mx-auto w-full max-w-[560px]"
        >
          <div className="absolute -left-5 top-9 hidden h-[82%] w-28 border border-mutedMint/25 bg-[linear-gradient(180deg,rgba(34,34,34,0.58),rgba(11,110,79,0.24))] sm:block" aria-hidden="true" />
          <div className="absolute -right-4 bottom-8 hidden h-52 w-28 border border-mutedMint/20 bg-[linear-gradient(180deg,rgba(245,247,244,0.16),rgba(207,229,216,0.06))] sm:block" aria-hidden="true" />

          <div className="relative overflow-hidden rounded-md border border-mutedMint/30 bg-[linear-gradient(145deg,rgba(245,247,244,0.15),rgba(11,110,79,0.12))] p-2 shadow-[0_30px_70px_rgba(0,0,0,0.28)]">
            <img
              src={magnificImages.hero.src}
              alt={magnificImages.hero.alt}
              loading="eager"
              fetchPriority="high"
              className="h-[440px] w-full rounded object-cover sm:h-[560px] lg:h-[620px]"
              style={{ objectPosition: magnificImages.hero.objectPosition }}
            />
            <div className="pointer-events-none absolute inset-2 rounded bg-[linear-gradient(180deg,rgba(34,34,34,0)_48%,rgba(34,34,34,0.58)_100%)]" aria-hidden="true" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-[260px] border border-mutedMint/30 bg-charcoal/86 px-4 py-3 backdrop-blur">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
                  Magdalene Wambui
                </p>
                <p className="mt-1 font-serif text-2xl leading-tight text-mistWhite">
                  Earned, not manufactured.
                </p>
              </div>
              <div className="flex w-max items-center gap-2 border border-mutedMint/30 bg-mistWhite px-3 py-2 text-sm font-extrabold text-charcoal shadow-[0_16px_28px_rgba(0,0,0,0.16)]">
                <ShieldCheck size={17} className="text-deepEmerald" aria-hidden="true" />
                RQ ready
              </div>
            </div>
          </div>

          <div className="mt-4 hidden gap-3 sm:absolute sm:-left-10 sm:bottom-12 sm:mt-0 sm:grid sm:w-56">
            <div className="overflow-hidden rounded border border-sage bg-mistWhite p-2 text-charcoal shadow-[0_24px_55px_rgba(0,0,0,0.18)]">
              <img
                src={magnificImages.heroAccent.src}
                alt={magnificImages.heroAccent.alt}
                loading="lazy"
                className="h-32 w-full rounded-sm object-cover"
                style={{ objectPosition: magnificImages.heroAccent.objectPosition }}
              />
              <p className="mt-3 px-2 pb-2 text-sm font-bold leading-5">
                Presence people feel before they choose.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 border border-mutedMint/25 bg-charcoal/86 p-4 text-mistWhite shadow-[0_22px_50px_rgba(0,0,0,0.18)] backdrop-blur sm:absolute sm:-right-6 sm:top-12 sm:mt-0 sm:w-60">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">
              <BadgeCheck size={16} aria-hidden="true" />
              Trust architecture
            </div>
            <p className="font-serif text-2xl leading-tight">Clarity. Proof. Resonance.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
