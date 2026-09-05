import { useEffect, useMemo, useState } from "react";
import SiteButton from "../../../components/SiteButton.jsx";
import { listPublicMediaAssets } from "../../../services/api.js";
import { imageUrl, toSrcSet } from "../../../utils/cloudinaryImage.js";
import { magnificImages } from "./homeContent.js";
import { SectionEyebrow } from "./HomeShared.jsx";

const bulletPoints = [
  "Compare you on price.",
  "Struggle to understand what makes your approach different."
];

export default function ProblemSection() {
  const [mediaImage, setMediaImage] = useState(null);
  const fallbackImage = magnificImages.problem;
  const problemImage = useMemo(() => {
    if (!mediaImage) return fallbackImage;

    return {
      src: imageUrl(mediaImage, fallbackImage.src),
      srcSet: toSrcSet(mediaImage),
      alt: mediaImage.altText || mediaImage.displayName || fallbackImage.alt,
      objectPosition: mediaImage.metadata?.objectPosition || fallbackImage.objectPosition
    };
  }, [fallbackImage, mediaImage]);

  useEffect(() => {
    let active = true;

    listPublicMediaAssets({ q: "Favikon", resourceType: "image", limit: 1 })
      .then((response) => {
        if (!active) return;
        setMediaImage(response.data?.items?.[0] || null);
      })
      .catch(() => {
        if (active) setMediaImage(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="earned-credibility"
      className="relative overflow-hidden bg-[#FAF9F6] py-8 sm:py-10 lg:py-15"
    >
      <div className="container-shell mx-auto max-w-7xl px-1 sm:px-3 lg:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <SectionEyebrow>The Problem</SectionEyebrow>
          <h2 className="mt-3 font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal leading-[1.15] text-balance">
            You are not struggling because you are unqualified.
          </h2>
        </div>

        {/* Main Content Split with Image on the Left */}
        <div className="mt-8 lg:mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          
          

          {/* Right Side: Narrative Content Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-sage/80 bg-white p-8 sm:p-12 shadow-sm space-y-8 font-serif text-base sm:text-lg leading-relaxed text-charcoal/85">
            
            <p>
              You have spent years becoming good at what you do. But when your expertise is not positioned clearly, people cannot see its full value.
            </p>

            <div>
              <p className="font-sans text-xs font-extrabold uppercase tracking-widest text-deepEmerald mb-4">
                They:
              </p>
              <ul className="space-y-3 font-sans text-sm sm:text-base text-charcoal/75">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-deepEmerald shrink-0 mt-2.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p>
              Someone with less depth can become easier to choose simply because they are easier to understand.
            </p>

            <p className="font-medium text-charcoal">
              You don't necessarily need to become more credible. You need what you've already earned to become easier to see.
            </p>

            {/* Action CTA */}
            <p className="font-sans  pt-4 border-t border-sage/60 text-xs font-extrabold uppercase tracking-widest text-deepEmerald mb-4">
              Do I Have a Credibility Gap? 
              </p>
            
              
              
        
            <div className="flex justify-center">
            <SiteButton 
              to="/assessment"
              variant="brandOnLight"
              className="px-6 py-3.5 text-xs font-bold justify-center shadow-lg bg-deepEmerald hover:bg-deepEmerald/90 text-white"
            >
              <span>Take Earned Credibility™ Assessment</span>
              
            </SiteButton>
              
            </div>

          </div>

          {/* Left Side: Visual Frame */}
          <div className="relative min-h-[480px] lg:min-h-[600px] overflow-hidden rounded-3xl border border-sage/80 bg-charcoal shadow-xl">
            <img
              src={problemImage.src}
              srcSet={problemImage.srcSet}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt={problemImage.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: problemImage.objectPosition }}
              onError={(event) => {
                event.currentTarget.src = fallbackImage.src;
                event.currentTarget.removeAttribute("srcset");
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.02)_34%,rgba(26,26,26,0.85)_100%),linear-gradient(115deg,rgba(15,77,62,0.3),transparent_58%)]" aria-hidden="true" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-md rounded-2xl border border-mutedMint/30 bg-charcoal/90 p-5 backdrop-blur-md shadow-2xl">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-mutedMint block mb-1">
                  That is the problem I call the Credibility Gap™:
                </span>
                <p className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                  The gap between the credibility you have earned and the credibility others can perceive.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
