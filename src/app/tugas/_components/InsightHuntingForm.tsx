"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, TaskFileUpload } from "@/components";
import { uploadRawFile } from "@/lib/image-upload";
import {
  getInsightHuntingSubmission,
  getTaskApiErrorMessage,
  submitInsightHuntingFile,
} from "@/lib/task-api";

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
      setError("File PDF Insight Hunting wajib dipilih.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fileUrl = await uploadRawFile(file);
      const submission = await submitInsightHuntingFile(fileUrl);
      setExistingFileUrl(submission?.file_url ?? fileUrl);
      setMessage("Submission Insight Hunting berhasil disimpan.");
    } catch (submitError) {
      setError(getTaskApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Upload Hasil Insight Hunting
        </h2>
        <p className="text-b2 text-foreground/80">
          Unggah file PDF sesuai format pengumpulan pada desain.
        </p>
        {existingFileUrl && (
          <a
            href={existingFileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-b2 text-yellow-100 underline underline-offset-4"
          >
            Lihat file yang sudah tersimpan
          </a>
        )}
        <TaskFileUpload
          fileType="pdf"
          maxSizeMb={10}
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
