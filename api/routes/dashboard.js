const router = require("express").Router();
const authMiddleware = require("../middleware/auth");

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.identifiant} sur le dashboard !` });
});

module.exports = router;