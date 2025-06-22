const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split('.')[1])); // decode payload
  const currentTime = Math.floor(Date.now() / 1000);  // current time in seconds
  return currentTime >= payload.exp;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // format: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, role, etc.
    if(isTokenExpired(token)) return res.status(403).json({error: "No allow"})
    next();
  } catch {
    
    return res.status(403).json({ error: "No allow" });
  }
}

module.exports = {
  verifyToken
}
