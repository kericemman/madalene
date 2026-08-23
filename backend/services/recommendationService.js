import { RecommendationRule } from "../models/RecommendationRule.js";
import { ScoreRange } from "../models/ScoreRange.js";
import { normalizeMatchValue } from "./assessmentScoringService.js";

const hasNoValues = (values) => !values || values.length === 0;

const listMatches = (criteriaValues, actualValue) => {
  if (hasNoValues(criteriaValues)) return true;
  const normalizedActual = normalizeMatchValue(actualValue);
  return criteriaValues.map(normalizeMatchValue).includes(normalizedActual);
};

export const findScoreRange = async (score) =>
  ScoreRange.findOne({
    active: true,
    minScore: { $lte: score },
    maxScore: { $gte: score }
  })
    .sort({ displayOrder: 1, minScore: 1 })
    .lean();

export const ruleMatchesContext = (rule, context) => {
  const criteria = rule.criteria || {};

  if (criteria.minScore !== undefined && context.overallScore < criteria.minScore) return false;
  if (criteria.maxScore !== undefined && context.overallScore > criteria.maxScore) return false;
  if (!listMatches(criteria.weakestCategories, context.weakestCategory?.key)) return false;
  if (!listMatches(criteria.secondWeakestCategories, context.secondWeakestCategory?.key)) return false;
  if (!listMatches(criteria.professions, context.profession)) return false;
  if (!listMatches(criteria.businessStages, context.businessStage)) return false;
  if (!listMatches(criteria.primaryChallenges, context.primaryChallenge)) return false;
  if (!listMatches(criteria.readinessToInvest, context.readinessToInvest)) return false;
  if (!listMatches(criteria.desiredOutcomes, context.desiredOutcome)) return false;

  return true;
};

export const selectRecommendationRule = async (context) => {
  const rules = await RecommendationRule.find({ active: true })
    .sort({ priority: -1, createdAt: 1 })
    .populate("offer", "name slug price currency ctaText ctaType ctaUrl")
    .populate("resource", "title slug description resourceType fileUrl externalUrl emailDelivery")
    .lean();

  return rules.find((rule) => ruleMatchesContext(rule, context)) || null;
};

export const buildRecommendationSnapshot = (rule) => {
  if (!rule) return null;

  return {
    rule: rule._id,
    offer: rule.offer?._id,
    resource: rule.resource?._id,
    explanation: rule.explanation,
    ctaText: rule.ctaText,
    ctaDestination: rule.ctaDestination,
    secondaryAction: rule.secondaryAction,
    emailSequenceKey: rule.emailSequenceKey
  };
};
