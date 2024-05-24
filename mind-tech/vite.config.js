/* eslint-disable prettier/prettier */
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import graphql from '@rollup/plugin-graphql';
import { buildSchema } from 'graphql'; 

import resolvers from './app/graphql/resolvers';


const schema = buildSchema(`
    type Query {
      isFavorite(productId: ID!): Boolean 
    }

    type Mutation {
      agregarProductoFavorito(productoId: ID!): ProductoFavorito
    }

    type ProductoFavorito {
      id: ID!
      productoId: ID!
    }
`);


export default defineConfig({
  plugins: [
    graphql(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },

    // Configuración de Hydrogen
    hydrogen: {
      server: {
        proxy: {
          '/api': 'http://localhost:3010', 
        },
      },
      graphql: {
        schema,
        resolvers,
      },
    },

});
