// const jwt = require('jsonwebtoken');
// const User = require('../models/User');


// async function authMiddleware(req,res,next){
// const header = req.headers.authorization;
// if(!header) return res.status(401).json({message:'No token'});
// const token = header.split(' ')[1];
// try{
// const payload = jwt.verify(token, process.env.JWT_SECRET);
// req.user = await User.findById(payload.id).select('-passwordHash');
// next();
// }catch(err){
// return res.status(401).json({message:'Invalid token'});
// }
// }


// module.exports = authMiddleware;
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
