import dotenv from "dotenv";

// Load environment variables before importing other modules
dotenv.config({ path: "./.env" });

import app from "./app.js";
import cloudinary from "cloudinary";

// Configure Cloudinary for image uploads
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000; // Use default port if not specified

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});