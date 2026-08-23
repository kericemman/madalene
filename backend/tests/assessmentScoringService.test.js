import { describe, expect, it } from "vitest";
import { calculateAssessmentScore, validateAssessmentAnswers } from "../services/assessmentScoringService.js";
import {
  assessmentCategories,
  assessmentQuestions,
  assessmentV2Questions,
  assessmentV3Questions,
  assessmentV4Questions
} from "../seeds/defaultAssessmentData.js";

const assessmentVersion = {
  _id: "assessment-version-1",
  version: 1,
  categories: assessmentCategories
};

const questions = assessmentQuestions.map((question) => ({
  _id: question.key,
  weight: 1,
  required: true,
  scored: true,
  active: true,
  versionNumber: 1,
  ...question
}));

const scoredQuestions = questions.filter((question) => question.scored);

const answersFor = (defaultValue, overrides = {}) =>
  scoredQuestions.map((question) => ({
    questionKey: question.key,
    value: overrides[question.key] ?? defaultValue
  }));

describe("calculateAssessmentScore", () => {
  it("returns 100 when every scored answer receives the highest score", () => {
    const result = calculateAssessmentScore({
      assessmentVersion,
      questions,
      answers: answersFor("5")
    });

    expect(result.overallScore).toBe(100);
    expect(result.categoryScores).toHaveLength(5);
    expect(result.categoryScores.every((category) => category.score === 100)).toBe(true);
  });

  it("identifies weakest and strongest categories from weighted scores", () => {
    const result = calculateAssessmentScore({
      assessmentVersion,
      questions,
      answers: answersFor("5", {
        positioning: "1"
      })
    });

    expect(result.overallScore).toBe(84);
    expect(result.weakestCategory.key).toBe("positioning");
    expect(result.weakestCategory.score).toBe(20);
    expect(result.strongestCategory.score).toBe(100);
  });

  it("supports raw 25-point Resonance Quotient scoring", () => {
    const result = calculateAssessmentScore({
      assessmentVersion: {
        ...assessmentVersion,
        scoringMode: "raw_total",
        scoreDisplayMax: 25
      },
      questions,
      answers: answersFor("4", {
        proof: "2"
      })
    });

    expect(result.overallScore).toBe(18);
    expect(result.overallMaxScore).toBe(25);
    expect(result.scoringSnapshot.scoringMode).toBe("raw_total");
    expect(result.weakestCategory.key).toBe("proof");
  });
});

describe("validateAssessmentAnswers", () => {
  it("returns errors for missing required questions", () => {
    const errors = validateAssessmentAnswers({
      questions,
      answers: answersFor("4").slice(0, 3)
    });

    expect(errors.length).toBeGreaterThan(0);
  });

  it("returns errors for invalid option values", () => {
    const errors = validateAssessmentAnswers({
      questions,
      answers: answersFor("not-a-real-option")
    });

    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("assessment V2", () => {
  const v2Questions = assessmentV2Questions.map((question) => ({
    _id: question.key,
    weight: 1,
    required: true,
    scored: true,
    active: true,
    versionNumber: 2,
    ...question
  }));

  it("keeps the enhanced diagnostic on the existing 25-point scale", () => {
    const result = calculateAssessmentScore({
      assessmentVersion: {
        _id: "assessment-version-2",
        version: 2,
        scoringMode: "raw_total",
        scoreDisplayMax: 25,
        categories: assessmentCategories
      },
      questions: v2Questions,
      answers: v2Questions.map((question) => ({
        questionKey: question.key,
        value: question.scored === false ? "A specific, evidence-based response that gives the assessment enough context to interpret." : question.options.at(-1).value
      }))
    });

    expect(result.overallScore).toBe(25);
    expect(result.overallMaxScore).toBe(25);
    expect(result.categoryScores.every((category) => category.score === 100)).toBe(true);
  });
});

describe("canonical assessment V3", () => {
  const v3Questions = assessmentV3Questions.map((question) => ({
    _id: question.key,
    required: true,
    scored: true,
    active: true,
    versionNumber: 3,
    ...question
  }));

  it("uses 25 five-point statements while preserving a 25-point Resonance Quotient", () => {
    const result = calculateAssessmentScore({
      assessmentVersion: {
        _id: "assessment-version-3",
        version: 3,
        scoringMode: "raw_total",
        scoreDisplayMax: 25,
        categories: assessmentCategories
      },
      questions: v3Questions,
      answers: v3Questions.map((question) => ({ questionKey: question.key, value: "5" }))
    });

    expect(v3Questions).toHaveLength(25);
    expect(result.overallScore).toBe(25);
    expect(result.overallMaxScore).toBe(25);
    expect(result.categoryScores.every((category) => category.pointsEarned === 5)).toBe(true);
  });
});

describe("evidence-scored assessment V4", () => {
  const v4Questions = assessmentV4Questions.map((question) => ({
    _id: question.key,
    required: true,
    scored: true,
    active: true,
    versionNumber: 4,
    ...question
  }));
  const evidenceAnswer = "I can point to a specific example from my work, explain why it matters, and connect it to the people I serve.";

  it("keeps the 25 approved statements as self-assessment and requires five evidence responses", () => {
    const result = calculateAssessmentScore({
      assessmentVersion: {
        _id: "assessment-version-4",
        version: 4,
        scoringMode: "raw_total",
        scoreDisplayMax: 25,
        categories: assessmentCategories
      },
      questions: v4Questions,
      answers: v4Questions.map((question) => ({
        questionKey: question.key,
        value: question.answerType === "long_text" ? evidenceAnswer : "5"
      }))
    });

    expect(v4Questions).toHaveLength(30);
    expect(v4Questions.filter((question) => question.aiScored)).toHaveLength(5);
    expect(result.overallScore).toBe(25);
    expect(result.responses.filter((response) => response.answerType === "long_text")).toHaveLength(5);
  });

  it("rejects vague evidence that does not meet the minimum response length", () => {
    const errors = validateAssessmentAnswers({
      questions: v4Questions,
      answers: v4Questions.map((question) => ({
        questionKey: question.key,
        value: question.answerType === "long_text" ? "I help people." : "4"
      }))
    });

    expect(errors.filter((error) => error.questionKey.endsWith("-evidence"))).toHaveLength(5);
  });
});
