import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Enable CORS for frontend communication
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware for parsing cookies, JSON, and URL-encoded data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable file uploads with temporary file storage
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Define API routes
app.use("/user", userRouter);
app.use("/job", jobRouter);
app.use("/application", applicationRouter);

// Start scheduled newsletter cron job
newsLetterCron();

// Establish database connection
connection();

// Global error handling middleware
app.use(errorMiddleware);

export default app;