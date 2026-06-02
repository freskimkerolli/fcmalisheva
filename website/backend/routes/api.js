const express = require("express");
const {
  players,
  staff,
  gallery,
  results,
  table,
} = require("../data/sampleData");

const router = express.Router();

router.get("/team", (req, res) => {
  res.json(players);
});

router.get("/staff", (req, res) => {
  res.json(staff);
});

router.get("/gallery", (req, res) => {
  res.json(gallery);
});

router.get("/results", (req, res) => {
  res.json({ matches: results, table });
});

router.post("/checkout", (req, res) => {
  res
    .status(501)
    .json({
      error: "Stripe checkout is postponed. Please use Cash ordering for now.",
    });
});

module.exports = router;
