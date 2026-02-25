const express = require("express");
const cors = require("cors");
require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Brancher routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/dashboard"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));