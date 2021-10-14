import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  const user = await db.collection('users').findOne({ username: session.user.name });
  const userId = user._id;

  if (req.method === 'GET') {
    try {
      const holdings = await db.collection('holdings').find({ user: userId }).toArray();

      res.status(200).json({ holdings });
    } catch (error) {
      res.status(500).json({ message: 'Could not get holdings' });
    }
  }

  if (req.method === 'POST') {
    const requiredFields = ['symbol', 'name', 'amount'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        res.status(400).send(message);
        client.close();
        return;
      }
    }

    try {
      const { symbol, name, amount } = req.body;
      const result = await db.collection('holdings').findOneAndUpdate(
        { symbol: symbol, user: userId },
        {
          $set: {
            symbol,
            name,
            user: userId,
          },
          $inc: {
            amount: Number(amount),
          },
        },
        { upsert: true, returnDocument: 'after' },
      );

      res.status(201).json({ message: 'Holding added' }); // return holding here? or do I not need it and can just await?
    } catch (error) {
      res.status(500).json({ message: 'Could not add holding' });
    }
  }

  client.close();
}
