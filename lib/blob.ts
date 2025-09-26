import { put, del } from '@vercel/blob';

export async function createUploadUrl(pathHint: string) {
  const name = `${Date.now()}-${pathHint}`.replace(/[^a-zA-Z0-9._-]/g, '');
  const { url } = await put(name, new Blob([]), {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

export async function deleteBlob(url: string) {
  if (!url) return;
  await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
}
