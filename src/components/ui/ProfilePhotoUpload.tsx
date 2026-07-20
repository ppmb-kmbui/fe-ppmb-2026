"use client";

import { createPortal } from "react-dom";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { cropImageToFile, ImageCropError } from "@/lib/crop-image";
import { cn } from "@/lib/cn";

import { Button } from "./Button";
import { FileUpload } from "./FileUpload";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const DEFAULT_MAX_SIZE_MB = 5;

interface PendingPhoto {
  file: File;
  sourceUrl: string;
}

function PhotoPreview({
  sourceUrl,
  isNewPhoto,
  fileName,
}: {
  sourceUrl: string;
  isNewPhoto: boolean;
  fileName?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <span
        role="img"
        aria-label={isNewPhoto ? "Pratinjau foto profil yang sudah dipotong" : "Foto profil saat ini"}
        className="size-24 shrink-0 rounded-full bg-cover bg-center shadow-lg"
        style={{ backgroundImage: `url(${sourceUrl})` }}
      />
      <div className="min-w-0">
        <p className="font-subheading text-s5 font-semibold text-foreground">
          {isNewPhoto ? "Foto siap diunggah" : "Foto profil saat ini"}
        </p>
        {fileName && <p className="truncate text-b3 text-purple-100">{fileName}</p>}
      </div>
    </div>
  );
}

function LocalPhotoPreview({ file }: { file: File }) {
  const [sourceUrl] = useState(() => URL.createObjectURL(file));

  useEffect(() => () => URL.revokeObjectURL(sourceUrl), [sourceUrl]);

  return <PhotoPreview sourceUrl={sourceUrl} isNewPhoto fileName={file.name} />;
}

export interface ProfilePhotoUploadProps {
  label?: string;
  hint?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  existingImageUrl?: string | null;
  error?: string;
  disabled?: boolean;
  maxSizeMb?: number;
  wrapperClassName?: string;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("hidden"));
}

export function ProfilePhotoUpload({
  label = "Foto Profil",
  hint = "Lampirkan foto dengan format .png/.jpg/.jpeg, maksimal 5 MB.",
  value,
  onChange,
  existingImageUrl,
  error,
  disabled = false,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  wrapperClassName,
}: ProfilePhotoUploadProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const browseButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const isProcessingRef = useRef(false);
  const [pendingPhoto, setPendingPhoto] = useState<PendingPhoto | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [localError, setLocalError] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!pendingPhoto) return;
    return () => URL.revokeObjectURL(pendingPhoto.sourceUrl);
  }, [pendingPhoto]);

  const closeCropper = useCallback(() => {
    if (isProcessingRef.current) return;
    setPendingPhoto(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setLocalError(undefined);
  }, []);

  useEffect(() => {
    if (!pendingPhoto) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCropper();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusableElements = getFocusableElements(dialogRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      returnFocusRef.current?.focus();
    };
  }, [closeCropper, pendingPhoto]);

  const handleCropComplete = useCallback((_: Area, nextAreaPixels: Area) => {
    setCroppedAreaPixels(nextAreaPixels);
  }, []);

  function handleSelectedFile(file: File | null) {
    if (!file) return;

    setLocalError(undefined);
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setLocalError("Format foto harus PNG, JPG, atau JPEG.");
      return;
    }
    if (file.size === 0) {
      setLocalError("File foto kosong. Pilih foto lain.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`Ukuran file maksimal ${maxSizeMb} MB.`);
      return;
    }

    returnFocusRef.current = browseButtonRef.current;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPendingPhoto({ file, sourceUrl: URL.createObjectURL(file) });
  }

  async function handleConfirmCrop() {
    if (!pendingPhoto || !croppedAreaPixels || isProcessingRef.current) return;

    setLocalError(undefined);
    isProcessingRef.current = true;
    setIsProcessing(true);
    try {
      const croppedFile = await cropImageToFile(
        pendingPhoto.sourceUrl,
        croppedAreaPixels,
        pendingPhoto.file.name,
      );
      onChange(croppedFile);
      setPendingPhoto(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (cropError) {
      setLocalError(
        cropError instanceof ImageCropError
          ? cropError.message
          : "Foto gagal diproses. Silakan coba lagi.",
      );
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    // Prevent a press of Enter on react-easy-crop's keyboard surface from
    // accidentally submitting a parent registration/profile form.
    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault();
    }
  }

  const modal = pendingPhoto ? (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-purple-950/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCropper();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={isProcessing || undefined}
        onKeyDown={handleDialogKeyDown}
        className="my-auto flex w-full max-w-2xl flex-col gap-5 rounded-3xl border border-white/15 bg-purple-950 p-5 shadow-modal sm:p-7"
      >
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="font-heading text-h4 text-yellow-300 sm:text-h3">
            Potong Foto Profil
          </h2>
          <p className="text-b3 text-purple-100">
            Geser foto dan atur pembesaran hingga wajah berada di dalam lingkaran.
          </p>
        </div>

        <div className="relative h-[min(55svh,420px)] min-h-[280px] overflow-hidden rounded-2xl bg-black/40">
          <Cropper
            image={pendingPhoto.sourceUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            roundCropAreaPixels
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            mediaProps={{
              alt: "Foto yang akan dipotong",
              onError: () => setLocalError("Foto tidak dapat dibaca. Pilih foto lain."),
            }}
            cropperProps={{ "aria-label": "Area potong foto profil" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor={`${titleId}-zoom`} className="font-subheading text-s5 text-foreground">
              Perbesar foto
            </label>
            <span aria-hidden="true" className="text-b3 text-purple-100">
              {zoom.toFixed(1)}x
            </span>
          </div>
          <input
            id={`${titleId}-zoom`}
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            disabled={isProcessing}
            aria-valuetext={`${zoom.toFixed(1)} kali`}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-yellow-400 disabled:opacity-50"
          />
        </div>

        {localError && (
          <p role="alert" className="text-b2 text-red-300">
            {localError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            ref={cancelButtonRef}
            type="button"
            disabled={isProcessing}
            onClick={closeCropper}
            className="h-12 w-full bg-white/15 text-s5 hover:bg-white/25 sm:w-auto"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={!croppedAreaPixels}
            isLoading={isProcessing}
            onClick={handleConfirmCrop}
            className="h-12 w-full text-s5 sm:w-auto"
          >
            Gunakan Foto
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className={cn("flex w-full flex-col gap-4", wrapperClassName)}>
      <FileUpload
        label={label}
        hint={hint}
        accept="image/png,image/jpeg"
        maxSizeMb={maxSizeMb}
        disabled={disabled}
        fileName={value?.name ?? ""}
        error={localError ?? error}
        browseButtonRef={browseButtonRef}
        onFileChange={handleSelectedFile}
      />

      {value ? (
        <LocalPhotoPreview
          key={`${value.name}:${value.size}:${value.lastModified}`}
          file={value}
        />
      ) : existingImageUrl ? (
        <PhotoPreview sourceUrl={existingImageUrl} isNewPhoto={false} />
      ) : null}

      {typeof document !== "undefined" && modal ? createPortal(modal, document.body) : null}
    </div>
  );
}
