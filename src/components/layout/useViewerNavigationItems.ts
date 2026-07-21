import { useEffect, useMemo, useState } from "react";

import {
  getCachedProfileSnapshot,
  getProfileCached,
} from "@/lib/auth-api";

import type { SidebarItem } from "./Sidebar";

type ViewerNavigationAccess = {
  tasks: boolean;
  materials: boolean;
};

function getViewerNavigationAccess(profile: {
  batch: number;
  isAdmin: boolean;
}): ViewerNavigationAccess {
  return {
    tasks: profile.batch === 2026 && !profile.isAdmin,
    materials: profile.batch === 2026,
  };
}

export function filterNavigationItemsForViewerAccess(
  items: readonly SidebarItem[],
  access: ViewerNavigationAccess,
) {
  return items.filter(
    (item) =>
      (item.key !== "tasks" || access.tasks) &&
      (item.key !== "materials" || access.materials),
  );
}

/**
 * Restricted navigation starts hidden when the profile is not cached,
 * preventing a senior account from briefly seeing unavailable routes.
 */
export function useViewerNavigationItems(items: readonly SidebarItem[]) {
  const [access, setAccess] = useState<ViewerNavigationAccess | null>(() => {
    const profile = getCachedProfileSnapshot();
    return profile ? getViewerNavigationAccess(profile) : null;
  });

  useEffect(() => {
    if (access !== null) return;

    let active = true;
    getProfileCached()
      .then((profile) => {
        if (active) {
          setAccess(getViewerNavigationAccess(profile));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [access]);

  return useMemo(
    () =>
      filterNavigationItemsForViewerAccess(
        items,
        access ?? { tasks: false, materials: false },
      ),
    [access, items],
  );
}
