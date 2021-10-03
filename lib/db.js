import { MongoClient } from 'mongodb';

const DATABASE_URL = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@crypto-numismatics.6du06.mongodb.net/crypto-numismatics?retryWrites=true&w=majority`;

export async function connectToDatabase() {
  const client = await MongoClient.connect(DATABASE_URL);

  return client;
}
