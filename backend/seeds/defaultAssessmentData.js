const oneToOneBookingUrl = "https://calendly.com/wambui-magdalene/content-that-connects";

const paragraph = (value) => `<p style="margin:0 0 16px;">${value}</p>`;
const heading = (value) =>
  `<h2 style="margin:26px 0 12px;color:#0B6E4F;font-size:20px;line-height:1.25;">${value}</h2>`;
const bulletList = (items) =>
  `<ul style="margin:0 0 20px;padding-left:22px;">${items.map((item) => `<li style="margin:0 0 8px;">${item}</li>`).join("")}</ul>`;
const checklist = (items) =>
  `<ul style="margin:0 0 20px;padding-left:0;list-style:none;">${items.map((item) => `<li style="margin:0 0 9px;">&#9744; ${item}</li>`).join("")}</ul>`;

const buildText = (sections) =>
  sections
    .map((section) => {
      if (section.type === "list") return section.items.map((item) => `- ${item}`).join("\n");
      if (section.type === "checklist") return section.items.map((item) => `[ ] ${item}`).join("\n");
      return section.value;
    })
    .join("\n\n");

const resourceEmail = ({ subject, preheader, title, focus, sections }) => ({
  subject,
  preheader,
  title,
  intro: preheader,
  bodyHtml: sections
    .map((section) => {
      if (section.type === "heading") return heading(section.value);
      if (section.type === "paragraph") return paragraph(section.value);
      if (section.type === "list") return bulletList(section.items);
      if (section.type === "checklist") return checklist(section.items);
      return "";
    })
    .join(""),
  text: buildText(sections),
  ctaText: "Book a 1:1 Call",
  ctaUrl: oneToOneBookingUrl,
  focus
});

export const assessmentCategories = [
  {
    key: "story",
    name: "Story",
    description: "How clearly your story explains why you do this work.",
    weight: 1,
    displayOrder: 1
  },
  {
    key: "trust",
    name: "Trust",
    description: "How quickly people can find enough evidence to feel confident choosing you.",
    weight: 1,
    displayOrder: 2
  },
  {
    key: "positioning",
    name: "Positioning",
    description: "How clearly people understand what makes you different.",
    weight: 1,
    displayOrder: 3
  },
  {
    key: "proof",
    name: "Proof",
    description: "How consistently your outcomes and client evidence support your reputation.",
    weight: 1,
    displayOrder: 4
  },
  {
    key: "resonance",
    name: "Resonance",
    description: "How memorable and emotionally clear your message feels.",
    weight: 1,
    displayOrder: 5
  }
];

const likertOptions = [
  { label: "Strongly Disagree", value: "1", score: 1, displayOrder: 1 },
  { label: "Disagree", value: "2", score: 2, displayOrder: 2 },
  { label: "Neither Agree nor Disagree", value: "3", score: 3, displayOrder: 3 },
  { label: "Agree", value: "4", score: 4, displayOrder: 4 },
  { label: "Strongly Agree", value: "5", score: 5, displayOrder: 5 }
];

export const assessmentQuestions = [
  {
    key: "story",
    categoryKey: "story",
    questionText:
      "My personal story clearly explains why I do this work, making it easy for people to understand what drives me.",
    helperText: "Score the current reality of your website, profile, content, and conversations.",
    answerType: "likert",
    options: likertOptions,
    displayOrder: 1
  },
  {
    key: "trust",
    categoryKey: "trust",
    questionText: "When someone discovers me online, they quickly find enough evidence to feel confident choosing me.",
    answerType: "likert",
    options: likertOptions,
    displayOrder: 2
  },
  {
    key: "positioning",
    categoryKey: "positioning",
    questionText: "People can clearly explain what makes me different from other practitioners in my field.",
    answerType: "likert",
    options: likertOptions,
    displayOrder: 3
  },
  {
    key: "proof",
    categoryKey: "proof",
    questionText:
      "I consistently share real examples, results or client outcomes that demonstrate the impact of my work.",
    answerType: "likert",
    options: likertOptions,
    displayOrder: 4
  },
  {
    key: "resonance",
    categoryKey: "resonance",
    questionText:
      "People remember me not just for what I do, but for how my message, story or perspective makes them feel.",
    answerType: "likert",
    options: likertOptions,
    displayOrder: 5
  }
];

const diagnosticOptions = (options) =>
  options.map((option, index) => ({
    ...option,
    score: [0, 0.75, 1.75, 2.5][index],
    displayOrder: index + 1
  }));

const evidenceRubric =
  "Assess only the evidence provided. 0 means no relevant evidence, 1 means a vague claim, 2 means some specific but unclear evidence, 3 means specific credible evidence, and 4 means distinctive proof-led authority.";

