const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const ADMIN_EMAIL = 'admin@shopeasy.com';
const ADMIN_PASSWORD = 'admin123';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'shopeasy-demo-secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

function readDB() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writeDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
function makeId() { return crypto.randomUUID().slice(0, 8).toUpperCase(); }
function publicUser(u) { return { id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin }; }
function requireLogin(req, res, next) { if (!req.session.userId) return res.status(401).json({ error: 'Please login first.' }); next(); }
function requireAdmin(req, res, next) { if (!req.session.isAdmin) return res.status(403).json({ error: 'Admin access required.' }); next(); }

app.get('/api/products', (req, res) => res.json(readDB().products));
app.get('/api/products/:id', (req, res) => {
  const p = readDB().products.find(x => x.id === Number(req.params.id));
  p ? res.json(p) : res.status(404).json({ error: 'Product not found.' });
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
  const db = readDB();
  const cleanEmail = email.trim().toLowerCase();
  if (db.users.some(u => u.email === cleanEmail)) return res.status(409).json({ error: 'Email already registered.' });
  const user = { id: makeId(), name: name.trim(), email: cleanEmail, password };
  db.users.push(user); writeDB(db);
  req.session.userId = user.id; req.session.isAdmin = false;
  res.status(201).json({ message: 'Registration successful.', user: publicUser(user) });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.userId = 'ADMIN'; req.session.isAdmin = true;
    return res.json({ message: 'Admin login successful.', user: { id: 'ADMIN', name: 'Administrator', email: ADMIN_EMAIL, isAdmin: true } });
  }
  const db = readDB();
  const user = db.users.find(u => u.email === String(email || '').trim().toLowerCase() && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
  req.session.userId = user.id; req.session.isAdmin = false;
  res.json({ message: 'Login successful.', user: publicUser(user) });
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  if (req.session.isAdmin) return res.json({ user: { id: 'ADMIN', name: 'Administrator', email: ADMIN_EMAIL, isAdmin: true } });
  const user = readDB().users.find(u => u.id === req.session.userId);
  res.json({ user: user ? publicUser(user) : null });
});
app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ message: 'Logged out.' })));

app.post('/api/products/:id/reviews', requireLogin, (req, res) => {
  const { rating, text } = req.body;
  const db = readDB(); const p = db.products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found.' });
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Please login first.' });
  const r = Number(rating);
  if (!r || r < 1 || r > 5 || !text) return res.status(400).json({ error: 'Rating and review are required.' });
  p.reviews = p.reviews || []; p.reviews.push({ name: user.name, rating: r, text: text.trim(), date: new Date().toISOString() });
  writeDB(db); res.json(p);
});

app.post('/api/orders', (req, res) => {
  const { items, customer, paymentMethod = 'Cash on Delivery', coupon = '' } = req.body;
  if (!Array.isArray(items) || !items.length || !customer?.name || !customer?.phone || !customer?.address) return res.status(400).json({ error: 'Complete customer and cart details are required.' });
  const db = readDB(); const orderItems = [];
  for (const item of items) {
    const p = db.products.find(x => x.id === Number(item.id)); const qty = Math.max(1, Number(item.quantity) || 1);
    if (!p) continue;
    if (qty > p.stock) return res.status(400).json({ error: `${p.name} does not have enough stock.` });
    orderItems.push({ id: p.id, name: p.name, price: p.price, quantity: qty, emoji: p.emoji });
  }
  if (!orderItems.length) return res.status(400).json({ error: 'No valid products in cart.' });
  const subtotal = orderItems.reduce((s, x) => s + x.price * x.quantity, 0);
  const discount = String(coupon).toUpperCase() === 'SAVE10' ? Math.min(10, subtotal) : 0;
  const total = subtotal - discount;
  orderItems.forEach(i => { db.products.find(p => p.id === i.id).stock -= i.quantity; });
  const order = { id: makeId(), userId: req.session.userId || null, customer, items: orderItems, subtotal, discount, total, paymentMethod, status: 'Processing', timeline: [{ status: 'Processing', date: new Date().toISOString() }], createdAt: new Date().toISOString() };
  db.orders.push(order); writeDB(db); res.status(201).json({ message: 'Order placed successfully.', order });
});

app.get('/api/orders', requireAdmin, (req, res) => res.json(readDB().orders));
app.get('/api/my-orders', requireLogin, (req, res) => res.json(readDB().orders.filter(o => o.userId === req.session.userId).reverse()));
app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const db = readDB(); const o = db.orders.find(x => x.id === req.params.id); const allowed = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!o) return res.status(404).json({ error: 'Order not found.' });
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
  o.status = req.body.status; o.timeline.push({ status: o.status, date: new Date().toISOString() }); writeDB(db); res.json(o);
});

app.get('/api/admin/summary', requireAdmin, (req, res) => { const d = readDB(); res.json({ products: d.products.length, users: d.users.length, orders: d.orders.length, revenue: d.orders.reduce((s, o) => s + o.total, 0) }); });
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const { name, price, originalPrice, category, stock, description, emoji } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'Name, price and category are required.' });
  const db = readDB(); const p = { id: Date.now(), name, price: Number(price), originalPrice: Number(originalPrice || price), category, stock: Number(stock || 0), description: description || 'ShopEasy product.', emoji: emoji || '🛍️', reviews: [] };
  db.products.push(p); writeDB(db); res.status(201).json(p);
});
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => { const db = readDB(); const before = db.products.length; db.products = db.products.filter(p => p.id !== Number(req.params.id)); if (before === db.products.length) return res.status(404).json({ error: 'Product not found.' }); writeDB(db); res.json({ message: 'Product deleted.' }); });

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`E-commerce store running at http://localhost:${PORT}`));
