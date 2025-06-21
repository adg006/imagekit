import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb url in your env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function dbConnect() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    mongoose.connect(MONGODB_URI).then(() => mongoose.connection);
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.connection;
}