// V2 keeps the 25-point RQ scale while pairing structured choices with evidence prompts.
export const assessmentV2Questions = [
  {
    key: "story-origin",
    categoryKey: "story",
    questionText: "How easily can a new person understand why your experience makes you the right person to do this work?",
    helperText: "Think about your website, LinkedIn profile, introductions, and the content people meet first.",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "They mostly see a title, service, or qualification." , value: "title-only" },
      { label: "They can find parts of my story, but it feels disconnected from my work.", value: "disconnected" },
      { label: "My story connects to my work, but it is not consistently visible.", value: "connected-inconsistently" },
      { label: "They quickly understand the experiences and perspective that shape how I work.", value: "clear-perspective" }
    ]),
    displayOrder: 1
  },
  {
    key: "story-point-of-view",
    categoryKey: "story",
    questionText: "When you introduce your work, how clearly do people hear a point of view that is recognisably yours?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "My introduction is mostly a list of services or credentials.", value: "services-only" },
      { label: "I have a point of view, but I rarely articulate it clearly.", value: "unspoken-view" },
      { label: "I can explain it when asked, though it is not yet a consistent part of my message.", value: "clear-on-request" },
      { label: "My point of view gives people a clear reason to remember how I see the work.", value: "signature-view" }
    ]),
    displayOrder: 2
  },
  {
    key: "story-evidence",
    categoryKey: "story",
    questionText: "What experience, turning point, or conviction has most shaped the way you work today?",
    helperText: "Share only what you are comfortable sharing. Focus on the connection between the experience and the way you now serve clients.",
    answerType: "long_text",
    scored: false,
    aiScored: true,
    aiScoringRubric: evidenceRubric,
    displayOrder: 3
  },
  {
    key: "trust-verification",
    categoryKey: "trust",
    questionText: "In a 60-second search, what can a careful potential client verify about you?",
    helperText: "Consider your profile, website, testimonials, case examples, credentials, and public presence.",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "Very little beyond a name, service, or social profile.", value: "little-to-verify" },
      { label: "Some credentials or claims, but limited proof of the client experience.", value: "credentials-only" },
      { label: "A mix of clear information and proof, though it is scattered or incomplete.", value: "some-proof" },
      { label: "Clear expertise, relevant proof, and practical signals that make choosing me feel safer.", value: "easy-to-verify" }
    ]),
    displayOrder: 4
  },
  {
    key: "trust-journey",
    categoryKey: "trust",
    questionText: "Before someone enquires, how confidently can they understand what working with you will be like?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "They would need to contact me to understand almost everything.", value: "unclear-journey" },
      { label: "They can see what I offer, but not enough to know whether it is right for them.", value: "offer-only" },
      { label: "They can understand most of the process, but a few trust-building details are missing.", value: "mostly-clear" },
      { label: "They can see who it is for, how I work, what to expect, and evidence of care or results.", value: "high-confidence" }
    ]),
    displayOrder: 5
  },
  {
    key: "positioning-difference",
    categoryKey: "positioning",
    questionText: "If an ideal client compared you with other capable practitioners, how clearly could they explain why you are the better fit?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "They would mostly compare prices, availability, or generic credentials.", value: "generic-comparison" },
      { label: "They might notice a difference, but I have not made it easy to describe.", value: "unclear-difference" },
      { label: "They can identify parts of my approach, though the distinction is not yet sharp.", value: "partial-difference" },
      { label: "They can name the specific perspective, method, or outcome that makes me difficult to compare.", value: "clear-difference" }
    ]),
    displayOrder: 6
  },
  {
    key: "positioning-language",
    categoryKey: "positioning",
    questionText: "How consistent is the language you use to describe who you help, what you help them achieve, and how you work?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "It changes depending on the platform or conversation.", value: "inconsistent-language" },
      { label: "I have broad language, but it could describe many people in my field.", value: "broad-language" },
      { label: "The core message is clear, though some touchpoints still feel generic.", value: "developing-language" },
      { label: "My language is consistent, specific, and easy for others to repeat or refer.", value: "signature-language" }
    ]),
    displayOrder: 7
  },
  {
    key: "positioning-evidence",
    categoryKey: "positioning",
    questionText: "Describe the clients you do your best work with and the change they seek. What makes your approach meaningfully different?",
    helperText: "A few specific sentences are more useful than a polished slogan.",
    answerType: "long_text",
    scored: false,
    aiScored: true,
    aiScoringRubric: evidenceRubric,
    displayOrder: 8
  },
  {
    key: "proof-visibility",
    categoryKey: "proof",
    questionText: "Which best describes the proof of your work that is visible to potential clients today?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "Most proof lives in private conversations, inboxes, or my memory.", value: "private-proof" },
      { label: "I have testimonials or outcomes, but I rarely share them or they lack context.", value: "hidden-proof" },
      { label: "I share relevant proof sometimes, but it is not organised around the outcomes I want to be known for.", value: "inconsistent-proof" },
      { label: "I consistently show specific, ethical proof that helps people understand the value and care behind my work.", value: "visible-proof" }
    ]),
    displayOrder: 9
  },
  {
    key: "proof-specificity",
    categoryKey: "proof",
    questionText: "When you share a testimonial, client story, or professional recognition, how much context does it give a new person?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "I do not usually share evidence of outcomes or recognition.", value: "no-context" },
      { label: "It tends to be a general compliment or logo without a clear connection to the work.", value: "generic-context" },
      { label: "It shows an outcome or experience, though it could be more specific and better placed.", value: "some-context" },
      { label: "It makes the situation, my contribution, and the meaningful result clear without overclaiming.", value: "strong-context" }
    ]),
    displayOrder: 10
  },
  {
    key: "proof-evidence",
    categoryKey: "proof",
    questionText: "Share one concrete example of a client outcome, testimonial, recognition, or repeatable result that represents the quality of your work.",
    helperText: "Do not include private client details. Describe the situation, your contribution, and the outcome at a level you can stand behind.",
    answerType: "long_text",
    scored: false,
    aiScored: true,
    aiScoringRubric: evidenceRubric,
    displayOrder: 11
  },
  {
    key: "resonance-memory",
    categoryKey: "resonance",
    questionText: "After people encounter your content or profile, what are they most likely to remember?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "A general service category, if they remember anything specific.", value: "generic-memory" },
      { label: "Useful information, but not a distinct perspective or message.", value: "useful-not-distinct" },
      { label: "A clear idea or feeling, though it is not consistently reinforced.", value: "developing-memory" },
      { label: "A distinctive idea, perspective, or emotional clarity they associate with my name.", value: "recognisable-memory" }
    ]),
    displayOrder: 12
  },
  {
    key: "resonance-voice",
    categoryKey: "resonance",
    questionText: "How consistently does your public voice reflect the convictions and lived understanding behind your work?",
    answerType: "single_choice",
    options: diagnosticOptions([
      { label: "My content is mostly generic, educational, or adapted from what others are saying.", value: "generic-voice" },
      { label: "My voice appears occasionally, but it is not yet a clear thread through my work.", value: "occasional-voice" },
      { label: "My perspective is recognisable in some content and conversations.", value: "recognisable-sometimes" },
      { label: "My convictions and language create a consistent, memorable experience of my work.", value: "consistent-resonance" }
    ]),
    displayOrder: 13
  }
];

