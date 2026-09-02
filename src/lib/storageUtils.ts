import { supabase } from "@/lib/supabase";

/**
 * Sanitizes file name to prevent broken URLs in Supabase storage
 * (e.g., handles spaces, #, ?, %, &, +, parentheses, etc.)
 */
export function sanitizeFileName(fileName: string): string {
  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts.pop()?.replace(/[^a-zA-Z0-9]/g, "") || "png" : "png";
  const nameWithoutExt = parts.join(".");
  
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 50);

  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}-${randomStr}-${cleanName}.${ext}`;
}

/**
 * Uploads a file to a specified Supabase storage bucket with sanitized name
 */
export async function uploadFileToStorage(
  bucket: string,
  file: File
): Promise<{ publicUrl: string | null; error: any }> {
  try {
    const fileName = sanitizeFileName(file.name);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(`Supabase storage upload error (${bucket}):`, uploadError);
      return { publicUrl: null, error: uploadError };
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { publicUrl: data.publicUrl, error: null };
  } catch (err) {
    console.error(`Exception during storage upload (${bucket}):`, err);
    return { publicUrl: null, error: err };
  }
}

/**
 * Normalizes external image URLs (e.g. Google Drive share links, Dropbox) into direct image URLs.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // Google Drive URL handling
  const gdriveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`;
  }

  // Dropbox URL handling
  if (trimmed.includes("dropbox.com")) {
    return trimmed.replace("dl=0", "raw=1");
  }

  return trimmed;
}
