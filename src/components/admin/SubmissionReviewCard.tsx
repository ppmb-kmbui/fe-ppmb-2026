"use client";

import {
  useId,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { FaFilePdf, FaLink } from "react-icons/fa6";

import { Button, StatusBadge, type SubmissionStatus } from "@/components/ui";
import { cn } from "@/lib/cn";
import type {
  AdminTaskReview,
  AdminTaskType,
  SaveAdminTaskReviewInput,
} from "@/lib/admin-task-api";

export interface SubmissionFile {
  href: string;
  label?: string;
}

export interface SubmissionLink {
  href: string;
  label: string;
  description?: string;
}

export interface SubmissionReviewCardProps extends HTMLAttributes<HTMLElement> {
  taskType?: AdminTaskType;
  title: string;
  status: SubmissionStatus;
  review?: AdminTaskReview | null;
  media?: ReactNode;
  answer?: ReactNode;
  file?: SubmissionFile;
  links?: SubmissionLink[];
  answerFirst?: boolean;
  onSaveReview?: (
    taskType: AdminTaskType,
    input: SaveAdminTaskReviewInput,
  ) => Promise<void>;
}

function ContentPanel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-[160px] min-w-0 flex-1 items-start overflow-hidden rounded-2xl bg-[rgba(41,0,75,0.25)] p-4 text-b2 md:min-h-[223px] md:p-6 md:text-b1">
      {children}
    </div>
  );
}

function isUrl(value: ReactNode): value is string {
  return typeof value === "string" && /^https?:\/\//.test(value);
}

function formatReviewedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function SubmissionReviewCard({
  taskType,
  title,
  status,
  review,
  media,
  answer,
  file,
  links,
  answerFirst = false,
  onSaveReview,
  className,
  ...props
}: SubmissionReviewCardProps) {
  const scoreId = useId();
  const feedbackId = useId();
  const [score, setScore] = useState(review ? String(review.score) : "");
  const [feedback, setFeedback] = useState(review?.feedback ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [saveMessage, setSaveMessage] = useState<string>();
  const isSubmitted = status === "submitted";
  const canReview = Boolean(isSubmitted && taskType && onSaveReview);

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(undefined);
    setSaveMessage(undefined);

    const parsedScore = Number(score);
    if (
      score.trim() === "" ||
      !Number.isInteger(parsedScore) ||
      parsedScore < 0 ||
      parsedScore > 100
    ) {
      setSaveError("Nilai harus berupa bilangan bulat dari 0 sampai 100.");
      return;
    }

    if (!canReview || !taskType || !onSaveReview) return;

    setIsSaving(true);
    try {
      await onSaveReview(taskType, {
        score: parsedScore,
        feedback: feedback.trim() || null,
      });
      setSaveMessage("Nilai berhasil disimpan.");
    } catch (error) {
      setSaveError(
        error instanceof Error && error.message
          ? error.message
          : "Nilai gagal disimpan. Silakan coba lagi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const answerPanel = answer ? (
    <ContentPanel>
      {isUrl(answer) ? (
        <a
          href={answer}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 break-all underline hover:text-yellow-100"
        >
          <FaLink aria-hidden="true" className="size-5 shrink-0" />
          <span>{answer}</span>
        </a>
      ) : (
        <span className="whitespace-pre-wrap break-words">{answer}</span>
      )}
    </ContentPanel>
  ) : null;
  const mediaPanel = media ? (
    <div className="min-h-[160px] min-w-0 flex-1 overflow-hidden rounded-lg bg-background md:min-h-[223px]">
      {isUrl(media) ? (
        <a href={media} target="_blank" rel="noreferrer">
          <img
            src={media}
            alt=""
            className="h-full min-h-[160px] w-full object-cover md:min-h-[223px]"
          />
        </a>
      ) : (
        media
      )}
    </div>
  ) : null;
  const filePanel = file?.href ? (
    <ContentPanel>
      <a
        href={file.href}
        target="_blank"
        rel="noreferrer"
        className="m-auto flex flex-col items-center gap-4 text-center underline hover:text-yellow-100"
      >
        <FaFilePdf aria-hidden="true" className="size-[88px] text-blue-500" />
        <span>{file.label ?? "Tautan unduhan PDF"}</span>
      </a>
    </ContentPanel>
  ) : null;
  const linksPanel = links?.length ? (
    <ContentPanel>
      <div className="flex w-full flex-col gap-4">
        {links.map((link) => (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 bg-purple-950/20 px-4 py-3 transition-colors hover:border-yellow-100/60 hover:bg-purple-950/35"
          >
            <span className="flex items-center gap-3 font-subheading text-s5 text-yellow-100">
              <FaLink aria-hidden="true" className="size-4 shrink-0" />
              <span>{link.label}</span>
            </span>
            {link.description && (
              <span className="mt-1 block text-b3 text-foreground/80 group-hover:text-foreground">
                {link.description}
              </span>
            )}
          </a>
        ))}
      </div>
    </ContentPanel>
  ) : null;
  const panels = answerFirst
    ? [linksPanel, answerPanel, mediaPanel, filePanel]
    : [mediaPanel, answerPanel, linksPanel, filePanel];
  const visiblePanels = panels.filter(Boolean);

  return (
    <article
      className={cn(
        "flex w-full min-w-0 flex-col gap-4 rounded-3xl border border-white/10 bg-purple-400/50 px-4 py-4 sm:px-6",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-subheading pt-2 text-s3">{title}</h3>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge status={status} />
          {taskType && (
            <span
              role="status"
              className={cn(
                "inline-flex min-h-[45px] items-center justify-center rounded-2xl border px-3 py-2.5 text-b2",
                review
                  ? "border-blue-400 bg-blue-200/50"
                  : "border-yellow-100/70 bg-yellow-100/10 text-yellow-50",
              )}
            >
              {review ? "Sudah Diperiksa" : "Belum Diperiksa"}
            </span>
          )}
        </div>
      </div>
      {visiblePanels.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePanels.map((panel, index) => (
            <div key={index} className={cn(visiblePanels.length === 1 && "md:col-span-2")}>
              {panel}
            </div>
          ))}
        </div>
      )}

      {taskType && (
        <section
          aria-label={`Penilaian ${title}`}
          className="rounded-2xl border border-white/10 bg-purple-950/25 p-4 sm:p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="font-subheading text-s5">Penilaian Admin</h4>
              <p className="mt-1 text-b3 text-foreground/75">
                {taskType === "networking"
                  ? "Satu nilai keseluruhan untuk 18 hasil Networking dalam skala 0–100."
                  : "Nilai keseluruhan tugas dalam skala 0–100."}
              </p>
            </div>
            {review && (
              <div className="min-w-0 text-b3 text-foreground/80 sm:max-w-[50%] sm:text-right">
                <p className="break-words">
                  Diperiksa oleh {review.reviewer.fullname?.trim() || "Admin"}
                </p>
                <p className="break-all">{review.reviewer.email}</p>
                <p>{formatReviewedAt(review.reviewedAt)} WIB</p>
              </div>
            )}
          </div>

          <form
            className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)_auto] lg:items-end"
            onSubmit={handleReviewSubmit}
            noValidate
          >
            <label htmlFor={scoreId} className="flex min-w-0 flex-col gap-2 text-b3">
              Nilai
              <div className="relative">
                <input
                  id={scoreId}
                  name="score"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  required
                  value={score}
                  disabled={!canReview || isSaving}
                  onChange={(event) => setScore(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/15 bg-purple-950/35 px-4 pr-12 text-b2 outline-none focus:border-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-b3 text-foreground/70">
                  /100
                </span>
              </div>
            </label>

            <label htmlFor={feedbackId} className="flex min-w-0 flex-col gap-2 text-b3">
              <span>
                Feedback <span className="text-foreground/65">(opsional)</span>
              </span>
              <textarea
                id={feedbackId}
                name="feedback"
                rows={3}
                maxLength={4000}
                value={feedback}
                disabled={!canReview || isSaving}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="Tambahkan feedback bila diperlukan (opsional)"
                className="min-h-12 w-full resize-y rounded-xl border border-white/15 bg-purple-950/35 px-4 py-3 text-b2 outline-none placeholder:text-foreground/45 focus:border-yellow-100 disabled:cursor-not-allowed disabled:opacity-60 lg:min-h-12"
              />
            </label>

            <Button
              type="submit"
              isLoading={isSaving}
              disabled={!canReview || score === ""}
              className="h-12 lg:w-auto lg:min-w-[150px]"
            >
              Simpan Nilai
            </Button>
          </form>

          {!isSubmitted && (
            <p className="mt-3 text-b3 text-yellow-50">
              Penilaian tersedia setelah tugas lengkap dikumpulkan.
            </p>
          )}
          {saveError && (
            <p role="alert" className="mt-3 text-b3 text-red-100">
              {saveError}
            </p>
          )}
          {saveMessage && (
            <p role="status" className="mt-3 text-b3 text-green-100">
              {saveMessage}
            </p>
          )}
        </section>
      )}
    </article>
  );
}
