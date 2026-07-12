import type { Metadata } from "next";
import {
  Faculty_Glyphic,
  Palanquin_Dark,
  Pangolin,
} from "next/font/google";
import "./globals.css";

const facultyGlyphic = Faculty_Glyphic({
  variable: "--font-faculty-glyphic",
  subsets: ["latin"],
  weight: "400",
});

const palanquinDark = Palanquin_Dark({
  variable: "--font-palanquin-dark",
  subsets: ["latin"],
  weight: "600",
});

const pangolin = Pangolin({
  variable: "--font-pangolin",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "PPMB KMBUI 2026",
    template: "%s | PPMB KMBUI 2026",
  },
  description:
    "Website resmi PPMB Keluarga Mahasiswa Buddhis Universitas Indonesia 2026.",
  applicationName: "PPMB KMBUI 2026",
  keywords: [
    "PPMB",
    "KMBUI",
    "KMB UI",
    "Keluarga Mahasiswa Buddhis",
    "Universitas Indonesia",
    "2026",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${facultyGlyphic.variable} ${palanquinDark.variable} ${pangolin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
