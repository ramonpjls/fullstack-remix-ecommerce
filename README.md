# MindTech Fullstack Ecommerce Project

This repository contains a fullstack ecommerce application built with Shopify Hydrogen and a custom backend API.

## Project Structure

The project is divided into two main parts:

1. **`mind-tech` (Frontend):** The Shopify Hydrogen storefront responsible for the user interface and interactions.
2. **`mindtech-bck` (Backend):** A custom backend API built with Node.js and SQLite, providing data and logic for the storefront.

## Features

- **Product Catalog:** Display products with details, images, and variations.
- **Shopping Cart:** Add products to cart, manage quantities, and proceed to checkout.
- **Customer Accounts:** User registration, login, profile management, and order history.
- **Favorites:** Users can save their favorite products for later viewing.
- **Search:** A predictive search feature to help users find products quickly.
- **Internationalization (i18n):** Support for multiple locales.
- **SEO:** Optimized for search engines with sitemap and robots.txt files.

## Getting Started

### Prerequisites

- **Node.js:** Make sure you have Node.js (version >= 18) installed on your machine.
- **Shopify Partner Account:** You'll need a Shopify partner account to create a development store.
- **Shopify CLI:** Install the Shopify CLI with `npm install -g @shopify/cli`.

### Installation and Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/tu-usuario/mindtech-fullstack-ecommerce.git
    cd mindtech-fullstack-ecommerce
    ```

2. **Install dependencies:**

    ```bash
    cd mind-tech
    npm install
    cd ../mindtech-bck
    npm install
    ```

3. **Set up environment variables:**
   Create `.env` files in both `mind-tech` and `mindtech-bck` folders and add your variables.

4. **Start the backend:**

    ```bash
    cd mindtech-bck
    node server.js
    ```

5. **Start the frontend:**

    ```bash
    cd mind-tech
    npm run dev
    ```

    This will start the frontend development server and the backend server. You can now access the storefront in your browser.

## Running Tests

Both the frontend and backend have unit tests set up:

- **Frontend (`mind-tech`):**
    ```bash
    npm run test
    ```

- **Backend (`mindtech-bck`):**
    ```bash
    npm test
    ```

## Technology Stack

- **Frontend:**
  - Shopify Hydrogen
  - React
  - Remix
  - GraphQL
- **Backend:**
  - Node.js
  - Express.js
  - SQLite
  - GraphQL (Apollo Server)

## Additional Notes

- **Customization:** Feel free to modify and extend this project to fit your specific needs.
- **Data:** For testing purposes, there's a sample database file (`products.db`) in the backend folder. You can replace it with your own product data.
- **Deployment:** To deploy this application to a production environment, you can use the Shopify CLI or deploy the backend separately and update the frontend to point to the production API endpoint.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
