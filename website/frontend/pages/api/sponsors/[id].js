import { requireAuth } from '../../../lib/auth';
import { parseForm, uploadPhoto } from '../../../lib/upload';
import { updateSponsor, deleteSponsor } from '../../../lib/store';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const { id } = req.query;
  if (!requireAuth(req, res)) return;
  try {
    if (req.method === 'PUT') {
      const { fields, files } = await parseForm(req);
      const logo_path = files.logo_file ? await uploadPhoto(files.logo_file) : fields.logo_path || '';
      const s = await updateSponsor(id, { ...fields, logo_path });
      if (!s) return res.status(404).json({ error: 'Sponzori nuk u gjet' });
      return res.json(s);
    }
    if (req.method === 'DELETE') {
      const ok = await deleteSponsor(id);
      if (!ok) return res.status(404).json({ error: 'Sponzori nuk u gjet' });
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}