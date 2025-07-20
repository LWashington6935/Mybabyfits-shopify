// scripts/cart.js

document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY    = 'cart';
  const itemsEl     = document.getElementById('cart-items');
  const totalEl     = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // helper to save + reload display
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  // compute and return total
  function computeTotal() {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty   = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);
  }

  // remove item at index
  function removeItem(idx) {
    cart.splice(idx, 1);
    saveCart();
  }

  // change quantity
  function changeQty(idx, delta) {
    cart[idx].quantity = Math.max(1, (cart[idx].quantity || 1) + delta);
    saveCart();
  }

  // render the entire cart UI
  function renderCart() {
    itemsEl.innerHTML = '';
    const total = computeTotal();

    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <p class="text-gray-600 text-center">Your cart is empty.</p>
      `;
      totalEl.textContent = '$0.00';
      checkoutBtn.classList.add('opacity-50', 'pointer-events-none');
      return;
    }

    checkoutBtn.classList.remove('opacity-50', 'pointer-events-none');

    cart.forEach((item, idx) => {
      const price = Number(item.price) || 0;
      const qty   = Number(item.quantity || 1);
      const line  = price * qty;

      // build row
      const row = document.createElement('div');
      row.className = 'flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded shadow';

      row.innerHTML = `
        <div class="flex items-center w-full md:w-1/2">
          <img src="${item.image}"
               alt="${item.name}"
               class="w-20 h-20 object-cover rounded mr-4"/>
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-gray-600">$${price.toFixed(2)}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2 mt-4 md:mt-0">
          <button class="qty-btn bg-gray-200 hover:bg-gray-300" data-action="decr" data-idx="${idx}">–</button>
          <input class="qty-input" type="number" min="1" value="${qty}" data-idx="${idx}" />
          <button class="qty-btn bg-gray-200 hover:bg-gray-300" data-action="incr" data-idx="${idx}">+</button>
        </div>
        <div class="flex items-center space-x-6 mt-4 md:mt-0">
          <p class="font-semibold">$${line.toFixed(2)}</p>
          <button class="text-red-600 hover:underline" data-action="remove" data-idx="${idx}">
            Remove
          </button>
        </div>
      `;
      itemsEl.appendChild(row);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;

    // wire up all buttons & inputs
    itemsEl.querySelectorAll('[data-action]').forEach(btn => {
      const idx    = parseInt(btn.dataset.idx);
      const action = btn.dataset.action;

      btn.addEventListener('click', () => {
        if (action === 'remove')   removeItem(idx);
        if (action === 'incr')     changeQty(idx, +1);
        if (action === 'decr')     changeQty(idx, -1);
      });
    });

    itemsEl.querySelectorAll('.qty-input').forEach(input => {
      const idx = parseInt(input.dataset.idx);
      input.addEventListener('change', () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;
        cart[idx].quantity = val;
        saveCart();
      });
    });
  }

  // initial render
  renderCart();
});
document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const container = document.getElementById('cart-items');
  const checkoutBtn = document.getElementById('checkout-btn');
  let total = 0;

  if (!cart.length) {
    container.innerHTML = '<p class="text-center text-gray-600">Your cart is empty.</p>';
    checkoutBtn.classList.add('opacity-50');
    checkoutBtn.setAttribute('aria-disabled', 'true');
    return;
  }

  // Render each item
  cart.forEach((item, idx) => {
    const qty = item.quantity || 1;
    const line = item.price * qty;
    total += line;

    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-white p-4 rounded shadow';
    div.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded"/>
        <div>
          <h4 class="font-semibold">${item.name}</h4>
          <p class="text-sm text-gray-600">$${item.price.toFixed(2)}</p>
          <div class="flex items-center mt-2 space-x-2">
            <button data-action="decrease" data-index="${idx}"
                    class="px-2 bg-gray-200 rounded hover:bg-gray-300">–</button>
            <span id="qty-${idx}">${qty}</span>
            <button data-action="increase" data-index="${idx}"
                    class="px-2 bg-gray-200 rounded hover:bg-gray-300">+</button>
          </div>
        </div>
      </div>
      <button data-action="remove" data-index="${idx}"
              class="text-red-600 hover:underline">Remove</button>
    `;
    container.append(div);
  });

  // Show total
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

  // Delegate all cart adjustments
  container.addEventListener('click', e => {
    const idx = +e.target.dataset.index;
    if (e.target.dataset.action === 'remove') {
      cart.splice(idx, 1);
    } else if (e.target.dataset.action === 'increase') {
      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
    } else if (e.target.dataset.action === 'decrease') {
      const newQty = (cart[idx].quantity || 1) - 1;
      if (newQty < 1) return;
      cart[idx].quantity = newQty;
    } else {
      return; // not one of our buttons
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload();
  });
});
