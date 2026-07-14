import Image from "next/image";
import {
  DashboardPageLayout,
  Dropdown,
  SponsorMarquee,
  TimelineItem,
  type TimelineItemProps,
} from "@/components";

const TimelineData: TimelineItemProps[] = [
  {
    date: "5 Des 2026",
    title: "Main",
    description: "main",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "ui",
    locationHref: "https://maps.google.com",
  },
  {
    date: "5 Des 2025",
    title: "Main",
    description: "main",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "ui",
    locationHref: "https://maps.google.com",
  },
  {
    date: "5 Des 2023",
    title: "Main",
    description: "main",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "ui",
    locationHref: "https://maps.google.com",
  },
  {
    date: "5 Des 2021",
    title: "Main",
    description: "main",
    media: (
      <Image
        src="/assets/timeline-img.jpg"
        alt=""
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    ),
    location: "ui",
    locationHref: "https://maps.google.com",
  },
];

const FAQData: { question: string; answer: string }[] = [
  {
    question: "acsadcas",
    answer: "as",
  },
  {
    question: "acsadcas",
    answer: "ass",
  },
  {
    question: "acsadcas",
    answer: "sad",
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

export default function HomePage() {
  return (
    <DashboardPageLayout activeItem="home">
      <main className="flex flex-col overflow-hidden gap-20 max-md:gap-14">
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
              <Dropdown
                key={`${data.question}-${data.answer}`}
                title={data.question}
              >
                {data.answer}
              </Dropdown>
            ))}
          </div>
        </section>
        <section
          id="sponsor"
          className="flex flex-col gap-8 md:gap-16 pb-24"
        >
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
      </main>
    </DashboardPageLayout>
  );
}
