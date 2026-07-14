"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button, TaskFileUpload } from "@/components";
import { uploadImage, uploadRawFile } from "@/lib/image-upload";
import {
  getFosterSiblingsSubmission,
  getTaskApiErrorMessage,
  submitFosterSiblings,
} from "@/lib/task-api";

export function FosterSiblingsForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

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
      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 max-md:text-s5 font-semibold">
          Upload Dokumentasi
        </h2> 
        {existingImageUrl && (
          <a
            href={existingImageUrl}
            target="_blank"
            rel="noreferrer"
            className="text-b2 text-yellow-100 underline underline-offset-4"
          >
            Lihat foto yang sudah tersimpan
          </a>
        )}
        <TaskFileUpload
          fileType="image"
          disabled={isLoading || isSubmitting}
          onFileChange={setImageFile}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 max-md:text-s5 font-semibold">
          Upload Hasil Foster Siblings
        </h2>
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
          onFileChange={setPdfFile}
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
        className="h-13 rounded-2xl"
      >
        Submit
      </Button>
    </form>
  );
}
