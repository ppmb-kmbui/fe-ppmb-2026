"use client";

import {
  useId,
  useRef,
  useState,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";
import { FaCamera, FaFilePdf, FaVideo } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export type TaskFileType = "image" | "video" | "pdf";

export interface TaskFileUploadProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "onChange" | "type" | "value"
  > {
  fileType: TaskFileType;
  fileName?: string;
  maxSizeMb?: number;
  error?: string;
  onFileChange?: (file: File | null) => void;
}

const fileTypeConfig = {
  image: {
    accept: "image/jpeg,image/png,image/webp",
    dragLabel: "Tarik dan lepaskan foto di sini",
    browseLabel: "+ Cari Foto",
    Icon: FaCamera,
  },
  video: {
    accept: "video/mp4,video/webm,video/quicktime",
    dragLabel: "Tarik dan lepaskan video di sini",
    browseLabel: "+ Cari Video",
    Icon: FaVideo,
  },
  pdf: {
    accept: "application/pdf",
    dragLabel: "Tarik dan lepaskan PDF di sini",
    browseLabel: "+ Cari File",
    Icon: FaFilePdf,
  },
} as const;

export function TaskFileUpload({
  id,
  fileType,
  fileName,
  maxSizeMb,
  error,
  disabled = false,
  accept,
  className,
  onFileChange,
  ...props
}: TaskFileUploadProps) {
  const config = fileTypeConfig[fileType];
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string>();
  const [validationError, setValidationError] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const displayedName = fileName ?? selectedName;
  const displayedError = error ?? validationError;
  const acceptedTypes = accept ?? config.accept;
  const errorId = displayedError ? `${inputId}-error` : undefined;

  function isAcceptedFile(file: File) {
    return acceptedTypes.split(",").some((rule) => {
      const normalizedRule = rule.trim().toLowerCase();
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      if (normalizedRule.startsWith(".")) return fileName.endsWith(normalizedRule);
      if (normalizedRule.endsWith("/*")) {
        return fileType.startsWith(normalizedRule.slice(0, -1));
      }

      return fileType === normalizedRule;
    });
  }

  function selectFile(file: File | null) {
    if (!file) {
      setSelectedName(undefined);
      setValidationError(undefined);
      onFileChange?.(null);
      return;
    }

    if (!isAcceptedFile(file)) {
      setSelectedName(undefined);
      setValidationError("Tipe file tidak sesuai.");
      onFileChange?.(null);
      return;
    }

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setSelectedName(undefined);
      setValidationError(`Ukuran file maksimal ${maxSizeMb} MB.`);
      onFileChange?.(null);
      return;
    }

    setSelectedName(file.name);
    setValidationError(undefined);
    onFileChange?.(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) selectFile(event.dataTransfer.files.item(0));
  }

  const Icon = config.Icon;

  return (
    <div className="flex w-full flex-col gap-2">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptedTypes}
        disabled={disabled}
        className="sr-only"
        aria-label={`Unggah file ${fileType}`}
        aria-invalid={displayedError ? true : undefined}
        aria-describedby={errorId}
        onChange={(event) => selectFile(event.target.files?.item(0) ?? null)}
        {...props}
      />

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-yellow-50/10 px-5 py-5 text-center md:min-h-[322px] md:px-10",
          isDragging && "border-blue-400 bg-yellow-50/15",
          displayedError && "border-red-300",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <Icon aria-hidden="true" className="size-20 text-blue-500 md:size-[136px]" />
        <p className={cn("text-b1 text-blue-50", displayedName && "underline")}>
          {displayedName ?? config.dragLabel}
        </p>
        <p className="text-b1 text-blue-50">atau</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-b2 text-yellow-50 hover:bg-blue-700 disabled:cursor-not-allowed md:px-6 md:text-b1"
        >
          {config.browseLabel}
        </button>
      </div>

      {displayedError && (
        <p id={errorId} role="alert" className="text-b2 text-red-300">
          {displayedError}
        </p>
      )}
    </div>
  );
}
