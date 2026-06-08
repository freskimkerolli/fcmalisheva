import { requireAuth } from '../../../lib/auth';
import { parseForm, uploadPhoto } from '../../../lib/upload';
import { updatePlayer, deletePlayer } from '../../../lib/store';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const { id } = req.query;
  if (!requireAuth(req, res)) return;
  try {
    if (req.method === 'PUT') {
      const { fields, files } = await parseForm(req);
      const photo = files.photo ? await uploadPhoto(files.photo) : fields.photo || '';
      const player = await updatePlayer(id, { ...fields, photo });
      if (!player) return res.status(404).json({ error: 'Lojtari nuk u gjet' });
      return res.json(player);
    }
    if (req.method === 'DELETE') {
      const ok = await deletePlayer(id);
      if (!ok) return res.status(404).json({ error: 'Lojtari nuk u gjet' });
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}