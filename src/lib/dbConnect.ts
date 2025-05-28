import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGO_URI);
};

export default dbConnect;
