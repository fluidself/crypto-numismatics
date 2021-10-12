import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../lib/db';

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
        { symbol, user: userId },
        {
          symbol: symbol,
          name: name,
          $inc: {
            amount: amount,
          },
          user: userId,
        },
        { upsert: true, new: true, runValidators: true },
      );
      console.log('POST result', result);
      res.status(201).json({ message: 'Holding added' }); // return holding here? or do I not need it and can just await?
    } catch (error) {
      res.status(500).json({ message: 'Could not add holding' });
    }
  }

  if (req.method === 'PUT') {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message = `Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`;
      console.error(message);
      res.status(400).json({ message: message });
      client.close();
      return;
    }

    try {
      const { amount } = req.body;
      const result = await db.collection('holdings').updateOne({ _id: req.params.id }, { $set: { amount: amount } });
      console.log('PUT result', result);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Could not update holding' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await db.collection('holdings').deleteOne({ _id: req.params.id });
      console.log('DELETE result', result);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Could not delete holding' });
    }
  }

  client.close();
}
