// backend/server.js
require('dotenv').config();

const path   = require('path');
const express = require('express');
const cors    = require('cors');
const Stripe  = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app    = express();

// —— MIDDLEWARE ——
// JSON bodies + CORS
app.use(cors());
app.use(express.json());

// Serve all of your front‑end files (one level up from /backend)
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// —— PAYMENT INTENT ENDPOINT ——
// POST /create-payment-intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, items, shipping } = req.body;
  let total;

  if (typeof amount === 'number') {
    total = amount;
  } else if (Array.isArray(items)) {
    total = items.reduce((sum, i) => {
      const p = Number(i.price)  || 0;
      const q = Number(i.quantity || i.qty) || 0;
      return sum + p * q;
    }, 0);
  } else {
    return res.status(400).json({ error: 'Must supply numeric `amount` or array of `items`.' });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount:   total,
      currency: 'usd',
      shipping,          // optional
      metadata: {}       // e.g. orderNumber, etc.
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('⚠️  Unable to create PaymentIntent:', err);
    res.status(500).json({ error: 'PaymentIntent creation failed' });
  }
});

// —— ORDER LOOKUP ENDPOINT ——
// GET /api/orders/:orderNumber?email=you@here.com
const ordersDB = {
  "BF-10001": { /* … */ },
  "BF-10002": { /* … */ },
  // etc.
};

app.get('/api/orders/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const email = (req.query.email || '').toLowerCase().trim();

  if (!orderNumber || !email) {
    return res.status(400).json({ error: 'orderNumber + email required' });
  }

  const order = ordersDB[orderNumber];
  if (!order || order.email.toLowerCase() !== email) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(order);
});

// —— FALLBACK (SPA style) ——
// Any other request, just return your index.html
// (doesn't go through path‑to‑regexp, so no more “missing parameter name” errors)
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// —— START UP —— 
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`🚀  Server listening on http://localhost:${PORT}`);
});