const canonicalAssessmentStatements = {
  story: [
    "My personal story clearly explains why I do this work, making it easy for people to understand what drives me.",
    "The experiences I share about my life clearly connect to the work I do today.",
    "My story helps people understand the beliefs, perspectives or values that shape how I approach my work.",
    "I intentionally share the parts of my story that strengthen people's understanding of my expertise, rather than simply sharing personal experiences.",
    "People can remember something meaningful about my journey and connect it to what I stand for professionally."
  ],
  trust: [
    "When someone discovers me online, they quickly find enough evidence to feel confident choosing me.",
    "My online presence gives people a consistent sense of professionalism and credibility across the places they encounter me.",
    "People can quickly understand why I am qualified or equipped to help with the problem I say I solve.",
    "Someone considering working with me can find enough reassurance to feel confident taking the next step.",
    "My credibility is visible before I need to explain or defend it myself."
  ],
  positioning: [
    "People can clearly explain what makes me different from other practitioners in my field.",
    "People can quickly understand who my work is for and the problem or outcome I want to be associated with.",
    "My positioning gives people a clear reason to remember me beyond my job title or profession.",
    "My perspective or approach gives the right people a meaningful reason to choose me over other credible alternatives.",
    "The way I position myself is consistent enough that people know what they should associate with my name."
  ],
  proof: [
    "I consistently share real examples, results or client outcomes that demonstrate the impact of my work.",
    "My claims about my expertise are supported by visible evidence rather than relying on people to take my word for it.",
    "I make relevant client results, testimonials or examples of my work easy for potential clients to find.",
    "My professional achievements, experience or third-party recognition are visible where they strengthen people's confidence in my work.",
    "My ideas, frameworks, observations or methodologies demonstrate the depth of my expertise."
  ],
  resonance: [
    "People remember me not just for what I do, but for how my message, story or perspective makes them feel.",
    "People regularly respond to my ideas in ways that show they see themselves or their experiences in what I communicate.",
    "My content communicates perspectives or ideas that people can begin to associate specifically with me.",
    "My message is consistent enough that people know what I stand for even when they encounter different pieces of my content.",
    "My ideas stay with people beyond the moment they consume my content and influence how they think about the problem I address."
  ]
};

