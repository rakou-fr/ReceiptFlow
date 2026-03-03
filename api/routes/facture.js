const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const path     = require("path");
const Facture  = require("../models/Facture");

// ── Config Multer (stockage local) ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error("Image uniquement (jpg/png/webp)"));
  },
});

// ── GET /api/factures — tous les templates ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const factures = await Facture.find().sort({ createdAt: -1 });

    // Construire l'URL publique de l'image
    const base = `${req.protocol}://${req.get("host")}`;
    const data = factures.map((f) => ({
      ...f.toObject(),
      image: `${base}/${f.image}`,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ── GET /api/factures/:id — un template ─────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    if (!facture) return res.status(404).json({ message: "Template introuvable" });

    const base = `${req.protocol}://${req.get("host")}`;
    res.json({ ...facture.toObject(), image: `${base}/${facture.image}` });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ── POST /api/factures — créer un template ───────────────────────────────────
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, fields } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image requise" });

    const parsedFields = typeof fields === "string" ? JSON.parse(fields) : fields;

    const facture = await Facture.create({
      name,
      image:  `uploads/${req.file.filename}`,
      fields: parsedFields || [],
    });

    res.status(201).json(facture);
  } catch (err) {
    res.status(400).json({ message: "Erreur création", error: err.message });
  }
});

// ── PUT /api/factures/:id — mettre à jour ────────────────────────────────────
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, fields } = req.body;
    const parsedFields = typeof fields === "string" ? JSON.parse(fields) : fields;

    const update = { name, fields: parsedFields };
    if (req.file) update.image = `uploads/${req.file.filename}`;

    const facture = await Facture.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!facture) return res.status(404).json({ message: "Template introuvable" });

    res.json(facture);
  } catch (err) {
    res.status(400).json({ message: "Erreur mise à jour", error: err.message });
  }
});

// ── DELETE /api/factures/:id ─────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) return res.status(404).json({ message: "Template introuvable" });
    res.json({ message: "Supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;