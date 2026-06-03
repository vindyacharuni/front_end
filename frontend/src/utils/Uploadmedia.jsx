import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Uploads a File/Blob to Supabase Storage and returns the public URL.
 * - Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set in env.
 * - Install dependency: `npm install @supabase/supabase-js`
 *
 * @param {File|Blob} file - file to upload
 * @param {object} options
 * @param {string} options.bucket - storage bucket name (default: 'images')
 * @param {string} options.folder - folder/path prefix (default: 'uploads')
 * @param {boolean} options.makePublic - whether to return a public URL (default: true)
 * @returns {Promise<string|object>} public URL string (if makePublic) or upload data
 */
export default async function UploadMedia(file, { bucket = 'images', folder = 'uploads', makePublic = true } = {}) {
  if (!file) throw new Error('No file provided to UploadMedia');
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const timestamp = Date.now();
  const originalName = file?.name || 'file';
  const safeName = originalName.replace(/\s+/g, '-');
  const path = `${folder}/${timestamp}-${safeName}`;

  try {
    const toastId = toast.loading('Uploading...');
    const { data, error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) throw uploadError;

    if (makePublic) {
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
      toast.success('Upload successful', { id: toastId });
      return publicData?.publicUrl || null;
    }
    toast.success('Upload successful', { id: toastId });
    return data;
  } catch (err) {
    const message = err?.message || JSON.stringify(err) || 'Upload failed';
    try { toast.error(message); } catch (e) {}
    throw new Error(message);
  }
}
