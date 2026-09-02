import HeroSection from "./home/HeroSection.jsx";
import ProblemSection from "./home/ProblemSection.jsx";
import BigIdeaSection from "./home/BigIdeaSection.jsx";
import AssessmentSection from "./home/AssessmentSection.jsx";
import ResourcesSection from "./home/ResourcesSection.jsx";
import ProofSection from "./home/ProofSection.jsx";
import FounderStorySection from "./home/FounderStorySection.jsx";
import OffersSection from "./home/OffersSection.jsx";
import FinalCtaSection from "./home/FinalCtaSection.jsx";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <BigIdeaSection />
      <AssessmentSection />
     
      <ResourcesSection />
      <ProofSection />
      <FounderStorySection />
      <OffersSection />
      <FinalCtaSection />
    </>
  );
}
