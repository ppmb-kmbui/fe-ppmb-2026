import type { ReactNode } from "react";
import { FaChalkboardUser, FaNetworkWired, FaPeopleRoof } from "react-icons/fa6";
import { MdExplore, MdNoteAlt } from "react-icons/md";

import { cn } from "@/lib/cn";

export type TaskIconKey =
  | "networking"
  | "insight"
  | "explorer"
  | "mentoring"
  | "foster";

export function getTaskIcon(icon?: TaskIconKey, className?: string): ReactNode {
  const styles = cn("size-7", className);

  switch (icon) {
    case "networking":
      return <FaNetworkWired aria-hidden="true" className={styles} />;
    case "insight":
      return <MdNoteAlt aria-hidden="true" className={styles} />;
    case "explorer":
      return <MdExplore aria-hidden="true" className={styles} />;
    case "mentoring":
      return <FaChalkboardUser aria-hidden="true" className={styles} />;
    case "foster":
      return <FaPeopleRoof aria-hidden="true" className={styles} />;
    default:
      return null;
  }
}
