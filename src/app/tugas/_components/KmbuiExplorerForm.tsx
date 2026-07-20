"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, Input, TaskFileUpload } from "@/components";
import { uploadImage } from "@/lib/image-upload";
import {
  getClosedSubmissionMessage,
  isTaskSubmissionClosed,
} from "@/lib/task-deadlines";
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
  const isSubmissionClosed = isTaskSubmissionClosed("explorer");

  useEffect(() => {
    let active = true;

    getExplorerSubmission()
      .then((submission) => {
        if (!active) return;
        setActivityName(submission?.activity_name ?? "");
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

    if (isSubmissionClosed) {
      setError(getClosedSubmissionMessage());
      return;
    }

    if (!activityName.trim()) {
      setError("Nama kegiatan wajib diisi.");
      return;
    }

    if (!file && !existingPhotoUrl) {
      setError("Foto kegiatan wajib dipilih sebelum dikumpulkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const photoUrl = file ? await uploadImage(file) : existingPhotoUrl;
      const submission = await submitExplorer(activityName.trim(), photoUrl);
      setExistingPhotoUrl(submission?.img_url ?? photoUrl);
      setMessage("Pengumpulan KMBUI Explorer berhasil disimpan.");
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
        placeholder="Tulis nama kegiatan yang sudah kamu ikuti!"
        value={activityName}
        disabled={isLoading || isSubmitting || isSubmissionClosed}
        onChange={(event) => setActivityName(event.target.value)}
        className="bg-[rgba(41,0,75,0.25)] placeholder:text-white/50"
      />

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Unggah Hasil KMBUI Explorer
        </h2>
        {existingPhotoUrl && (
          <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
            Kamu sudah mengumpulkan foto KMBUI Explorer. Jika mengumpulkan ulang,
            foto lama akan diganti dengan foto terbaru.
          </p>
        )}
        <TaskFileUpload
          fileType="image"
          maxSizeMb={5}
          disabled={isLoading || isSubmitting || isSubmissionClosed}
          onFileChange={setFile}
        />
      </div>

      {isSubmissionClosed && (
        <p className="rounded-2xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-3 text-b2 text-yellow-100">
          {getClosedSubmissionMessage()}
        </p>
      )}

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
        disabled={isLoading || isSubmissionClosed}
        className="h-[50px] rounded-2xl"
      >
        Kumpulkan
      </Button>
    </form>
  );
}
