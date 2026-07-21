export const NETWORKING_VIEWER_BATCH = 2026;

export const NETWORKING_PEER_FIXED_QUESTIONS = [
  {
    code: "study_path_choice",
    prompt:
      "Dari banyaknya pilihan yang ada, apa yang akhirnya membuat kamu memilih jalan yang membawa kamu sampai ke jurusan dan universitas ini?",
  },
  {
    code: "formative_experience",
    prompt:
      "Dari perjalanan kamu sampai saat ini, pengalaman apa yang paling berpengaruh dalam membentuk dirimu yang sekarang?",
  },
  {
    code: "first_year_goal",
    prompt: "Apa target yang ingin kamu capai di tahun pertama kuliah ini?",
  },
] as const;

// Senior prompts are provided by the backend catalog because they are managed
// separately from the peer question set.
export const NETWORKING_PEER_FIXED_QUESTION_COUNT =
  NETWORKING_PEER_FIXED_QUESTIONS.length;
export const NETWORKING_SENIOR_FIXED_QUESTION_COUNT = 5;
export const NETWORKING_SENIOR_TEMPLATE_URL =
  "https://docs.google.com/document/d/1Jb48QX1sV48pFZ4Kis8XEeq8kfxeD0bIv3hR9QifPgs/edit?usp=drive_link";

// Backwards-compatible alias for call sites that refer to the original peer
// catalog.
export const NETWORKING_FIXED_QUESTIONS = NETWORKING_PEER_FIXED_QUESTIONS;

export const NETWORKING_BATCH_REQUIREMENTS = [
  { batch: 2026, required: 10, label: "Teman Angkatan 2026" },
  { batch: 2025, required: 4, label: "Teman Angkatan 2025" },
  { batch: 2024, required: 2, label: "Teman Angkatan 2024" },
  { batch: 2023, required: 2, label: "Teman Angkatan 2023" },
] as const;

export type NetworkingTargetBatch =
  (typeof NETWORKING_BATCH_REQUIREMENTS)[number]["batch"];

export const NETWORKING_TOTAL_REQUIRED = NETWORKING_BATCH_REQUIREMENTS.reduce(
  (total, requirement) => total + requirement.required,
  0,
);

export function isNetworkingTargetBatch(
  batch: number,
): batch is NetworkingTargetBatch {
  return NETWORKING_BATCH_REQUIREMENTS.some(
    (requirement) => requirement.batch === batch,
  );
}

export function getNetworkingBatchRequirement(batch: number) {
  return NETWORKING_BATCH_REQUIREMENTS.find(
    (requirement) => requirement.batch === batch,
  );
}

export type NetworkingType = "peer" | "senior";

export function isNetworkingViewerBatch(batch: number) {
  return batch === NETWORKING_VIEWER_BATCH;
}

export function isPeerNetworkingTarget(batch: number) {
  return batch === NETWORKING_VIEWER_BATCH;
}

export function isSeniorNetworkingTarget(batch: number) {
  return batch === 2023 || batch === 2024 || batch === 2025;
}

export function getNetworkingTypeForBatch(
  batch: number,
): NetworkingType | null {
  if (isPeerNetworkingTarget(batch)) return "peer";
  if (isSeniorNetworkingTarget(batch)) return "senior";
  return null;
}

export function getNetworkingFixedQuestionCount(type: NetworkingType) {
  return type === "peer"
    ? NETWORKING_PEER_FIXED_QUESTION_COUNT
    : NETWORKING_SENIOR_FIXED_QUESTION_COUNT;
}
