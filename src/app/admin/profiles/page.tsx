"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { BackButton } from "@/components";
import { getAdminNavigationItems } from "@/components/admin";
import { Header, type HeaderUser } from "@/components/layout/Header";
import { Button, SearchInput, UserAvatar } from "@/components/ui";
import { ApiError } from "@/lib/api";
import {
  getSuperAdminProfiles,
  setSuperAdminProfileVisibility,
  type ProfileVisibilityFilter,
  type SuperAdminProfile,
  type SuperAdminProfileBatch,
} from "@/lib/admin-api";
import { getProfileCached } from "@/lib/auth-api";
import { getSuperAdminAccessRedirect } from "@/lib/superadmin-access";

const profilesPerPage = 12;
const profileBatches: readonly SuperAdminProfileBatch[] = [
  2026,
  2025,
  2024,
  2023,
];

function getRequestErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (typeof error.payload?.error === "string") return error.payload.error;
    return error.payload?.message ?? fallback;
  }

  return fallback;
}

export default function SuperAdminProfilesPage() {
  const router = useRouter();
  const [access, setAccess] = useState<"checking" | "allowed" | "denied">(
    "checking",
  );
  const [headerUser, setHeaderUser] = useState<HeaderUser>();
  const [profiles, setProfiles] = useState<SuperAdminProfile[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [batch, setBatch] = useState<SuperAdminProfileBatch>();
  const [visibility, setVisibility] =
    useState<ProfileVisibilityFilter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [pendingProfileIds, setPendingProfileIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;

    async function authorize() {
      try {
        const profile = await getProfileCached();
        if (!active) return;

        const redirect = getSuperAdminAccessRedirect(profile);
        if (redirect) {
          setAccess("denied");
          router.replace(redirect);
          return;
        }

        setHeaderUser({
          fullName: profile.fullname ?? "Superadmin",
          subtitle: "Superadmin",
          imgUrl: profile.imgUrl,
        });
        setAccess("allowed");
      } catch {
        if (!active) return;
        setAccess("denied");
        router.replace("/login");
      }
    }

    void authorize();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (access !== "allowed") return;

    let active = true;

    async function loadProfiles() {
      setIsLoading(true);
      setLoadError(undefined);

      try {
        const data = await getSuperAdminProfiles({
          page,
          limit: profilesPerPage,
          search: debouncedSearch,
          batch,
          visibility,
        });
        if (!active) return;

        const nextTotalPages = Math.max(1, data.pagination.totalPages);
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
          return;
        }

        setProfiles(data.profiles);
        setTotalPages(nextTotalPages);
        setTotalProfiles(data.pagination.total);
      } catch (error) {
        if (!active) return;
        setLoadError(
          getRequestErrorMessage(
            error,
            "Daftar profil gagal dimuat. Silakan coba lagi.",
          ),
        );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProfiles();

    return () => {
      active = false;
    };
  }, [
    access,
    batch,
    debouncedSearch,
    page,
    refreshVersion,
    visibility,
  ]);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => setSuccessMessage(undefined), 4500);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  async function handleVisibilityChange(profile: SuperAdminProfile) {
    if (pendingProfileIds.has(profile.id)) return;

    const hidden = !profile.isProfileHidden;
    const name = profile.fullname ?? profile.email;
    setPendingProfileIds((current) => new Set(current).add(profile.id));
    setActionError(undefined);
    setSuccessMessage(undefined);

    try {
      const updatedProfile = await setSuperAdminProfileVisibility(
        profile.id,
        hidden,
      );
      setProfiles((current) =>
        current.map((item) =>
          item.id === updatedProfile.id ? updatedProfile : item,
        ),
      );
      setSuccessMessage(
        hidden
          ? `Profil ${name} berhasil disembunyikan.`
          : `Profil ${name} berhasil ditampilkan kembali.`,
      );
      setRefreshVersion((current) => current + 1);
    } catch (error) {
      setActionError(
        getRequestErrorMessage(
          error,
          `Visibilitas profil ${name} gagal diperbarui.`,
        ),
      );
    } finally {
      setPendingProfileIds((current) => {
        const next = new Set(current);
        next.delete(profile.id);
        return next;
      });
    }
  }

  if (access !== "allowed") {
    return (
      <main className="grid min-h-screen place-items-center bg-[image:var(--gradient-dashboard)] px-4 text-foreground">
        <p role="status" className="rounded-2xl bg-blue-200/20 px-5 py-4 text-b2">
          {access === "checking"
            ? "Memeriksa akses SUPERADMIN..."
            : "Mengalihkan ke halaman yang sesuai..."}
        </p>
      </main>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
      <Header
        activeItem="profiles"
        mobileNavItems={getAdminNavigationItems(true)}
        user={headerUser}
        className="relative z-30"
      />

      <main className="relative z-10 min-h-[calc(100svh-86px)] px-4 py-8 md:min-h-[calc(100svh-100px)] md:px-[60px] md:py-10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7">
          <BackButton href="/admin" label="Kembali ke admin" />

          <section className="flex flex-col gap-3">
            <span className="text-b3 font-semibold tracking-[0.2em] text-yellow-200">
              SUPERADMIN
            </span>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="bg-[linear-gradient(161.67deg,var(--gradient-header-start)_11.592%,var(--gradient-header-end)_72.166%)] bg-clip-text pb-2 font-heading text-h2 leading-[1.15] text-transparent md:text-h1">
                  Visibilitas Profil
                </h1>
                <p className="text-b2 leading-relaxed text-purple-50/80">
                  Atur siapa yang muncul di pencarian profil dan pilihan target
                  Networking. Menyembunyikan profil tidak menghapus akun.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-purple-900/25 px-5 py-4">
                <p className="text-b3 text-purple-100">Hasil sesuai filter</p>
                <p className="mt-1 font-heading text-h3 text-yellow-100">
                  {totalProfiles}
                </p>
              </div>
            </div>
          </section>

          <section
            aria-label="Filter profil"
            className="grid gap-4 rounded-3xl border border-white/10 bg-purple-900/20 p-4 shadow-modal md:grid-cols-2 md:p-5 xl:grid-cols-[minmax(280px,1fr)_220px_220px]"
          >
            <SearchInput
              id="profile-search"
              label="Cari profil"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau email"
              className="h-[54px] border-white/15 bg-purple-950/20"
            />

            <label className="flex flex-col gap-2 text-b3 text-purple-100">
              Angkatan
              <select
                value={batch ?? ""}
                onChange={(event) => {
                  const nextBatch = Number(event.target.value);
                  setBatch(
                    profileBatches.includes(
                      nextBatch as SuperAdminProfileBatch,
                    )
                      ? (nextBatch as SuperAdminProfileBatch)
                      : undefined,
                  );
                  setPage(1);
                }}
                className="h-[54px] rounded-2xl border border-white/15 bg-purple-950/35 px-4 text-b2 text-foreground outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Semua angkatan</option>
                {profileBatches.map((profileBatch) => (
                  <option key={profileBatch} value={profileBatch}>
                    Angkatan {profileBatch}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-b3 text-purple-100">
              Status profil
              <select
                value={visibility}
                onChange={(event) => {
                  setVisibility(
                    event.target.value as ProfileVisibilityFilter,
                  );
                  setPage(1);
                }}
                className="h-[54px] rounded-2xl border border-white/15 bg-purple-950/35 px-4 text-b2 text-foreground outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">Semua status</option>
                <option value="visible">Terlihat</option>
                <option value="hidden">Tersembunyi</option>
              </select>
            </label>
          </section>

          {(successMessage || actionError) && (
            <div
              role={actionError ? "alert" : "status"}
              aria-live="polite"
              className={`rounded-2xl border px-5 py-4 text-b2 ${
                actionError
                  ? "border-red-300/35 bg-red-500/10 text-red-100"
                  : "border-green-300/35 bg-green-500/10 text-green-100"
              }`}
            >
              {actionError ?? successMessage}
            </div>
          )}

          {loadError && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-2xl border border-red-300/35 bg-red-500/10 px-5 py-4 text-b2 text-red-100 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => setRefreshVersion((current) => current + 1)}
                className="shrink-0 rounded-xl bg-red-100/10 px-4 py-2 font-semibold hover:bg-red-100/20"
              >
                Coba lagi
              </button>
            </div>
          )}

          {isLoading && profiles.length === 0 && !loadError && (
            <p
              role="status"
              className="rounded-2xl bg-blue-200/20 px-5 py-4 text-b2"
            >
              Memuat daftar profil...
            </p>
          )}

          {!isLoading && !loadError && profiles.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/15 bg-purple-900/15 px-6 py-14 text-center">
              <p className="font-subheading text-s4 text-yellow-50">
                Tidak ada profil yang cocok
              </p>
              <p className="mt-2 text-b3 text-purple-100">
                Coba ubah kata pencarian atau filter yang dipilih.
              </p>
            </div>
          )}

          {profiles.length > 0 && !loadError && (
            <section
              aria-label="Daftar profil"
              aria-busy={isLoading || undefined}
              className={`grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${
                isLoading ? "opacity-70" : ""
              }`}
            >
              {profiles.map((profile) => {
                const name = profile.fullname ?? "Nama belum tersedia";
                const isPending = pendingProfileIds.has(profile.id);

                return (
                  <article
                    key={profile.id}
                    className="flex min-w-0 flex-col gap-5 rounded-3xl border border-white/10 bg-blue-200/20 p-5 shadow-modal"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <UserAvatar
                        src={profile.imgUrl}
                        alt={`Foto ${name}`}
                        className="size-16 shrink-0 rounded-2xl sm:size-20"
                        imageClassName="object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h2 className="min-w-0 break-words font-subheading text-s4 text-yellow-50">
                            {name}
                          </h2>
                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-b3 font-semibold ${
                              profile.isProfileHidden
                                ? "bg-red-400/15 text-red-100"
                                : "bg-green-400/15 text-green-100"
                            }`}
                          >
                            {profile.isProfileHidden ? (
                              <FaEyeSlash aria-hidden="true" />
                            ) : (
                              <FaEye aria-hidden="true" />
                            )}
                            {profile.isProfileHidden
                              ? "Tersembunyi"
                              : "Terlihat"}
                          </span>
                        </div>
                        <p className="mt-1 break-all text-b3 text-purple-100">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-purple-950/20 p-4 text-b3">
                      <div>
                        <dt className="text-purple-200">Angkatan</dt>
                        <dd className="mt-1 font-semibold text-yellow-50">
                          {profile.batch}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-purple-200">Fakultas</dt>
                        <dd className="mt-1 break-words font-semibold text-yellow-50">
                          {profile.faculty ?? "-"}
                        </dd>
                      </div>
                    </dl>

                    <Button
                      isLoading={isPending}
                      disabled={isLoading}
                      onClick={() => void handleVisibilityChange(profile)}
                      aria-label={`${
                        profile.isProfileHidden ? "Tampilkan" : "Sembunyikan"
                      } profil ${name}`}
                      className={`mt-auto h-12 text-s5 ${
                        profile.isProfileHidden
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-red-500/80 hover:bg-red-500"
                      }`}
                    >
                      {profile.isProfileHidden
                        ? "Tampilkan profil"
                        : "Sembunyikan profil"}
                    </Button>
                  </article>
                );
              })}
            </section>
          )}

          {!loadError && profiles.length > 0 && (
            <nav
              aria-label="Paginasi profil"
              className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-purple-900/20 px-4 py-3 text-b3 sm:flex-row"
            >
              <p>
                Menampilkan {profiles.length} dari {totalProfiles} profil
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="rounded-xl bg-purple-300/40 px-4 py-2 transition-colors hover:bg-purple-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <span aria-current="page">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1),
                    )
                  }
                  className="rounded-xl bg-purple-300/40 px-4 py-2 transition-colors hover:bg-purple-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}
