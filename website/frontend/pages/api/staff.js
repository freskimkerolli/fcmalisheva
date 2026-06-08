import { requireAuth } from '../../lib/auth';
import { parseForm, uploadPhoto } from '../../lib/upload';
import { getStaff, createStaffMember } from '../../lib/store';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.json(await getStaff());
    }
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const { fields, files } = await parseForm(req);
      const photo = files.photo ? await uploadPhoto(files.photo) : fields.photo || '';
      return res.status(201).json(await createStaffMember({ ...fields, photo }));
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}