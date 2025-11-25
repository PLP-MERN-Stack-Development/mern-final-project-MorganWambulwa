// module.exports = function requireRole(...allowed){
//     return (req,res,next)=>{
//     if(!req.user) return res.status(401).send('unauth');
//     if(!allowed.includes(req.user.role)) return res.status(403).send('forbidden');
//     next();
//     }
//     }
export const requireRole = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role))
        return res.status(403).json({ message: "Access denied" });
      next();
    };
  };
  