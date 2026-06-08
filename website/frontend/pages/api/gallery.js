import { requireAuth } from '../../lib/auth';
import { parseForm, uploadPhoto } from '../../lib/upload';
import { getGallery, addGalleryPhoto, removeGalleryPhoto } from '../../lib/store';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.json(await getGallery());
    }
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const { files } = await parseForm(req);
      if (!files.photo) return res.status(400).json({ error: 'Nuk u ngarkua foto' });
      const url = await addGalleryPhoto(await uploadPhoto(files.photo));
      return res.status(201).json({ url });
    }
    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;
      // DELETE sends JSON body — re-parse from the stream
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const { url } = JSON.parse(Buffer.concat(chunks).toString());
      const ok = await removeGalleryPhoto(url);
      if (!ok) return res.status(404).json({ error: 'Foto nuk u gjet' });
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}