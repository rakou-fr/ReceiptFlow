const express = require("express");
const router = express.Router();
const StockItem = require("../models/StockItem");
const auth = require("../middleware/auth");

// GET - Tous les articles du user
router.get("/stock", auth, async (req, res) => {
  try {
    const items = await StockItem.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Créer un article
router.post("/stock", auth, async (req, res) => {
  try {
    const item = new StockItem({
      user: req.user,
      name: req.body.name || "Nouvel Article",
      group: req.body.group || "Divers",
      quantity: req.body.quantity ?? 0,
      reserved: req.body.reserved ?? 0,
      ordered: req.body.ordered ?? 0,
      buyPrice: req.body.buyPrice ?? 0,
      sellPrice: req.body.sellPrice ?? 0,
      status: req.body.status || "available",
      image: req.body.image || "",
    });
    await item.save();
    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Modifier un article
// Si le status passe à "sold" → on enregistre soldAt = maintenant
// Si le status repasse à autre chose → on efface soldAt
router.put("/stock/:id", auth, async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.status === "sold") {
      updateData.soldAt = new Date();
    } else if (req.body.status && req.body.status !== "sold") {
      updateData.soldAt = null;
    }

    const item = await StockItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updateData,
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Supprimer un article
router.delete("/stock/:id", auth, async (req, res) => {
  try {
    await StockItem.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;