// Each pillar is averaged to five points, preserving the canonical 25-point RQ scale.
export const assessmentV3Questions = assessmentCategories.flatMap((category) =>
  canonicalAssessmentStatements[category.key].map((questionText, index) => ({
    key: `${category.key}-${index + 1}`,
    categoryKey: category.key,
    questionText,
    answerType: "likert",
    options: likertOptions,
    weight: 0.2,
    displayOrder: (category.displayOrder - 1) * 5 + index + 1
  }))
);

const evidencePrompts = {
  story: {
    questionText: "What lived or professional experience most shaped why you do this work, and how does it influence the way you serve clients today?",
    helperText: "Share a specific experience and the connection to your work. Do not include confidential client information.",
    aiScoringRubric:
      "Assess whether the response connects a specific lived or professional experience to the participant's purpose, perspective, values, or way of working. Look for a clear, memorable link rather than biography alone."
  },
  trust: {
    questionText: "What could a careful new client independently verify about you in the first minute of visiting your website, profile, or online presence?",
    helperText: "Name the visible credentials, experience, proof, or trust signals a new person can actually find.",
    aiScoringRubric:
      "Assess whether the response names visible, independently checkable trust signals that help a new person understand qualification, consistency, and reassurance before a conversation."
  },
  positioning: {
    questionText: "Who do you do your best work with, what outcome do they seek, and what makes your approach meaningfully different?",
    helperText: "Be as specific as you can about the people, outcome, and perspective you want to be known for.",
    aiScoringRubric:
      "Assess whether the response clearly identifies an audience, desired outcome, and meaningful distinction or point of view that gives the right person a reason to remember and choose the participant."
  },
  proof: {
    questionText: "Share one ethical, non-identifying example of a result, testimonial, recognition, or repeated outcome that demonstrates the impact of your work.",
    helperText: "Use a real example. Remove client names and any private details.",
    aiScoringRubric:
      "Assess whether the response gives specific, credible, ethically described proof of impact, expertise, recognition, or a repeatable method that a prospective client could reasonably trust."
  },
  resonance: {
    questionText: "What idea, perspective, or message do you want people to remember and associate with your name after they encounter your work?",
    helperText: "Describe the idea in your own words and the response it creates in the right people.",
    aiScoringRubric:
      "Assess whether the response articulates a distinctive, relevant idea or perspective that can create recognition, emotional relevance, consistency, and a memorable association with the participant."
  }
};

// The approved 25 statements remain the participant's self-check. One written
// evidence response per pillar is scored against a fixed 1-5 rubric by the AI.
export const assessmentV4Questions = assessmentCategories.flatMap((category) => {
  const statements = canonicalAssessmentStatements[category.key].map((questionText, index) => ({
    key: `${category.key}-${index + 1}`,
    categoryKey: category.key,
    questionText,
    answerType: "likert",
    options: likertOptions,
    weight: 0.2,
    displayOrder: (category.displayOrder - 1) * 10 + index + 1
  }));
  const evidence = evidencePrompts[category.key];

  return [
    ...statements,
    {
      key: `${category.key}-evidence`,
      categoryKey: category.key,
      questionText: evidence.questionText,
      helperText: evidence.helperText,
      answerType: "long_text",
      weight: 0,
      scored: false,
      aiScored: true,
      aiScoringRubric: evidence.aiScoringRubric,
      minAnswerLength: 60,
      displayOrder: (category.displayOrder - 1) * 10 + 6
    }
  ];
});

