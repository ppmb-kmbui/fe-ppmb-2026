"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { register, translateAuthError } from "@/lib/auth-api";
import { ImageUploadError, uploadImage } from "@/lib/image-upload";

import { SignupForm, type SignupFieldErrors, type SignupFormValues } from "./SignupForm";

export function SignupFormContainer() {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const [serverErrors, setServerErrors] = useState<SignupFieldErrors>({});

  async function handleSubmit(values: SignupFormValues) {
    setServerErrors({});
    setFormError(undefined);

    if (!values.photo) {
      setServerErrors({ photo: "Foto profil wajib diunggah" });
      return;
    }

    let imgUrl: string;
    try {
      imgUrl = await uploadImage(values.photo);
    } catch (error) {
      setFormError(
        error instanceof ImageUploadError ? error.message : "Gagal mengunggah foto",
      );
      return;
    }

    try {
      await register({
        fullName: values.fullName,
        lineId: values.lineId,
        whatsapp: values.whatsapp,
        email: values.email,
        faculty: values.faculty,
        batch: values.batch,
        password: values.password,
        confirmPassword: values.confirmPassword,
        imgUrl,
      });
      router.push("/login?registered=1");
    } catch (error) {
      const translated = translateAuthError(error);
      setServerErrors(translated.fieldErrors);
      setFormError(translated.formError);
    }
  }

  return (
    <SignupForm
      onSubmit={handleSubmit}
      formError={formError}
      serverErrors={serverErrors}
    />
  );
}
