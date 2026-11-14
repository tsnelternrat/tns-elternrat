/**
 * Öffentliche Basis-Adresse des Vercel-Blob-Stores, gleich wie in @payloadcms/storage-vercel-blob.
 * Null, wenn kein Token gesetzt ist (Dateien laufen dann über /api/<collection>/file).
 */
export function blobBasis(): string | null {
  if (process.env.STORAGE_VERCEL_BLOB_BASE_URL) return process.env.STORAGE_VERCEL_BLOB_BASE_URL
  const store = process.env.BLOB_READ_WRITE_TOKEN?.match(
    /^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i,
  )?.[1]
  return store ? `https://${store.toLowerCase()}.public.blob.vercel-storage.com` : null
}
