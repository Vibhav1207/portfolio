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
