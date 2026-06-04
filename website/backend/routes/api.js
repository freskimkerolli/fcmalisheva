const express = require("express");
const store = require("../data/store");

const router = express.Router();

router.get("/team", async (req, res) => {
  try {
    res.json(await store.getPlayers());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/staff", async (req, res) => {
  try {
    res.json(await store.getStaff());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/gallery", async (req, res) => {
  try {
    res.json(await store.getGallery());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/results", async (req, res) => {
  try {
    res.json(await store.getResults());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/announcements", async (req, res) => {
  try { res.json(await store.getAnnouncements()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/upcoming-match", async (req, res) => {
  try { res.json(await store.getUpcomingMatch()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/sponsors", async (req, res) => {
  try { res.json(await store.getSponsors()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/checkout", (req, res) => {
  res.status(501).json({
    error: "Stripe checkout is postponed. Please use Cash ordering for now.",
  });
});

module.exports = router;
