const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - allow all origins (or restrict in production)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '10mb' }));


// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRODUCTS ──

app.get("/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products ORDER BY name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, description, price, original_price, image, category, featured } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, original_price, image, category, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, original_price, image, category, featured || false]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE products SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CATEGORIES ──

app.get("/categories", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/categories", async (req, res) => {
  try {
    const { name, icon } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO categories (name, icon) VALUES ($1, $2) RETURNING *",
      [name, icon]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE categories SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BANNERS ──

app.get("/banners", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM banners ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/banners", async (req, res) => {
  try {
    const { title, subtitle, image, cta_text, cta_link } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO banners (title, subtitle, image, cta_text, cta_link)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, subtitle, image, cta_text, cta_link]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/banners/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE banners SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/banners/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM banners WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SETTINGS ──

app.get("/settings", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM settings");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
       RETURNING *`,
      [key, value]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`JR Perfumaria API running on port ${PORT}`);
});
