// server.js
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// --- Static (serve your frontend root) ---
app.use(express.static(path.join(__dirname, '..'))); 
// Adjust if directory differs; here assuming: backend/server.js and frontend files one level up.

app.use(cors());
app.use(express.json());

// ---- In-Memory Orders "DB" ----
const ordersDB = {
  "BF-10001": {
    orderNumber: "BF-10001",
    email: "demo@babyfits.com",
    placedAt: "2025-07-15T14:22:00Z",
    status: "Processing",
    shippingAddress: {
      name: "Alex Johnson",
      line1: "123 Meadow Lane",
      city: "Springfield",
      state: "IL",
      postal: "62701",
      country: "US"
    },
    payment: { method: "Card", brand: "Visa", last4: "4242" },
    items: [
      { name: "Pink Cotton Onesie", qty: 2, price: 19.99 },
      { name: "Neutral Bib Set (3-pack)", qty: 1, price: 14.99 }
    ],
    timeline: [
      { label: "Order Placed", date: "2025-07-15T14:22:00Z", done: true },
      { label: "Processing", date: "2025-07-15T14:40:00Z", done: true },
      { label: "Shipped", date: null, done: false },
      { label: "Out for Delivery", date: null, done: false },
      { label: "Delivered", date: null, done: false }
    ]
  },
  "BF-10002": {
    orderNumber: "BF-10002",
    email: "demo@babyfits.com",
    placedAt: "2025-07-10T11:05:00Z",
    status: "Shipped",
    shippingAddress: {
      name: "Taylor Green",
      line1: "56 Oak Ridge Ct",
      city: "Columbus",
      state: "OH",
      postal: "43004",
      country: "US"
    },
    payment: { method: "Card", brand: "Mastercard", last4: "5150" },
    items: [
      { name: "Blue Baby Romper", qty: 1, price: 22.99 },
      { name: "Little Man Suit", qty: 1, price: 34.95 }
    ],
    timeline: [
      { label: "Order Placed",      date: "2025-07-10T11:05:00Z", done: true },
      { label: "Processing",        date: "2025-07-10T12:10:00Z", done: true },
      { label: "Shipped",           date: "2025-07-11T09:00:00Z", done: true },
      { label: "Out for Delivery",  date: null,                   done: false },
      { label: "Delivered",         date: null,                   done: false }
    ]
  }
};

// ---- Payment Intent Route ----
app.post('/create-payment-intent', async (req, res) => {
  let amount = 0;
  const { items, amount: directAmount, shipping } = req.body;

  if (typeof directAmount === 'number') {
    amount = directAmount;
  } else if (Array.isArray(items)) {
    amount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;     // price in cents expected?
      const qty   = Number(item.qty || item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  } else {
    return res.status(400).json({ error: 'Provide numeric `amount` or array of `items`.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      shipping, // optional if you want to store shipping in PI
      metadata: {
        // Add any metadata you like (e.g., orderNumber)
      }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('PaymentIntent creation failed:', err);
    res.status(500).json({ error: 'PaymentIntent creation failed' });
  }
});

// ---- Order Lookup Route ----
// GET /api/orders/:orderNumber?email=someone@example.com
app.get('/api/orders/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const email = (req.query.email || '').toLowerCase().trim();

  if (!orderNumber || !email) {
    return res.status(400).json({ error: 'Missing orderNumber or email.' });
  }

  const order = ordersDB[orderNumber];
  if (!order || order.email.toLowerCase() !== email) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(order);
});

// Fallback: serve index for unknown routes (optional SPA style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`🛡️  Backend server listening on http://localhost:${PORT}`);
});
