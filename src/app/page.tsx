import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  BrandLogo,
  DashboardPageLayout,
  Dropdown,
  Footer,
  SponsorMarquee,
  TimelineItem,
  type TimelineItemProps,
} from "@/components";

const AUTH_COOKIE_NAME = "ppmb_access_token";

const TimelineData: TimelineItemProps[] = [
  {
    date: "12 Juni 2026",
    title: "Opening PPMB",
    description:
      "Rangkaian awal untuk mengenal PPMB KMBUI 2026, alur kegiatan, dan sistem pertugasan.",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "Universitas Indonesia",
    locationHref: "https://maps.google.com",
  },
  {
    date: "13 Juni 2026",
    title: "Networking dan Mentoring",
    description:
      "Peserta mulai membangun relasi dengan sesama maba, kakak tingkat, dan mentor.",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "Universitas Indonesia",
    locationHref: "https://maps.google.com",
  },
  {
    date: "15 Juni 2026",
    title: "Insight Hunting dan KMBUI Explorer",
    description:
      "Peserta menggali pengalaman, mengikuti kegiatan, dan mengenal KMBUI lebih dekat.",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "Universitas Indonesia",
    locationHref: "https://maps.google.com",
  },
  {
    date: "Juli 2026",
    title: "Closing PPMB",
    description:
      "Penutup rangkaian PPMB dan momen refleksi perjalanan awal bersama KMBUI.",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "Universitas Indonesia",
    locationHref: "https://maps.google.com",
  },
];

const FAQData: { question: string; answer: string }[] = [
  {
    question: "Apa itu PPMB KMBUI 2026?",
    answer:
      "PPMB KMBUI 2026 adalah rangkaian pengenalan Keluarga Mahasiswa Buddhis Universitas Indonesia untuk mahasiswa baru.",
  },
  {
    question: "Siapa saja yang perlu mengikuti PPMB?",
    answer:
      "Mahasiswa baru Buddhis UI 2026 diarahkan untuk mengikuti rangkaian PPMB sesuai informasi dari panitia.",
  },
  {
    question: "Di mana saya bisa mengumpulkan tugas?",
    answer:
      "Tugas dapat dilihat dan dikumpulkan melalui dashboard setelah login menggunakan akun PPMB.",
  },
];

const SponsorData: { src: string; alt: string }[] = [
  {
    src: "assets/sponsor-onassis.webp",
    alt: "Onassis Logo",
  },
  {
    src: "assets/sponsor-king.webp",
    alt: "King Logo",
  },
];

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

function hasLikelyValidSession(token?: string) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const footerContacts = [
  {
    type: "person" as const,
    name: "Justin Lie",
    lineId: "@justin.lie42",
    whatsapp: "08999201385",
    whatsappHref: "https://wa.me/628999201385",
  },
  {
    type: "person" as const,
    name: "Felice Chan",
    lineId: "@feliceee08",
    whatsapp: "087893135979",
    whatsappHref: "https://wa.me/6287893135979",
  },
  {
    type: "instagram" as const,
    label: "@ppmb.kmbui",
    href: "https://www.instagram.com/ppmb.kmbui/",
  },
] as const;

function HomeContent({ isDashboard = false }: { isDashboard?: boolean }) {
  return (
    <div
      className={
        isDashboard
          ? "flex flex-col"
          : "mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-0 pt-12 max-md:gap-14 md:px-[60px]"
      }
    >
      <div className="flex flex-col gap-20 max-md:gap-14">
        <section id="timeline" className="flex flex-col gap-8 md:gap-16">
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
              Timeline Kegiatan
            </span>
          </h1>
          <div className="relative flex flex-col gap-4">
            <div
              className="absolute left-3 md:left-1/2 top-8 md:top-0 bottom-0 w-1 -translate-x-1/2 max-md:bg-linear-to-b from-white to-blue-800 md:bg-blue-800"
              aria-hidden="true"
            />
            {TimelineData.map((data, i) => (
              <TimelineItem
                key={`${data.date}-${data.title}`}
                date={data.date}
                title={data.title}
                description={data.description}
                media={data.media}
                location={data.location}
                locationHref={data.locationHref}
                reversed={i % 2 !== 0}
              />
            ))}
          </div>
        </section>
        <section id="faq" className="flex flex-col gap-8 md:gap-16">
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading ">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text max-md:hidden">
              Frequently Asked Question (FAQ)
            </span>
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text md:hidden">
              FAQ
            </span>
          </h1>
          <div className="space-y-4">
            {FAQData.map((data) => (
              <Dropdown key={`${data.question}-${data.answer}`} title={data.question}>
                {data.answer}
              </Dropdown>
            ))}
          </div>
        </section>
        <section id="sponsor" className="flex flex-col gap-8 md:gap-16">
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
              Sponsor
            </span>
          </h1>
          <div className="w-full flex items-center justify-center gap-12 max-lg:hidden">
            {SponsorData.map((sponsor) => (
              <Image
                key={`${sponsor.src}-${sponsor.alt}`}
                src={`/${sponsor.src}`}
                alt={sponsor.alt}
                width={136}
                height={136}
                className="w-auto h-34"
              />
            ))}
          </div>
          <SponsorMarquee items={SponsorData} speed={10} className="lg:hidden" />
        </section>
      </div>

      <div
        className={
          isDashboard
            ? "relative z-30 -mx-4 mt-14 md:-ml-[140px] md:-mr-[22px] md:mt-20"
            : "-mx-4 md:-mx-[60px]"
        }
      >
        <Footer contacts={footerContacts} surface="transparent" />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const isLoggedIn = hasLikelyValidSession(token);

  if (isLoggedIn) {
    return (
      <DashboardPageLayout
        activeItem="home"
        mainClassName="pb-0 md:pb-0 md:pt-9"
        sidebarContainerClassName="bottom-[261px] min-h-[982px]"
      >
        <HomeContent isDashboard />
      </DashboardPageLayout>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
      <header
        className="sticky top-0 z-40 flex min-h-[100px] w-full items-center border-b border-white/10 px-4 py-4 backdrop-blur-glass md:px-[60px]"
        style={{ backgroundImage: "var(--gradient-app-header)" }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-3 md:gap-6">
            <BrandLogo priority />
            <div className="hidden min-w-0 flex-col gap-2 sm:flex">
              <p className="truncate font-heading text-h4">PPMB KMBUI 2026</p>
              <p className="truncate text-b2">
                Begin your journey, build your story
              </p>
            </div>
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="flex shrink-0 items-center gap-3"
          >
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500 px-5 text-b2 text-yellow-100 transition-colors hover:bg-yellow-500/10"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-b2 text-yellow-50 transition-colors hover:bg-primary-hover"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <HomeContent />
    </main>
  );
}
