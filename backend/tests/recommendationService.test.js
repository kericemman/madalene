import { describe, expect, it } from "vitest";
import { ruleMatchesContext } from "../services/recommendationService.js";

describe("ruleMatchesContext", () => {
  it("matches score and weakest category criteria", () => {
    const rule = {
      criteria: {
        minScore: 11,
        maxScore: 15,
        weakestCategories: ["positioning"]
      }
    };

    expect(
      ruleMatchesContext(rule, {
        overallScore: 13,
        weakestCategory: { key: "positioning" }
      })
    ).toBe(true);
  });

  it("rejects rules when contextual criteria do not match", () => {
    const rule = {
      criteria: {
        minScore: 21,
        maxScore: 25,
        readinessToInvest: ["ready"]
      }
    };

    expect(
      ruleMatchesContext(rule, {
        overallScore: 23,
        readinessToInvest: "not_ready"
      })
    ).toBe(false);
  });
});
