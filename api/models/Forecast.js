const mongoose = require("mongoose");

// ─── Sous-schéma : un article dans un groupement ───────────────────────────
const itemSchema = new mongoose.Schema(
  {
    label:    { type: String, required: true, default: "Article" },
    buyPrice: { type: Number, required: true, default: 0 },
    qty:      { type: Number, required: true, default: 1 },
  },
  { _id: true }
);

// ─── Sous-schéma : un groupement ──────────────────────────────────────────
const groupSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, default: "Nouveau groupement" },
    items:        { type: [itemSchema], default: [] },
    sellPrice:    { type: Number, default: 0 },
    deliveryDays: { type: Number, default: 7 },
    saleDays:     { type: Number, default: 14 },
    paymentDays:  { type: Number, default: 3 },
    reinvest:     { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

// ─── Schéma principal : un document Forecast par utilisateur ──────────────
const forecastSchema = new mongoose.Schema(
  {
    // Lien vers l'utilisateur via son token (string stocké dans User.token)
    userToken: { type: String, required: true, unique: true, index: true },
    groups:    { type: [groupSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forecast", forecastSchema);