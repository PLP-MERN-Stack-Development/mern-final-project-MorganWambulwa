import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------
// Safe __dirname for Jest
// ---------------------------
const __dirname = path.resolve();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);

// ---------------------------
// MongoDB connection
// ---------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(err);
    }
  });

export default app;
