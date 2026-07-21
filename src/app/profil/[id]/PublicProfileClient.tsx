"use client";

import { useEffect, useState } from "react";

import { BackButton, DashboardPageLayout, UserAvatar } from "@/components";
import { ApiError } from "@/lib/api";
import {
  getPublicProfile,
  type PublicProfileUser,
} from "@/lib/profile-api";

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

export function PublicProfileClient({ id }: { id: number }) {
  const [profile, setProfile] = useState<PublicProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setIsLoading(true);
      setNotFound(false);
      setLoadError("");
      setProfile(null);
    });

    getPublicProfile(id)
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setNotFound(!data);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true);
          return;
        }
        setLoadError(
          error instanceof ApiError && error.status === 401
            ? "Sesi login berakhir. Silakan masuk kembali."
            : "Profil belum dapat dimuat. Silakan coba lagi.",
        );
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
        <BackButton href="/kalyanamitta" />

        {isLoading ? (
          <p className="rounded-2xl bg-blue-200/20 px-4 py-3 text-b2">
            Memuat profil...
          </p>
        ) : loadError ? (
          <p
            role="alert"
            className="rounded-2xl bg-red-400/10 px-4 py-3 text-b2 text-red-100"
          >
            {loadError}
          </p>
        ) : notFound || !profile ? (
          <p className="rounded-2xl bg-red-400/10 px-4 py-3 text-b2 text-red-100">
            Profil peserta tidak ditemukan.
          </p>
        ) : (
          <>
            <section className="flex flex-col items-center gap-4 px-2 text-center sm:flex-row sm:px-8 sm:text-left">
              <UserAvatar
                src={profile.imgUrl}
                alt={`Foto ${name}`}
                className="size-[129px] rounded-full"
              />
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
