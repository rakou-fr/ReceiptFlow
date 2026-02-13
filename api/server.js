const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/FTMRFlow"; // MongoDB local

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Schéma utilisateur
const userSchema = new mongoose.Schema({
  identifiant: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
});

const User = mongoose.model("User", userSchema);

// Route pour créer un utilisateur (pour test / seed)
app.post("/api/register", async (req, res) => {
  const { identifiant, password } = req.body;
  console.log("[REGISTER] Requête reçue :", req.body);

  if (!identifiant || !password) {
    console.log("[REGISTER] Identifiant ou mot de passe manquant");
    return res.status(400).json({ message: "Identifiant et mot de passe requis" });
  }

  try {
    const existingUser = await User.findOne({ identifiant });
    if (existingUser) {
      console.log("[REGISTER] Utilisateur déjà existant :", identifiant);
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ identifiant, password: hashedPassword });
    await newUser.save();

    console.log("[REGISTER] Utilisateur créé :", identifiant);
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (err) {
    console.error("[REGISTER] Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route login
app.post("/api/login", async (req, res) => {
  const { identifiant, password } = req.body;
  console.log("[LOGIN] Requête reçue :", req.body);

  try {
    const user = await User.findOne({ identifiant });
    if (!user) {
      console.log("[LOGIN] Utilisateur non trouvé :", identifiant);
      return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[LOGIN] Mot de passe incorrect pour :", identifiant);
      return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Générer token aléatoire
    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    console.log("[LOGIN] Connexion réussie pour :", identifiant, "| Token :", token);
    res.json({ token, identifiant: user.identifiant });
  } catch (err) {
    console.error("[LOGIN] Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Middleware pour vérifier token
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("[AUTH] Token reçu :", token);

  if (!token) {
    console.log("[AUTH] Token manquant");
    return res.status(401).json({ message: "Token manquant" });
  }

  const user = await User.findOne({ token });
  if (!user) {
    console.log("[AUTH] Token invalide :", token);
    return res.status(401).json({ message: "Token invalide" });
  }

  console.log("[AUTH] Token valide pour :", user.identifiant);
  req.user = user;
  next();
};

// Route sécurisée exemple
app.get("/api/dashboard", authMiddleware, (req, res) => {
  console.log("[DASHBOARD] Accès autorisé pour :", req.user.identifiant);
  res.json({ message: `Bienvenue ${req.user.identifiant} sur le dashboard !` });
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
