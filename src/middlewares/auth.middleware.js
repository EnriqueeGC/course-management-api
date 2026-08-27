const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.cookies.authToken;

  if(!token){
    return res.status(401).json({
      message: "Access denied, not token providen"
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  };
}

module.exports = {
  isAuth,
};
