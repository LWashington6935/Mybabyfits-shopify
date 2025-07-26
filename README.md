ChatGPT said:
markdown
Copy
Edit
# MyBabyFits Shopify Storefront

[![Live Demo](https://img.shields.io/badge/demo-live-purple)](https://mybabyfits-shopify.vercel.app)  
[![License](https://img.shields.io/badge/license-MIT-blue)](/LICENSE)

A fully‑custom, headless Shopify storefront for **MyBabyFits**—a baby & kids apparel shop.  
Built with Tailwind CSS, vanilla JavaScript & the Shopify Buy SDK to fetch products, manage carts, and drive checkout.

---

## 🚀 Features

- **Browse & Search** all products synced from your Shopify Admin  
- **Filter & Sort** by price, category, and tags  
- **Product Detail Pages** with image carousel, description, and variant selectors  
- **“You May Also Like”** recommendations based on shared tags  
- **Cart** powered by Shopify’s Storefront API—add, update, remove items  
- **Responsive**, mobile‑first design with Tailwind CSS  
- **Easy to deploy** to GitHub Pages, Vercel, or any static host

---

## 🛠 Tech Stack

- **UI**: HTML5, Tailwind CSS, Poppins font  
- **JS**: Vanilla ES modules, Shopify Buy SDK (Storefront API)  
- **Hosting**: Vercel (recommended) or GitHub Pages  
- **Package Manager**: npm (for build & deploy scripts)

---

## 🏁 Quick Start

1. **Clone this repo**  
   ```bash
   git clone https://github.com/LWashington6935/Mybabyfits.git
   cd Mybabyfits
Install dependencies

bash
Copy
Edit
npm install
Configure environment
Copy env.example.js → env.js (or edit credentials directly in your scripts):

js
Copy
Edit
// env.js
export const SHOPIFY_DOMAIN           = 'your‐shopify‐store.myshopify.com';
export const SHOPIFY_STOREFRONT_TOKEN = 'your_storefront_access_token';
Create a Storefront API token in Shopify Admin → Apps → Develop apps → Create token → enable “Storefront API” scopes.

Use your actual .myshopify.com domain.

Run a local server

bash
Copy
Edit
npx live-server .
Then visit http://127.0.0.1:8080/shop.html (or whichever page).

🔗 Shopify Buy SDK Integration
This storefront uses the Shopify Buy SDK (Storefront API) to:

Fetch products

js
Copy
Edit
client.product.fetchAll().then(renderShop);
client.product.fetchByHandle('future‐actor').then(renderProduct);
Create & persist a checkout

js
Copy
Edit
let checkout = await client.checkout.create();
localStorage.setItem('checkout_id', checkout.id);
Add / update / remove line items

js
Copy
Edit
await client.checkout.addLineItems(checkoutId, [{ variantId, quantity }]);
await client.checkout.updateLineItems(checkoutId, [{ id: lineItemId, quantity }]);
await client.checkout.removeLineItems(checkoutId, [lineItemId]);
Redirect to hosted checkout

js
Copy
Edit
window.location.href = checkout.webUrl;
All read‑only storefront calls are safe in the browser; private admin keys are never exposed.

📁 Project Structure
bash
Copy
Edit
Mybabyfits/
├── index.html           # Home page
├── shop.html            # Shop listing & filters
├── product.html         # Product detail & “you may also like”
├── cart.html            # Cart interface & checkout redirect
├── images/              # Logos, icons & static assets
├── scripts/
│   └── shopify.js       # Shared Shopify client & helpers
├── env.example.js       # Example env file (copy to env.js)
├── README.md            # This document
└── package.json         # Build & deploy scripts
📦 Deployment
Vercel (recommended)
Sign up / log in at vercel.com

In your project folder:

bash
Copy
Edit
vercel login
vercel
– answer prompts to link your GitHub repo and set root directory to .

In Vercel dashboard → Settings → Environment Variables, add:

SHOPIFY_DOMAIN

SHOPIFY_STOREFRONT_TOKEN

Click Deploy → your site will live at your-project.vercel.app

GitHub Pages
In GitHub repo → Settings → Pages, set Branch = main, Folder = / (root).

Commit & push → live at https://<username>.github.io/Mybabyfits/.

🤝 Contributing
Fork this repository

Create a feature branch

Commit your changes

Push & open a Pull Request

Please follow standard Conventional Commits and fill out any new environment variable needs in env.example.js.

📝 License
This project is licensed under the MIT License – see LICENSE.

Built with ❤️ by Lucas Washington
Special thanks to Shopify’s developer ecosystem!

makefile
Copy
Edit
::contentReference[oaicite:0]{index=0}
