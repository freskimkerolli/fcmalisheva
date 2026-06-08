import { requireAuth } from '../../lib/auth';
import { updateTable } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();
  if (!requireAuth(req, res)) return;
  try {
    res.json(await updateTable(req.body.tableData));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}