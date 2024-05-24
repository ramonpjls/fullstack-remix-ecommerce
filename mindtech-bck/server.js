const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const util = require('util');
const port = 3010; // You can change the port if needed

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const db = new sqlite3.Database('./products.db');

db.run = util.promisify(db.run);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS productos_favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto TEXT,
      producto_detalle TEXT
    );
  `);
});

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.post('/api/favorite/:productoId', async (req, res) => {
  const productoId = req.params.productoId;
  const producto = req.body;

  try {
    await db.run(
      'INSERT INTO productos_favoritos (producto, producto_detalle) VALUES (?, ?)',
      [productoId, JSON.stringify(producto)]
    );
    res.status(201).json({ message: 'Product added to favorites' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Product is already in favorites' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const favoritos = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM productos_favoritos',
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    const parsedFavoritos = favoritos?.map((fav) => {
      try {
        return {
          id: fav.producto,
          ...JSON.parse(fav.producto_detalle),
        };
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError, fav.producto);
        return null;
      }
    }).filter(Boolean); 
    res.json(parsedFavoritos);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/favorito/:productoId', async (req, res) => {
  const productoId = parseInt(req.params.productoId, 10);

  try {
    const products = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM productos_favoritos WHERE producto = ?',
        productoId,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    res.json({ isFavorite: products.length > 0 });
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/favorite/:productoId', async (req, res) => {
  const productoId = parseInt(req.params.productoId, 10);

  try {
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM productos_favoritos WHERE producto = ?',
        [productoId],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        }
      );
    });

    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Microservice listening at http://localhost:${port}`);
});
