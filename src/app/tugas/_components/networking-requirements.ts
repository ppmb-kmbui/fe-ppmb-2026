import type { NetworkingSubmissionField } from "@/lib/task-api";

export const networkingSegments = {
  "26": {
    title: "Angkatan 26",
    label: "Angkatan 26",
    total: 1,
    field: "first_docs_url",
    summaryField: "firstDocsUrl",
    category: "Networking",
    deadlineTitle: "Deadline Angkatan",
    deadlineDate: "31 Agustus",
    templateUrl:
      "https://docs.google.com/document/d/1SLkh-GfLt-_IIHWUxXDHG4hHprm4gscwhLMJnXPH_TE/edit?usp=drive_link",
  },
  "23-25": {
    title: "Angkatan 23-25",
    label: "Angkatan 23-25",
    total: 1,
    field: "second_docs_url",
    summaryField: "secondDocsUrl",
    category: "Networking",
    deadlineTitle: "Deadline Angkatan",
    deadlineDate: "31 Agustus",
    templateUrl:
      "https://docs.google.com/document/d/1Jb48QX1sV48pFZ4Kis8XEeq8kfxeD0bIv3hR9QifPgs/edit?usp=drive_link",
  },
} as const;

export type NetworkingSegment = keyof typeof networkingSegments;
export type NetworkingRequirement = (typeof networkingSegments)[NetworkingSegment] & {
  field: NetworkingSubmissionField;
  summaryField: "firstDocsUrl" | "secondDocsUrl";
};

const aliases: Record<string, NetworkingSegment> = {
  "2026": "26",
  "26": "26",
  "2025": "23-25",
  "2024": "23-25",
  "2023": "23-25",
  "24-25": "23-25",
  "23-25": "23-25",
};

export function resolveNetworkingSegment(slug: string): NetworkingSegment | null {
  return aliases[slug] ?? null;
}

export function isNetworkingSegment(slug: string): slug is NetworkingSegment {
  return slug in networkingSegments;
}

export function getNetworkingRequirement(segment: NetworkingSegment) {
  return networkingSegments[segment] as NetworkingRequirement;
}
