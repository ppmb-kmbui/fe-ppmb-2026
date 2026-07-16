"use client";

import { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";

import {
  BackButton,
  Button,
  DashboardPageLayout,
  FacultySelect,
  FileUpload,
  Input,
} from "@/components";
import { ImageUploadError, uploadImage } from "@/lib/image-upload";
import {
  getOwnProfile,
  updateOwnProfile,
  type ProfileUser,
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

export function ProfileClient() {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [form, setForm] = useState({
    fullname: "",
    lineId: "",
    whatsappNumber: "",
    faculty: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;

    getOwnProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setForm({
          fullname: data.fullname ?? "",
          lineId: data.lineId ?? "",
          whatsappNumber: data.whatsappNumber ?? "",
          faculty: data.faculty ?? "",
        });
      })
      .catch(() => {
        if (active) setError("Profil gagal dimuat.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    setError(undefined);
    setMessage(undefined);
    setIsSaving(true);

    try {
      const imgUrl = photo ? await uploadImage(photo) : undefined;
      const updated = await updateOwnProfile({
        fullname: form.fullname.trim(),
        lineId: form.lineId.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        faculty: form.faculty.trim(),
        ...(imgUrl ? { imgUrl } : {}),
      });
      setProfile(updated);
      setPhoto(null);
      setIsEditing(false);
      setMessage("Profil berhasil diperbarui.");
    } catch (saveError) {
      setError(
        saveError instanceof ImageUploadError
          ? saveError.message
          : "Profil gagal diperbarui. Periksa kembali format datanya.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing() {
    setError(undefined);
    setMessage(undefined);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (profile) {
      setForm({
        fullname: profile.fullname ?? "",
        lineId: profile.lineId ?? "",
        whatsappNumber: profile.whatsappNumber ?? "",
        faculty: profile.faculty ?? "",
      });
    }

    setPhoto(null);
    setError(undefined);
    setMessage(undefined);
    setIsEditing(false);
  }

  const name = profile?.fullname ?? "Nama Lengkap";

  return (
    <DashboardPageLayout
      activeItem="friends"
      user={
        profile
          ? { fullName: name, batch: profile.batch, imgUrl: profile.imgUrl }
          : undefined
      }
      mainClassName="md:pt-6"
      rightRail={null}
    >
      <div className="flex w-full max-w-[1345px] flex-col gap-8">
        <BackButton href="/" />

        {isLoading ? (
          <p className="rounded-2xl bg-blue-200/20 px-4 py-3 text-b2">
            Memuat profil...
          </p>
        ) : error && !profile ? (
          <p className="rounded-2xl bg-red-400/10 px-4 py-3 text-b2 text-red-100">
            {error}
          </p>
        ) : profile ? (
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-6 px-2 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <ProfileAvatar imgUrl={profile.imgUrl} />
                <div className="min-w-0">
                  {isEditing ? (
                    <Input
                      label="Nama Lengkap"
                      value={form.fullname}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          fullname: event.target.value,
                        }))
                      }
                      wrapperClassName="w-full sm:w-[420px]"
                    />
                  ) : (
                    <>
                      <h1 className="break-words font-heading text-h3 text-yellow-500 sm:text-h2">
                        {name}
                      </h1>
                      <p className="mt-2 text-b3 text-foreground sm:text-b2">
                        {profile.email}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3 lg:justify-end">
                {isEditing && (
                  <Button
                    type="button"
                    onClick={cancelEditing}
                    className="h-10 w-[74px] rounded-3xl bg-white/15 px-0 text-b3 hover:bg-white/25 sm:h-[50px] sm:w-[111px] sm:text-b2"
                  >
                    Batal
                  </Button>
                )}
                {isEditing ? (
                  <Button
                    type="button"
                    isLoading={isSaving}
                    onClick={handleSave}
                    className="h-10 w-[74px] rounded-3xl px-0 text-b3 sm:h-[50px] sm:w-[111px] sm:text-b2"
                  >
                    Simpan
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={startEditing}
                    className="h-10 w-[74px] rounded-3xl px-0 text-b3 sm:h-[50px] sm:w-[111px] sm:text-b2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </section>

            <section className="grid gap-x-5 gap-y-4 px-2 sm:px-8 md:grid-cols-2">
              {isEditing ? (
                <>
                  <FileUpload
                    label="Foto Profil"
                    hint="Lampirkan foto dengan format .png/.jpg/.jpeg, maksimal 5 MB."
                    accept="image/png,image/jpeg"
                    maxSizeMb={5}
                    disabled={isSaving}
                    onFileChange={setPhoto}
                    wrapperClassName="md:col-span-2"
                  />
                  <Input
                    label="ID Line"
                    value={form.lineId}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        lineId: event.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Nomor Whatsapp"
                    value={form.whatsappNumber}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        whatsappNumber: event.target.value,
                      }))
                    }
                  />
                  <FacultySelect
                    label="Fakultas"
                    value={form.faculty}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        faculty: event.target.value,
                      }))
                    }
                  />
                  <DisplayField label="Angkatan" value={profile.batch} />
                </>
              ) : (
                <>
                  <DisplayField label="ID Line" value={profile.lineId} />
                  <DisplayField
                    label="Nomor Whatsapp"
                    value={profile.whatsappNumber}
                  />
                  <DisplayField label="Fakultas" value={profile.faculty} />
                  <DisplayField label="Angkatan" value={profile.batch} />
                </>
              )}
            </section>

            {message && (
              <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
                {message}
              </p>
            )}
            {error && (
              <p className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-b2 text-red-100">
                {error}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </DashboardPageLayout>
  );
}
