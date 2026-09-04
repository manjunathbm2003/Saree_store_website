import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  PRODUCT_IMAGES_BUCKET,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase";

function uniqueFilename(originalName: string): string {
  const ext = path.extname(originalName) || ".jpg";
  return `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
}

async function saveToLocal(files: File[]): Promise<string[]> {
  const uploadDir = path.join(process.cwd(), "public", "products");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (!file.size) continue;
    const filename = uniqueFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/products/${filename}`);
  }
  return urls;
}

async function saveToSupabase(files: File[]): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const urls: string[] = [];

  for (const file of files) {
    if (!file.size) continue;

    const filename = uniqueFilename(file.name);
    const objectPath = `products/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(objectPath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(objectPath);

    urls.push(data.publicUrl);
  }

  return urls;
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const valid = files.filter((f) => f && f.size > 0);
  if (valid.length === 0) return [];

  if (isSupabaseConfigured()) {
    return saveToSupabase(valid);
  }

  // Local fallback for development without Supabase
  return saveToLocal(valid);
}

function supabaseObjectPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function deleteProductImageFile(url: string): Promise<void> {
  if (url.startsWith("/products/")) {
    const filePath = path.join(process.cwd(), "public", url);
    await unlink(filePath).catch(() => {});
    return;
  }

  const objectPath = supabaseObjectPathFromUrl(url);
  if (!objectPath || !isSupabaseConfigured()) return;

  await getSupabaseAdmin()
    .storage.from(PRODUCT_IMAGES_BUCKET)
    .remove([objectPath])
    .catch(() => {});
}
