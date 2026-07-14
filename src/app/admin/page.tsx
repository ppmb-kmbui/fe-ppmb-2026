"use client";

import { useEffect, useState } from "react";

import { ParticipantCard } from "@/components/admin";
import { Participant } from "@/components/admin/Participant";
import { Header } from "@/components/layout/Header";
import { getParticipants } from "@/lib/admin-api";
import { MobileAdminPage } from "@/components/admin/MobileAdminPage";

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function loadParticipants() {
      try {
        const users = await getParticipants();
        setParticipants(users);
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    }

    void loadParticipants();
  }, []);

  return (
    <>
      <div className="hidden md:block relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
        <Header
          user={{
            fullName: "Nama Lengkap",
            subtitle: "Admin",
          }}
        />

        <main className="relative z-10 min-h-[calc(100svh-100px)] px-4 py-9 md:px-[60px]">
          <div className="flex w-full flex-col gap-8 md:gap-10">
            <h1 className="bg-[linear-gradient(161.67deg,var(--gradient-header-start)_11.592%,var(--gradient-header-end)_72.166%)] bg-clip-text pb-2 font-heading text-h1 leading-[1.15] text-transparent">
              Anggota dan Penugasan
            </h1>

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,450px),1fr))] gap-5">
              {participants.map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  name={participant.fullname}
                  batch={participant.batch}
                  progress={participant.progress.percentage}
                  avatar={
                    participant.imgUrl ? (
                      <img
                        src={participant.imgUrl}
                        alt={participant.fullname}
                        className="h-full w-full object-cover"
                      />
                    ) : undefined
                  }
                  href={`/admin/peserta/${participant.id}`}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileAdminPage />
    </>
  );
}