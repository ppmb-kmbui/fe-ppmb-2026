import { FaEyeSlash, FaUserShield } from "react-icons/fa6";

import type { SidebarItem } from "@/components/layout/Sidebar";

export function getAdminNavigationItems(
  isSuperAdmin: boolean,
): readonly SidebarItem[] {
  return [
    {
      key: "admin",
      label: "Admin",
      href: "/admin",
      icon: <FaUserShield />,
    },
    ...(isSuperAdmin
      ? [
          {
            key: "profiles",
            label: "Visibilitas Profil",
            href: "/admin/profiles",
            icon: <FaEyeSlash />,
          },
        ]
      : []),
  ];
}
