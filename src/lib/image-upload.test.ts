import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ImageUploadError, uploadImage } from "@/lib/image-upload";

const originalEnv = { ...process.env };

function makeFile(): File {
  return new File(["fake-image-bytes"], "photo.png", { type: "image/png" });
}

describe("uploadImage", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "xuytis3l";
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "PPMB KMB UI 2026";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("posts the file and preset to Cloudinary and returns the secure URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: "https://res.cloudinary.com/xuytis3l/image/upload/v1/photo.png" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const url = await uploadImage(makeFile());

    expect(url).toBe("https://res.cloudinary.com/xuytis3l/image/upload/v1/photo.png");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.cloudinary.com/v1_1/xuytis3l/image/upload",
      expect.objectContaining({ method: "POST" }),
    );
    const sentFormData = fetchMock.mock.calls[0][1].body as FormData;
    expect(sentFormData.get("upload_preset")).toBe("PPMB KMB UI 2026");
  });

  it("throws ImageUploadError with Cloudinary's message when the upload is rejected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "Upload preset not found" } }),
      }),
    );

    await expect(uploadImage(makeFile())).rejects.toThrow(ImageUploadError);
    await expect(uploadImage(makeFile())).rejects.toThrow("Upload preset not found");
  });

  it("throws ImageUploadError when the network request itself fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    await expect(uploadImage(makeFile())).rejects.toThrow(
      "Tidak dapat mengunggah file. Periksa koneksi internet kamu.",
    );
  });

  it("throws when Cloudinary is not configured", async () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    await expect(uploadImage(makeFile())).rejects.toThrow(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET belum dikonfigurasi",
    );
  });
});
