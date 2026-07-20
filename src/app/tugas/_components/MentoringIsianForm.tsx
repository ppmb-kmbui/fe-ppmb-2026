"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, Input } from "@/components";
import {
  getClosedSubmissionMessage,
  isTaskSubmissionClosed,
} from "@/lib/task-deadlines";
import {
  getMentoringSubmission,
  getTaskApiErrorMessage,
  submitMentoring,
} from "@/lib/task-api";

export function MentoringIsianForm() {
  const [gdriveUrl, setGdriveUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const isSubmissionClosed = isTaskSubmissionClosed("mentoring");

  useEffect(() => {
    let active = true;

    getMentoringSubmission()
      .then((data) => {
        if (!active) return;
        setGdriveUrl(data?.gdrive_url ?? "");
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
    const trimmedUrl = gdriveUrl.trim();

    setError(undefined);
    setMessage(undefined);

    if (isSubmissionClosed) {
      setError(getClosedSubmissionMessage());
      return;
    }

    if (!trimmedUrl) {
      setError("Tautan Google Drive wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await submitMentoring(trimmedUrl);
      setGdriveUrl(data?.gdrive_url ?? trimmedUrl);
      setMessage("Pengumpulan Mentoring berhasil disimpan.");
    } catch (submitError) {
      setError(getTaskApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <Input
        label="Unggah Hasil Tugas Mentoring"
        hint="Masukkan tautan Google Drive berisi hasil tugas Mentoring yang sudah bisa diakses panitia."
        placeholder="https://drive.google.com/drive/folders/..."
        type="url"
        value={gdriveUrl}
        disabled={isLoading || isSubmitting || isSubmissionClosed}
        onChange={(event) => setGdriveUrl(event.target.value)}
        className="bg-[rgba(41,0,75,0.25)] placeholder:text-white/50"
      />

      {isSubmissionClosed && (
        <p className="rounded-2xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-3 text-b2 text-yellow-100">
          {getClosedSubmissionMessage()}
        </p>
      )}

      {gdriveUrl && !message && (
        <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
          Kamu sudah mengumpulkan tautan Mentoring. Jika mengumpulkan ulang,
          tautan lama akan diganti dengan tautan terbaru.
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
