import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);

export default router;
