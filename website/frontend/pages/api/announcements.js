import { requireAuth } from '../../lib/auth';
import { getAnnouncements, createAnnouncement } from '../../lib/store';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return res.json(await getAnnouncements());
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      return res.status(201).json(await createAnnouncement(req.body));
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}