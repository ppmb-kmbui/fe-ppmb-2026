import { FriendRequestCard, MemberCard, ParticipantCard, SearchInput } from "@/components";

export default function KalyanamittaPage() {
  return (
    <main className="">
      <section id="timeline" className="flex flex-col gap-6">
        <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
          <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
            Kalyanamitta
          </span>
        </h1>
        <SearchInput placeholder="Cari Kalyanamitta" />
        <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <MemberCard name="Jaysen Lestari" batch={2024} />
          <FriendRequestCard name="Jaysen Lestari" batch={2024} />
          <ParticipantCard name="Jaysen Lestari" batch={2024} progress={70} />
        </div>
      </section>
    </main>
  );
}
