export const FACULTIES = [
  "Fasilkom",
  "FKM",
  "Fisip",
  "FKG",
  "FK",
  "FMIPA",
  "FT",
  "Vokasi",
  "FH",
  "FPsi",
  "FIA",
  "FF",
  "FIK",
  "FEB",
  "Sastra Mesin",
] as const;

export type Faculty = (typeof FACULTIES)[number];

export function isFaculty(value: string): value is Faculty {
  return FACULTIES.includes(value as Faculty);
}
