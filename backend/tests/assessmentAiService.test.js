import { describe, expect, it } from "vitest";
import { applyAiEvidenceScores } from "../services/assessmentAiService.js";

const version = {
  scoringMode: "raw_total",
  scoreDisplayMax: 25,
  aiScoringMode: "evidence_rules",
  categories: [
    { key: "story", name: "Story", weight: 1, displayOrder: 1 },
    { key: "trust", name: "Trust", weight: 1, displayOrder: 2 },
    { key: "positioning", name: "Positioning", weight: 1, displayOrder: 3 },
    { key: "proof", name: "Proof", weight: 1, displayOrder: 4 },
    { key: "resonance", name: "Resonance", weight: 1, displayOrder: 5 }
  ]
};

const scoring = {
  overallScore: 15,
  overallMaxScore: 25,
  categoryScores: [
    { key: "story", name: "Story", weight: 1, pointsEarned: 3, maxPoints: 5, score: 60 },
    { key: "trust", name: "Trust", weight: 1, pointsEarned: 3, maxPoints: 5, score: 60 },
    { key: "positioning", name: "Positioning", weight: 1, pointsEarned: 3, maxPoints: 5, score: 60 },
    { key: "proof", name: "Proof", weight: 1, pointsEarned: 3, maxPoints: 5, score: 60 },
    { key: "resonance", name: "Resonance", weight: 1, pointsEarned: 3, maxPoints: 5, score: 60 }
  ],
  strongestCategory: { key: "story", name: "Story", score: 60 },
  weakestCategory: { key: "story", name: "Story", score: 60 },
  secondWeakestCategory: { key: "trust", name: "Trust", score: 60 },
  scoringSnapshot: { scoringMode: "raw_total", overallMaxScore: 25 }
};

describe("applyAiEvidenceScores", () => {
  it("uses complete high-confidence evidence scores as the final 25-point result", () => {
    const result = applyAiEvidenceScores({
      scoring,
      assessmentVersion: version,
      minimumConfidence: 0.65,
      aiAnalysis: {
        status: "complete",
        confidence: 0.9,
        promptVersion: "earned-credibility-v3",
        categoryEvidence: [
          { key: "story", score: 4, normalizedScore: 80, confidence: 0.8 },
          { key: "trust", score: 3, normalizedScore: 60, confidence: 0.8 },
          { key: "positioning", score: 3, normalizedScore: 60, confidence: 0.8 },
          { key: "proof", score: 4, normalizedScore: 80, confidence: 0.8 },
          { key: "resonance", score: 3, normalizedScore: 60, confidence: 0.8 }
        ]
      }
    });

    expect(result.categoryScores[0]).toMatchObject({ score: 80, baseScore: 60, aiScore: 80, evidencePoints: 4, aiApplied: true });
    expect(result.categoryScores[1]).toMatchObject({ score: 60, baseScore: 60, evidencePoints: 3, aiApplied: true });
    expect(result.overallScore).toBe(17);
    expect(result.strongestCategory.key).toBe("story");
    expect(result.weakestCategory.key).toBe("trust");
    expect(result.scoringSnapshot.scoreSource).toBe("evidence_rubric");
    expect(result.scoringSnapshot.evidenceReview.requiresReview).toBe(false);
  });

  it("uses the self-assessment result when evidence analysis falls back", () => {
    const result = applyAiEvidenceScores({
      scoring,
      assessmentVersion: version,
      aiAnalysis: { status: "fallback", categoryEvidence: [] }
    });

    expect(result.overallScore).toBe(15);
    expect(result.scoringSnapshot.scoreSource).toBe("self_assessment_fallback");
  });

  it("falls back when any required evidence score is missing or below confidence threshold", () => {
    const result = applyAiEvidenceScores({
      scoring,
      assessmentVersion: version,
      minimumConfidence: 0.65,
      aiAnalysis: {
        status: "complete",
        confidence: 0.9,
        promptVersion: "earned-credibility-v3",
        categoryEvidence: [
          { key: "story", score: 4, normalizedScore: 80, confidence: 0.99 },
          { key: "trust", score: 3, normalizedScore: 60, confidence: 0.99 },
          { key: "positioning", score: 3, normalizedScore: 60, confidence: 0.5 },
          { key: "proof", score: 4, normalizedScore: 80, confidence: 0.99 }
        ]
      }
    });

    expect(result.overallScore).toBe(15);
    expect(result.scoringSnapshot.scoreSource).toBe("self_assessment_fallback");
  });
});
