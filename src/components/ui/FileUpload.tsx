"use client";

import {
  useId,
  useRef,
  useState,
  type DragEvent,
  type InputHTMLAttributes,
  type Ref,
  type SVGProps,
} from "react";

import { cn } from "@/lib/cn";

function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 136 136" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M57.9455 110H79.0545C93.8793 110 101.294 110 106.619 106.611C108.917 105.15 110.896 103.263 112.442 101.059C116 95.9869 116 88.9181 116 74.7896C116 60.6612 116 53.5924 112.442 48.5202C110.896 46.3161 108.917 44.4295 106.619 42.9685C103.199 40.7874 98.9142 40.0081 92.3545 39.7315C89.2242 39.7315 86.531 37.472 85.9182 34.544C85.45 32.3992 84.2333 30.4772 82.4738 29.1026C80.7143 27.7281 78.5199 26.9855 76.2615 27.0002H60.7385C56.0455 27.0002 52.0033 30.1588 51.0818 34.544C50.469 37.472 47.7758 39.7315 44.6455 39.7315C38.0905 40.0081 33.806 40.792 30.3812 42.9685C28.0848 44.43 26.1075 46.3165 24.5625 48.5202C21 53.5924 21 60.6566 21 74.7896C21 88.9227 21 95.9823 24.5578 101.059C26.0968 103.254 28.0727 105.14 30.3812 106.611C35.706 110 43.1207 110 57.9455 110ZM68.5 55.9256C57.5702 55.9256 48.7068 64.3686 48.7068 74.785C48.7068 85.2015 57.575 93.6583 68.5 93.6583C79.425 93.6583 88.2932 85.2107 88.2932 74.7943C88.2932 64.3778 79.425 55.9256 68.5 55.9256ZM68.5 63.4694C61.945 63.4694 56.625 68.537 56.625 74.7896C56.625 81.0377 61.945 86.1053 68.5 86.1053C75.055 86.1053 80.375 81.0377 80.375 74.7896C80.375 68.5416 75.055 63.4694 68.5 63.4694ZM90.9295 59.6975C90.9295 57.6133 92.7012 55.9256 94.891 55.9256H100.164C102.349 55.9256 104.125 57.6133 104.125 59.6975C104.115 60.7069 103.693 61.6711 102.951 62.3783C102.209 63.0856 101.208 63.478 100.168 63.4694H94.891C94.3758 63.4743 93.8646 63.3806 93.3866 63.1936C92.9087 63.0067 92.4733 62.7302 92.1055 62.38C91.7376 62.0297 91.4444 61.6126 91.2426 61.1523C91.0409 60.692 90.9345 60.1977 90.9295 59.6975Z"
      />
    </svg>
  );
}

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
  browseButtonRef?: Ref<HTMLButtonElement>;
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
  browseButtonRef,
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
  const displayedName = fileName === undefined ? selectedName : fileName || undefined;

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
        className="font-subheading text-s5 font-semibold text-foreground sm:text-s3"
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
        onChange={(event) => {
          selectFile(event.target.files?.item(0) ?? null);
          // Allow choosing the same file again after a crop dialog is cancelled.
          event.currentTarget.value = "";
        }}
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
        <CameraIcon className="size-[136px] text-purple-500" />

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
          ref={browseButtonRef}
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl bg-primary px-6 py-2.5 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover hover:text-yellow-100 disabled:cursor-not-allowed"
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
