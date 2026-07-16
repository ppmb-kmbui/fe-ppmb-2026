import Link from "next/link";
import type { HTMLAttributes } from "react";
import { FaInstagram, FaLine, FaWhatsapp } from "react-icons/fa6";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface FooterMenuItem {
  label: string;
  href: string;
}

export type FooterContact =
  | {
      type: "line" | "instagram" | "whatsapp";
      label: string;
      href?: string;
    }
  | {
      type: "person";
      name: string;
      lineId: string;
      whatsapp: string;
      whatsappHref: string;
    };

type FooterLinkContact = Extract<FooterContact, { label: string }>;
type FooterPersonContact = Extract<FooterContact, { type: "person" }>;

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  logoSrc?: string;
  menuItems?: readonly FooterMenuItem[];
  contacts?: readonly FooterContact[];
  surface?: "solid" | "transparent";
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
  surface = "solid",
  className,
  ...props
}: FooterProps) {
  const personContacts = contacts.filter(
    (contact): contact is FooterPersonContact => contact.type === "person",
  );
  const linkContacts = contacts.filter(
    (contact): contact is FooterLinkContact => contact.type !== "person",
  );
  const instagramContacts = linkContacts.filter(
    (contact) => contact.type === "instagram",
  );
  const otherLinkContacts = linkContacts.filter(
    (contact) => contact.type !== "instagram",
  );

function renderLinkContact(contact: FooterLinkContact, index: number) {
    const icon = {
      instagram: <FaInstagram aria-hidden="true" className="size-5" />,
      line: <FaLine aria-hidden="true" className="size-5" />,
      whatsapp: <FaWhatsapp aria-hidden="true" className="size-5" />,
    }[contact.type];
    const content = (
      <>
        {icon}
        <span className="min-w-0">{contact.label}</span>
      </>
    );

    return (
      <li key={`${contact.type}-${contact.label}-${index}`}>
        {contact.href ? (
          <a
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 text-b2 hover:text-yellow-100"
          >
            {content}
          </a>
        ) : (
          <div className="flex items-center gap-4 text-b2">{content}</div>
        )}
      </li>
    );
}

  function renderMobileContact(contact: FooterContact, index: number) {
    if (contact.type === "person") {
      return (
        <li
          key={`${contact.name}-mobile-${index}`}
          className="flex items-center gap-1.5"
        >
          <span className="flex items-center gap-0.5">
            <FaLine aria-label="LINE" className="size-2.5 shrink-0" />
            <span>{contact.lineId}</span>
          </span>
          <span aria-hidden="true">/</span>
          <a
            href={contact.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-0.5 hover:text-yellow-100"
          >
            <FaWhatsapp aria-label="WhatsApp" className="size-2.5 shrink-0" />
            <span>{contact.whatsapp}</span>
          </a>
        </li>
      );
    }

    const icon = {
      instagram: <FaInstagram aria-hidden="true" className="size-2.5 shrink-0" />,
      line: <FaLine aria-hidden="true" className="size-2.5 shrink-0" />,
      whatsapp: <FaWhatsapp aria-hidden="true" className="size-2.5 shrink-0" />,
    }[contact.type];
    const content = (
      <>
        {icon}
        <span>{contact.label}</span>
      </>
    );

    return (
      <li key={`${contact.type}-${contact.label}-mobile-${index}`}>
        {contact.href ? (
          <a
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-yellow-100"
          >
            {content}
          </a>
        ) : (
          <span className="flex items-center gap-1">{content}</span>
        )}
      </li>
    );
  }

  return (
    <footer
      className={cn(
        "w-full border-b-4 border-purple-500 px-4 py-px text-foreground md:min-h-[225px] md:border-b-0 md:border-t-4 md:px-[60px] md:py-5",
        surface === "solid" ? "bg-background" : "bg-[#481770] md:bg-transparent",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center overflow-hidden py-4 md:hidden">
        <div className="flex w-full items-center justify-between gap-3">
          <BrandLogo src={logoSrc} className="size-[34px]" />
          <p className="whitespace-nowrap text-right text-b2">
            Begin your journey, build your story
          </p>
        </div>

        {contacts.length > 0 && (
          <ul className="mt-2 flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[8px] leading-none text-foreground">
            {contacts.map(renderMobileContact)}
          </ul>
        )}
      </div>

      <div className="hidden flex-col gap-10 md:flex md:flex-row md:items-start md:justify-between">
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
          <div className="flex min-w-[320px] flex-col gap-4">
            <h2 className="font-subheading text-s3 font-semibold">Kontak</h2>

            {personContacts.length > 0 && (
              <ul className="flex flex-col gap-4">
                {personContacts.map((contact, index) => (
                  <li key={`${contact.name}-${index}`}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-b2">
                      <span>{contact.name}:</span>
                      <span className="inline-flex items-center gap-2">
                        <FaLine aria-label="LINE" className="size-5" />
                        <span>{contact.lineId}</span>
                      </span>
                      <span className="mx-1" aria-hidden="true">
                        /
                      </span>
                      <a
                        href={contact.whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 hover:text-yellow-100"
                      >
                        <FaWhatsapp aria-label="WhatsApp" className="size-5" />
                        <span>{contact.whatsapp}</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {otherLinkContacts.length > 0 && (
              <ul className="flex flex-col gap-3">
                {otherLinkContacts.map(renderLinkContact)}
              </ul>
            )}

            {instagramContacts.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <h3 className="font-subheading text-b2 font-semibold">
                  Instagram
                </h3>
                <ul className="flex flex-col gap-3">
                  {instagramContacts.map(renderLinkContact)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
