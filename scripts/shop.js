// wait for DOM
document.addEventListener('DOMContentLoaded', async () => {
  let products = [];
  const listEl = document.getElementById('product-list');
  const searchInput = document.getElementById('search-input');
  const searchBtn   = document.getElementById('search-btn');

  // 1) load products.json
  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    // data is an object keyed by id, convert to array:
    products = Object.entries(data).map(([id, info]) => ({ id, ...info }));
  } catch (err) {
    console.error(err);
    listEl.innerHTML = `
      <p class="col-span-full text-center text-red-600">
        Failed to load products.
      </p>`;
    return;
  }

  // 2) render a given array of products
  function render(arr) {
    if (!arr.length) {
      listEl.innerHTML = `
        <p class="col-span-full text-center text-gray-600">
          No products found.
        </p>`;
      return;
    }
    listEl.innerHTML = arr.map(p => `
      <div class="bg-white rounded shadow p-4 text-center">
        <a href="product.html?id=${encodeURIComponent(p.id)}">
          <img src="${p.image}" alt="${p.name}"
               class="w-40 h-40 mx-auto object-cover mb-2"/>
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <p class="text-pink-600 font-bold mb-2">
            $${p.price.toFixed(2)}
          </p>
        </a>
        <button
          onclick='addToCart({
            id: "${p.id}",
            name: ${JSON.stringify(p.name)},
            image: "${p.image}",
            price: ${p.price}
          })'
          class="bg-blue-200 text-blue-900 px-4 py-2 rounded hover:bg-blue-300 transition"
        >
          Add to Cart
        </button>
      </div>
    `).join('');
  }

  // 3) first render all
  render(products);

  // 4) search/filter logic
  function doSearch() {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return render(products);
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
    render(filtered);
  }

  searchBtn.addEventListener('click',  doSearch);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
});

// 5) global helper for cart
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${item.name} added to cart!`);
}
import {
  fetchAllProducts,
  createCheckout,
  addItemToCheckout,
  redirectToCheckout
} from './shopify.js';

let checkout = null;

// 1) On load, create or re‑use a checkout
window.addEventListener('DOMContentLoaded', async () => {
  // Try stored checkout
  const stored = localStorage.getItem('shopify_checkout');
  if (stored) {
    checkout = await client.checkout.fetch(stored);
  }
  if (!checkout || checkout.completedAt) {
    checkout = await createCheckout();
    localStorage.setItem('shopify_checkout', checkout.id);
  }

  // 2) Fetch & render products
  const products = await fetchAllProducts();
  const grid = document.getElementById('product-list');
  grid.innerHTML = products.map(p => {
    const v = p.variants[0];
    return `
      <div class="product-card">
        <img src="${p.images[0].src}" />
        <h4>${p.title}</h4>
        <p>$${v.price}</p>
        <button data-vid="${v.id}">Add to Cart</button>
      </div>`;
  }).join('');

  // 3) Handle Add to Cart clicks:
  grid.addEventListener('click', async e => {
    const btn = e.target.closest('button[data-vid]');
    if (!btn) return;
    const variantId = btn.dataset.vid;
    checkout = await addItemToCheckout(checkout.id, variantId, 1);
    alert('Added to cart! Cart has ' + checkout.lineItems.length + ' items.');
  });
});
