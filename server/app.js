import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/posts.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

export default app;
