/**
 * routes/forecast.js
 *
 * Brancher dans server.js :
 *   app.use("/api", require("./routes/forecast"));
 *
 * Endpoints :
 *   GET    /api/forecast              → récupère tous les groupements
 *   POST   /api/forecast/groups       → crée un groupement
 *   PUT    /api/forecast/groups/:id   → met à jour un groupement
 *   DELETE /api/forecast/groups/:id   → supprime un groupement
 */

const express  = require("express");
const router   = express.Router();
const Forecast = require("../models/Forecast");
const User     = require("../models/User");

// ─── Middleware auth ──────────────────────────────────────────────────────────
// Aligné avec ton middleware existant : lit req.headers["authorization"] brut
// Le front envoie : Authorization: <token>  (sans "Bearer ")
async function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  const user = await User.findOne({ token });
  if (!user) return res.status(401).json({ message: "Token invalide" });

  req.user      = user;
  req.userToken = token;
  next();
}

// ─── Helper : trouve ou crée le doc Forecast de l'utilisateur ────────────────
async function getForecastDoc(userToken) {
  let doc = await Forecast.findOne({ userToken });
  if (!doc) doc = await Forecast.create({ userToken, groups: [] });
  return doc;
}

// ─── GET /api/forecast ────────────────────────────────────────────────────────
router.get("/forecast", auth, async (req, res) => {
  try {
    const doc = await getForecastDoc(req.userToken);
    res.json(doc.groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── POST /api/forecast/groups ───────────────────────────────────────────────
router.post("/forecast/groups", auth, async (req, res) => {
  try {
    const doc = await getForecastDoc(req.userToken);

    const {
      name         = "Nouveau groupement",
      items        = [{ label: "Article principal", buyPrice: 0, qty: 1 }],
      sellPrice    = 0,
      deliveryDays = 7,
      saleDays     = 14,
      paymentDays  = 3,
      reinvest     = true,
    } = req.body;

    doc.groups.push({ name, items, sellPrice, deliveryDays, saleDays, paymentDays, reinvest });
    await doc.save();

    res.status(201).json(doc.groups[doc.groups.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── PUT /api/forecast/groups/:id ────────────────────────────────────────────
router.put("/forecast/groups/:id", auth, async (req, res) => {
  try {
    const doc   = await getForecastDoc(req.userToken);
    const group = doc.groups.id(req.params.id);

    if (!group) return res.status(404).json({ error: "Groupement introuvable" });

    const { name, items, sellPrice, deliveryDays, saleDays, paymentDays, reinvest } = req.body;

    if (name         !== undefined) group.name         = name;
    if (items        !== undefined) group.items        = items;
    if (sellPrice    !== undefined) group.sellPrice    = sellPrice;
    if (deliveryDays !== undefined) group.deliveryDays = deliveryDays;
    if (saleDays     !== undefined) group.saleDays     = saleDays;
    if (paymentDays  !== undefined) group.paymentDays  = paymentDays;
    if (reinvest     !== undefined) group.reinvest     = reinvest;

    await doc.save();
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── DELETE /api/forecast/groups/:id ─────────────────────────────────────────
router.delete("/forecast/groups/:id", auth, async (req, res) => {
  try {
    const doc   = await getForecastDoc(req.userToken);
    const group = doc.groups.id(req.params.id);

    if (!group) return res.status(404).json({ error: "Groupement introuvable" });

    group.deleteOne();
    await doc.save();
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;