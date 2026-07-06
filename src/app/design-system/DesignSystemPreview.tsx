"use client";

import { useState } from "react";

import {
  AgendaCard,
  BackButton,
  Button,
  Chip,
  DashboardPageLayout,
  Dropdown,
  FileUpload,
  Footer,
  FriendRequestCard,
  Header,
  Input,
  MaterialCard,
  MemberCard,
  ParticipantCard,
  ProgressBar,
  QuotaCard,
  SearchInput,
  Sidebar,
  StatusBadge,
  SubmissionReviewCard,
  TaskCard,
  TaskFileUpload,
  TaskSubmissionPanel,
  Textarea,
  TimelineItem,
  WeekCalendar,
} from "@/components";

const palettes = [
  {
    name: "Purple",
    colors: [
      "bg-purple-50",
      "bg-purple-100",
      "bg-purple-200",
      "bg-purple-300",
      "bg-purple-400",
      "bg-purple-500",
      "bg-purple-600",
      "bg-purple-700",
      "bg-purple-800",
      "bg-purple-900",
    ],
  },
  {
    name: "Yellow",
    colors: [
      "bg-yellow-50",
      "bg-yellow-100",
      "bg-yellow-200",
      "bg-yellow-300",
      "bg-yellow-400",
      "bg-yellow-500",
      "bg-yellow-600",
      "bg-yellow-700",
      "bg-yellow-800",
      "bg-yellow-900",
    ],
  },
  {
    name: "Blue",
    colors: [
      "bg-blue-50",
      "bg-blue-100",
      "bg-blue-200",
      "bg-blue-300",
      "bg-blue-400",
      "bg-blue-500",
      "bg-blue-600",
      "bg-blue-700",
      "bg-blue-800",
      "bg-blue-900",
    ],
  },
  {
    name: "Grey",
    colors: [
      "bg-grey-50",
      "bg-grey-100",
      "bg-grey-200",
      "bg-grey-300",
      "bg-grey-400",
      "bg-grey-500",
      "bg-grey-600",
      "bg-grey-700",
      "bg-grey-800",
      "bg-grey-900",
    ],
  },
  {
    name: "Red",
    colors: [
      "bg-red-50",
      "bg-red-100",
      "bg-red-200",
      "bg-red-300",
      "bg-red-400",
      "bg-red-500",
      "bg-red-600",
      "bg-red-700",
      "bg-red-800",
      "bg-red-900",
    ],
  },
  {
    name: "Green",
    colors: [
      "bg-green-50",
      "bg-green-100",
      "bg-green-200",
      "bg-green-300",
      "bg-green-400",
      "bg-green-500",
      "bg-green-600",
      "bg-green-700",
      "bg-green-800",
      "bg-green-900",
    ],
  },
] as const;

const typography = [
  ["H1 · 64 px", "font-heading text-h1", "Faculty Glyphic"],
  ["H2 · 48 px", "font-heading text-h2", "Faculty Glyphic"],
  ["H3 · 32 px", "font-heading text-h3", "Faculty Glyphic"],
  ["H4 · 24 px", "font-heading text-h4", "Faculty Glyphic"],
  ["H5 · 20 px", "font-heading text-h5", "Faculty Glyphic"],
  ["H6 · 16 px", "font-heading text-h6", "Faculty Glyphic"],
  ["S1 · 48 px", "font-subheading text-s1 font-semibold", "Palanquin Dark"],
  ["S2 · 30 px", "font-subheading text-s2 font-semibold", "Palanquin Dark"],
  ["S3 · 24 px", "font-subheading text-s3 font-semibold", "Palanquin Dark"],
  ["B1 · 24 px", "font-body text-b1", "Pangolin"],
  ["B2 · 20 px", "font-body text-b2", "Pangolin"],
  ["B3 · 16 px", "font-body text-b3", "Pangolin"],
] as const;

function PreviewSection({
  id,
  title,
  children,
}: Readonly<{ id?: string; title: string; children: React.ReactNode }>) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl border border-white/10 bg-purple-900/40 p-5 shadow-modal md:p-8"
    >
      <h2 className="mb-6 font-heading text-h3 text-yellow-100">{title}</h2>
      {children}
    </section>
  );
}

