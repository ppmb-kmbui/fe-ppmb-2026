"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, TaskFileUpload } from "@/components";
import { uploadImage, uploadRawFile } from "@/lib/image-upload";
import {
  getClosedSubmissionMessage,
  isTaskSubmissionClosed,
} from "@/lib/task-deadlines";
import {
  getFosterSiblingsSubmission,
  getTaskApiErrorMessage,
  submitFosterSiblings,
} from "@/lib/task-api";

const fosterSiblingsTemplateUrl =
  "https://docs.google.com/document/d/1claz-dq0ULSzdF9LuCttFiJ0QjK504LbmCh8uZ87ERI/edit?usp=sharing";

export function FosterSiblingsForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const isSubmissionClosed = isTaskSubmissionClosed("fossib");

  useEffect(() => {
    let active = true;

    getFosterSiblingsSubmission()
      .then((submission) => {
        if (!active) return;
        setExistingImageUrl(submission?.photo_url ?? "");
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

    if (!imageFile) {
      setError("Foto dokumentasi wajib dipilih.");
      return;
    }

    if (!pdfFile) {
      setError("File PDF hasil foster siblings wajib dipilih.");
      return;
    }

    setIsSubmitting(true);
    try {
      const [imageUrl, fileUrl] = await Promise.all([
        uploadImage(imageFile),
        uploadRawFile(pdfFile),
      ]);
      const submission = await submitFosterSiblings(imageUrl, fileUrl);
      setExistingImageUrl(submission?.photo_url ?? imageUrl);
      setExistingFileUrl(submission?.file_url ?? fileUrl);
      setMessage("Submission Foster Siblings berhasil disimpan.");
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
        <p>Gunakan template berikut untuk mengerjakan Foster Siblings.</p>
        <a
          href={fosterSiblingsTemplateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center justify-center rounded-2xl bg-primary px-5 py-3 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover"
        >
          Link Template
        </a>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 max-md:text-s5 font-semibold">
          Upload Dokumentasi
        </h2>
        {existingImageUrl && (
          <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
            Kamu sudah submit foto dokumentasi. Jika submit ulang, foto lama
            akan diganti dengan foto terbaru.
          </p>
        )}
        <TaskFileUpload
          fileType="image"
          disabled={isLoading || isSubmitting || isSubmissionClosed}
          onFileChange={setImageFile}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 max-md:text-s5 font-semibold">
          Upload Hasil Foster Siblings
        </h2>
        {existingFileUrl && (
          <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
            Kamu sudah submit file Foster Siblings. Jika submit ulang, file lama
            akan diganti dengan file terbaru.
          </p>
        )}
        <TaskFileUpload
          fileType="pdf"
          maxSizeMb={10}
          disabled={isLoading || isSubmitting || isSubmissionClosed}
          onFileChange={setPdfFile}
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
        className="h-13 rounded-2xl"
      >
        Submit
      </Button>
    </form>
  );
}
