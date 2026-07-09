import { ParticipantCard } from "@/components/admin";
import { Header } from "@/components/layout/Header";

const participants = Array.from({ length: 9 }, (_, index) => ({
  name: "Jaysen Lestari",
  batch: 2024,
  progress: 70,
  avatar: "",
  href: `/admin/peserta/${ index + Math.round(Math.random()* 1234.1234) }`
}));

export default function AdminPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
        <Header user={ { fullName: "Nama Lengkap",  subtitle: "Admin" } } />
        <main className="relative z-10 min-h-[calc(100svh-100px)] px-4 py-9 md:px-[60px]">

          <div className="flex w-full flex-col gap-8 md:gap-10">
            <h1 className="bg-[linear-gradient(126deg,var(--gradient-header-start)_0%,var(--gradient-header-end)_100%)] bg-clip-text pb-2 font-heading text-h1 leading-[1.15] text-transparent">
              Anggota dan Penugasan
            </h1>

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,450px),1fr))] gap-5">
              {participants.map((participant) => (
                <ParticipantCard
                  name={participant.name}
                  batch={participant.batch}
                  progress={participant.progress}
                  avatar={participant.avatar}
                  href={participant.href}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      <div className="block md:hidden">

      </div>
    </>
  );
}