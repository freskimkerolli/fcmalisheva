import { requireAuth } from '../../../lib/auth';
import { updateAnnouncement, deleteAnnouncement } from '../../../lib/store';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!requireAuth(req, res)) return;
  try {
    if (req.method === 'PUT') {
      const a = await updateAnnouncement(id, req.body);
      if (!a) return res.status(404).json({ error: 'Njoftimi nuk u gjet' });
      return res.json(a);
    }
    if (req.method === 'DELETE') {
      const ok = await deleteAnnouncement(id);
      if (!ok) return res.status(404).json({ error: 'Njoftimi nuk u gjet' });
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}