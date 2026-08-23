import { BookOpenText, FileText, Layers3, Quote, Sparkles } from "lucide-react";
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
    icon: Sparkles,
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
    fallbackImage: magnificImages.assessment
  },
  {
    key: "trust-resonance",
    path: "/code-of-resonance/trust-resonance",
    label: "Trust & Resonance",
    title: "Trust & Resonance",
    eyebrow: "Belief Shift",
    description:
      "Strategic reflections on the emotional and practical signals that make expertise feel safe to choose.",
    contentType: "trust_resonance",
    icon: Sparkles,
    fallbackImage: magnificImages.proof
  },
  {
    key: "recommended-reading",
    path: "/code-of-resonance/recommended-reading",
    label: "Recommended Reading",
    title: "Recommended Reading",
    eyebrow: "Curated Learning",
    description:
      "Books, frameworks, and reference notes that sharpen credibility, story, and authority.",
    contentType: "reading_list",
    icon: Layers3,
    fallbackImage: magnificImages.problem
  },
  {
    key: "case-studies",
    path: "/code-of-resonance/case-studies",
    label: "Case Studies",
    title: "Case Studies",
    eyebrow: "Credibility in Practice",
    description:
      "Proof-led stories showing how clearer positioning, trust signals, and resonance change the way people choose.",
    contentType: "case_study",
    icon: Quote,
    fallbackImage: magnificImages.finalCta
  },
  {
    key: "guides",
    path: "/code-of-resonance/guides",
    label: "Guides",
    title: "Practical Guides",
    eyebrow: "Implementation",
    description:
      "Actionable resources for making your earned credibility more visible and usable.",
    contentType: "guide",
    icon: FileText,
    fallbackImage: magnificImages.problem
  },
  {
    key: "stories",
    path: "/code-of-resonance/stories",
    label: "Transformation Stories",
    title: "Transformation Stories",
    eyebrow: "Social Proof",
    description:
      "Client and reader reflections that show the human shift behind stronger trust and clearer positioning.",
    contentType: "testimonial",
    icon: Quote,
    fallbackImage: magnificImages.hero
  }
];

export const codeSections = Object.fromEntries(codeSectionList.map((section) => [section.key, section]));

export const typeLabels = {
  guide: "Guide",
  essay: "Essay",
  trust_resonance: "Trust & Resonance",
  reading_list: "Recommended Reading",
  case_study: "Case Study",
  testimonial: "Transformation Story"
};

export const sectionForType = (contentType) =>
  codeSectionList.find((section) => section.contentType === contentType) || codeSections.all;
