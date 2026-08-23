import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put, del } from "@vercel/blob";

const STORAGE_DIR = path.join(process.cwd(), "public", "recipe-images");

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function downloadImage(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return undefined;

    const contentType = response.headers.get("content-type")?.split(";")[0].trim() ?? "";
    const ext = EXT_BY_CONTENT_TYPE[contentType] ?? "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await response.arrayBuffer());

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`recipe-images/${filename}`, buffer, {
        access: "public",
        contentType: contentType || "image/jpeg",
      });
      return blob.url;
    }

    await mkdir(STORAGE_DIR, { recursive: true });
    await writeFile(path.join(STORAGE_DIR, filename), buffer);
    return `/recipe-images/${filename}`;
  } catch (err) {
    console.error("downloadImage failed:", err);
    return undefined;
  }
}

export async function deleteRecipeImage(imageUrl: string | null): Promise<void> {
  if (!imageUrl) return;

  if (imageUrl.startsWith("/recipe-images/")) {
    const filename = path.basename(imageUrl);
    await unlink(path.join(STORAGE_DIR, filename)).catch(() => null);
    return;
  }

  if (imageUrl.includes(".public.blob.vercel-storage.com")) {
    await del(imageUrl).catch(() => null);
  }
}
