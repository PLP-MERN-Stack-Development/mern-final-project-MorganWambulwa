// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const generateToken = require('../utils/generateToken');


// exports.register = async (req,res) =>{
// const { name,email,password,role } = req.body;
// if(!name||!email||!password) return res.status(400).json({message:'missing'});
// const existing = await User.findOne({ email });
// if(existing) return res.status(400).json({message:'exists'});
// const passwordHash = await bcrypt.hash(password, 12);
// const user = await User.create({ name, email, passwordHash, role: role || 'receiver' });
// const token = generateToken(user);
// res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
// }


// exports.login = async (req,res)=>{
// const { email,password } = req.body;
// const user = await User.findOne({ email });
// if(!user) return res.status(401).json({message:'invalid'});
// const ok = await bcrypt.compare(password, user.passwordHash);
// if(!ok) return res.status(401).json({message:'invalid'});
// const token = generateToken(user);
// res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
// }


// exports.me = async (req,res)=>{
// res.json({ user: req.user })
// }
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const user = await User.create({ name, email, password, role });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
