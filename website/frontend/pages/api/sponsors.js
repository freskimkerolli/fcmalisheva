import { requireAuth } from '../../lib/auth';
import { parseForm, uploadPhoto } from '../../lib/upload';
import { getSponsors, createSponsor } from '../../lib/store';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return res.json(await getSponsors());
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const { fields, files } = await parseForm(req);
      const logo_path = files.logo_file ? await uploadPhoto(files.logo_file) : fields.logo_path || '';
      return res.status(201).json(await createSponsor({ ...fields, logo_path }));
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}