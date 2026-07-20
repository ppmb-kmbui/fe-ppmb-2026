import { describe, expect, it } from "vitest";

import {
  isNetworkingTargetBatch,
  NETWORKING_BATCH_REQUIREMENTS,
  NETWORKING_FIXED_QUESTIONS,
  NETWORKING_TOTAL_REQUIRED,
} from "./networking-requirements";

describe("networking requirements", () => {
  it("requires 18 friends across the agreed batches", () => {
    expect(NETWORKING_BATCH_REQUIREMENTS).toEqual([
      expect.objectContaining({ batch: 2026, required: 10 }),
      expect.objectContaining({ batch: 2025, required: 4 }),
      expect.objectContaining({ batch: 2024, required: 2 }),
      expect.objectContaining({ batch: 2023, required: 2 }),
    ]);
    expect(NETWORKING_TOTAL_REQUIRED).toBe(18);
  });

  it("allows only the four target batches", () => {
    expect(isNetworkingTargetBatch(2026)).toBe(true);
    expect(isNetworkingTargetBatch(2023)).toBe(true);
    expect(isNetworkingTargetBatch(2022)).toBe(false);
  });

  it("keeps the three fixed prompts from the approved template", () => {
    expect(NETWORKING_FIXED_QUESTIONS).toHaveLength(3);
    expect(NETWORKING_FIXED_QUESTIONS.map(({ code }) => code)).toEqual([
      "study_path_choice",
      "formative_experience",
      "first_year_goal",
    ]);
  });
});
