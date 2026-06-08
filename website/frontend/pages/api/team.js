import { getPlayers } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    res.json(await getPlayers());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}