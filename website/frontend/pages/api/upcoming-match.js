import { requireAuth } from '../../lib/auth';
import { parseForm, uploadPhoto } from '../../lib/upload';
import { getUpcomingMatch, updateUpcomingMatch } from '../../lib/store';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.json(await getUpcomingMatch());
    }
    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      const { fields, files } = await parseForm(req);
      const data = { ...fields };
      if (files.home_logo_file) data.home_logo = await uploadPhoto(files.home_logo_file);
      if (files.away_logo_file) data.away_logo = await uploadPhoto(files.away_logo_file);
      return res.json(await updateUpcomingMatch(data));
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}