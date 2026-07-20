import { beforeEach, describe, expect, it } from "vitest";

import {
  clearSignupDraft,
  readSignupDraft,
  SIGNUP_DRAFT_STORAGE_KEY,
  writeSignupDraft,
} from "./signup-draft";

const validDraft = {
  fullName: "Made Peserta",
  lineId: "made.peserta",
  whatsapp: "081234567890",
  email: "made@example.com",
  faculty: "FIB",
  batch: "2026",
};

describe("signup draft", () => {
  beforeEach(() => sessionStorage.clear());

  it("stores and restores only the supported non-sensitive fields", () => {
    writeSignupDraft(sessionStorage, validDraft);

    expect(readSignupDraft(sessionStorage)).toEqual(validDraft);
    expect(sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY)).not.toContain("password");
    expect(sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY)).not.toContain("photo");
  });

  it("rejects invalid stored faculty and batch values", () => {
    sessionStorage.setItem(
      SIGNUP_DRAFT_STORAGE_KEY,
      JSON.stringify({ ...validDraft, faculty: "Fakultas Bebas", batch: "20xx" }),
    );

    expect(readSignupDraft(sessionStorage)).toEqual({
      ...validDraft,
      faculty: "",
      batch: "",
    });
  });

  it("ignores malformed storage and can clear a saved draft", () => {
    sessionStorage.setItem(SIGNUP_DRAFT_STORAGE_KEY, "not-json");
    expect(readSignupDraft(sessionStorage)).toBeNull();

    writeSignupDraft(sessionStorage, validDraft);
    clearSignupDraft(sessionStorage);
    expect(readSignupDraft(sessionStorage)).toBeNull();
  });
});
