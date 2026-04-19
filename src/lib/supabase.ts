import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { User, Session } from '@supabase/supabase-js'

// Storage bucket names
export const BUCKETS = {
  PROPERTY_PHOTOS: 'property-photos',
  TITLE_DOCS: 'title-documents',
  AVATARS: 'avatars',
  CROP_IMAGES: 'crop-images',
} as const

/**
 * Upload a file to a Supabase storage bucket.
 * Returns the public URL on success, throws on error.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Delete a file from a Supabase storage bucket.
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

/**
 * Get the public URL for a stored file without downloading it.
 */
export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
