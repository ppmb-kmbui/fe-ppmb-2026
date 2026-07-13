"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";

import { Button, FileUpload, Input } from "@/components/ui";

export interface SignupFormValues {
  fullName: string;
  lineId: string;
  whatsapp: string;
  email: string;
  faculty: string;
  batch: number;
  password: string;
  confirmPassword: string;
  photo: File | null;
}

export type SignupFieldErrors = Partial<Record<keyof SignupFormValues, string>>;

export interface SignupFormProps {
  onSubmit?: (values: SignupFormValues) => Promise<void> | void;
  formError?: string;
  serverErrors?: SignupFieldErrors;
}

const WHATSAPP_REGEX = /^(?:\+62|62|0)8\d{7,12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_BATCH = 2020;
const MAX_BATCH = 2100;

export function SignupForm({ onSubmit, formError, serverErrors }: SignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [lineId, setLineId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedErrors: SignupFieldErrors = {
    fullName: fieldErrors.fullName ?? serverErrors?.fullName,
    lineId: fieldErrors.lineId ?? serverErrors?.lineId,
    whatsapp: fieldErrors.whatsapp ?? serverErrors?.whatsapp,
    email: fieldErrors.email ?? serverErrors?.email,
    faculty: fieldErrors.faculty ?? serverErrors?.faculty,
    batch: fieldErrors.batch ?? serverErrors?.batch,
    password: fieldErrors.password ?? serverErrors?.password,
    confirmPassword: fieldErrors.confirmPassword ?? serverErrors?.confirmPassword,
    photo: fieldErrors.photo ?? serverErrors?.photo,
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignupFieldErrors = {};
    if (!fullName) {
      nextErrors.fullName = "Nama lengkap wajib diisi";
    } else if (fullName.trim().length < 3) {
      nextErrors.fullName = "Nama lengkap minimal 3 karakter";
    }
    if (!lineId) {
      nextErrors.lineId = "ID Line wajib diisi";
    } else if (lineId.trim().length < 2) {
      nextErrors.lineId = "ID Line minimal 2 karakter";
    }
    if (!whatsapp) {
      nextErrors.whatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!WHATSAPP_REGEX.test(whatsapp.trim())) {
      nextErrors.whatsapp = "Nomor WhatsApp tidak valid";
    }
    if (!email) {
      nextErrors.email = "Email wajib diisi";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Format email tidak valid";
    }
    if (!faculty) {
      nextErrors.faculty = "Fakultas wajib diisi";
    } else if (faculty.trim().length < 2) {
      nextErrors.faculty = "Fakultas minimal 2 karakter";
    }
    if (!batch) {
      nextErrors.batch = "Angkatan wajib diisi";
    } else if (!/^\d+$/.test(batch)) {
      nextErrors.batch = "Angkatan harus berupa angka";
    } else if (Number(batch) < MIN_BATCH || Number(batch) > MAX_BATCH) {
      nextErrors.batch = `Angkatan harus antara ${MIN_BATCH}-${MAX_BATCH}`;
    }
    if (!password) {
      nextErrors.password = "Kata sandi wajib diisi";
    } else if (password.length < 8) {
      nextErrors.password = "Kata sandi minimal 8 karakter";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Konfirmasi kata sandi wajib diisi";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok";
    }
    if (!photo) {
      nextErrors.photo = "Foto profil wajib diunggah";
    }
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        fullName,
        lineId,
        whatsapp,
        email,
        faculty,
        batch: Number(batch),
        password,
        confirmPassword,
        photo,
      });
    } catch {
      // Parent is responsible for surfacing the failure via `formError`.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-8">
      <div className="flex w-full flex-col items-start gap-4">
        <h1
          className="w-full bg-clip-text break-words font-heading text-h2 leading-[1.35] text-transparent sm:text-h1"
          style={{
            backgroundImage:
              "linear-gradient(175.54deg, var(--gradient-header-start) 11.592%, var(--gradient-header-end) 72.166%)",
          }}
        >
          Mulai Perjalananmu
        </h1>
        <p className="font-body text-b3 text-foreground sm:text-b1">
          Lengkapi data diri di bawah ini untuk bergabung.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col items-start gap-6"
      >
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Input
            type="text"
            name="fullName"
            autoComplete="name"
            label="Nama Lengkap (sesuai SIAK)"
            placeholder="Masukan nama lengkap kamu!"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            error={displayedErrors.fullName}
          />
          <Input
            type="text"
            name="lineId"
            label="ID Line"
            placeholder="Masukkan id line kamu!"
            value={lineId}
            onChange={(event) => setLineId(event.target.value)}
            error={displayedErrors.lineId}
          />
          <Input
            type="tel"
            name="whatsapp"
            autoComplete="tel"
            label="Nomor Whatsapp"
            placeholder="Contoh : 0812XXXXX"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            error={displayedErrors.whatsapp}
          />
          <Input
            type="email"
            name="email"
            autoComplete="email"
            label="Email"
            placeholder="Contoh : johndoe@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={displayedErrors.email}
          />
          <Input
            type="text"
            name="faculty"
            label="Fakultas"
            placeholder="Masukkan fakultas kamu!"
            value={faculty}
            onChange={(event) => setFaculty(event.target.value)}
            error={displayedErrors.faculty}
          />
          <Input
            type="text"
            inputMode="numeric"
            name="batch"
            label="Angkatan"
            placeholder="Contoh : 2024"
            value={batch}
            onChange={(event) => setBatch(event.target.value)}
            error={displayedErrors.batch}
          />
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            label="Kata Sandi (Min. 8 Karakter)"
            placeholder="Masukkan kata sandi!"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={displayedErrors.password}
          />
          <Input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            label="Konfirmasi Kata Sandi"
            placeholder="Masukkan kembali kata sandi yang telah dibuat!"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={displayedErrors.confirmPassword}
          />
        </div>

        <FileUpload
          label="Foto Profil"
          hint="Lampirkan foto dengan format .png/.jpg/.jpeg, maksimal 5 MB."
          accept="image/png,image/jpeg"
          maxSizeMb={5}
          onFileChange={setPhoto}
          error={displayedErrors.photo}
        />

        {formError && (
          <p role="alert" className="text-b2 text-red-300">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Daftar
        </Button>
      </form>

      <p className="w-full text-center font-subheading text-s5 font-semibold text-foreground sm:text-s3">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-200 hover:text-blue-100">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
