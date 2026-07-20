export interface ImageCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PROFILE_PHOTO_SIZE = 512;
export const PROFILE_PHOTO_QUALITY = 0.9;

export class ImageCropError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageCropError";
  }
}

function loadImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () => reject(new ImageCropError("Foto tidak dapat dibaca. Pilih foto lain.")),
      { once: true },
    );
    image.src = sourceUrl;
  });
}

function isValidCropArea(cropArea: ImageCropArea): boolean {
  return (
    Number.isFinite(cropArea.x) &&
    Number.isFinite(cropArea.y) &&
    Number.isFinite(cropArea.width) &&
    Number.isFinite(cropArea.height) &&
    cropArea.x >= 0 &&
    cropArea.y >= 0 &&
    cropArea.width > 0 &&
    cropArea.height > 0
  );
}

function croppedFileName(originalFileName: string): string {
  const stem = originalFileName.replace(/\.[^/.]+$/, "").trim() || "foto-profil";
  return `${stem}-cropped.jpg`;
}

/**
 * Renders a square profile-photo crop to a predictable, upload-friendly JPEG.
 * The crop coordinates must be the pixel coordinates returned by react-easy-crop.
 */
export async function cropImageToFile(
  sourceUrl: string,
  cropArea: ImageCropArea,
  originalFileName: string,
): Promise<File> {
  if (!sourceUrl || !isValidCropArea(cropArea)) {
    throw new ImageCropError("Area potong foto tidak valid. Atur ulang posisi foto.");
  }

  const image = await loadImage(sourceUrl);
  const canvas = document.createElement("canvas");
  canvas.width = PROFILE_PHOTO_SIZE;
  canvas.height = PROFILE_PHOTO_SIZE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new ImageCropError("Peramban tidak dapat memproses foto ini.");
  }

  // JPEG has no alpha channel. A white base prevents transparent PNG pixels
  // from becoming black in the generated profile photo.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, PROFILE_PHOTO_SIZE, PROFILE_PHOTO_SIZE);
  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    PROFILE_PHOTO_SIZE,
    PROFILE_PHOTO_SIZE,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", PROFILE_PHOTO_QUALITY);
  });

  if (!blob) {
    throw new ImageCropError("Foto gagal diproses. Silakan coba lagi.");
  }

  return new File([blob], croppedFileName(originalFileName), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
