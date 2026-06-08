import { requireAuth } from '../../../lib/auth';
import { updateResult, deleteResult } from '../../../lib/store';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!requireAuth(req, res)) return;
  try {
    if (req.method === 'PUT') {
      const r = await updateResult(id, req.body);
      if (!r) return res.status(404).json({ error: 'Ndeshja nuk u gjet' });
      return res.json(r);
    }
    if (req.method === 'DELETE') {
      const ok = await deleteResult(id);
      if (!ok) return res.status(404).json({ error: 'Ndeshja nuk u gjet' });
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}