export const scoreRanges = [
  {
    name: "Hidden Credibility",
    minScore: 0,
    maxScore: 5,
    description:
      "You have more credibility than people can currently see. You are not starting from zero. You are starting from hidden.",
    recommendedAction:
      "Reveal the credibility you have already earned by clarifying your story, adding visible proof, and defining what makes your approach distinctive.",
    primaryCtaText: "Read My Recommended Resource",
    primaryCtaUrl: "/resources/story-clarity-workbook",
    report: {
      whatItMeans:
        "You have more credibility than people can currently see. Hidden Credibility is not about your ability; it is about visibility. Your reputation may exist offline, but it has not yet been translated into a digital presence that reflects the quality of your work.",
      biggestOpportunity:
        "Your goal is not to become more qualified. It is to reveal the credibility you have already earned.",
      nextSteps: [
        "Clarify the story behind your work.",
        "Add visible proof of the results you create.",
        "Define what makes your approach distinctive."
      ],
      recommendedResourceTitle: "Story Clarity Workbook",
      finalNote:
        "Your Resonance Quotient is a snapshot of how your earned credibility is showing up today. Every improvement brings you closer to becoming the practitioner people choose with confidence."
    },
    displayOrder: 1
  },
  {
    name: "Emerging Credibility",
    minScore: 6,
    maxScore: 10,
    description:
      "Your credibility is beginning to show, but it is not yet consistent. People who know you may trust you, but new people still need clearer signals.",
    recommendedAction:
      "Strengthen consistency across your story, proof, positioning, and trust signals so people can understand why you are the right practitioner.",
    primaryCtaText: "Read My Recommended Resource",
    primaryCtaUrl: "/resources/trust-signals-checklist",
    report: {
      whatItMeans:
        "Your credibility is beginning to show, but it is not yet consistent. People who already know you may trust your expertise. The challenge is helping new people reach that confidence without needing a personal introduction.",
      biggestOpportunity:
        "Focus on consistency. Every place someone encounters you should reinforce the same message, expertise, and level of trust.",
      nextSteps: [
        "Strengthen your positioning.",
        "Make your trust signals easier to find.",
        "Share client outcomes more consistently."
      ],
      recommendedResourceTitle: "Trust Signals Checklist",
      finalNote:
        "Credibility is not something you have to manufacture. You have already earned it. The opportunity is to make it visible, memorable, and impossible to overlook."
    },
    displayOrder: 2
  },
  {
    name: "Visible Credibility",
    minScore: 11,
    maxScore: 15,
    description:
      "People can see your expertise. The next challenge is distinction: becoming known for something specific and easy to remember.",
    recommendedAction:
      "Shift from being recognised for what you do to being remembered for how you do it. Clear positioning creates preference.",
    primaryCtaText: "Read My Recommended Resource",
    primaryCtaUrl: "/resources/positioning-canvas",
    report: {
      whatItMeans:
        "People can see your expertise. Your experience is becoming visible, and your professional reputation is growing. The next challenge is not visibility; it is distinction.",
      biggestOpportunity:
        "Shift from being recognised for what you do to being remembered for how you do it. Clear positioning creates preference.",
      nextSteps: [
        "Refine your unique positioning.",
        "Develop one signature message or framework.",
        "Align your content with the transformation you want to be known for."
      ],
      recommendedResourceTitle: "Positioning Canvas",
      finalNote:
        "The question that moves you forward is simple: if someone had to describe why they should choose you instead of another practitioner, could they do it in one sentence?"
    },
    displayOrder: 3
  },
  {
    name: "Resonant Credibility",
    minScore: 16,
    maxScore: 20,
    description:
      "Your credibility is creating connection. People do not simply understand your work; they are beginning to remember it.",
    recommendedAction:
      "Own your category by developing signature ideas, sharing evidence of impact, and building a reputation beyond your existing network.",
    primaryCtaText: "Read My Recommended Resource",
    primaryCtaUrl: "/resources/resonance-playbook",
    report: {
      whatItMeans:
        "Your credibility is creating something more valuable than visibility. It is creating connection. People do not simply understand your work; they remember it.",
      biggestOpportunity:
        "Own your category. Consistency and clarity will help transform strong credibility into lasting authority.",
      nextSteps: [
        "Continue sharing evidence of your impact.",
        "Develop signature ideas that reinforce your positioning.",
        "Build a reputation that extends beyond your existing network."
      ],
      recommendedResourceTitle: "Resonance Playbook",
      finalNote:
        "This is where trust becomes emotional rather than transactional. Your perspective is beginning to shape how others think and feel."
    },
    displayOrder: 4
  },
  {
    name: "Trusted Choice",
    minScore: 21,
    maxScore: 25,
    description:
      "People do not simply recognise your expertise. They trust your judgement. Your next chapter is multiplying your influence.",
    recommendedAction:
      "Document your frameworks, refine your thought leadership, and create resources that expand the impact of your earned credibility.",
    primaryCtaText: "Read My Recommended Resource",
    primaryCtaUrl: "/resources/legacy-influence-blueprint",
    report: {
      whatItMeans:
        "People do not simply recognise your expertise. They trust your judgement. Your reputation reflects the quality of your work, and your credibility extends beyond qualifications alone.",
      biggestOpportunity:
        "Your next chapter is not about building credibility. It is about multiplying your influence.",
      nextSteps: [
        "Continue refining your thought leadership.",
        "Document your frameworks and intellectual property.",
        "Mentor, teach, and create resources that expand your impact."
      ],
      recommendedResourceTitle: "Legacy Influence Blueprint",
      finalNote:
        "You have become memorable because people understand not only what you do, but why it matters. That is what it means to become the Trusted Choice."
    },
    displayOrder: 5
  }
];