export function DesignSystemPreview() {
  const [selectedChip, setSelectedChip] = useState("Semua");
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 5, 12));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-4 py-10 md:px-page-x">
        <header>
          <p className="mb-2 font-subheading text-s5 font-semibold uppercase tracking-wider text-yellow-300">
            Development only
          </p>
          <h1 className="font-heading text-h2 md:text-h1">PPMB 2026 Design System</h1>
          <p className="mt-4 max-w-3xl text-b3 text-purple-100 md:text-b2">
            Preview token dan komponen yang diekstrak dari Figma. Route ini tidak
            tersedia pada production build.
          </p>
        </header>

        <PreviewSection title="Color palettes">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {palettes.map((palette) => (
              <div key={palette.name}>
                <h3 className="mb-2 font-subheading text-s5 font-semibold">
                  {palette.name}
                </h3>
                <div className="grid grid-cols-10 overflow-hidden rounded-lg">
                  {palette.colors.map((color, index) => (
                    <div
                      key={color}
                      title={`${palette.name} ${index === 0 ? 50 : index * 100}`}
                      className={`aspect-square ${color}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>

        <PreviewSection title="Typography">
          <div className="grid gap-7 overflow-hidden">
            {typography.map(([label, className, family]) => (
              <div key={label} className="border-b border-white/10 pb-5">
                <p className="mb-2 text-b4 text-purple-200">
                  {label} · {family}
                </p>
                <p className={className}>Begin your journey</p>
              </div>
            ))}
          </div>
        </PreviewSection>

        <PreviewSection title="Buttons and states">
          <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
            <Button>Default button</Button>
            <Button disabled>Disabled button</Button>
            <Button isLoading>Loading button</Button>
          </div>
        </PreviewSection>

        <PreviewSection title="Form controls">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Input label="Default input" placeholder="Masukkan data" />
              <Input label="Filled input" defaultValue="Contoh isi" />
              <Input
                label="Invalid input"
                defaultValue="Data tidak valid"
                error="Periksa kembali data yang dimasukkan."
              />
            </div>
            <FileUpload
              label="Unggah foto"
              hint="JPG atau PNG, maksimal 2 MB"
              maxSizeMb={2}
            />
          </div>
        </PreviewSection>

        <PreviewSection title="Dropdown">
          <div className="grid gap-5">
            <Dropdown title="Default dropdown">
              Konten dropdown menggunakan panel transparan dari desain Figma.
            </Dropdown>
            <Dropdown title="Opened dropdown" open>
              State aktif dapat dilihat langsung dan tetap menggunakan elemen
              HTML native.
            </Dropdown>
          </div>
        </PreviewSection>

        <PreviewSection title="Chips and status">
          <div className="flex flex-wrap gap-4">
            {["Semua", "Belum selesai", "Selesai"].map((chip) => (
              <Chip
                key={chip}
                selected={selectedChip === chip}
                onClick={() => setSelectedChip(chip)}
              >
                {chip}
              </Chip>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <StatusBadge status="submitted" />
            <StatusBadge status="not-submitted" />
          </div>
        </PreviewSection>

        <PreviewSection title="Progress and navigation">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-3">
              <ProgressBar value={70} label="Contoh progress" />
              <ProgressBar value={50} label="Contoh progress glow" glow />
            </div>
            <BackButton href="/design-system" />
          </div>
        </PreviewSection>

        <PreviewSection title="Task overview">
          <div className="grid gap-5 md:grid-cols-2">
            <TaskCard title="Networking" progress={70} />
            <TaskCard title="KMBUI Explorer" progress={55} />
            <TaskCard title="Mentoring" progress={35} />
            <TaskCard title="Foster Siblings" progress={0} />
          </div>
          <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_344px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <AgendaCard
                category="Networking"
                title="Deadline Angkatan"
                date="13 Juni"
              />
              <AgendaCard
                category="KMBUI Explorer"
                title="Puja Rutin"
                date="15 Juni"
              />
            </div>
            <WeekCalendar
              selectedDate={calendarDate}
              eventDates={["2026-06-13", "2026-06-15"]}
              onDateChange={setCalendarDate}
            />
          </div>
        </PreviewSection>

        <PreviewSection title="Task submission">
          <TaskSubmissionPanel>
            <div className="grid gap-4 lg:grid-cols-3">
              <TaskFileUpload fileType="image" maxSizeMb={5} />
              <TaskFileUpload fileType="video" maxSizeMb={50} />
              <TaskFileUpload fileType="pdf" maxSizeMb={10} />
            </div>
            <Textarea placeholder="Jelaskan apa saja yang didapatkan saat kegiatan..." />
          </TaskSubmissionPanel>
        </PreviewSection>

        <PreviewSection title="Task quota">
          <div className="grid gap-4 md:grid-cols-3">
            <QuotaCard label="Angkatan 26" completed={5} total={10} />
            <QuotaCard label="Angkatan 25" completed={8} total={10} />
            <QuotaCard label="Angkatan 24" completed={10} total={10} />
          </div>
        </PreviewSection>

        <PreviewSection title="Kalyanamitta and participants">
          <SearchInput placeholder="Cari Kalyanamitta" />
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <MemberCard name="Jaysen Lestari" batch={2024} />
            <FriendRequestCard name="Jaysen Lestari" batch={2024} />
            <ParticipantCard name="Jaysen Lestari" batch={2024} progress={70} />
          </div>
        </PreviewSection>

        <PreviewSection title="Material and timeline cards">
          <div className="grid gap-8 lg:grid-cols-2">
            <MaterialCard
              title="Judul materi"
              description="Deskripsi singkat materi."
            />
            <TimelineItem
              date="26 Juli 2026"
              title="Welcoming Mahasiswa Baru"
              description="Deskripsi kegiatan dan informasi yang diperlukan peserta."
              location="Zoom"
            />
          </div>
        </PreviewSection>

        <PreviewSection title="Admin submission review">
          <div className="grid gap-5">
            <SubmissionReviewCard
              title="Networking"
              status="submitted"
              media={<div className="h-full bg-background" />}
              answer="Jawaban networking peserta"
            />
            <SubmissionReviewCard
              title="Mentoring"
              status="submitted"
              answer="Jawaban esai peserta"
              media={<div className="h-full bg-background" />}
              answerFirst
            />
            <SubmissionReviewCard
              title="Foster Siblings"
              status="submitted"
              file={{ href: "#", label: "Link download PDF" }}
            />
            <SubmissionReviewCard title="KMBUI Explorer" status="not-submitted" />
          </div>
        </PreviewSection>

        <PreviewSection title="Header variants">
          <div className="overflow-hidden rounded-2xl">
            <Header />
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl">
            <Header user={{ fullName: "Nama Peserta", batch: 2026 }} />
          </div>
        </PreviewSection>

        <PreviewSection
          id="shared-dashboard-layout"
          title="Shared dashboard page layout"
        >
          <p className="mb-5 text-b3 text-purple-100">
            Layout responsif untuk Tugas, Networking, KMBUI Explorer, Fossib,
            dan Kalyanamitta. Area kanan dapat diisi kalender, kuota, atau daftar
            permintaan pertemanan sesuai kebutuhan halaman.
          </p>
          <div className="h-[760px] overflow-auto rounded-2xl border border-white/10">
            <DashboardPageLayout
              activeItem="tasks"
              user={{ fullName: "Nama Peserta", batch: 2026 }}
              className="min-h-[760px]"
              rightRail={
                <div className="flex flex-col gap-5">
                  <h2 className="font-heading text-h4">Agenda</h2>
                  <WeekCalendar
                    selectedDate={calendarDate}
                    eventDates={["2026-06-13", "2026-06-15"]}
                    onDateChange={setCalendarDate}
                  />
                  <QuotaCard label="Angkatan 26" completed={5} total={10} />
                </div>
              }
            >
              <div className="flex max-w-2xl flex-col gap-6">
                <BackButton onClick={() => undefined} />
                <div>
                  <p className="mb-2 text-b3 text-yellow-300">Tugas</p>
                  <h2 className="font-heading text-h2">Networking</h2>
                </div>
                <TaskSubmissionPanel>
                  <Textarea placeholder="Tuliskan jawaban tugas..." />
                  <TaskFileUpload fileType="image" maxSizeMb={5} />
                </TaskSubmissionPanel>
              </div>
            </DashboardPageLayout>
          </div>
        </PreviewSection>

        <PreviewSection title="Sidebar variants">
          <p className="mb-5 text-b3 text-purple-100">
            Arahkan pointer atau fokuskan keyboard ke sidebar untuk membukanya.
            Gunakan tombol pin untuk mempertahankan state terbuka.
          </p>
          <div className="h-[620px] overflow-auto rounded-2xl bg-gradient-to-br from-purple-900 to-blue-900">
            <Sidebar
              activeItem="tasks"
              className="min-h-full"
              panelClassName="pt-20"
            />
          </div>
        </PreviewSection>

        <PreviewSection title="Footer">
          <div className="overflow-hidden rounded-2xl">
            <Footer
              contacts={[
                {
                  type: "instagram",
                  label: "Instagram PPMB",
                  href: "https://instagram.com/",
                },
                {
                  type: "line",
                  label: "LINE PPMB",
                  href: "https://line.me/",
                },
              ]}
            />
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}
