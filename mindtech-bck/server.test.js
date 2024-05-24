const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const util = require('util');
const app = express();
const port = 3010;

app.use(express.json());

const db = new sqlite3.Database(':memory:');

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
    res.status(500).json({ error: 'Internal Server Error' });
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

    const parsedFavoritos = favoritos.map((fav) => ({
      id: fav.producto,
      ...JSON.parse(fav.producto_detalle),
    }));

    res.json(parsedFavoritos);
  } catch (error) {
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


describe('Microservice API', () => {
  beforeAll((done) => {
    app.listen(port, () => {
      console.log(`Test server running on port ${port}`);
      done();
    });
  });

  afterAll((done) => {
    db.close(() => {
      console.log('Database connection closed');
      done();
    });
  });

  it('POST /api/favorite/:productoId - should add a product to favorites', async () => {
    const producto = { name: 'Test Product', detail: 'Test Detail' };
    const response = await request(app)
      .post('/api/favorite/1')
      .send(producto)
      .expect(201);

    expect(response.body).toEqual({ message: 'Product added to favorites' });
  });

  it('GET /api/favorites - should return all favorite products', async () => {
    const response = await request(app)
      .get('/api/favorites')
      .expect(200);

    expect(response.body).toEqual([
      { id: '1', name: 'Test Product', detail: 'Test Detail' },
    ]);
  });


});