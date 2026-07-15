"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, TaskFileUpload } from "@/components";
import { uploadRawFile } from "@/lib/image-upload";
import {
  getClosedSubmissionMessage,
  isTaskSubmissionClosed,
} from "@/lib/task-deadlines";
import {
  getInsightHuntingSubmission,
  getTaskApiErrorMessage,
  submitInsightHuntingFile,
} from "@/lib/task-api";

const insightHuntingTemplateUrl =
  "https://docs.google.com/document/d/1Was6EOpZ41ps1UQqj8P-UC4KfiQNot6m/edit?usp=sharing&ouid=100133896649194217758&rtpof=true&sd=true";

export function InsightHuntingForm() {
  const [file, setFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const isSubmissionClosed = isTaskSubmissionClosed("insightHunting");

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

    if (isSubmissionClosed) {
      setError(getClosedSubmissionMessage());
      return;
    }

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
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-blue-200/20 px-5 py-4 text-b2 text-foreground/85">
        <p className="font-subheading text-s3 font-semibold text-yellow-500">
          Template Tugas
        </p>
        <p>Gunakan template berikut untuk mengerjakan Insight Hunting.</p>
        <a
          href={insightHuntingTemplateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center justify-center rounded-2xl bg-primary px-5 py-3 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover"
        >
          Link Template
        </a>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Upload Hasil Insight Hunting
        </h2>
        {existingFileUrl && (
          <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
            Kamu sudah submit file Insight Hunting. Jika submit ulang, file lama
            akan diganti dengan file terbaru.
          </p>
        )}
        <TaskFileUpload
          fileType="pdf"
          maxSizeMb={10}
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
        Submit
      </Button>
    </form>
  );
}
