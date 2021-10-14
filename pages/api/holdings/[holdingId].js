import mongo from 'mongodb';
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

  if (req.method === 'PUT') {
    if (!(req.query.holdingId && req.body.id && req.query.holdingId === req.body.id)) {
      const message = `Request path id (${req.query.holdingId}) and request body id ` + `(${req.body.id}) must match`;
      console.error(message);
      res.status(400).json({ message: message });
      client.close();
      return;
    }

    try {
      const { amount } = req.body;
      const result = await db
        .collection('holdings')
        .updateOne({ _id: new mongo.ObjectId(req.query.holdingId) }, { $set: { amount: amount } });
      console.log('PUT result', result);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Could not update holding' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await db.collection('holdings').deleteOne({ _id: new mongo.ObjectId(req.query.holdingId), user: userId });

      if (result.deletedCount === 1) {
        res.status(204).end();
      } else {
        throw new Error('No documents matched the query. Deleted 0 documents.');
      }
    } catch (error) {
      res.status(500).json({ message: 'Could not delete holding' });
    }
  }

  client.close();
}