export const offers = [
  {
    name: "Credibility Audit",
    slug: "credibility-audit",
    shortDescription: "Find out what is making people hesitate before they choose you.",
    fullDescription:
      "A focused diagnostic for experts whose work is strong but whose positioning, messaging, or presence is not converting into the confidence it deserves.",
    price: 99,
    currency: "USD",
    offerType: "audit",
    deliveryMethod: "strategic_diagnostic",
    features: [
      "See exactly where your credibility is leaking",
      "Identify what is weakening trust in your positioning, messaging, and presence",
      "Know what to fix first instead of changing everything",
      "Leave with a prioritised action plan"
    ],
    outcomes: ["Certainty about the real trust gap", "A prioritised action plan", "A clear first move"],
    idealClient: "You know something is not landing, but cannot tell exactly what.",
    ctaText: "Book Your Credibility Audit",
    ctaType: "booking",
    ctaUrl: "/booking/credibility-audit",
    bookingEnabled: true,
    active: true,
    displayOrder: 1,
    featured: false,
    relatedEmailSequenceKey: "credibility_audit"
  },
  {
    name: "Earned Credibility Intensive",
    slug: "earned-credibility-intensive",
    shortDescription: "Stop sounding like everyone else in your field.",
    fullDescription:
      "A strategic extraction experience that brings your expertise, lived experience, accomplishment, and story together into a positioning direction people can recognise and remember.",
    price: 0,
    currency: "USD",
    offerType: "intensive",
    deliveryMethod: "strategic_intensive",
    features: [
      "Uncover the experiences and proof that make your authority yours",
      "Articulate what makes you difficult to compare",
      "Turn your story into strategic credibility, not biography",
      "Build your positioning around what you have actually earned"
    ],
    outcomes: ["Core Earned Credibility assets", "A clear positioning direction", "Language that makes your authority distinct"],
    idealClient: "You have depth, but generic positioning is making it hard for people to see what sets you apart.",
    ctaText: "Uncover What Makes You Difficult to Copy",
    ctaType: "application",
    ctaUrl: "/application/earned-credibility-intensive",
    externalBookingUrl: oneToOneBookingUrl,
    applicationRequired: true,
    active: true,
    displayOrder: 2,
    featured: false,
    relatedEmailSequenceKey: "earned_credibility_intensive"
  },
  {
    name: "DISCERN",
    slug: "discern",
    shortDescription: "Your expertise has grown. Your reputation should catch up.",
    fullDescription:
      "A 90-day private advisory for the established wellness practitioner whose body of work has evolved beyond the brand currently representing it.",
    price: 0,
    currency: "USD",
    offerType: "application_only",
    deliveryMethod: "private_advisory",
    features: [
      "Authority positioning and Earned Credibility extraction",
      "Strategic story, messaging, and thought leadership",
      "LinkedIn presence, reputation, and trust",
      "Your complete authority ecosystem"
    ],
    outcomes: ["A cohesive authority brand", "A reputation that makes you easier to trust, remember, and choose", "A shift from credible practitioner to Trusted Choice"],
    idealClient: "An established wellness practitioner whose reputation needs to catch up with the expertise they have earned.",
    ctaText: "Apply for DISCERN",
    ctaType: "application",
    ctaUrl: "/application/discern",
    applicationRequired: true,
    active: true,
    displayOrder: 3,
    featured: true,
    relatedEmailSequenceKey: "discern"
  }
];

