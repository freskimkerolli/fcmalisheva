import { formidable } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_ENABLED = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function parseForm(req) {
  const form = formidable({ maxFileSize: 5 * 1024 * 1024, keepExtensions: true });
  const [fields, files] = await form.parse(req);
  const flat = (obj) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  return { fields: flat(fields), files: flat(files) };
}

export async function uploadPhoto(file) {
  if (!file) return '';
  if (CLOUDINARY_ENABLED) {
    const result = await cloudinary.uploader.upload(file.filepath, { folder: 'fcmalisheva' });
    return result.secure_url;
  }
  throw new Error('Cloudinary nuk është konfiguruar. Shto CLOUDINARY_* env vars në Vercel.');
}