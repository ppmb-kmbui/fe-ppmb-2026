"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";

import { Button, Input } from "@/components/ui";

export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  formError?: string;
  serverErrors?: LoginFieldErrors;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm({ onSubmit, formError, serverErrors }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedErrors: LoginFieldErrors = {
    email: fieldErrors.email ?? serverErrors?.email,
    password: fieldErrors.password ?? serverErrors?.password,
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: LoginFieldErrors = {};
    if (!email) {
      nextErrors.email = "Email wajib diisi";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Format email tidak valid";
    }
    if (!password) nextErrors.password = "Kata sandi wajib diisi";
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ email, password });
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
              "linear-gradient(161.67deg, var(--gradient-header-start) 11.592%, var(--gradient-header-end) 72.166%)",
          }}
        >
          Selamat Datang Kembali!
        </h1>
        <p className="font-body text-b3 text-foreground sm:text-b1">
          Silakan masuk untuk melanjutkan aktivitas dan tugas kamu.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col items-start gap-8"
      >
        <div className="flex w-full flex-col items-start gap-4">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            label="Email"
            placeholder="Masukan email akun PPMB kamu!"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={displayedErrors.email}
          />
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            label="Kata Sandi"
            placeholder="Masukan kata sandi kamu!"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={displayedErrors.password}
          />
        </div>

        {formError && (
          <p role="alert" className="text-b2 text-red-300">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Masuk
        </Button>
      </form>

      <p className="w-full text-center font-subheading text-s5 font-semibold text-foreground sm:text-s3">
        Belum punya akun?{" "}
        <Link href="/signup" className="text-blue-200 hover:text-blue-100">
          Daftar Sekarang
        </Link>
      </p>
    </div>
  );
}
