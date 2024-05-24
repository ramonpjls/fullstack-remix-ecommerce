/* eslint-disable prettier/prettier */
import { json } from '@shopify/remix-oxygen';
import { Image } from '@shopify/hydrogen';
import axios from 'axios';
import { useLoaderData } from '@remix-run/react'



export async function loader() {
  try {
    const response = await axios.get('http://localhost:3010/api/favorites');
    const favoriteProducts = response?.data
    return favoriteProducts
  } catch (error) {
    console.error('Error in loader:', error);
    throw json(
      { error: 'Error loading favorite products' },
      { status: 500 }
    );
  }
};


export default function Favorites() {
  const favoriteProducts = useLoaderData();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Favorites Items</h1>
      <ul style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        listStyle: 'none',
        padding: 0
      }}>
        {favoriteProducts.map((item) => {
          const product = item.product;

          return (
            <div key={product.id}>
              <li style={{
                marginBottom: '20px',
                border: '1px solid #ddd',
                padding: '15px',
                gap: '10px',
                borderRadius: '5px',
                width: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <h2>{product.title}</h2>
                {product.selectedVariant?.image && ( // Verificar si image existe
                  <Image
                    src={product.selectedVariant.image.url}
                    alt={product.selectedVariant.image.altText || product.title}
                    width="311"
                    height="311"
                  />
                )}
                <p>{product?.description} </p>
                <h4>
                  {product.selectedVariant?.price?.amount}{' '}
                  {product.selectedVariant?.price?.currencyCode}
                </h4>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
