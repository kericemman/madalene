export const offerContent = {
  "credibility-audit": {
    number: "01",
    phase: "Diagnose",
    headline: "Find Out What's Making People Hesitate.",
    description:
      "You've built the expertise. But somewhere between what you've earned and what people see, trust is getting lost.",
    story: [
      "You do not need to question the quality of your work. The more useful question is where trust is being lost between the credibility you have earned and the way people currently encounter you.",
      "The Credibility Audit gives you a precise diagnosis, so you can stop changing everything and start strengthening the part that will make the biggest difference."
    ],
    bestFor: "You know something is not landing, but cannot tell exactly what.",
    features: [
      "See exactly where your credibility is leaking",
      "Identify what is weakening trust in your positioning, messaging, and presence",
      "Know what to fix first instead of changing everything",
      "Leave with a prioritised action plan"
    ],
    outcomeTitle: "Leave with certainty about what to fix first.",
    outcomes: ["Certainty about the real trust gap", "A prioritised action plan", "A clear first move"],
    ctaText: "Book Your Credibility Audit",
    ctaType: "booking",
    ctaUrl: "/booking/credibility-audit",
    formTitle: "Request your Credibility Audit",
    formDescription: "Share a few details and I will come back to you with the next step."
  },
  "earned-credibility-intensive": {
    number: "02",
    phase: "Extract",
    headline: "Stop Sounding Like Everyone Else in Your Field.",
    description:
      "Years of expertise, lived experience, accomplishments, and stories should not disappear behind generic positioning.",
    story: [
      "Your authority should not depend on a generic version of your profession. This work brings together the expertise, lived experience, proof, and perspective that make your approach recognisably yours.",
      "The goal is not a better biography. It is strategic credibility: a clear way for the right people to understand why your work is difficult to compare."
    ],
    bestFor: "You have depth, but generic positioning is making it hard for people to see what sets you apart.",
    features: [
      "Uncover the experiences and proof that make your authority yours",
      "Articulate what makes you difficult to compare",
      "Turn your story into strategic credibility, not biography",
      "Build your positioning around what you have actually earned"
    ],
    outcomeTitle: "You leave with the assets and language to be distinct.",
    outcomes: ["Your core Earned Credibility assets", "A clear positioning direction", "Language that makes your authority distinct"],
    ctaText: "Uncover What Makes You Difficult to Copy",
    ctaType: "application",
    ctaUrl: "/application/earned-credibility-intensive",
    formTitle: "Apply for the Earned Credibility Intensive",
    formDescription: "A short application helps me understand whether this is the right place to start."
  },
  discern: {
    number: "03",
    phase: "Flagship Private Advisory",
    headline: "Your Expertise Has Grown. Your Reputation Should Catch Up.",
    description:
      "Over 90 days, we strategically reposition your expertise and lived experience into a cohesive authority brand designed to make you easier to trust, remember, and choose.",
    story: [
      "This is for the practitioner whose depth has outgrown the brand currently representing it. Over 90 days, we bring the body of work you have built into a clear authority system that can hold your next level of visibility and influence.",
      "The work moves beyond isolated messaging changes into the strategic story, proof, thought leadership, and reputation that make your authority easier to recognise before someone has to experience it first-hand."
    ],
    bestFor: "The established wellness practitioner whose body of work has evolved beyond the brand representing it.",
    features: [
      "Authority positioning and Earned Credibility extraction",
      "Strategic story, messaging, and thought leadership",
      "LinkedIn presence, reputation, and trust",
      "Your complete authority ecosystem"
    ],
    outcomeTitle: "Build the reputation of the Trusted Choice.",
    outcomes: ["A cohesive authority brand", "A reputation that makes you easier to trust, remember, and choose", "A shift from credible practitioner to Trusted Choice"],
    ctaText: "Apply for DISCERN",
    ctaType: "application",
    ctaUrl: "/application/discern",
    formTitle: "Apply for DISCERN",
    formDescription: "This is a considered, private advisory. The application helps us decide whether it is the right fit."
  }
};

export const offerSlugs = Object.keys(offerContent);

const fallbackNames = {
  "credibility-audit": "Credibility Audit",
  "earned-credibility-intensive": "Earned Credibility Intensive",
  discern: "DISCERN"
};

export const getOfferPath = (slug) => (slug === "discern" ? "/discern" : `/offers/${slug}`);

export const getOfferActionPath = (offer) => {
  if (offer.ctaType === "booking") return `/booking/${offer.slug}`;
  return `/application/${offer.slug}`;
};

export const mergeOffer = (offer = {}) => {
  const content = offerContent[offer.slug] || {};
  return {
    slug: offer.slug,
    name: offer.name || fallbackNames[offer.slug] || "Offers",
    shortDescription: offer.shortDescription || content.description,
    fullDescription: offer.fullDescription || content.description,
    features: offer.features?.length ? offer.features : content.features || [],
    outcomes: offer.outcomes?.length ? offer.outcomes : content.outcomes || [],
    idealClient: offer.idealClient || content.bestFor,
    ctaText: offer.ctaText || content.ctaText || "Explore this offer",
    ctaType: offer.ctaType || content.ctaType || "application",
    ctaUrl: offer.ctaUrl || content.ctaUrl,
    featured: Boolean(offer.featured ?? offer.slug === "discern"),
    ...content,
    ...offer
  };
};

export const fallbackOffers = offerSlugs.map((slug, index) =>
  mergeOffer({ slug, name: fallbackNames[slug], displayOrder: index + 1 })
);
