import { BookOpen, FileText, Layers3, Quote, Sparkles } from "lucide-react";
import gardens00330 from "../../../assets/home/maggy-gardens-00330.jpg";
import gardens00333 from "../../../assets/home/maggy-gardens-00333.jpg";
import gardens00411 from "../../../assets/home/maggy-gardens-00411.jpg";
import gardens00414 from "../../../assets/home/maggy-gardens-00414.jpg";
import gardens00423 from "../../../assets/home/maggy-gardens-00423.jpg";
import gardens00563 from "../../../assets/home/maggy-gardens-00563.jpg";

const magnific = {
  heroStudio: gardens00330,
  heroSmile: gardens00563,
  assessmentConfidence: gardens00423,
  problemGarden: gardens00563,
  problemPresence: gardens00333,
  healthcareSupport: gardens00333,
  clinicalNotes: gardens00411,
  credibilityLeadership: gardens00414,
  notebook: gardens00563,
  careTrust: gardens00423
};

export const magnificImages = {
  hero: {
    src: magnific.heroStudio,
    alt: "Magdalene Wambui in emerald green and white in a garden setting.",
    objectPosition: "center 44%"
  },
  heroAccent: {
    src: magnific.heroSmile,
    alt: "Magdalene Wambui smiling in a white blouse among garden flowers.",
    objectPosition: "center 42%"
  },
  problem: {
    src: magnific.problemPresence,
    alt: "Magdalene Wambui seated in emerald green in a garden setting.",
    objectPosition: "center 56%"
  },
  assessment: {
    src: magnific.assessmentConfidence,
    alt: "Magdalene Wambui in an emerald green outfit and white blazer.",
    objectPosition: "center 45%"
  },
  proof: {
    src: magnific.problemGarden,
    alt: "Magdalene Wambui outdoors in a white blouse and emerald green trousers.",
    objectPosition: "center 42%"
  },
  founder: {
    src: magnific.heroStudio,
    alt: "Magdalene Wambui in an emerald green outfit in the garden.",
    objectPosition: "center 44%"
  },
  offers: {
    src: magnific.clinicalNotes,
    alt: "Editorial portrait of Magdalene Wambui against a black background.",
    objectPosition: "center 30%"
  },
  finalCta: {
    src: magnific.credibilityLeadership,
    alt: "Magdalene Wambui in a black editorial portrait.",
    objectPosition: "center 32%"
  }
};

export const dimensions = [
  {
    title: "Story Clarity",
    text: "Can people see the experiences that shaped your expertise?"
  },
  {
    title: "Trust Signals",
    text: "What helps clients feel confident choosing you?"
  },
  {
    title: "Positioning Clarity",
    text: "Can someone immediately understand why you are different?"
  },
  {
    title: "Credibility Proof",
    text: "Are you showing evidence that builds confidence before the first conversation?"
  },
  {
    title: "Resonance",
    text: "Will people remember you long after they have visited your profile?"
  }
];

export const reportItems = [
  {
    title: "Your Resonance Quotient (RQ)",
    text: "A snapshot of how effectively your lived experience is translated into trust."
  },
  {
    title: "Your Personalised Earned Credibility Report",
    text: "A clear breakdown of your strengths, blind spots, and opportunities."
  },
  {
    title: "Your Strongest Trust Assets",
    text: "The experiences and qualities already helping people believe in you."
  },
  {
    title: "Your Hidden Credibility Gaps",
    text: "The invisible barriers preventing your value from being fully recognised."
  },
  {
    title: "A Personalised Next-Step Roadmap",
    text: "Practical recommendations to help you become the trusted choice in your niche."
  }
];

export const stages = [
  {
    name: "Hidden Credibility",
    score: "0-5",
    text: "Your expertise is not the problem. The people who need you cannot yet see what makes you worth trusting.",
    cta: "Become the Trusted Choice"
  },
  {
    name: "Emerging Credibility",
    score: "6-10",
    text: "You have expertise. But your message deserves to be remembered, not just noticed.",
    cta: "Turn your credibility into clarity"
  },
  {
    name: "Visible Credibility",
    score: "11-15",
    text: "You are becoming more visible, but visibility without resonance rarely creates lasting trust.",
    cta: "Transform visibility into trust"
  },
  {
    name: "Resonant Credibility",
    score: "16-20",
    text: "You are already making an impression. Now people need to remember why you are their trusted choice.",
    cta: "Build your authority ecosystem"
  },
  {
    name: "Trusted Choice",
    score: "21-25",
    text: "You have built something many practitioners aspire to. Now the opportunity is to multiply your impact.",
    cta: "Expand your influence"
  }
];

export const resources = [
  {
    title: "Email Delivered Directly to You",
    text: "Personalised workbooks and prompts delivered directly inside your result email.",
    cta: "Take Assessment",
    icon: FileText,
    image: {
      src: magnific.notebook,
      alt: "Magdalene Wambui in a garden setting.",
      objectPosition: "center 42%"
    }
  },
  {
    title: "The Code of Resonance",
    text: "Weekly essays on trust, identity, earned credibility, and the stories that shape who we become.",
    cta: "Subscribe",
    icon: BookOpen,
    image: {
      src: magnific.healthcareSupport,
      alt: "Magdalene Wambui in an emerald green outfit.",
      objectPosition: "center 56%"
    }
  },
  {
    title: "Essays That Challenge Conventional Thinking",
    text: "Explore ideas on positioning, trust, emotional intelligence, and the psychology behind becoming unforgettable.",
    cta: "Explore Essays",
    icon: Sparkles,
    image: {
      src: magnific.clinicalNotes,
      alt: "Editorial portrait of Magdalene Wambui.",
      objectPosition: "center 30%"
    }
  },
  {
    title: "Recommended Reading",
    text: "The books, research, and ideas that have shaped Magdalene's philosophy on trust, leadership, and earned credibility.",
    cta: "View Reading List",
    icon: Layers3,
    image: {
      src: magnific.notebook,
      alt: "Magdalene Wambui in a garden setting.",
      objectPosition: "center 42%"
    }
  },
  {
    title: "Stories of Transformation",
    text: "See how practitioners uncovered their earned credibility and became the trusted choice.",
    cta: "Read Case Studies",
    icon: Quote,
    image: {
      src: magnific.careTrust,
      alt: "Magdalene Wambui in an emerald green outfit and white blazer.",
      objectPosition: "center 45%"
    }
  }
];

export const testimonials = [
  {
    before: "I knew I was good at what I did, but I struggled to explain why clients should choose me.",
    after:
      "Working with Magdalene helped me see that my story was not something to hide. It became the reason people finally understood my value.",
    name: "Client Name",
    role: "Role | Profession"
  },
  {
    before: "I kept collecting certifications, believing they would make me more credible.",
    after:
      "I discovered that the experiences I had overlooked were the very things my clients connected with most.",
    name: "Client Name",
    role: "Profession"
  },
  {
    before: "I was trying to sound impressive.",
    after:
      "For the first time, I started communicating what was true. That changed how people responded to my work.",
    name: "Client Name",
    role: "Profession"
  }
];

export const offerPreviewSlugs = ["credibility-audit", "earned-credibility-intensive", "discern"];
