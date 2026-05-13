require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");
const { createClient } = require("redis");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 4000;

// ── Prometheus metrics ─────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: "api_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "api_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"],
  registers: [register],
});

// ── Middleware ─────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100,
  message: { error: "Terlalu banyak request, coba lagi nanti." },
});
app.use("/api/", limiter);

// Prometheus middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on("finish", () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
  });
  next();
});

// ── PostgreSQL ─────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "portomoran",
  user: process.env.DB_USER || "moran",
  password: process.env.DB_PASSWORD,
});

// ── Redis ──────────────────────────────────────────
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:6379`,
});

redisClient.connect().catch(console.error);

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("✅ Redis connected"));

// ── Routes ─────────────────────────────────────────

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ── API: Contact form ──────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  try {
    // Cek cache Redis dulu
    const cacheKey = `contact:${email}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(429).json({ error: "Tunggu 1 menit sebelum kirim pesan lagi." });
    }

    // Simpan ke PostgreSQL
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    // Set cache Redis 1 menit
    await redisClient.setEx(cacheKey, 60, "sent");

    res.json({ success: true, message: "Pesan berhasil dikirim!" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Terjadi kesalahan, coba lagi nanti." });
  }
});

// ── API: Get projects ──────────────────────────────
app.get("/api/projects", async (req, res) => {
  try {
    // Cek cache Redis
    const cached = await redisClient.get("projects");
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    // Ambil dari PostgreSQL
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );

    // Simpan ke cache 5 menit
    await redisClient.setEx("projects", 300, JSON.stringify(result.rows));

    res.json({ source: "db", data: result.rows });
  } catch (err) {
    console.error("Projects error:", err);
    res.status(500).json({ error: "Gagal mengambil data projects." });
  }
});

// ── API: Get stats ─────────────────────────────────
app.get("/api/stats", async (req, res) => {
  try {
    const cached = await redisClient.get("stats");
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    const contacts = await pool.query("SELECT COUNT(*) FROM contacts");
    const projects = await pool.query("SELECT COUNT(*) FROM projects");

    const stats = {
      total_contacts: parseInt(contacts.rows[0].count),
      total_projects: parseInt(projects.rows[0].count),
    };

    await redisClient.setEx("stats", 60, JSON.stringify(stats));

    res.json({ source: "db", data: stats });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Gagal mengambil stats." });
  }
});

// ── Start server ───────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API berjalan di port ${PORT}`);
});

module.exports = app;
