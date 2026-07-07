import {
  DashboardPageLayout,
  Dropdown,
  MaterialCard,
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
      <img
        src="assets/timeline-img.jpg"
        alt=""
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
      <img
        src="assets/timeline-img.jpg"
        alt=""
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
      <img
        src="assets/timeline-img.jpg"
        alt=""
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
      <img
        src="assets/timeline-img.jpg"
        alt=""
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
    src: "assets/logo_ppmb.webp",
    alt: "logo",
  },
  {
    src: "assets/logo_ppmb.webp",
    alt: "logo1",
  },
  {
    src: "assets/logo_ppmb.webp",
    alt: "logo2",
  },
  {
    src: "assets/logo_ppmb.webp",
    alt: "logo3",
  },
  {
    src: "assets/logo_ppmb.webp",
    alt: "logo4",
  },
];

export default function HomePage() {
  return (
    <DashboardPageLayout activeItem="home">
      <main className="flex flex-col overflow-hidden gap-20 p-8">
        <section id="timeline" className="flex flex-col gap-16">
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
              Timeline Kegiatan
            </span>
          </h1>
          <div className="relative flex flex-col gap-4">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-blue-800"
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
        <section id="faq" className="flex flex-col gap-16">
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading ">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
              Frequently Asked Question
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
        <section id="sponsor" className="flex flex-col gap-16 pb-24">
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
              Sponsor
            </span>
          </h1>
          <SponsorMarquee items={SponsorData} />
        </section>
      </main>
    </DashboardPageLayout>
  );
}
