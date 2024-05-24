/* eslint-disable prettier/prettier */
import { render, screen, waitFor } from '@testing-library/react';
import { createRemixStub, json } from '@remix-run/testing';
import Favorites from '../routes/($locale).favorites';

// Datos de prueba para el loader
const mockFavoriteProducts = [
    {
        product: {
            id: '1',
            title: 'Producto de prueba',
            selectedVariant: {
                image: { url: 'imagen.jpg', altText: 'alt text' },
                price: { amount: '10.00', currencyCode: 'USD' },
            },
            description: 'Descripción del producto',
        },
    },
];

describe('Favorites', () => {
    it('renders favorite products', async () => {
        // Creamos un RemixStub con una ruta que renderiza el componente Favorites
        const RemixStub = createRemixStub([
            {
                path: '/',
                Component: Favorites,
                loader: () => json(mockFavoriteProducts), // Simulamos el loader devolviendo los datos de prueba
            },
        ]);

        render(<RemixStub />); // Renderizamos el RemixStub en lugar del componente directamente

        // Esperamos a que los datos se carguen y se rendericen los elementos
        await waitFor(() => {
            expect(screen.getByText('Favorites Items')).toBeInTheDocument();
            expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
            expect(screen.getByText('Descripción del producto')).toBeInTheDocument();
            expect(screen.getByText('10.00 USD')).toBeInTheDocument();
            expect(screen.getByAltText('alt text')).toBeInTheDocument();
        });
    });

    it('handles errors from the loader', async () => {
        const RemixStub = createRemixStub([
            {
                path: '/',
                Component: Favorites,
                loader: () => { throw new Response('Error de prueba', { status: 500 }); }, // Simulamos un error en el loader
            },
        ]);

        render(<RemixStub />);

        await waitFor(() => {
            expect(screen.getByText('Error al cargar los productos favoritos')).toBeInTheDocument();
        });
    });

    it('displays a message when there are no favorite products', async () => {
        const RemixStub = createRemixStub([
            {
                path: '/',
                Component: Favorites,
                loader: () => json([]), // Simulamos el loader devolviendo una lista vacía
            },
        ]);

        render(<RemixStub />);

        await waitFor(() => {
            expect(screen.getByText(/No hay productos favoritos/i)).toBeInTheDocument();
        });
    });
});
