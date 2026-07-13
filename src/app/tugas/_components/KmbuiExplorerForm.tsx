"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, Input, TaskFileUpload } from "@/components";
import { uploadImage } from "@/lib/image-upload";
import {
  getExplorerSubmission,
  getTaskApiErrorMessage,
  submitExplorer,
} from "@/lib/task-api";

export function KmbuiExplorerForm() {
  const [activityName, setActivityName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;

    getExplorerSubmission()
      .then((submission) => {
        if (!active) return;
        setExistingPhotoUrl(submission?.img_url ?? "");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(getTaskApiErrorMessage(loadError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(undefined);
    setMessage(undefined);

    if (!file) {
      setError("Foto kegiatan wajib dipilih sebelum submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const photoUrl = await uploadImage(file);
      const submission = await submitExplorer(photoUrl);
      setExistingPhotoUrl(submission?.img_url ?? photoUrl);
      setMessage("Submission KMBUI Explorer berhasil disimpan.");
    } catch (submitError) {
      setError(getTaskApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <Input
        label="Nama Kegiatan"
        hint="Saat ini backend belum menyimpan nama kegiatan; field ini hanya sebagai catatan saat mengisi."
        placeholder="Tulis nama kegiatan yang sudah kamu ikuti!"
        value={activityName}
        disabled={isLoading || isSubmitting}
        onChange={(event) => setActivityName(event.target.value)}
        className="bg-[rgba(41,0,75,0.25)] placeholder:text-white/50"
      />

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Upload Hasil KMBUI Explorer
        </h2>
        {existingPhotoUrl && (
          <a
            href={existingPhotoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-b2 text-yellow-100 underline underline-offset-4"
          >
            Lihat foto yang sudah tersimpan
          </a>
        )}
        <TaskFileUpload
          fileType="image"
          maxSizeMb={5}
          disabled={isLoading || isSubmitting}
          onFileChange={setFile}
        />
      </div>

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

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isLoading}
        className="h-[50px] rounded-2xl"
      >
        Submit
      </Button>
    </form>
  );
}
