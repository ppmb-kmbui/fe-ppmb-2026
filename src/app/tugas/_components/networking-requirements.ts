export const NETWORKING_TEMPLATE_URL =
  "https://docs.google.com/document/d/1SLkh-GfLt-_IIHWUxXDHG4hHprm4gscwhLMJnXPH_TE/edit?usp=drive_link";

export const NETWORKING_FIXED_QUESTIONS = [
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
