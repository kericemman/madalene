import { describe, expect, it } from "vitest";
import { env } from "../config/env.js";
import { hashToken, hashTokenCandidates, legacyHashToken } from "../utils/tokenUtils.js";

describe("tokenUtils", () => {
  it("uses a keyed result-token hash when RESULT_TOKEN_SECRET is configured", () => {
    const originalSecret = env.resultTokenSecret;
    env.resultTokenSecret = "0123456789abcdef0123456789abcdef";

    const token = "rq_example-token";
    const keyedHash = hashToken(token);
    const legacyHash = legacyHashToken(token);

    env.resultTokenSecret = originalSecret;

    expect(keyedHash).toHaveLength(64);
    expect(keyedHash).not.toBe(legacyHash);
  });

  it("keeps legacy hash candidates available for older result links", () => {
    const originalSecret = env.resultTokenSecret;
    env.resultTokenSecret = "fedcba9876543210fedcba9876543210";

    const token = "rq_legacy-compatible-token";
    const keyedHash = hashToken(token);
    const candidates = hashTokenCandidates(token);

    env.resultTokenSecret = originalSecret;

    expect(candidates).toContain(keyedHash);
    expect(candidates).toContain(legacyHashToken(token));
  });
});
