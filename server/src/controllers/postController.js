import FoodPost from "../models/FoodPost.js";

export const createPost = async (req, res) => {
  try {
    const post = await FoodPost.create({
      ...req.body,
      postedBy: req.user._id,
      imageUrl: req.file?.path
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  const posts = await FoodPost.find().sort({ createdAt: -1 });
  res.json(posts);
};
