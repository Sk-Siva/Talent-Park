import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: "./.env" });

/**
 * Establishes a connection to the MongoDB database.
 */
export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "HIREMATE"
    });
    console.log("✅ Connected to the database.");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit process if connection fails
  }
};
