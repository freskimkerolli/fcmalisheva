const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const { connectDatabase } = require("./backend/db");
const store = require("./backend/data/store");

const app = express();
const PORT = process.env.PORT || process.env.ADMIN_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "fcmalisheva-admin-secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

const CLOUDINARY_ENABLED = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "admin-public")));
app.use("/assets", express.static(path.join(__dirname, "frontend", "public", "assets")));
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

const uploadDir = path.join(__dirname, "frontend", "public", "assets");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Vetëm imazhet lejohen"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

async function uploadPhoto(file) {
  if (CLOUDINARY_ENABLED) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "fcmalisheva" },
        (err, result) => { if (err) reject(err); else resolve(result.secure_url); }
      );
      stream.end(file.buffer);
    });
  }
  // Fallback: ruaj në disk lokalisht
  const ext = path.extname(file.originalname);
  const filename = `upload_${Date.now()}${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
  return `/assets/${filename}`;
}

// Auth middleware
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

// ── Routes Publike (pa autentikim, për frontend Vercel) ───────────────────────
app.get("/api/team",           async (req, res) => { try { res.json(await store.getPlayers()); }        catch (e) { res.status(500).json({ error: e.message }); } });
app.get("/api/staff",          async (req, res) => { try { res.json(await store.getStaff()); }          catch (e) { res.status(500).json({ error: e.message }); } });
app.get("/api/gallery",        async (req, res) => { try { res.json(await store.getGallery()); }        catch (e) { res.status(500).json({ error: e.message }); } });
app.get("/api/results",        async (req, res) => { try { res.json(await store.getResults()); }        catch (e) { res.status(500).json({ error: e.message }); } });
app.get("/api/announcements",  async (req, res) => { try { res.json(await store.getAnnouncements()); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get("/api/upcoming-match", async (req, res) => { try { res.json(await store.getUpcomingMatch()); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get("/api/sponsors",       async (req, res) => { try { res.json(await store.getSponsors()); }       catch (e) { res.status(500).json({ error: e.message }); } });

// ── Login ──────────────────────────────────────────────────────────────────────
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Kredencialet janë të gabuara" });
  }
});

// ── Lojtarët ───────────────────────────────────────────────────────────────────
app.get("/api/players", auth, async (req, res) => {
  try { res.json(await store.getPlayers()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/players", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? await uploadPhoto(req.file) : req.body.photo || "";
    res.status(201).json(await store.createPlayer({ ...req.body, photo }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/players/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? await uploadPhoto(req.file) : req.body.photo;
    const player = await store.updatePlayer(req.params.id, { ...req.body, photo });
    if (!player) return res.status(404).json({ error: "Lojtari nuk u gjet" });
    res.json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/players/:id", auth, async (req, res) => {
  try {
    const ok = await store.deletePlayer(req.params.id);
    if (!ok) return res.status(404).json({ error: "Lojtari nuk u gjet" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Stafi ──────────────────────────────────────────────────────────────────────
app.get("/api/staff", auth, async (req, res) => {
  try { res.json(await store.getStaff()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/staff", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? await uploadPhoto(req.file) : req.body.photo || "";
    res.status(201).json(await store.createStaffMember({ ...req.body, photo }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/staff/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? await uploadPhoto(req.file) : req.body.photo;
    const member = await store.updateStaffMember(req.params.id, { ...req.body, photo });
    if (!member) return res.status(404).json({ error: "Anëtari nuk u gjet" });
    res.json(member);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/staff/:id", auth, async (req, res) => {
  try {
    const ok = await store.deleteStaffMember(req.params.id);
    if (!ok) return res.status(404).json({ error: "Anëtari nuk u gjet" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Galeria ────────────────────────────────────────────────────────────────────
app.get("/api/gallery", auth, async (req, res) => {
  try { res.json(await store.getGallery()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/gallery", auth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nuk u ngarkua foto" });
    const url = await store.addGalleryPhoto(await uploadPhoto(req.file));
    res.status(201).json({ url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/gallery", auth, async (req, res) => {
  try {
    const ok = await store.removeGalleryPhoto(req.body.url);
    if (!ok) return res.status(404).json({ error: "Foto nuk u gjet" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Rezultatet ─────────────────────────────────────────────────────────────────
app.get("/api/results", auth, async (req, res) => {
  try { res.json(await store.getResults()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/results", auth, async (req, res) => {
  try {
    res.status(201).json(await store.createResult(req.body));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/results/:id", auth, async (req, res) => {
  try {
    const r = await store.updateResult(req.params.id, req.body);
    if (!r) return res.status(404).json({ error: "Ndeshja nuk u gjet" });
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/results/:id", auth, async (req, res) => {
  try {
    const ok = await store.deleteResult(req.params.id);
    if (!ok) return res.status(404).json({ error: "Ndeshja nuk u gjet" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/table", auth, async (req, res) => {
  try {
    res.json(await store.updateTable(req.body.tableData));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Njoftime ──────────────────────────────────────────────────────────────────
app.get("/api/announcements", auth, async (req, res) => {
  try { res.json(await store.getAnnouncements()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/announcements", auth, async (req, res) => {
  try { res.status(201).json(await store.createAnnouncement(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/announcements/:id", auth, async (req, res) => {
  try {
    const a = await store.updateAnnouncement(req.params.id, req.body);
    if (!a) return res.status(404).json({ error: "Njoftimi nuk u gjet" });
    res.json(a);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/announcements/:id", auth, async (req, res) => {
  try {
    const ok = await store.deleteAnnouncement(req.params.id);
    if (!ok) return res.status(404).json({ error: "Njoftimi nuk u gjet" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Ndeshja e Ardhshme ────────────────────────────────────────────────────────
app.get("/api/upcoming-match", auth, async (req, res) => {
  try { res.json(await store.getUpcomingMatch()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/upcoming-match", auth, upload.fields([{ name: "home_logo_file" }, { name: "away_logo_file" }]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.home_logo_file?.[0]) data.home_logo = await uploadPhoto(req.files.home_logo_file[0]);
    if (req.files?.away_logo_file?.[0]) data.away_logo = await uploadPhoto(req.files.away_logo_file[0]);
    res.json(await store.updateUpcomingMatch(data));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Sponzorët ─────────────────────────────────────────────────────────────────
app.get("/api/sponsors", auth, async (req, res) => {
  try { res.json(await store.getSponsors()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/sponsors", auth, upload.single("logo_file"), async (req, res) => {
  try {
    const logo_path = req.file ? await uploadPhoto(req.file) : req.body.logo_path || "";
    res.status(201).json(await store.createSponsor({ ...req.body, logo_path }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/sponsors/:id", auth, upload.single("logo_file"), async (req, res) => {
  try {
    const logo_path = req.file ? await uploadPhoto(req.file) : req.body.logo_path;
    const s = await store.updateSponsor(req.params.id, { ...req.body, logo_path });
    if (!s) return res.status(404).json({ error: "Sponzori nuk u gjet" });
    res.json(s);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/sponsors/:id", auth, async (req, res) => {
  try {
    const ok = await store.deleteSponsor(req.params.id);
    if (!ok) return res.status(404).json({ error: "Sponzori nuk u gjet" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Serve admin HTML for all other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-public", "index.html"));
});

connectDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`Admin panel: http://localhost:${PORT}`);
  });
});
