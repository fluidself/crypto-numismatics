import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;
  const { username, password, passwordconfirm } = data;

  const explicityTrimmedFields = ['username', 'password', 'passwordconfirm'];
  const nonTrimmedField = explicityTrimmedFields.find(field => req.body[field].trim() !== req.body[field]);
  if (nonTrimmedField) {
    res.status(422).json({ message: `${nonTrimmedField} cannot start or end with whitespace` });
    return;
  }

  if (password.trim().length < 6) {
    res.status(422).json({ message: `Password must be at least 6 characters long` });
    return;
  }

  if (password !== passwordconfirm) {
    res.status(422).json({ message: 'Passwords must match' });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    res.status(422).json({ message: 'Username already taken' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);
  await db.collection('users').insertOne({ username, password: hashedPassword });

  res.status(201).json({ message: 'User created' });
  client.close();
}
