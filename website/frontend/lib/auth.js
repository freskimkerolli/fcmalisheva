import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fcmalisheva-admin-secret';

export function requireAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Nuk jeni të autorizuar' });
    return false;
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    return true;
  } catch {
    res.status(401).json({ error: 'Token i pavlefshëm' });
    return false;
  }
}