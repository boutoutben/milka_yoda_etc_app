const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split('.')[1])); // decode payload
  const currentTime = Math.floor(Date.now() / 1000);  // current time in seconds
  return currentTime >= payload.exp;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  // Cas 1 : pas de token OU token égal à "null" ou "undefined"
  if (!token || token === "null" || token === "undefined") {
    res.status(401).json({ error: "Token manquant ou invalide" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (isTokenExpired(token)) {
      return res.status(403).json({ error: "Token expiré" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token invalide" });
  }
}

module.exports = {
  verifyToken
}
