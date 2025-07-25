(function() {
  // 1) Build your client
  const client = ShopifyBuy.buildClient({
    domain: 'mybabyfitsoriginal.myshopify.com',          // ← replace me
    storefrontAccessToken: 'befadbd49a6aed0ef16c3b91744cc025'      // ← replace me
  });

  // 2) Fetch all products
  client.product.fetchAll().then(products => {
    const container = document.getElementById('product-list');
    // Remove the loading text
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.remove();

    // 3) For each product, build a card
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl shadow-lg p-4 flex flex-col';

      // Image
      const img = document.createElement('img');
      img.src = product.images[0]?.src || '';
      img.alt = product.title;
      img.className = 'w-full h-48 object-cover rounded-lg mb-4';
      card.appendChild(img);

      // Title
      const title = document.createElement('h3');
      title.textContent = product.title;
      title.className = 'font-semibold text-lg mb-2';
      card.appendChild(title);

      // Price (first variant)
      const price = document.createElement('p');
      price.textContent = `$${product.variants[0].price}`;
      price.className = 'text-gray-700 mb-4';
      card.appendChild(price);

      // Add to Cart button
      const btn = document.createElement('button');
      btn.textContent = 'Add to Cart';
      btn.className = 'mt-auto py-2 rounded-xl border border-pink-300 hover:bg-pink-100';
      btn.addEventListener('click', () => {
        client.checkout.create().then(checkout => {
          const lineItemsToAdd = [{ variantId: product.variants[0].id, quantity: 1 }];
          return client.checkout.addLineItems(checkout.id, lineItemsToAdd);
        }).then(updatedCheckout => {
          // Redirect to Shopify’s checkout
          window.location.href = updatedCheckout.webUrl;
        });
      });
      card.appendChild(btn);

      // Insert card
      container.appendChild(card);
    });
  }).catch(err => {
    console.error(err);
    const container = document.getElementById('product-list');
    container.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load products.</p>';
  });
})();
