// const mongoose = require('mongoose');


// const UserSchema = new mongoose.Schema({
// name: { type: String, required: true },
// email: { type: String, required: true, unique: true, lowercase: true },
// passwordHash: { type: String, required: true },
// role: { type: String, enum: ['giver','receiver','admin'], default: 'receiver' },
// phone: { type: String },
// location: {
// address: String,
// coords: { type: { type: String, default: 'Point' }, coordinates: [Number] }
// },
// createdAt: { type: Date, default: Date.now }
// });
// UserSchema.index({ 'location.coords': '2dsphere' });
// module.exports = mongoose.model('User', UserSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["giver", "receiver", "admin"],
      default: "receiver"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.model("User", userSchema);
