import Link from "next/link";
import type { HTMLAttributes } from "react";
import { FaInstagram, FaLine } from "react-icons/fa6";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface FooterMenuItem {
  label: string;
  href: string;
}

export interface FooterContact {
  type: "line" | "instagram";
  label: string;
  href: string;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  logoSrc?: string;
  menuItems?: readonly FooterMenuItem[];
  contacts?: readonly FooterContact[];
}

const defaultMenuItems: readonly FooterMenuItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Tugas", href: "/tugas" },
  { label: "Kalyanamitta", href: "/kalyanamitta" },
  { label: "Materi", href: "/materi" },
];

export function Footer({
  logoSrc,
  menuItems = defaultMenuItems,
  contacts = [],
  className,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full border-t-4 border-purple-500 bg-background px-6 py-5 text-foreground md:min-h-[225px] md:px-[60px]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-[560px] flex-col gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo src={logoSrc} />
            <p className="font-heading text-h3">PPMB KMBUI 2026</p>
          </div>
          <div className="font-heading text-h5">
            <p>PPMB KMBUI 2026</p>
            <p>Begin your journey, build your story</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-subheading text-s3 font-semibold">Menu</h2>
          <nav aria-label="Navigasi footer" className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="text-b2 hover:text-yellow-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {contacts.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-subheading text-s3 font-semibold">Kontak</h2>
            <ul className="flex flex-col gap-3">
              {contacts.map((contact) => (
                <li key={`${contact.type}-${contact.href}`}>
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 text-b2 hover:text-yellow-100"
                  >
                    {contact.type === "line" ? (
                      <FaLine aria-hidden="true" className="size-5" />
                    ) : (
                      <FaInstagram aria-hidden="true" className="size-5" />
                    )}
                    <span>{contact.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
