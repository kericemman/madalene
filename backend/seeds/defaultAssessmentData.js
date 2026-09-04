const oneToOneBookingUrl = "https://calendly.com/wambui-magdalene/content-that-connects";

const paragraph = (value) => `<p style="margin:0 0 16px;">${value}</p>`;
const heading = (value) =>
  `<h2 style="margin:26px 0 12px;color:#0F4D3E;font-size:20px;line-height:1.25;">${value}</h2>`;
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
      recommendedResourceTitle: "Story Clarity Workbook™",
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
      recommendedResourceTitle: "Trust Signals Checklist™",
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
      recommendedResourceTitle: "Positioning Canvas™",
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
      recommendedResourceTitle: "Resonance Playbook™",
      finalNote:
        "This is where trust becomes emotional rather than transactional. Your perspective is beginning to shape how others think and feel."
    },
    displayOrder: 4
  },
  {
    name: "Trusted Choice™",
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
      recommendedResourceTitle: "Legacy Influence Blueprint™",
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
    title: "Story Clarity Workbook™",
    slug: "story-clarity-workbook",
    description: "Discover the lived experiences that make you the Trusted Choice™.",
    resourceType: "workbook",
    free: true,
    emailGated: true,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Hidden Credibility",
    relatedWeakestCategory: "story",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Story Clarity Workbook",
      preheader: "Discover the lived experiences that make you the Trusted Choice™.",
      title: "Story Clarity Workbook™",
      focus: "Story",
      sections: [
        { type: "paragraph", value: "Your story is not your biography. Most practitioners think their story begins with qualifications: where they studied, what they specialise in, and how many years they have been practising." },
        { type: "paragraph", value: "That is not where your story begins. Your story began with the experiences that shaped how you see people, how you solve problems, and why you care so deeply about the work you do." },
        { type: "paragraph", value: "Those experiences became your perspective. Your perspective became your approach. Your approach became your credibility." },
        { type: "heading", value: "Before You Begin" },
        { type: "paragraph", value: "You are not trying to write an inspirational story. You are uncovering the experiences that answer one strategic question: why should someone trust me?" },
        { type: "paragraph", value: "Be honest. Do not write what sounds impressive. Write what is true." },
        { type: "heading", value: "What Is Story Clarity™?" },
        { type: "paragraph", value: "Story Clarity™ is the ability to clearly communicate the lived experiences that shaped the practitioner you have become." },
        { type: "paragraph", value: "It is not about sharing everything. It is about recognising which experiences created the wisdom people are actually buying. People do not buy your story. They buy the perspective your story created." },
        { type: "heading", value: "Exercise One: Why Do You Really Do This Work?" },
        { type: "list", items: ["I first became interested in this work because...", "The experience that changed how I see people was...", "The reason I still do this work today is..."] },
        { type: "paragraph", value: "Looking at your answers, what patterns do you notice? Circle the themes that appear repeatedly: healing, resilience, family, leadership, loss, faith, service, identity, courage, justice, hope, belonging, and transformation." },
        { type: "heading", value: "Exercise Two: The Moments That Changed You" },
        { type: "paragraph", value: "List five experiences that fundamentally changed how you see life. They do not need to be dramatic. Sometimes the quiet moments shape us the most." },
        { type: "list", items: ["What happened?", "How did it change you?", "What belief did it create?", "How does that belief influence the way you serve clients today?"] },
        { type: "heading", value: "Exercise Three: What Have You Earned?" },
        { type: "paragraph", value: "People often list qualifications. In this exercise, list wisdom." },
        { type: "list", items: ["Because I have experienced...", "I now understand...", "Repeat this five times."] },
        { type: "heading", value: "Exercise Four: Your Credibility Timeline" },
        { type: "list", items: ["Defining moments", "Challenges", "Breakthroughs", "Turning points", "Decisions", "Successes"] },
        { type: "paragraph", value: "Ask yourself: what did each experience teach me that no qualification ever could?" },
        { type: "heading", value: "Exercise Five: The Lessons People Pay For" },
        { type: "paragraph", value: "Your clients are not paying for your past. They are paying for what your past allows you to see. List ten lessons you have earned through experience, then highlight the three your ideal client would benefit from most." },
        { type: "heading", value: "Exercise Six: Your Unique Perspective" },
        { type: "list", items: ["Most people believe...", "I believe...", "Repeat this five times."] },
        { type: "paragraph", value: "These beliefs become your thought leadership." },
        { type: "heading", value: "Exercise Seven: Your Story Is Not About You" },
        { type: "paragraph", value: "For every important experience you have listed, answer this question: how does this help someone else? Never stop at the event. Always connect it to service." },
        { type: "heading", value: "Story Filter" },
        { type: "checklist", items: ["Does this experience explain why I care?", "Does it explain why people trust me?", "Does it help someone feel understood?", "Does it support my positioning?", "Does it create hope?"] },
        { type: "paragraph", value: "If not, it probably belongs in your journal, not your brand." },
        { type: "heading", value: "Your Story Statement" },
        { type: "list", items: ["The experiences that shaped me taught me...", "Because of that...", "I help..."] },
        { type: "heading", value: "Your Earned Credibility™" },
        { type: "list", items: ["People trust me because...", "Not because of my qualifications.", "Because..."] },
        { type: "heading", value: "What Is Next?" },
        { type: "paragraph", value: "Story Clarity is only one part of becoming the Trusted Choice™. The next step is understanding how your story, positioning, trust, proof, and resonance work together." },
        { type: "paragraph", value: "YOU'VE SEEN THE GAP. Make your expertise easy to understand. Turn what you know into a brand people immediately understand and remember." },
        { type: "paragraph", value: "Close My Credibility Gap →" }
      ]
    })
  },
  {
    title: "Trust Signals Checklist™",
    slug: "trust-signals-checklist",
    description: "Make your earned credibility visible before a prospective client ever speaks to you.",
    resourceType: "checklist",
    free: true,
    emailGated: true,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Emerging Credibility",
    relatedWeakestCategory: "trust",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Trust Signals Checklist",
      preheader: "Review the visible evidence that helps people trust you before they contact you.",
      title: "Trust Signals Checklist™",
      focus: "Trust",
      sections: [
        { type: "paragraph", value: "Trust is not claimed. It is recognised. Many practitioners have earned deep credibility through years of experience, transformed lives, and meaningful work, yet very little of that credibility is visible." },
        { type: "paragraph", value: "People cannot trust what they cannot see. This checklist helps you identify the trust signals that strengthen your reputation before a prospective client ever speaks to you." },
        { type: "heading", value: "What Are Trust Signals?" },
        { type: "paragraph", value: "Trust signals are the visible pieces of evidence that help people feel confident choosing you. They answer questions like: can I trust this practitioner, have they helped people like me, do they understand my situation, and why should I choose them?" },
        { type: "paragraph", value: "Strong trust signals reduce uncertainty. They help people make confident decisions." },
        { type: "heading", value: "Trust Signal 1: A Clear Positioning Statement" },
        { type: "checklist", items: ["I clearly define who I serve.", "My positioning focuses on transformation, not services.", "My headline is specific.", "My messaging is consistent across platforms."] },
        { type: "heading", value: "Trust Signal 2: A Compelling Story" },
        { type: "paragraph", value: "People do not trust practitioners because of perfect stories. They trust practitioners whose experiences help them feel understood." },
        { type: "checklist", items: ["My story explains why I do this work.", "My lived experience supports my expertise.", "I connect my story to my clients' challenges.", "I consistently share meaningful experiences."] },
        { type: "heading", value: "Trust Signal 3: Evidence of Transformation" },
        { type: "checklist", items: ["I regularly share client success stories.", "I have written testimonials.", "I can describe measurable outcomes.", "My examples demonstrate real transformation."] },
        { type: "heading", value: "Trust Signal 4: Visible Proof" },
        { type: "checklist", items: ["My certifications are relevant and current.", "My awards or recognition are visible.", "I highlight meaningful achievements.", "I showcase speaking engagements, publications, or media where relevant."] },
        { type: "heading", value: "Trust Signal 5: Consistent Thought Leadership" },
        { type: "checklist", items: ["My content teaches, not just promotes.", "I share original ideas.", "I challenge common misconceptions.", "I consistently reinforce my philosophy."] },
        { type: "heading", value: "Trust Signal 6: A Cohesive Online Presence" },
        { type: "checklist", items: ["My profile photo is professional.", "My banner communicates my positioning.", "My About section reflects my philosophy.", "My Featured section guides visitors to the next step."] },
        { type: "heading", value: "Trust Signal 7: Social Proof" },
        { type: "paragraph", value: "People trust what others say about you more than what you say about yourself." },
        { type: "checklist", items: ["I have client recommendations.", "I showcase testimonials.", "I highlight meaningful client feedback.", "I regularly collect new proof."] },
        { type: "heading", value: "Trust Signal 8: Consistency" },
        { type: "checklist", items: ["My message remains consistent.", "My visuals are consistent.", "My tone is consistent.", "My content reflects my positioning."] },
        { type: "heading", value: "Reflection" },
        { type: "paragraph", value: "Look back through the checklist. Which trust signal needs the most attention? Write one commitment for the next 30 days." },
        { type: "heading", value: "Remember" },
        { type: "paragraph", value: "People rarely choose the practitioner with the longest list of qualifications. They choose the practitioner whose credibility they can clearly recognise." },
        { type: "paragraph", value: "Every trust signal you strengthen reduces uncertainty. Every trust signal you reveal increases confidence." },
        { type: "heading", value: "Your Next Step" },
        { type: "paragraph", value: "Trust is only one pillar of Earned Credibility™. The next step is understanding how your story, positioning, proof, and resonance work together." },
        { type: "paragraph", value: "YOU'VE SEEN THE GAP. Make your credibility easier to trust. Turn the proof you have earned into reasons people feel confident choosing you." },
        { type: "paragraph", value: "Close My Credibility Gap →" }
      ]
    })
  },
  {
    title: "Positioning Canvas™",
    slug: "positioning-canvas",
    description: "Become the practitioner people naturally choose because they understand why you are the right fit.",
    resourceType: "workbook",
    free: true,
    emailGated: true,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Visible Credibility",
    relatedWeakestCategory: "positioning",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Positioning Canvas",
      preheader: "Define what makes your approach different and memorable.",
      title: "Positioning Canvas™",
      focus: "Positioning",
      sections: [
        { type: "paragraph", value: "People do not choose the best practitioner. They choose the practitioner they understand." },
        { type: "paragraph", value: "Most practitioners struggle because they are trying to explain everything they do. Strong positioning does the opposite. It creates clarity." },
        { type: "paragraph", value: "This workbook helps you answer three questions with confidence: who do you help, what transformation do you create, and why should someone choose you?" },
        { type: "heading", value: "What Is Positioning?" },
        { type: "paragraph", value: "Positioning is not your job title. It is not your qualifications. It is not your services. Positioning is the reason someone chooses you instead of another practitioner." },
        { type: "list", items: ["People understand your value faster.", "Referrals become easier.", "Content becomes easier to create.", "You stop competing on price.", "Trust grows naturally."] },
        { type: "heading", value: "Exercise 1: Who Do You Serve?" },
        { type: "paragraph", value: "Be specific. Avoid broad answers like everyone or anyone who needs help." },
        { type: "list", items: ["I primarily help...", "What stage are they in?", "What situation makes them ready for your work?"] },
        { type: "heading", value: "Exercise 2: What Problem Do You Solve?" },
        { type: "paragraph", value: "Think beyond symptoms. What problem do your clients believe they have, and what problem are they actually experiencing?" },
        { type: "list", items: ["Surface problem:", "Real problem:", "What do they need to understand differently?"] },
        { type: "heading", value: "Exercise 3: What Is the Cost of Doing Nothing?" },
        { type: "list", items: ["Professionally, what happens if they do not solve it?", "Personally, what happens?", "Emotionally, what happens?"] },
        { type: "heading", value: "Exercise 4: What Is Their Dream Outcome?" },
        { type: "paragraph", value: "When your work is successful, what becomes possible? Complete the sentence: my clients leave with..." },
        { type: "heading", value: "Exercise 5: Why You?" },
        { type: "paragraph", value: "This is where most practitioners become generic. List five things that make your approach different." },
        { type: "list", items: ["Your lived experiences", "Your philosophy", "Your process", "Your values", "Your perspective"] },
        { type: "heading", value: "Exercise 6: Your Perspective" },
        { type: "paragraph", value: "People remember ideas, not information. Complete these sentences three times: most people believe... I believe..." },
        { type: "heading", value: "Exercise 7: Your Earned Credibility™" },
        { type: "list", items: ["People trust me because...", "Not because I have...", "But because..."] },
        { type: "heading", value: "Exercise 8: Your Positioning Statement" },
        { type: "list", items: ["I help...", "Who want to...", "By...", "So they can...", "Now rewrite it naturally."] },
        { type: "heading", value: "Positioning Checklist" },
        { type: "checklist", items: ["Can someone immediately understand who you help?", "Can they understand what problem you solve?", "Can they understand what transformation you create?", "Can they understand why you are different?", "Can they understand why they should trust you?"] },
        { type: "heading", value: "Reflection" },
        { type: "paragraph", value: "Positioning is not about sounding impressive. It is about becoming memorable." },
        { type: "paragraph", value: "When people understand exactly who you help and why your approach is different, they stop comparing you to everyone else. That is when trust begins." },
        { type: "heading", value: "Your Next Step" },
        { type: "paragraph", value: "Positioning is one pillar of Earned Credibility™. The next step is understanding how your positioning works together with your story, proof, trust, and resonance." },
        { type: "paragraph", value: "YOU'VE SEEN THE GAP. Become the clear why you. Position your expertise so the right people understand why you are the choice, not just another option." },
        { type: "paragraph", value: "Close My Credibility Gap →" }
      ]
    })
  },
  {
    title: "Proof Library™",
    slug: "proof-library",
    description: "Organise the evidence that helps people trust the quality, depth, and impact of your work.",
    resourceType: "workbook",
    free: true,
    emailGated: true,
    category: "Earned Credibility",
    relatedWeakestCategory: "proof",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Proof Library",
      preheader: "Gather the proof you have already earned so people can see it.",
      title: "Proof Library™",
      focus: "Proof",
      sections: [
        { type: "paragraph", value: "You have already earned credibility through your work. The question is whether other people can see it quickly enough to trust you." },
        { type: "paragraph", value: "Proof is the bridge between what you know you can do and what a prospective client can confidently believe about you." },
        { type: "heading", value: "What Counts as Proof?" },
        { type: "paragraph", value: "Proof is not limited to dramatic before-and-after claims. It includes the evidence, stories, examples, recognition, and repeated outcomes that show your expertise has created real value." },
        { type: "heading", value: "Part 1: Client Success" },
        { type: "list", items: ["What transformations have your clients experienced?", "Which client stories best represent the impact of your work?", "What results are you most proud of?", "What outcomes do clients repeatedly mention after working with you?"] },
        { type: "heading", value: "Part 2: Client Feedback" },
        { type: "list", items: ["What compliments do you hear most often?", "Do you have testimonials that reflect the experience of working with you?", "Are there reviews or recommendations you have not shared?", "What language do clients use when describing your value?"] },
        { type: "heading", value: "Part 3: Professional Recognition" },
        { type: "list", items: ["Awards, certifications, or industry recognition", "Speaking, podcasts, publications, or media features", "Achievements that demonstrate experience and credibility", "Communities, brands, or events that have trusted your voice"] },
        { type: "heading", value: "Part 4: Story-Based Proof" },
        { type: "paragraph", value: "Not every proof point needs a statistic. Some proof lives in a specific story that shows how you think, what you notice, and how your approach creates change." },
        { type: "list", items: ["What was the client struggling to understand?", "What did your approach help them see differently?", "What shifted because of the work?", "What does this story prove about your credibility?"] },
        { type: "heading", value: "Part 5: Build Your Proof Library" },
        { type: "checklist", items: ["Client testimonials", "Client success stories", "Case studies", "Reviews", "Awards or recognition", "Speaking engagements", "Media features", "Qualifications and certifications", "Original frameworks or methods", "Screenshots of meaningful feedback", "Examples of client language and repeated themes"] },
        { type: "heading", value: "Reflection" },
        { type: "paragraph", value: "Your proof should make your credibility easier to recognise, not simply make your brand look busier. Choose evidence that helps the right person feel safer trusting you." },
        { type: "paragraph", value: "YOU'VE SEEN THE GAP. Make your impact visible. Turn the evidence you have earned into reasons people can believe, remember, and choose you." },
        { type: "paragraph", value: "Close My Credibility Gap →" }
      ]
    })
  },
  {
    title: "Resonance Playbook™",
    slug: "resonance-playbook",
    description: "Create content that people do not just consume. They remember it.",
    resourceType: "playbook",
    free: true,
    emailGated: true,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Resonant Credibility",
    relatedWeakestCategory: "resonance",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Resonance Playbook",
      preheader: "Create content that people do not just consume. They remember it.",
      title: "Resonance Playbook™",
      focus: "Resonance",
      sections: [
        { type: "paragraph", value: "Visibility gets attention. Resonance creates impact." },
        { type: "paragraph", value: "Many practitioners focus on being seen: posting more, sharing more, doing more. But being seen is not the same as being remembered." },
        { type: "paragraph", value: "People remember how you made them feel, how you helped them think differently, and how you changed the way they understood themselves. That is resonance." },
        { type: "heading", value: "What Is Resonance?" },
        { type: "paragraph", value: "Resonance is what remains after the conversation ends. It is the lasting impression your ideas, your story, and your presence leave behind." },
        { type: "paragraph", value: "It is why someone thinks of you months later, recommends you without being asked, and brings your name into rooms you have never entered." },
        { type: "heading", value: "The Resonance Formula" },
        { type: "list", items: ["What you believe", "Why you believe it", "Who you serve", "How you help", "What makes you different"] },
        { type: "paragraph", value: "When those five elements align, people stop consuming your content. They start remembering you." },
        { type: "heading", value: "Exercise 1: What Do You Want To Be Remembered For?" },
        { type: "list", items: ["When people think of my work, I want them to remember...", "Would my current content lead someone to that conclusion?", "What would need to become clearer?"] },
        { type: "heading", value: "Exercise 2: Your Core Beliefs" },
        { type: "paragraph", value: "People rarely remember information. They remember conviction." },
        { type: "list", items: ["Most practitioners believe...", "I believe...", "Because...", "Repeat this exercise three times."] },
        { type: "heading", value: "Exercise 3: The Ideas You Want To Own" },
        { type: "paragraph", value: "Every recognised expert becomes associated with a handful of ideas. List the five ideas you want people to associate with your name." },
        { type: "heading", value: "Exercise 4: Your Emotional Signature" },
        { type: "checklist", items: ["Understood", "Hopeful", "Inspired", "Calm", "Confident", "Seen", "Empowered", "Encouraged", "Challenged", "Curious"] },
        { type: "heading", value: "Exercise 5: The Stories People Remember" },
        { type: "paragraph", value: "Which three stories do people consistently respond to? Name each story, then write why you believe it resonates." },
        { type: "heading", value: "Exercise 6: The Conversations You Want To Start" },
        { type: "list", items: ["I want people to question...", "I want people to believe...", "I want people to stop believing..."] },
        { type: "heading", value: "Exercise 7: Resonance Audit" },
        { type: "checklist", items: ["Did I teach something original?", "Did I share a meaningful perspective?", "Did I include a story?", "Did I create emotion?", "Would someone remember this tomorrow?"] },
        { type: "paragraph", value: "If not, it may be visible, but it is not yet resonant." },
        { type: "heading", value: "The Resonance Commitment" },
        { type: "list", items: ["From today, I choose to become known for...", "The belief I will consistently communicate is...", "The people I want to impact are..."] },
        { type: "heading", value: "Final Reflection" },
        { type: "paragraph", value: "You do not become unforgettable by saying more. You become unforgettable by saying the same meaningful things consistently." },
        { type: "paragraph", value: "That is how trust grows. That is how movements begin. That is how practitioners become the Trusted Choice™." },
        { type: "heading", value: "Your Next Step" },
        { type: "paragraph", value: "Resonance is the final pillar of Earned Credibility™. When your story is clear, your positioning is focused, your proof is visible, and your trust is earned, resonance becomes the natural result." },
        { type: "paragraph", value: "YOU'VE SEEN THE GAP. Become recognisable, not just visible. Build a brand people remember, associate with distinct ideas, and come back to." },
        { type: "paragraph", value: "Close My Credibility Gap →" }
      ]
    })
  },
  {
    title: "Legacy Influence Blueprint™",
    slug: "legacy-influence-blueprint",
    description: "Document the frameworks, ideas and resources that multiply your influence.",
    resourceType: "blueprint",
    free: true,
    emailGated: true,
    category: "Earned Credibility",
    relatedAssessmentScoreRange: "Trusted Choice™",
    active: true,
    emailDelivery: resourceEmail({
      subject: "Your Legacy Influence Blueprint",
      preheader: "Your next chapter is multiplying the credibility you have already earned.",
      title: "Legacy Influence Blueprint™",
      focus: "Trusted Choice",
      sections: [
        { type: "paragraph", value: "Visibility fades. Influence endures." },
        { type: "paragraph", value: "Many practitioners spend years trying to become more visible. Few stop to ask a more important question: what do I want people to remember long after they have left my profile, my practice, or my content?" },
        { type: "paragraph", value: "Legacy is not built by reaching more people. It is built by leaving people changed." },
        { type: "heading", value: "What Is Legacy Influence?" },
        { type: "paragraph", value: "Legacy Influence is the lasting impact your ideas, values, and work continue to have after you have shared them. It is not measured by followers. It is measured by the lives you have shaped." },
        { type: "paragraph", value: "When people remember your message, repeat your ideas, recommend your work, or change the way they practise because of something you taught, that is legacy." },
        { type: "heading", value: "Exercise 1: What Do You Want To Be Known For?" },
        { type: "list", items: ["When people hear my name, I want them to think of...", "The problem I want to be remembered for solving is...", "The change I want to create is..."] },
        { type: "heading", value: "Exercise 2: Define Your Philosophy" },
        { type: "list", items: ["Most people believe...", "I believe...", "Because...", "Repeat this exercise three times."] },
        { type: "heading", value: "Exercise 3: The Ideas You Want To Own" },
        { type: "paragraph", value: "List five ideas you want to become synonymous with your name. These become the foundation of your thought leadership." },
        { type: "heading", value: "Exercise 4: Your Signature Framework" },
        { type: "list", items: ["What framework, philosophy, or approach do you want your name associated with?", "Why does it matter?", "How does it change people's lives?"] },
        { type: "heading", value: "Exercise 5: The Ripple Effect" },
        { type: "paragraph", value: "Imagine someone experiences your work today. Five years from now, what will still be true because they met you?" },
        { type: "heading", value: "Exercise 6: Influence Beyond Content" },
        { type: "paragraph", value: "Influence is not limited to social media. How will your ideas continue to live through clients, books, workshops, speaking, community, mentoring, research, or another form of contribution?" },
        { type: "heading", value: "Exercise 7: Your Legacy Statement" },
        { type: "list", items: ["I want my life's work to be remembered because...", "The contribution I hope to leave behind is..."] },
        { type: "heading", value: "Reflection" },
        { type: "paragraph", value: "Legacy is not something you build at the end of your career. It is built every day through the ideas you consistently share and the people you consistently serve." },
        { type: "paragraph", value: "Ask yourself: am I creating content, or am I building a body of work?" },
        { type: "heading", value: "Your Blueprint" },
        { type: "list", items: ["My audience:", "The problem I solve:", "The belief I champion:", "The framework I teach:", "The transformation I create:", "The legacy I hope to leave:"] },
        { type: "heading", value: "Final Reflection" },
        { type: "paragraph", value: "Your qualifications may open doors. Your expertise may transform lives. But your legacy will be shaped by the ideas that continue to influence people long after you have spoken them." },
        { type: "paragraph", value: "The Trusted Choice is not only selected. The Trusted Choice shapes how others think, feel, and decide." },
        { type: "paragraph", value: "Close My Credibility Gap →" }
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
