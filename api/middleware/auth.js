const User = require("../models/User");

module.exports = async (req, res, next) => {
  // Récupère le header Authorization
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  // Gère "Bearer token" OU juste "token"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Token invalide" });
  }

  // Vérifie que le token existe dans la DB
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(401).json({ message: "Token invalide" });
  }

  req.user = user;  // user complet (avec _id)
  next();
};
