"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserShield } from "react-icons/fa6";

import { ParticipantCard } from "@/components/admin";
import type { Participant } from "@/components/admin/Participant";
import { Header, type HeaderUser } from "@/components/layout/Header";
import { getProfileCached } from "@/lib/auth-api";
import { getParticipants } from "@/lib/admin-api";

const adminNavItems = [
  {
    key: "admin",
    label: "Admin",
    href: "/admin",
    icon: <FaUserShield />,
  },
] as const;

const participantsPerPage = 12;

export default function AdminPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<HeaderUser>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;

    async function loadAdminPage() {
      setIsLoading(true);
      setError(undefined);

      try {
        const profile = await getProfileCached();
        if (!profile.isAdmin) {
          router.replace("/");
          return;
        }

        if (!active) return;
        setAdminUser({
          fullName: profile.fullname ?? "Admin",
          subtitle: "Admin",
          imgUrl: profile.imgUrl,
        });

        const data = await getParticipants({
          page,
          limit: participantsPerPage,
          search: debouncedSearch,
        });
        if (!active) return;

        setParticipants(data.users);
        setTotalPages(Math.max(1, data.pagination.totalPages));
        setTotalParticipants(data.pagination.total);
      } catch {
        if (active) setError("Data admin gagal dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadAdminPage();

    return () => {
      active = false;
    };
  }, [debouncedSearch, page, router]);

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
      <Header
        activeItem="admin"
        mobileNavItems={adminNavItems}
        user={adminUser}
        className="relative z-30"
      />

      <main className="relative z-10 min-h-[calc(100svh-86px)] px-4 py-9 md:min-h-[calc(100svh-100px)] md:px-[60px]">
        <div className="flex w-full flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <h1 className="bg-[linear-gradient(161.67deg,var(--gradient-header-start)_11.592%,var(--gradient-header-end)_72.166%)] bg-clip-text pb-2 font-heading text-h2 leading-[1.15] text-transparent md:text-h1">
              Anggota dan Penugasan
            </h1>

            <label className="w-full md:max-w-sm">
              <span className="sr-only">Cari peserta</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, fakultas, angkatan"
                className="h-[50px] w-full rounded-2xl border border-white/10 bg-purple-900/30 px-5 text-b2 text-purple-50 outline-none placeholder:text-purple-200 focus:border-purple-200"
              />
            </label>
          </div>

          {isLoading && (
            <p className="rounded-2xl bg-blue-200/20 px-4 py-3 text-b2">
              Memuat data peserta...
            </p>
          )}

          {error && (
            <p className="rounded-2xl bg-red-400/10 px-4 py-3 text-b2 text-red-100">
              {error}
            </p>
          )}

          {!isLoading && !error && participants.length === 0 && (
            <p className="rounded-2xl bg-blue-200/20 px-4 py-3 text-b2">
              Tidak ada peserta yang cocok.
            </p>
          )}

          <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
            {participants.map((participant) => {
              const name = participant.fullname ?? "Nama Peserta";

              return (
                <ParticipantCard
                  key={participant.id}
                  name={name}
                  batch={participant.batch}
                  progress={participant.progress.percentage}
                  avatar={
                    participant.imgUrl ? (
                      <img
                        src={participant.imgUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : undefined
                  }
                  href={`/admin/peserta/${participant.id}`}
                />
              );
            })}
          </div>

          {!isLoading && !error && participants.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-purple-900/20 px-4 py-3 text-b3 sm:flex-row">
              <p>
                Menampilkan {participants.length} dari {totalParticipants} peserta
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-xl bg-purple-300/40 px-4 py-2 transition-colors hover:bg-purple-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <span>
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="rounded-xl bg-purple-300/40 px-4 py-2 transition-colors hover:bg-purple-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