export const resources = [
  {
    title: "Story Clarity Workbook",
    slug: "story-clarity-workbook",
    description: "Discover the story that helps people understand why they can trust you.",
    resourceType: "workbook",
    free: true,
    emailGated: false,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Hidden Credibility",
    relatedWeakestCategory: "story",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Story Clarity Workbook",
      preheader: "Discover the story that helps people understand why they can trust you.",
      title: "Story Clarity Workbook",
      focus: "Story",
      sections: [
        { type: "paragraph", value: "Every experienced practitioner has a story. Not a story to impress people, but a story that explains why they care so deeply about the work they do." },
        { type: "heading", value: "Part 1: Where It Began" },
        { type: "list", items: ["What inspired you to do this work?", "Was there a particular experience that influenced your decision?", "Why has this work remained important to you over the years?"] },
        { type: "heading", value: "Part 2: What Shaped You" },
        { type: "list", items: ["What challenge or experience has had the greatest influence on your approach?", "What has your work taught you about people?", "What do you understand today that you did not when you first started?"] },
        { type: "heading", value: "Part 3: What You Believe" },
        { type: "list", items: ["I believe...", "My clients deserve...", "The biggest misconception about my profession is...", "The transformation I care about most is..."] },
        { type: "heading", value: "Bring It Together" },
        { type: "list", items: ["I do this work because...", "The reason people trust me is...", "The difference I want to be remembered for is..."] },
        { type: "paragraph", value: "If someone discovered you today, would they understand why you do this work, or only what you do?" }
      ]
    })
  },
  {
    title: "Trust Signals Checklist",
    slug: "trust-signals-checklist",
    description: "Help potential clients trust you before they ever contact you.",
    resourceType: "checklist",
    free: true,
    emailGated: false,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Emerging Credibility",
    relatedWeakestCategory: "trust",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Trust Signals Checklist",
      preheader: "Review the visible evidence that helps people trust you before they contact you.",
      title: "Trust Signals Checklist",
      focus: "Trust",
      sections: [
        { type: "paragraph", value: "Your goal is to help potential clients trust you before they ever contact you." },
        { type: "heading", value: "Review Your Online Presence" },
        { type: "checklist", items: ["A professional profile photo", "A clear explanation of who you help", "Client testimonials", "Evidence of results", "Your qualifications or experience", "A clear call to action"] },
        { type: "heading", value: "Review Your Proof" },
        { type: "checklist", items: ["A client success story", "A testimonial", "A case study", "Before-and-after outcomes", "Reviews", "Speaking, media or publications"] },
        { type: "heading", value: "Review Your Consistency" },
        { type: "paragraph", value: "Does your LinkedIn profile, website and social media all communicate the same message?" },
        { type: "paragraph", value: "Trust is not built by making bigger claims. It is built by making your earned credibility visible." }
      ]
    })
  },
  {
    title: "Positioning Canvas",
    slug: "positioning-canvas",
    description: "Define what makes you the practitioner people remember and choose.",
    resourceType: "workbook",
    free: true,
    emailGated: false,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Visible Credibility",
    relatedWeakestCategory: "positioning",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Positioning Canvas",
      preheader: "Define what makes your approach different and memorable.",
      title: "Positioning Canvas",
      focus: "Positioning",
      sections: [
        { type: "paragraph", value: "Many practitioners struggle to explain what makes them different. People do not choose you because you do what others do. They choose you because they understand what makes your approach different." },
        { type: "heading", value: "Part 1: Who Do You Help?" },
        { type: "list", items: ["Who are the people you do your best work with?", "What stage of life or business are they in?", "What challenges bring them to you?"] },
        { type: "heading", value: "Part 2: What Problem Do You Solve?" },
        { type: "list", items: ["What is the biggest problem your clients want to solve?", "What happens if they do not solve it?", "Why is solving this problem important to them?"] },
        { type: "heading", value: "Part 3: What Makes You Different?" },
        { type: "list", items: ["What is different about the way you work?", "What beliefs guide your approach?", "What do clients often appreciate most about working with you?"] },
        { type: "heading", value: "Bring It Together" },
        { type: "list", items: ["I help...", "Who want to...", "By...", "So they can..."] }
      ]
    })
  },
  {
    title: "Proof Library",
    slug: "proof-library",
    description: "Organise the evidence that helps people trust the quality of your work.",
    resourceType: "workbook",
    free: true,
    emailGated: false,
    category: "Earned Credibility",
    relatedWeakestCategory: "proof",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Proof Library",
      preheader: "Gather the proof you have already earned so people can see it.",
      title: "Proof Library",
      focus: "Proof",
      sections: [
        { type: "paragraph", value: "You have already earned credibility through your work. The question is, can other people see it?" },
        { type: "heading", value: "Part 1: Client Success" },
        { type: "list", items: ["What transformations have your clients experienced?", "Which client stories best represent the impact of your work?", "What results are you most proud of?"] },
        { type: "heading", value: "Part 2: Client Feedback" },
        { type: "list", items: ["What compliments do you hear most often?", "Do you have testimonials that reflect the experience of working with you?", "Are there reviews or recommendations you have not shared?"] },
        { type: "heading", value: "Part 3: Professional Recognition" },
        { type: "list", items: ["Awards, certifications or industry recognition", "Speaking, podcasts or media features", "Achievements that demonstrate experience and credibility"] },
        { type: "heading", value: "Your Proof Library" },
        { type: "checklist", items: ["Client testimonials", "Client success stories", "Case studies", "Reviews", "Awards or recognition", "Speaking engagements", "Media features", "Qualifications and certifications", "Original frameworks or methods"] }
      ]
    })
  },
  {
    title: "Resonance Playbook",
    slug: "resonance-playbook",
    description: "Create content that people do not just consume. They remember it.",
    resourceType: "playbook",
    free: true,
    emailGated: false,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Resonant Credibility",
    relatedWeakestCategory: "resonance",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Resonance Playbook",
      preheader: "Create content that people do not just consume. They remember it.",
      title: "Resonance Playbook",
      focus: "Resonance",
      sections: [
        { type: "paragraph", value: "Visibility gets you noticed. Resonance makes you remembered." },
        { type: "heading", value: "Part 1: What Do You Want To Be Known For?" },
        { type: "list", items: ["What ideas do you want people to associate with you?", "What conversations do you want to lead?", "What do you hope people remember after reading your content?"] },
        { type: "heading", value: "Part 2: What Do Your Clients Need To Hear?" },
        { type: "list", items: ["What do your clients struggle to understand?", "What misconceptions do you regularly correct?", "What advice do you find yourself repeating most often?"] },
        { type: "heading", value: "Part 3: Share Your Perspective" },
        { type: "list", items: ["What do you believe that others often overlook?", "What common advice do you disagree with?", "What lesson has your experience taught you?"] },
        { type: "heading", value: "Before Publishing, Ask" },
        { type: "checklist", items: ["Does this help someone understand something more clearly?", "Does this reflect my values and beliefs?", "Does this share my perspective, not just information?", "Does this help people trust my expertise?", "Will someone remember this tomorrow?"] }
      ]
    })
  },
  {
    title: "Legacy Influence Blueprint",
    slug: "legacy-influence-blueprint",
    description: "Document the frameworks, ideas and resources that multiply your influence.",
    resourceType: "blueprint",
    free: true,
    emailGated: false,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Trusted Choice",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Legacy Influence Blueprint",
      preheader: "Your next chapter is multiplying the credibility you have already earned.",
      title: "Legacy Influence Blueprint",
      focus: "Trusted Choice",
      sections: [
        { type: "paragraph", value: "At this stage, your next chapter is not about building credibility. It is about multiplying your influence." },
        { type: "heading", value: "Clarify Your Signature Ideas" },
        { type: "list", items: ["What ideas do people already associate with you?", "Which frameworks have emerged from your experience?", "What do you want your work to help others understand more deeply?"] },
        { type: "heading", value: "Document Your Intellectual Property" },
        { type: "checklist", items: ["Signature framework", "Teaching method", "Client transformation map", "Core beliefs", "Repeatable process", "Stories that carry your philosophy"] },
        { type: "heading", value: "Expand Your Impact" },
        { type: "list", items: ["Mentor or teach what you have learned", "Create resources that outlive one-to-one conversations", "Shape conversations in your field with clarity and care"] },
        { type: "paragraph", value: "The Trusted Choice is not only selected. The Trusted Choice shapes how others think, feel and decide." }
      ]
    })
  }
];

