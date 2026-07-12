import mongoose from "mongoose";

mongoose.set("debug", true);

export async function connectDB() {
  return mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
      auth: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
      },
    })
    .then(() => console.log("Database Connected !"))
    .catch((error) => console.error("Database connection error: ", error));
}
