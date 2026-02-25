const router = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { identifiant, password } = req.body;

  if (!identifiant || !password)
    return res.status(400).json({ message: "Identifiant et mot de passe requis" });

  const existingUser = await User.findOne({ identifiant });
  if (existingUser)
    return res.status(400).json({ message: "Utilisateur déjà existant" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ identifiant, password: hashedPassword }).save();

  res.status(201).json({ message: "Utilisateur créé !" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { identifiant, password } = req.body;

  const user = await User.findOne({ identifiant });
  if (!user) return res.status(401).json({ message: "Identifiants incorrects" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Identifiants incorrects" });

  const token = crypto.randomBytes(32).toString("hex");
  user.token = token;
  await user.save();

  res.json({ token, identifiant: user.identifiant });
});

module.exports = router;