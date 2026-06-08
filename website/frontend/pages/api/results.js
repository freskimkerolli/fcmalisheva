import { requireAuth } from '../../lib/auth';
import { getResults, createResult } from '../../lib/store';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return res.json(await getResults());
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      return res.status(201).json(await createResult(req.body));
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}