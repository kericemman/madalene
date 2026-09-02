import {
  BookOpenText,
  Compass,
  FileCheck2,
  FileText,
  Layers3,
  MessageSquareQuote,
  Sparkles
} from "lucide-react";
import { magnificImages } from "../home/homeContent.js";

export const codeSectionList = [
  {
    key: "all",
    path: "/code-of-resonance",
    label: "All Notes",
    title: "The Code of Resonance",
    eyebrow: "Trust-Building Library",
    description:
      "Essays, guides, reading notes, and proof-led stories for becoming the trusted choice.",
    contentType: "",
    icon: Compass,
    accent: "deepEmerald",
    fallbackImage: magnificImages.proof
  },
  {
    key: "essays",
    path: "/code-of-resonance/essays",
    label: "Latest Essays",
    title: "Latest Essays",
    eyebrow: "Thinking in Public",
    description:
      "Long-form notes on earned credibility, message clarity, trust, resonance, and positioning.",
    contentType: "essay",
    icon: BookOpenText,
    accent: "deepEmerald",
    fallbackImage: magnificImages.assessment
  },
  {
    key: "trust_resonance",
    path: "/code-of-resonance/trust-resonance",
    label: "Trust & Resonance",
    title: "Trust & Resonance",
    eyebrow: "Belief Shift",
    description:
      "Strategic reflections on the emotional and practical signals that make expertise feel safe to choose.",
    contentType: "trust_resonance",
    icon: Sparkles,
    accent: "mutedMint",
    fallbackImage: magnificImages.proof
  },
  {
    key: "reading_list",
    path: "/code-of-resonance/recommended-reading",
    label: "Recommended Reading",
    title: "Recommended Reading",
    eyebrow: "Curated Learning",
    description:
      "Books, frameworks, and reference notes that sharpen credibility, story, and authority.",
    contentType: "reading_list",
    icon: Layers3,
    accent: "sage",
    fallbackImage: magnificImages.problem
  },
  {
    key: "case_study",
    path: "/code-of-resonance/case-studies",
    label: "Case Studies",
    title: "Case Studies",
    eyebrow: "Credibility in Practice",
    description:
      "Proof-led stories showing how clearer positioning, trust signals, and resonance change how people choose.",
    contentType: "case_study",
    icon: FileCheck2,
    accent: "deepEmerald",
    fallbackImage: magnificImages.finalCta
  },
  {
    key: "guide",
    path: "/code-of-resonance/guides",
    label: "Guides",
    title: "Practical Guides",
    eyebrow: "Implementation",
    description:
      "Actionable resources for making your earned credibility more visible and usable.",
    contentType: "guide",
    icon: FileText,
    accent: "sage",
    fallbackImage: magnificImages.problem
  },
  {
    key: "testimonial",
    path: "/code-of-resonance/stories",
    label: "Transformation Stories",
    title: "Transformation Stories",
    eyebrow: "Social Proof",
    description:
      "Client and reader reflections that show the human shift behind stronger trust and clearer positioning.",
    contentType: "testimonial",
    icon: MessageSquareQuote,
    accent: "mutedMint",
    fallbackImage: magnificImages.hero
  }
];

// O(1) Quick Access Map by Route Key
export const codeSections = Object.fromEntries(
  codeSectionList.map((section) => [section.key, section])
);

// O(1) Quick Access Map by Database ContentType
export const sectionsByContentType = Object.fromEntries(
  codeSectionList
    .filter((section) => Boolean(section.contentType))
    .map((section) => [section.contentType, section])
);

// Human-readable Badge Labels
export const typeLabels = {
  essay: "Essay",
  trust_resonance: "Trust & Resonance",
  reading_list: "Recommended Reading",
  case_study: "Case Study",
  guide: "Guide",
  testimonial: "Transformation Story"
};

// Constant-time resolver with fallback to the root library
export const sectionForType = (contentType) =>
  sectionsByContentType[contentType] || codeSections.all;