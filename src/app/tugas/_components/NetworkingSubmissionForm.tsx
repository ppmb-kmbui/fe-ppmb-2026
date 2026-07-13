"use client";

import { FormEvent, useState } from "react";

import { Button, TaskFileUpload } from "@/components";

export function NetworkingSubmissionForm({ batch }: { batch: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("File PDF networking wajib dipilih.");
      return;
    }

    setError(
      "FE sudah siap sesuai desain, tetapi BE belum menyediakan endpoint submit networking berdasarkan angkatan. Saat ini BE masih membutuhkan target user id.",
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Upload Hasil Networking Angkatan {batch.slice(-2)}
        </h2>
        <p className="text-b2 text-foreground/80">
          Unggah hasil networking dalam format PDF.
        </p>
        <TaskFileUpload fileType="pdf" maxSizeMb={10} onFileChange={setFile} />
      </div>

      {error && (
        <p className="rounded-2xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-3 text-b2 text-yellow-100">
          {error}
        </p>
      )}

      <Button type="submit" className="h-[50px] rounded-2xl">
        Submit
      </Button>
    </form>
  );
}
