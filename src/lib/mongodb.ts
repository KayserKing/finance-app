/* eslint-disable no-var */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || 'auth';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local');
}

declare global {
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

const cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME, // ✅ THIS IS CRUCIAL
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance.connection); // Use `connection` property
  }

  cached.conn = await cached.promise;
  console.log('✅ Connected to DB:', cached.conn.name);
  return cached.conn;
}

global.mongoose = cached;

export default dbConnect;
