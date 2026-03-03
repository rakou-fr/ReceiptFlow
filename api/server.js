const express = require("express");
const cors = require("cors");
const path = require("path");        
require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// Brancher routes
app.use("/api", require("./routes/stock"));
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/dashboard"));
app.use("/api", require("./routes/forecast"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));