import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // format: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, "6764jkgkkgjk995959jkkjg446");
    req.user = decoded; // userId, role, etc.
    console.log("cc")
    next();
  } catch (err) {
    return res.status(403).json({ error: "Vous êtes déconnecter" });
  }
}
