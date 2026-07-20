"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button, TaskFileUpload, Textarea } from "@/components";
import { uploadImage } from "@/lib/image-upload";
import {
  getClosedSubmissionMessage,
  isTaskSubmissionClosed,
} from "@/lib/task-deadlines";
import {
  getNetworkingFriend,
  getTaskApiErrorMessage,
  submitNetworkingFriend,
  type NetworkingFriend,
  type NetworkingQuestion,
} from "@/lib/task-api";

import {
  NETWORKING_FIXED_QUESTIONS,
  NETWORKING_TEMPLATE_URL,
} from "./networking-requirements";

const fallbackQuestions: NetworkingQuestion[] = NETWORKING_FIXED_QUESTIONS.map(
  (question, index) => ({
    id: -(index + 1),
    code: question.code,
    prompt: question.prompt,
    position: index + 1,
    isCustom: false,
  }),
);

export function NetworkingSubmissionForm({ friendId }: { friendId: number }) {
  const [friend, setFriend] = useState<NetworkingFriend>();
  const [questions, setQuestions] =
    useState<NetworkingQuestion[]>(fallbackQuestions);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const isSubmissionClosed = isTaskSubmissionClosed("networking");

  const fixedQuestions = useMemo(
    () =>
      questions
        .filter((question) => !question.isCustom)
        .sort((left, right) => left.position - right.position),
    [questions],
  );

  useEffect(() => {
    let active = true;

    getNetworkingFriend(friendId)
      .then((data) => {
        if (!active || !data) return;

        const loadedQuestions = data.questions
          .filter((question) => !question.isCustom)
          .sort((left, right) => left.position - right.position);
        const renderedQuestions = loadedQuestions.length
          ? loadedQuestions
          : fallbackQuestions;
        const customCatalogQuestion = data.questions.find(
          (question) => question.isCustom,
        );
        const customSubmissionAnswer = data.submission?.answers.find(
          (answer) =>
            Boolean(answer.customQuestion?.trim()) ||
            (customCatalogQuestion
              ? answer.questionId === customCatalogQuestion.id
              : answer.questionId === null),
        );

        setFriend(data.friend);
        setQuestions(renderedQuestions);
        setIsReady(
          loadedQuestions.length === 3 &&
            loadedQuestions.every((question) => question.id > 0),
        );
        if (loadedQuestions.length !== 3) {
          setError("Konfigurasi pertanyaan Networking belum tersedia.");
        }
        setAnswers(
          Object.fromEntries(
            renderedQuestions.map((question) => [
              question.id,
              data.submission?.answers.find(
                (answer) => answer.questionId === question.id,
              )?.answer ?? "",
            ]),
          ),
        );
        setCustomQuestion(customSubmissionAnswer?.customQuestion ?? "");
        setCustomAnswer(customSubmissionAnswer?.answer ?? "");
        setExistingImageUrl(data.submission?.photoUrl ?? "");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          getTaskApiErrorMessage(loadError) ||
            "Data Networking teman ini belum dapat dimuat.",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [friendId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setMessage(undefined);

    if (isSubmissionClosed) {
      setError(getClosedSubmissionMessage());
      return;
    }

    if (fixedQuestions.length !== 3 || fixedQuestions.some(({ id }) => id < 1)) {
      setError("Daftar pertanyaan belum berhasil dimuat. Silakan muat ulang halaman.");
      return;
    }

    if (fixedQuestions.some(({ id }) => !answers[id]?.trim())) {
      setError("Semua pertanyaan wajib dijawab.");
      return;
    }

    if (!customQuestion.trim() || !customAnswer.trim()) {
      setError("Pertanyaan bebas dan jawabannya wajib diisi.");
      return;
    }

    if (!imageFile && !existingImageUrl) {
      setError("Foto dokumentasi Networking wajib dipilih.");
      return;
    }

    setIsSubmitting(true);
    try {
      const photoUrl = imageFile
        ? await uploadImage(imageFile)
        : existingImageUrl;
      const data = await submitNetworkingFriend(friendId, {
        photoUrl,
        answers: fixedQuestions.map(({ id }) => ({
          questionId: id,
          answer: answers[id].trim(),
        })),
        customQuestion: customQuestion.trim(),
        customAnswer: customAnswer.trim(),
      });

      setExistingImageUrl(data?.submission?.photoUrl ?? photoUrl);
      setImageFile(null);
      setMessage(
        `Networking bersama ${friend?.fullname ?? "temanmu"} berhasil disimpan.`,
      );
    } catch (submitError) {
      setError(
        getTaskApiErrorMessage(submitError) ||
          "Networking belum berhasil disimpan. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabled =
    isLoading || !isReady || isSubmitting || isSubmissionClosed;

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-white/10 bg-blue-200/20 px-5 py-4 text-b2 text-foreground/85">
        <p className="font-subheading text-s3 font-semibold text-yellow-500">
          {friend ? `Bersama ${friend.fullname ?? "Teman"}` : "Sesi Networking"}
        </p>
        {friend && (
          <p className="mt-2">
            Angkatan {friend.batch}
            {friend.faculty ? ` — ${friend.faculty}` : ""}
          </p>
        )}
        <p className="mt-3">
          Wawancarai temanmu, isi jawaban sesuai percakapan, lalu unggah foto
          dokumentasi bersama.
        </p>
        <a
          href={NETWORKING_TEMPLATE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-fit items-center justify-center rounded-2xl border border-yellow-100/60 px-5 py-2.5 text-b2 text-yellow-50 transition-colors hover:bg-yellow-100/10"
        >
          Lihat Templat Pertanyaan
        </a>
      </div>

      {fixedQuestions.map((question, index) => (
        <Textarea
          key={question.code || question.id}
          label={`${index + 1}. ${question.prompt}`}
          value={answers[question.id] ?? ""}
          disabled={disabled}
          required
          placeholder="Tuliskan jawaban temanmu..."
          onChange={(event) =>
            setAnswers((current) => ({
              ...current,
              [question.id]: event.target.value,
            }))
          }
        />
      ))}

      <Textarea
        label="Pertanyaan Bebas dari mahasiswa baru"
        hint="Tuliskan satu pertanyaan tambahan yang ingin kamu tanyakan."
        value={customQuestion}
        disabled={disabled}
        required
        placeholder="Tuliskan pertanyaan bebasmu..."
        onChange={(event) => setCustomQuestion(event.target.value)}
      />

      <Textarea
        label="Jawaban pertanyaan bebas"
        value={customAnswer}
        disabled={disabled}
        required
        placeholder="Tuliskan jawaban temanmu..."
        onChange={(event) => setCustomAnswer(event.target.value)}
      />

      <div className="flex flex-col gap-3">
        <h2 className="font-subheading text-s3 font-semibold">
          Foto Dokumentasi
        </h2>
        {existingImageUrl && (
          <p className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
            Foto dokumentasi sudah tersimpan. Pilih foto baru hanya jika ingin
            menggantinya.
          </p>
        )}
        <TaskFileUpload
          fileType="image"
          fileName={imageFile?.name}
          maxSizeMb={5}
          disabled={disabled}
          onFileChange={setImageFile}
        />
      </div>

      {isSubmissionClosed && (
        <p className="rounded-2xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-3 text-b2 text-yellow-100">
          {getClosedSubmissionMessage()}
        </p>
      )}
      {message && (
        <p role="status" className="rounded-2xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-b2 text-green-100">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-b2 text-red-100">
          {error}
        </p>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={disabled}
        className="h-[50px] rounded-2xl"
      >
        Simpan Networking
      </Button>
    </form>
  );
}
