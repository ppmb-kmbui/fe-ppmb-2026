import { FaLine } from "react-icons/fa6";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface MobileAuthFooterProps {
  className?: string;
}

const LINE_CONTACTS = ["id_line", "id_line", "id_line"] as const;

/**
 * Footer khusus tampilan mobile untuk halaman login & signup, sesuai desain Figma:
 * maskot + tagline, tiga kontak LINE, lalu garis pemisah ungu di bawah.
 */
export function MobileAuthFooter({ className }: MobileAuthFooterProps) {
  return (
    <footer className={cn("px-4 pb-4", className)}>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <BrandLogo size={34} className="size-[34px]" />
          <p className="font-body text-b2 text-white">
            Begin your journey, build your story
          </p>
        </div>

        <ul className="flex items-center justify-center gap-3">
          {LINE_CONTACTS.map((label, index) => (
            <li
              key={`${label}-${index}`}
              className="flex items-center gap-1 font-body text-b4 text-white"
            >
              <FaLine aria-hidden="true" className="size-3 text-green-500" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-1.5 w-full rounded-full bg-purple-500" />
    </footer>
  );
}
