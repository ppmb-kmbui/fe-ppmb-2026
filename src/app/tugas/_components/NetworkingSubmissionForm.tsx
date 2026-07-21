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
  getNetworkingFixedQuestionCount,
  getNetworkingTypeForBatch,
  NETWORKING_SENIOR_TEMPLATE_URL,
  type NetworkingType,
} from "./networking-requirements";

export function NetworkingSubmissionForm({ friendId }: { friendId: number }) {
  const [friend, setFriend] = useState<NetworkingFriend>();
  const [networkingType, setNetworkingType] = useState<NetworkingType>();
  const [questions, setQuestions] = useState<NetworkingQuestion[]>([]);
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
  const expectedFixedQuestionCount = networkingType
    ? getNetworkingFixedQuestionCount(networkingType)
    : 0;

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
        const loadedNetworkingType =
          data.networkingType ?? getNetworkingTypeForBatch(data.friend.batch);
        const customCatalogQuestions = data.questions.filter(
          (question) => question.isCustom,
        );
        const customCatalogQuestion = customCatalogQuestions[0];
        const customSubmissionAnswer = data.submission?.answers.find(
          (answer) =>
            Boolean(answer.customQuestion?.trim()) ||
            (customCatalogQuestion
              ? answer.questionId === customCatalogQuestion.id
              : answer.questionId === null),
        );

        setFriend(data.friend);
        setNetworkingType(loadedNetworkingType ?? undefined);
        setQuestions(loadedQuestions);
        const expectedCount = loadedNetworkingType
          ? getNetworkingFixedQuestionCount(loadedNetworkingType)
          : 0;
        const hasValidCatalog =
          expectedCount > 0 &&
          loadedQuestions.length === expectedCount &&
          loadedQuestions.every((question) => question.id > 0) &&
          customCatalogQuestions.length === 1 &&
          Boolean(customCatalogQuestion && customCatalogQuestion.id > 0);
        setIsReady(hasValidCatalog);
        if (!hasValidCatalog) {
          setError("Konfigurasi pertanyaan Networking belum tersedia.");
        }
        setAnswers(
          Object.fromEntries(
            loadedQuestions.map((question) => [
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

    if (
      expectedFixedQuestionCount < 1 ||
      fixedQuestions.length !== expectedFixedQuestionCount ||
      fixedQuestions.some(({ id }) => id < 1)
    ) {
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

  if (isLoading) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2"
      >
        Memuat pertanyaan Networking...
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
      {networkingType === "senior" && (
        <a
          href={NETWORKING_SENIOR_TEMPLATE_URL}
          target="_blank"
          rel="noreferrer"
          className="w-fit rounded-full border border-yellow-100/60 bg-yellow-100/10 px-5 py-3 text-b2 text-yellow-50 transition-colors hover:bg-yellow-100/20"
        >
          Lihat Templat Pertanyaan Kakak Tingkat
        </a>
      )}

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
