// const mongoose = require('mongoose');


// const FoodPostSchema = new mongoose.Schema({
// title: { type: String, required: true },
// description: String,
// images: [{ url: String, public_id: String }],
// giver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// quantity: String,
// category: String,
// pickupWindow: { start: Date, end: Date },
// pickupInstructions: String,
// location: { address: String, coords: { type: { type: String, default: 'Point' }, coordinates: [Number] } },
// status: { type: String, enum: ['available','reserved','picked_up','expired','removed'], default: 'available' },
// reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// createdAt: { type: Date, default: Date.now }
// });
// FoodPostSchema.index({ 'location.coords': '2dsphere' });
// module.exports = mongoose.model('FoodPost', FoodPostSchema);

import mongoose from "mongoose";

const foodPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    pickupLocation: String,
    quantity: Number,
    imageUrl: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["available", "requested", "picked"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FoodPost", foodPostSchema);
