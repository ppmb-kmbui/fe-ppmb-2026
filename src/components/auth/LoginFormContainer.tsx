"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { getProfileCached, login, translateAuthError } from "@/lib/auth-api";

import { LoginForm, type LoginFieldErrors, type LoginFormValues } from "./LoginForm";

export interface LoginFormContainerProps {
  successMessage?: string;
}

export const registrationToastDurationMs = 4000;

export function LoginFormContainer({ successMessage }: LoginFormContainerProps) {
  const { replace, refresh } = useRouter();
  const [formError, setFormError] = useState<string>();
  const [serverErrors, setServerErrors] = useState<LoginFieldErrors>({});
  const [visibleSuccessMessage, setVisibleSuccessMessage] = useState(successMessage);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissSuccessMessage = useCallback(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }

    setVisibleSuccessMessage(undefined);
    replace("/login", { scroll: false });
  }, [replace]);

  useEffect(() => {
    if (!visibleSuccessMessage) return;

    toastTimer.current = setTimeout(
      dismissSuccessMessage,
      registrationToastDurationMs,
    );

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [dismissSuccessMessage, visibleSuccessMessage]);

  async function handleSubmit(values: LoginFormValues) {
    setServerErrors({});
    setFormError(undefined);

    try {
      await login(values);
      const profile = await getProfileCached();
      replace(profile.isAdmin ? "/admin" : "/");
      refresh();
    } catch (error) {
      const translated = translateAuthError(error);
      setServerErrors(translated.fieldErrors);
      setFormError(translated.formError);
    }
  }

  return (
    <>
      {visibleSuccessMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[100] flex w-[min(calc(100vw-2rem),430px)] -translate-x-1/2 items-start gap-3 rounded-2xl border border-green-300/40 bg-green-700/90 px-5 py-4 text-b2 text-green-50 shadow-modal backdrop-blur-glass"
        >
          <p className="min-w-0 flex-1">{visibleSuccessMessage}</p>
          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={dismissSuccessMessage}
            className="grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none text-green-50 transition-colors hover:bg-white/15"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <div className="flex w-full flex-col gap-4">
        <LoginForm
          onSubmit={handleSubmit}
          formError={formError}
          serverErrors={serverErrors}
        />
      </div>
    </>
  );
}
