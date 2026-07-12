"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { login, translateAuthError } from "@/lib/auth-api";

import { LoginForm, type LoginFieldErrors, type LoginFormValues } from "./LoginForm";

export interface LoginFormContainerProps {
  successMessage?: string;
}

export function LoginFormContainer({ successMessage }: LoginFormContainerProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const [serverErrors, setServerErrors] = useState<LoginFieldErrors>({});

  async function handleSubmit(values: LoginFormValues) {
    setServerErrors({});
    setFormError(undefined);

    try {
      await login(values);
      router.replace("/");
      router.refresh();
    } catch (error) {
      const translated = translateAuthError(error);
      setServerErrors(translated.fieldErrors);
      setFormError(translated.formError);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {successMessage && (
        <p
          role="status"
          className="w-full rounded-2xl border border-green-400 bg-green-200/50 px-6 py-3 text-b2 text-foreground"
        >
          {successMessage}
        </p>
      )}
      <LoginForm
        onSubmit={handleSubmit}
        formError={formError}
        serverErrors={serverErrors}
      />
    </div>
  );
}
