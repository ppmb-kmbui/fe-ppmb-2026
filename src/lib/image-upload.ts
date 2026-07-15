export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

interface CloudinaryUploadResponse {
  secure_url?: unknown;
  error?: { message?: unknown };
}

const uploadTimeoutMs = 30_000;

function getCloudinaryConfig(): { cloudName: string; uploadPreset: string } {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET belum dikonfigurasi",
    );
  }

  return { cloudName, uploadPreset };
}

export async function uploadImage(file: File): Promise<string> {
  return uploadToCloudinary(file, "image");
}

export async function uploadRawFile(file: File): Promise<string> {
  return uploadToCloudinary(file, "raw");
}

async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "raw",
): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), uploadTimeoutMs);

  let response: Response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      },
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ImageUploadError(
        "Upload file terlalu lama. Coba kompres file atau periksa koneksi internet kamu.",
      );
    }

    throw new ImageUploadError("Tidak dapat mengunggah file. Periksa koneksi internet kamu.");
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => undefined)) as
    | CloudinaryUploadResponse
    | undefined;

  if (!response.ok) {
    const message =
      typeof payload?.error?.message === "string" ? payload.error.message : "Gagal mengunggah file";
    throw new ImageUploadError(message);
  }

  if (typeof payload?.secure_url !== "string") {
    throw new ImageUploadError("Respons layanan unggah file tidak valid");
  }

  return payload.secure_url;
}
