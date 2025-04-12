// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || 'auth';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME, // ✅ THIS IS CRUCIAL
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log('✅ Connected to DB:', cached.conn.connection.name);
  return cached.conn;
}

(global as any).mongoose = cached;

export default dbConnect;
