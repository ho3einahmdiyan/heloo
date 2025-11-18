const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      purchasePrice REAL NOT NULL,
      sellingPrice REAL NOT NULL,
      stock INTEGER NOT NULL
    )`);
  }
});

// API Routes for Products

// GET all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ products: rows });
  });
});

// POST a new product
app.post('/api/products', (req, res) => {
  const { name, purchasePrice, sellingPrice, stock } = req.body;
  const sql = 'INSERT INTO products (name, purchasePrice, sellingPrice, stock) VALUES (?, ?, ?, ?)';
  const params = [name, purchasePrice, sellingPrice, stock];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// PUT (update) a product
app.put('/api/products/:id', (req, res) => {
  const { name, purchasePrice, sellingPrice, stock } = req.body;
  const sql = `UPDATE products SET
                name = ?,
                purchasePrice = ?,
                sellingPrice = ?,
                stock = ?
               WHERE id = ?`;
  const params = [name, purchasePrice, sellingPrice, stock, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.run(sql, req.params.id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
