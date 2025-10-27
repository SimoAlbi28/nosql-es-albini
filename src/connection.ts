import { MongoClient } from 'mongodb';

let _client = null;
let _db = null;

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URL (or MONGO_URI) is not set');
  }

  const dbName = process.env.MONGO_DB_NAME || process.env.MONGO_DATABASE;
  if (!dbName) {
    throw new Error('MONGO_DB_NAME is not set');
  }

  if (_db) return _db;

  _client = new MongoClient(mongoUri, { maxPoolSize: 10 });
  await _client.connect();
  _db = _client.db(dbName);
  return _db;
};

export const closeConnection = async () => {
  try {
    if (_client) {
      await _client.close();
      _client = null;
      _db = null;
    }
  } catch (err) {
    console.error('Error closing MongoDB connection', err);
  }
};