export const recommendationRules = [
  {
    name: "Hidden Credibility resource",
    priority: 100,
    criteria: { minScore: 0, maxScore: 5 },
    targetOfferSlug: "earned-credibility-intensive",
    targetResourceSlug: "story-clarity-workbook",
    explanation: "Your credibility is present, but your story needs to become more visible and memorable.",
    ctaText: "Book a 1:1 Call",
    ctaDestination: oneToOneBookingUrl,
    emailSequenceKey: "hidden_credibility_resource"
  },
  {
    name: "Emerging Credibility resource",
    priority: 100,
    criteria: { minScore: 6, maxScore: 10 },
    targetOfferSlug: "earned-credibility-intensive",
    targetResourceSlug: "trust-signals-checklist",
    explanation: "Your next trust shift is consistency. Make the evidence easier to find before people contact you.",
    ctaText: "Book a 1:1 Call",
    ctaDestination: oneToOneBookingUrl,
    emailSequenceKey: "emerging_credibility_resource"
  },
  {
    name: "Visible Credibility resource",
    priority: 100,
    criteria: { minScore: 11, maxScore: 15 },
    targetOfferSlug: "earned-credibility-intensive",
    targetResourceSlug: "positioning-canvas",
    explanation: "Your expertise is visible. Your next step is sharpening the distinction people remember.",
    ctaText: "Book a 1:1 Call",
    ctaDestination: oneToOneBookingUrl,
    emailSequenceKey: "visible_credibility_resource"
  },
  {
    name: "Resonant Credibility resource",
    priority: 100,
    criteria: { minScore: 16, maxScore: 20 },
    targetOfferSlug: "earned-credibility-intensive",
    targetResourceSlug: "resonance-playbook",
    explanation: "Your credibility is creating connection. Now build the signature ideas people remember.",
    ctaText: "Book a 1:1 Call",
    ctaDestination: oneToOneBookingUrl,
    emailSequenceKey: "resonant_credibility_resource"
  },
  {
    name: "Trusted Choice resource",
    priority: 100,
    criteria: { minScore: 21, maxScore: 25 },
    targetOfferSlug: "earned-credibility-intensive",
    targetResourceSlug: "legacy-influence-blueprint",
    explanation: "You are ready to multiply your influence by documenting and teaching the credibility you have earned.",
    ctaText: "Book a 1:1 Call",
    ctaDestination: oneToOneBookingUrl,
    emailSequenceKey: "trusted_choice_resource"
  }
];
