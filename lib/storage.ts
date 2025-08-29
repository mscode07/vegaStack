import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  POSTS: "posts",
} as const

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  path: string,
): Promise<{ url: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { url: urlData.publicUrl }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      url: "",
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}

export function generateFilePath(userId: string, fileName: string): string {
  const timestamp = Date.now()
  const extension = fileName.split(".").pop()
  return `${userId}/${timestamp}.${extension}`
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image must be less than 2MB" }
  }

  return { valid: true }
}
