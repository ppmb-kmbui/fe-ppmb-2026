"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, TaskFileUpload } from "@/components";
import { ApiError } from "@/lib/api";
import {
  getInsightHuntingSubmission,
  getTaskApiErrorMessage,
  submitInsightHuntingUpload,
} from "@/lib/task-api";

const insightHuntingTemplateUrl =
  "https://docs.google.com/document/d/1Was6EOpZ41ps1UQqj8P-UC4KfiQNot6m/edit?usp=sharing&ouid=100133896649194217758&rtpof=true&sd=true";
const insightHuntingErrorFallback =
  "Pengumpulan Insight Hunting gagal. Silakan coba lagi.";

function getInsightHuntingErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return getTaskApiErrorMessage(error) || insightHuntingErrorFallback;
    }

    const payloadMessage = error.payload?.message?.trim();
    if (payloadMessage) return payloadMessage;
  }

  return getTaskApiErrorMessage(error) || insightHuntingErrorFallback;
}

export function InsightHuntingForm() {
  const [file, setFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;

    getInsightHuntingSubmission()
      .then((submission) => {
        if (!active) return;
        setExistingFileUrl(submission?.file_url ?? "");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(getInsightHuntingErrorMessage(loadError));
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
      setError("Berkas PDF Insight Hunting wajib dipilih.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submission = await submitInsightHuntingUpload(file);
      setExistingFileUrl(submission?.file_url ?? "");
      setMessage("Pengumpulan Insight Hunting berhasil disimpan.");
    } catch (submitError) {
      setError(getInsightHuntingErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-blue-200/20 px-5 py-4 text-b2 text-foreground/85">
        <p className="font-subheading text-s3 font-semibold text-yellow-500">
          Templat Tugas
        </p>
        <p>Gunakan templat berikut untuk mengerjakan Insight Hunting.</p>
        <a
          href={insightHuntingTemplateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center justify-center rounded-2xl bg-primary px-5 py-3 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover"
        >
          Tautan Templat
        </a>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Unggah Hasil Insight Hunting
        </h2>
        {existingFileUrl && (
          <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
            Kamu sudah mengumpulkan berkas Insight Hunting. Jika mengumpulkan
            ulang, berkas lama akan diganti dengan berkas terbaru.
          </p>
        )}
        <p className="text-b2 text-foreground/80">Format PDF, maksimal 4 MB.</p>
        <TaskFileUpload
          fileType="pdf"
          accept="application/pdf,.pdf"
          maxSizeMb={4}
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
        disabled={isLoading || isSubmitting}
        className="h-[50px] rounded-2xl"
      >
        Kumpulkan
      </Button>
    </form>
  );
}
