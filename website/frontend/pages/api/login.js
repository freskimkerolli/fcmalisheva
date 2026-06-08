import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  if (username === (process.env.ADMIN_USER || 'admin') && password === (process.env.ADMIN_PASS || 'admin123')) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'fcmalisheva-admin-secret', { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Kredencialet janë të gabuara' });
}