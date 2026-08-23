import { connectDatabase } from "../config/db.js";
import { AssessmentQuestion } from "../models/AssessmentQuestion.js";
import { AssessmentVersion } from "../models/AssessmentVersion.js";
import { Offer } from "../models/Offer.js";
import { RecommendationRule } from "../models/RecommendationRule.js";
import { Resource } from "../models/Resource.js";
import { ScoreRange } from "../models/ScoreRange.js";
import {
  assessmentCategories,
  assessmentV4Questions,
  offers,
  recommendationRules,
  resources,
  scoreRanges
} from "./defaultAssessmentData.js";

await connectDatabase();

const assessment = await AssessmentVersion.findOneAndUpdate(
  { slug: "resonance-quotient-assessment", version: 4 },
  {
    title: "Resonance Quotient Assessment",
    slug: "resonance-quotient-assessment",
    version: 4,
    description:
      "A seven-minute assessment of how visible and trusted the credibility you have already earned is today.",
    estimatedMinutes: 7,
    scoringMode: "raw_total",
    scoreDisplayMax: 25,
    aiScoringWeight: 1,
    aiScoringMode: "evidence_rules",
    aiAnalysisEnabled: true,
    categories: assessmentCategories,
    status: "active",
    activeFrom: new Date()
  },
  { upsert: true, new: true }
);

await AssessmentVersion.updateMany(
  { _id: { $ne: assessment._id }, status: "active" },
  { $set: { status: "archived", activeUntil: new Date() } }
);

for (const question of assessmentV4Questions) {
  await AssessmentQuestion.findOneAndUpdate(
    { assessmentVersion: assessment._id, key: question.key },
    {
      assessmentVersion: assessment._id,
      weight: 1,
      required: true,
      scored: true,
      active: true,
      versionNumber: 4,
      ...question
    },
    { upsert: true, new: true }
  );
}

await AssessmentQuestion.updateMany(
  {
    assessmentVersion: assessment._id,
    key: { $nin: assessmentV4Questions.map((question) => question.key) }
  },
  { active: false }
);

for (const range of scoreRanges) {
  await ScoreRange.findOneAndUpdate({ name: range.name }, range, { upsert: true, new: true });
}

await ScoreRange.updateMany(
  { name: { $nin: scoreRanges.map((range) => range.name) } },
  { active: false }
);

const offerBySlug = new Map();
for (const offer of offers) {
  const savedOffer = await Offer.findOneAndUpdate({ slug: offer.slug }, offer, { upsert: true, new: true });
  offerBySlug.set(savedOffer.slug, savedOffer);
}

await Offer.updateMany(
  { slug: { $nin: offers.map((offer) => offer.slug) } },
  { active: false }
);

const resourceBySlug = new Map();
for (const resource of resources) {
  const savedResource = await Resource.findOneAndUpdate(
    { slug: resource.slug },
    {
      ...resource,
      relatedOffer: offerBySlug.get("earned-credibility-intensive")?._id
    },
    { upsert: true, new: true }
  );
  resourceBySlug.set(savedResource.slug, savedResource);
}

await Resource.updateMany(
  { slug: { $nin: resources.map((resource) => resource.slug) } },
  { active: false }
);

for (const rule of recommendationRules) {
  const { targetOfferSlug, targetResourceSlug, ...ruleData } = rule;
  await RecommendationRule.findOneAndUpdate(
    { name: rule.name },
    {
      ...ruleData,
      offer: targetOfferSlug ? offerBySlug.get(targetOfferSlug)?._id : undefined,
      resource: targetResourceSlug ? resourceBySlug.get(targetResourceSlug)?._id : undefined,
      active: true
    },
    { upsert: true, new: true }
  );
}

await RecommendationRule.updateMany(
  { name: { $nin: recommendationRules.map((rule) => rule.name) } },
  { active: false }
);

console.log("Seeded assessment version, questions, score ranges, offers, resources, and rules.");
process.exit(0);
