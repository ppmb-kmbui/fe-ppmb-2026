"use client";

import { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";

import { BackButton, DashboardPageLayout } from "@/components";
import type { FriendUser } from "@/lib/friend-api";
import { getPublicProfile } from "@/lib/profile-api";

function DisplayField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-subheading text-s5 font-semibold text-foreground sm:text-s3">
        {label}
      </p>
      <div className="min-h-10 rounded-3xl bg-[rgba(140,88,183,0.3)] px-6 py-2.5 text-b3 text-purple-200 sm:min-h-[50px] sm:text-b1">
        {value || "-"}
      </div>
    </div>
  );
}

function ProfileAvatar({ imgUrl }: { imgUrl?: string | null }) {
  if (imgUrl) {
    return (
      <span
        aria-hidden="true"
        className="size-[129px] shrink-0 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imgUrl})` }}
      />
    );
  }

  return (
    <FaCircleUser
      aria-hidden="true"
      className="size-[129px] shrink-0 text-yellow-300"
    />
  );
}

export function PublicProfileClient({ id }: { id: number }) {
  const [profile, setProfile] = useState<FriendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    getPublicProfile(id)
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setNotFound(!data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const name = profile?.fullname ?? "Nama Lengkap";

  return (
    <DashboardPageLayout activeItem="friends" mainClassName="md:pt-6" rightRail={null}>
      <div className="flex w-full max-w-[1345px] flex-col gap-8">
        <BackButton href="/kalyanamitta?tab=connected" />

        {isLoading ? (
          <p className="rounded-2xl bg-blue-200/20 px-4 py-3 text-b2">
            Memuat profil...
          </p>
        ) : notFound || !profile ? (
          <p className="rounded-2xl bg-red-400/10 px-4 py-3 text-b2 text-red-100">
            Profil tidak ditemukan dari daftar koneksi.
          </p>
        ) : (
          <>
            <section className="flex flex-col items-center gap-4 px-2 text-center sm:flex-row sm:px-8 sm:text-left">
              <ProfileAvatar imgUrl={profile.imgUrl} />
              <div className="min-w-0">
                <h1 className="break-words font-heading text-h3 text-yellow-500 sm:text-h2">
                  {name}
                </h1>
                <p className="mt-2 text-b3 text-foreground sm:text-b1">
                  {profile.faculty || "Fakultas belum diisi"} - Angkatan{" "}
                  {profile.batch}
                </p>
              </div>
            </section>

            <section className="grid gap-x-5 gap-y-4 px-2 sm:px-8 md:grid-cols-2">
              <DisplayField label="ID Line" value={profile.lineId} />
              <DisplayField
                label="Nomor Whatsapp"
                value={profile.whatsappNumber}
              />
            </section>
          </>
        )}
      </div>
    </DashboardPageLayout>
  );
}
