import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const DB_NAME = 'pawplace';

let db: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`  MongoDB connected: ${MONGO_URI}/${DB_NAME}`);
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error('DB not connected — call connectDb() first');
  return db;
}
