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

  let response: Response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch {
    throw new ImageUploadError("Tidak dapat mengunggah file. Periksa koneksi internet kamu.");
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
