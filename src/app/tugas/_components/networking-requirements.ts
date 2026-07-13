export const networkingRequirements = {
  "2026": {
    title: "Networking Angkatan 26",
    label: "Teman Seangkatan 2026",
    total: 10,
    category: "Networking",
    deadlineTitle: "Deadline Angkatan",
    deadlineDate: "13 Juni",
  },
  "2025": {
    title: "Networking Angkatan 25",
    label: "Kating Angkatan 2025",
    total: 4,
    category: "Networking",
    deadlineTitle: "Deadline Kating",
    deadlineDate: "15 Juni",
  },
  "2024": {
    title: "Networking Angkatan 24",
    label: "Kating Angkatan 2024",
    total: 2,
    category: "Networking",
    deadlineTitle: "Deadline Kating",
    deadlineDate: "15 Juni",
  },
  "2023": {
    title: "Networking Angkatan 23",
    label: "Kating Angkatan 2023",
    total: 2,
    category: "Networking",
    deadlineTitle: "Deadline Kating",
    deadlineDate: "15 Juni",
  },
} as const;

export type NetworkingBatch = keyof typeof networkingRequirements;

export function isNetworkingBatch(batch: string): batch is NetworkingBatch {
  return batch in networkingRequirements;
}

export function getNetworkingRequirement(batch: NetworkingBatch) {
  return networkingRequirements[batch];
}
