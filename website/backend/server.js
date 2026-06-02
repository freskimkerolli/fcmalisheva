const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");
const apiRoutes = require("./routes/api");
const { connectDatabase } = require("./db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);
app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "frontend", "public", "assets")),
);

app.get("/", (req, res) => {
  res.json({ status: "FC Malisheva backend is running" });
});

const PORT = process.env.PORT || 4000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY is not defined in .env");
}

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
