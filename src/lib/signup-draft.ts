import { isFaculty } from "@/lib/faculty";

export const SIGNUP_DRAFT_STORAGE_KEY = "ppmb-signup-draft-v1";

export interface SignupDraft {
  fullName: string;
  lineId: string;
  whatsapp: string;
  email: string;
  faculty: string;
  batch: string;
}

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;
type RemovableStorage = Pick<Storage, "removeItem">;

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function readSignupDraft(storage: ReadableStorage): SignupDraft | null {
  const storedDraft = storage.getItem(SIGNUP_DRAFT_STORAGE_KEY);
  if (!storedDraft) return null;

  try {
    const parsed: unknown = JSON.parse(storedDraft);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const values = parsed as Record<string, unknown>;
    const storedFaculty = stringValue(values.faculty);
    const storedBatch = stringValue(values.batch);

    return {
      fullName: stringValue(values.fullName),
      lineId: stringValue(values.lineId),
      whatsapp: stringValue(values.whatsapp),
      email: stringValue(values.email),
      faculty: isFaculty(storedFaculty) ? storedFaculty : "",
      batch: /^\d*$/.test(storedBatch) ? storedBatch : "",
    };
  } catch {
    return null;
  }
}

export function writeSignupDraft(storage: WritableStorage, draft: SignupDraft) {
  storage.setItem(SIGNUP_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearSignupDraft(storage: RemovableStorage) {
  storage.removeItem(SIGNUP_DRAFT_STORAGE_KEY);
}
