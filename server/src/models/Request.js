// const mongoose = require('mongoose');


// const RequestSchema = new mongoose.Schema({
// post: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPost', required: true },
// receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// message: String,
// status: { type: String, enum: ['pending','accepted','rejected','cancelled','collected'], default: 'pending' },
// createdAt: { type: Date, default: Date.now },
// updatedAt: Date
// });
// module.exports = mongoose.model('Request', RequestSchema);
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPost" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
