import mongoose from 'mongoose';

export default async function dbConnect(dbName?: string) {
  if (mongoose.connection.readyState === 1) return; // already connected

  const uri = process.env.MONGODB_URI!;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      dbName, // optional, based on your usage
    });
  }

  
  // Wait until the connection is fully open
  await new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve(true);

    mongoose.connection.once('open', () => resolve(true));
    mongoose.connection.once('error', (err) => reject(err));
  });
}
