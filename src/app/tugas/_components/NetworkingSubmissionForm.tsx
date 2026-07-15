"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, Input } from "@/components";
import {
  getClosedSubmissionMessage,
  isTaskSubmissionClosed,
} from "@/lib/task-deadlines";
import {
  getNetworkingSubmission,
  getTaskApiErrorMessage,
  submitNetworkingDocs,
} from "@/lib/task-api";

import { getNetworkingRequirement, type NetworkingSegment } from "./networking-requirements";

export function NetworkingSubmissionForm({
  segment,
}: {
  segment: NetworkingSegment;
}) {
  const requirement = getNetworkingRequirement(segment);
  const [docsUrl, setDocsUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const isSubmissionClosed = isTaskSubmissionClosed("networking");

  useEffect(() => {
    let active = true;

    getNetworkingSubmission()
      .then((data) => {
        if (!active) return;
        setDocsUrl(data?.submission?.[requirement.field] ?? "");
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
  }, [requirement.field]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = docsUrl.trim();

    setError(undefined);
    setMessage(undefined);

    if (isSubmissionClosed) {
      setError(getClosedSubmissionMessage());
      return;
    }

    if (!trimmedUrl) {
      setError("Link Google Docs wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await submitNetworkingDocs(requirement.field, trimmedUrl);
      setDocsUrl(data?.submission?.[requirement.field] ?? trimmedUrl);
      setMessage(`Submission Networking ${requirement.title} berhasil disimpan.`);
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
        <p>
          Gunakan template berikut untuk mengerjakan networking{" "}
          {requirement.title}.
        </p>
        <a
          href={requirement.templateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center justify-center rounded-2xl bg-primary px-5 py-3 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover"
        >
          Link Template
        </a>
      </div>

      <Input
        label={`Upload Hasil Networking ${requirement.title}`}
        hint="Masukkan link Google Docs hasil networking. Pastikan akses dokumennya bisa dibuka panitia"
        placeholder="https://docs.google.com/document/d/..."
        type="url"
        value={docsUrl}
        disabled={isLoading || isSubmitting || isSubmissionClosed}
        onChange={(event) => setDocsUrl(event.target.value)}
        className="bg-[rgba(41,0,75,0.25)] placeholder:text-white/50"
      />

      {isSubmissionClosed && (
        <p className="rounded-2xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-3 text-b2 text-yellow-100">
          {getClosedSubmissionMessage()}
        </p>
      )}

      {docsUrl && !message && (
        <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
          Kamu sudah submit link Networking {requirement.title}. Jika submit
          ulang, link lama akan diganti dengan link terbaru.
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
