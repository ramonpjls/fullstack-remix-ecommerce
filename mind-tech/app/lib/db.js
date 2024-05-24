/* eslint-disable prettier/prettier */
import sqlite3 from 'sqlite3';

const dbPath =  './../db/mydb.db';

export async function getDb() {
  const db = await sqlite3.open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Opcional: Crear tablas si no existen
  await db.exec(`
    CREATE TABLE IF NOT EXISTS productos_favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id TEXT UNIQUE
    );
  `);
  return db;
}

async function openDb() {
  return open({
    filename: '/path/to/database.db',
    driver: sqlite3.Database
  });
}

export async function getFavoriteProducts() {
  const db = await openDb();
  return db.all('SELECT id FROM favorite_products');
}