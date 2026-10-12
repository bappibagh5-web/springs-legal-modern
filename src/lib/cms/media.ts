import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "site-media";
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const MAX_BYTES = 15 * 1024 * 1024;

export type MediaAsset = {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  folder_id: string | null;
  mime_type: string;
  width: number | null;
  height: number | null;
  file_size: number;
  alt_text: string;
  created_at: string;
};
export type MediaFolder = { id: string; name: string };

export const mediaUrl = (path: string) => `/api/public/media/${path}`;

function readDims(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      resolve({ width: im.naturalWidth, height: im.naturalHeight });
      URL.revokeObjectURL(url);
    };
    im.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    im.src = url;
  });
}

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG, WebP, GIF or AVIF images are allowed.`;
  if (file.size > MAX_BYTES) return `${file.name}: file is larger than 15 MB.`;
  return null;
}

export async function uploadMedia(file: File, folderId: string | null): Promise<MediaAsset> {
  const err = validateFile(file);
  if (err) throw new Error(err);
  const ext = (file.name.split(".").pop() || "img").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${crypto.randomUUID()}.${ext}`;
  const dims = await readDims(file);
  const up = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) throw new Error(up.error.message);
  const { data: u } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      file_name: file.name,
      storage_path: path,
      public_url: mediaUrl(path),
      folder_id: folderId,
      mime_type: file.type,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
      file_size: file.size,
      alt_text: "",
      uploaded_by: u.user?.id ?? null,
    })
    .select()
    .single();
  if (error) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    throw new Error(error.message);
  }
  return data as MediaAsset;
}

/** Replaces the file contents while keeping the same address, so pages using it never break. */
export async function replaceMediaFile(asset: MediaAsset, file: File) {
  const err = validateFile(file);
  if (err) throw new Error(err);
  const dims = await readDims(file);
  const up = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(asset.storage_path, file, { contentType: file.type, upsert: true });
  if (up.error) throw new Error(up.error.message);
  const { error } = await supabase
    .from("media_assets")
    .update({ mime_type: file.type, file_size: file.size, width: dims?.width ?? null, height: dims?.height ?? null })
    .eq("id", asset.id);
  if (error) throw new Error(error.message);
}

/** Returns titles of pages whose draft or published content references this image. */
export async function findMediaUsage(url: string): Promise<string[]> {
  const [pub, drafts] = await Promise.all([
    supabase.from("site_content").select("page_key, content"),
    supabase.from("site_content_drafts").select("page_key, content"),
  ]);
  const hits = new Set<string>();
  for (const row of [...(pub.data ?? []), ...(drafts.data ?? [])]) {
    if (JSON.stringify(row.content).includes(url)) hits.add(row.page_key);
  }
  return [...hits];
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
