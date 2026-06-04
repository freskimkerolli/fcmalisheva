const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const store = require("../data/store");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "fcmalisheva-admin-secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

const uploadDir = path.join(__dirname, "..", "..", "frontend", "public", "assets");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `upload_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Vetëm imazhet lejohen"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Nuk jeni të autorizuar" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token i pavlefshëm" });
  }
}

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Kredencialet janë të gabuara" });
  }
});

// ── Lojtarët ──────────────────────────────────────────────────────────────────
router.get("/players", auth, async (req, res) => {
  try { res.json(await store.getPlayers()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/players", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? `/assets/${req.file.filename}` : req.body.photo || "";
    res.status(201).json(await store.createPlayer({ ...req.body, photo }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/players/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? `/assets/${req.file.filename}` : req.body.photo;
    const player = await store.updatePlayer(req.params.id, { ...req.body, photo });
    if (!player) return res.status(404).json({ error: "Lojtari nuk u gjet" });
    res.json(player);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/players/:id", auth, async (req, res) => {
  try {
    const ok = await store.deletePlayer(req.params.id);
    if (!ok) return res.status(404).json({ error: "Lojtari nuk u gjet" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Stafi ─────────────────────────────────────────────────────────────────────
router.get("/staff", auth, async (req, res) => {
  try { res.json(await store.getStaff()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/staff", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? `/assets/${req.file.filename}` : req.body.photo || "";
    res.status(201).json(await store.createStaffMember({ ...req.body, photo }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/staff/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? `/assets/${req.file.filename}` : req.body.photo;
    const member = await store.updateStaffMember(req.params.id, { ...req.body, photo });
    if (!member) return res.status(404).json({ error: "Anëtari nuk u gjet" });
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/staff/:id", auth, async (req, res) => {
  try {
    const ok = await store.deleteStaffMember(req.params.id);
    if (!ok) return res.status(404).json({ error: "Anëtari nuk u gjet" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Galeria ───────────────────────────────────────────────────────────────────
router.post("/gallery", auth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nuk u ngarkua foto" });
    const url = await store.addGalleryPhoto(`/assets/${req.file.filename}`);
    res.status(201).json({ url });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/gallery", auth, async (req, res) => {
  try {
    const ok = await store.removeGalleryPhoto(req.body.url);
    if (!ok) return res.status(404).json({ error: "Foto nuk u gjet" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Rezultatet ────────────────────────────────────────────────────────────────
router.get("/results", auth, async (req, res) => {
  try { res.json(await store.getResults()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/results", auth, async (req, res) => {
  try {
    res.status(201).json(await store.createResult(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/results/:id", auth, async (req, res) => {
  try {
    const ok = await store.deleteResult(req.params.id);
    if (!ok) return res.status(404).json({ error: "Ndeshja nuk u gjet" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/table", auth, async (req, res) => {
  try {
    res.json(await store.updateTable(req.body.tableData));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
