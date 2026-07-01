"use client";

import {
  useId,
  useRef,
  useState,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";
import { FaCamera } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface FileUploadProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "onChange" | "type" | "value"
  > {
  label: string;
  hint?: string;
  error?: string;
  fileName?: string;
  maxSizeMb?: number;
  onFileChange?: (file: File | null) => void;
  wrapperClassName?: string;
}

export function FileUpload({
  id,
  label,
  hint,
  error,
  fileName,
  accept = "image/png,image/jpeg",
  maxSizeMb,
  disabled = false,
  onFileChange,
  wrapperClassName,
  className,
  ...props
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string>();
  const [validationError, setValidationError] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const displayedError = error ?? validationError;
  const displayedName = fileName ?? selectedName;

  function selectFile(file: File | null) {
    if (!file) {
      setSelectedName(undefined);
      setValidationError(undefined);
      onFileChange?.(null);
      return;
    }

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setValidationError(`Ukuran file maksimal ${maxSizeMb} MB.`);
      setSelectedName(undefined);
      onFileChange?.(null);
      return;
    }

    setValidationError(undefined);
    setSelectedName(file.name);
    onFileChange?.(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      selectFile(event.dataTransfer.files.item(0));
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", wrapperClassName)}>
      <label
        htmlFor={inputId}
        className="font-subheading text-s3 font-semibold text-foreground"
      >
        {label}
      </label>

      {hint && <p className="text-b2 text-foreground">{hint}</p>}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        aria-invalid={displayedError ? true : undefined}
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
          "flex min-h-[284px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-[rgba(140,88,183,0.3)] px-10 py-5 text-center transition-colors",
          isDragging && "border-purple-200 bg-[rgba(140,88,183,0.6)]",
          disabled && "cursor-not-allowed opacity-50",
          displayedError && "border-red-300",
          className,
        )}
      >
        <FaCamera aria-hidden="true" className="size-[88px] text-purple-600" />

        <p
          className={cn(
            "text-b1 text-purple-200",
            displayedName && "text-foreground underline",
          )}
        >
          {displayedName ?? "Tarik dan lepaskan foto di sini"}
        </p>

        <p className="text-b1 text-purple-200">atau</p>

        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-md bg-primary px-6 py-2.5 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover hover:text-yellow-100 disabled:cursor-not-allowed"
        >
          + Cari Foto
        </button>
      </div>

      {displayedError && (
        <p role="alert" className="text-b2 text-red-300">
          {displayedError}
        </p>
      )}
    </div>
  );
}
