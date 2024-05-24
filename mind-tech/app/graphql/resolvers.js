/* eslint-disable prettier/prettier */
import { getDb } from '../lib/db';

const resolvers = {
  Query: {
    isFavorite: async (_, { productId }) => {
      const db = await getDb();
      try {
        const product = await db.get(
          'SELECT * FROM productos_favoritos WHERE producto_id = ?',
          productId
        );
        return !!product; 
      } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        throw new Error('Error al verificar si el producto es favorito');
      }
    },
  },
  Mutation: {
    agregarProductoFavorito: async (_, { productoId }) => {
      const db = await getDb();
      try {
        const result = await db.run(
          'INSERT INTO productos_favoritos (producto_id) VALUES (?)',
          productoId
        );
        return { id: result.lastID, productoId };
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          throw new Error('El producto ya está en favoritos');
        } else {
          console.error('Error al agregar el producto a favoritos:', error);
          throw new Error('Error al agregar el producto a favoritos');
        }
      }
    },
  },
};
export default resolvers;
