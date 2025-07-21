// scripts/shopify.js

// 1) Install SDK via CDN or npm:
//    <script src="https://unpkg.com/shopify-buy@2.11.0/build/shopify-buy.umd.polyfilled.min.js"></script>
// OR  npm install shopify-buy

// 2) Initialize the client. Replace with your own store myshopify domain & Storefront Access Token:
const client = ShopifyBuy.buildClient({
  domain: 'YOUR‑STORE‑HANDLE.myshopify.com',
  storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN'
});

// 3) Exported helpers:

/**
 * Fetch all products (for your shop page)
 * @returns {Promise<Array>}
 */
export async function fetchAllProducts() {
  return client.product.fetchAll();
}

/**
 * Fetch one product by its Shopify product ID
 * @param {string} productId
 * @returns {Promise<Object>}
 */
export async function fetchProductById(productId) {
  return client.product.fetch(productId);
}

/**
 * Create a new empty Checkout (cart)
 * @returns {Promise<Object>} the checkout object (has id & webUrl)
 */
export async function createCheckout() {
  return client.checkout.create();
}

/**
 * Add one line item to an existing checkout
 * @param {string} checkoutId
 * @param {string} variantId
 * @param {number} quantity
 * @returns {Promise<Object>} updated checkout
 */
export async function addItemToCheckout(checkoutId, variantId, quantity = 1) {
  const lineItemsToAdd = [{ variantId, quantity }];
  return client.checkout.addLineItems(checkoutId, lineItemsToAdd);
}

/**
 * Redirect the browser to Shopify's hosted checkout page
 * @param {string} checkoutUrl
 */
export function redirectToCheckout(checkoutUrl) {
  window.location.href = checkoutUrl;
}
