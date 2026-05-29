import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const DB_NAME = 'pawplace';

let db: Db | null = null;

function databaseFromClient(client: MongoClient, dbName: string): Db {
  return client.db(dbName);
}

function logDbConnected(uri: string, name: string): void {
  console.log(`  MongoDB connected: ${uri}/${name}`);
}

export async function connectDb(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const connected = databaseFromClient(client, DB_NAME);
  db = connected;
  logDbConnected(MONGO_URI, DB_NAME);
  return connected;
}

export function getDb(): Db {
  if (!db) throw new Error('DB not connected — call connectDb() first');
  return db;
}
