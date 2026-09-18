# ShopEasy – E-Commerce Store

ShopEasy is a simple educational e-commerce website built with **HTML, CSS, JavaScript, Node.js and Express.js**. It demonstrates the main parts of an online shopping website, including products, search, cart, login/register, checkout, orders, reviews and an admin dashboard.

> **Important:** This is a demo/educational project. Payment options are demo-only and no real payment is processed.

---

## 1. Main Features

### 🛍 Product Store
- Product listing page
- Product cards with product images
- Product name, category, price and original price
- Discount information
- Product stock
- Product description
- Product details popup
- Responsive design for laptop/mobile screens

### 🔎 Search, Filter and Sort
- Search products by name
- Filter products by category
- Sort products by:
  - Default
  - Price: Low to High
  - Price: High to Low

### ❤️ Wishlist
- Add products to wishlist
- Remove products from wishlist
- Wishlist is handled in the browser

### 🛒 Shopping Cart
- Add products to cart
- Increase/decrease quantity
- Remove products
- Automatic subtotal calculation
- Stock checking during order placement
- Coupon support

### 🎟 Coupon / Discount
Demo coupon:

`SAVE10`

It gives **₹10 off** the order total when valid.

### 👤 User Account
- Register a new account
- Login
- Logout
- View profile
- View user's orders
- Session-based login using Express sessions

### 📦 Checkout
Checkout collects:
- Full name
- Phone number
- Delivery address
- Payment method

Available demo payment methods:
- Cash on Delivery
- UPI (Demo)
- Card (Demo)

No real payment gateway is connected.

### 🚚 Order Management and Tracking
Orders start with:

`Processing`

The admin can change an order to:
- Processing
- Shipped
- Delivered
- Cancelled

The order timeline records status changes with dates.

### ⭐ Product Reviews
Logged-in users can:
- Give a 1–5 star rating
- Write a product review
- View reviews on products

### 🛠 Admin Dashboard
Admin can:
- View total number of products
- View total users
- View total orders
- View total revenue
- Add products
- Delete products
- View customer orders
- Change order status

### 🖼 Included Product Pictures
The project currently contains these local product images:

- Wireless Headphones
- Smart Watch
- Running Shoes
- Backpack
- Coffee Mug
- Desk Lamp
- Black Denim Pant
- Black Polo Shirt
- Wooden Wall Clock

A jacket image has not been included yet.

---

# 2. Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- Express Session

### Database
The project uses a simple JSON file instead of MySQL/MongoDB:

`data/db.json`

### Product Images
Product images are stored inside:

`public/images/`

---

# 3. Project Structure

```text
ShopEasy/
│
├── package.json
├── server.js
├── README.md
│
├── data/
│   └── db.json
│
└── public/
    ├── index.html
    ├── style.css
    ├── script.js
    │
    └── images/
        ├── headphones.jpg
        ├── smart-watch.webp
        ├── running-shoes.jpg
        ├── backpack.webp
        ├── coffee-mug.jpg
        ├── desk-lamp.jpg
        ├── pant.webp
        ├── black-shirt.webp
        └── wall-clock.jpg
```

---

# 4. Requirements

Install these before running the project:

- Node.js
- npm
- VS Code (recommended)
- A web browser such as Chrome

You can check Node.js and npm with:

```bash
node -v
npm -v
```

---

# 5. How to Install and Run

## Step 1 – Extract the ZIP

Extract the ShopEasy ZIP file to your laptop.

For example:

```text
Desktop/ShopEasy
```

## Step 2 – Open in VS Code

Open VS Code.

Select:

**File → Open Folder**

Choose the ShopEasy folder.

## Step 3 – Open Terminal

In VS Code select:

**Terminal → New Terminal**

## Step 4 – Install packages

Run:

```bash
npm install
```

Wait until the installation finishes.

## Step 5 – Start the server

Run:

```bash
npm start
```

You should see:

```text
E-commerce store running at http://localhost:3000
```

## Step 6 – Open the website

Open Chrome and visit:

```text
http://localhost:3000
```

The ShopEasy website will open.

---

# 6. Admin Login

Use the demo administrator account:

**Email**

```text
admin@shopeasy.com
```

**Password**

```text
admin123
```

After logging in, the **Admin** button becomes available.

---

# 7. How the Website Works

The website has two main parts:

## Frontend

The files inside `public/` create the website that the customer sees.

### `index.html`
Contains:
- Navigation
- Hero section
- Product area
- Search/filter controls
- Cart
- Login/register
- Checkout
- Profile
- Admin dashboard

### `style.css`
Controls:
- Colors
- Layout
- Product cards
- Buttons
- Forms
- Modals
- Responsive design

### `script.js`
Controls the website behavior:
- Loading products
- Searching
- Filtering
- Sorting
- Cart
- Wishlist
- Login/register
- Checkout
- Reviews
- Profile
- Admin actions

---

# 8. Backend – How It Works

The main backend file is:

```text
server.js
```

Express.js creates the web server and API.

The server runs on:

```text
Port 3000
```

The frontend communicates with the backend using API requests.

Important API routes include:

```text
GET  /api/products
GET  /api/products/:id

POST /api/register
POST /api/login
GET  /api/me
POST /api/logout

POST /api/products/:id/reviews

POST /api/orders
GET  /api/my-orders

GET   /api/orders
PATCH /api/orders/:id/status

GET    /api/admin/summary
POST   /api/admin/products
DELETE /api/admin/products/:id
```

---

# 9. How Products Are Stored

Products are stored in:

```text
data/db.json
```

A product contains information such as:

```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "price": 1999,
  "originalPrice": 2499,
  "category": "Electronics",
  "stock": 10,
  "description": "Comfortable wireless headphones.",
  "image": "/images/headphones.jpg",
  "reviews": []
}
```

The website reads this data and displays the products.

---

# 10. How Product Images Work

Local product images are stored in:

```text
public/images/
```

For example:

```text
public/images/headphones.jpg
```

The product database can refer to the image using:

```text
/images/headphones.jpg
```

Because the `public` folder is served by Express, the browser can display these images.

---

# 11. How to Add a New Product

There are two ways.

## Method 1 – Admin Dashboard

1. Start the server.
2. Open `http://localhost:3000`.
3. Login with the admin account.
4. Open **Admin**.
5. Go to **Add Product**.
6. Enter:
   - Product name
   - Category
   - Price
   - Original price
   - Stock
   - Description
7. Click **Add Product**.

The product is saved in `data/db.json`.

## Method 2 – Edit `db.json`

Open:

```text
data/db.json
```

Add a product object inside the `products` array.

Example:

```json
{
  "id": 100,
  "name": "Black Jacket",
  "price": 1499,
  "originalPrice": 1999,
  "category": "Fashion",
  "stock": 10,
  "description": "Stylish black jacket.",
  "image": "/images/jacket.jpg",
  "reviews": []
}
```

Then put the image here:

```text
public/images/jacket.jpg
```

Restart the server if necessary.

---

# 12. How Cart and Checkout Work

When a customer clicks **Add to Cart**, the selected product is added to the browser cart.

The cart calculates:

```text
Subtotal = Product Price × Quantity
```

If the coupon is valid:

```text
Total = Subtotal - Discount
```

When the customer places an order:
1. The browser sends the cart and customer details to the server.
2. The server checks the products.
3. The server checks available stock.
4. Stock is reduced.
5. An order is created.
6. The order is stored in `data/db.json`.
7. The order starts as `Processing`.

---

# 13. How Order Tracking Works

Every new order starts as:

```text
Processing
```

The admin can change it to:

```text
Shipped
```

and then:

```text
Delivered
```

The project also supports:

```text
Cancelled
```

Each status update is added to the order timeline with a date/time.

---

# 14. How Login Works

When a user registers:
1. Name, email and password are received by the server.
2. The user is stored in `data/db.json`.
3. A session is created.
4. The user becomes logged in.

When the user logs in:
1. Email and password are checked.
2. If correct, an Express session is created.
3. The website knows which user is logged in.

---

# 15. How Reviews Work

A logged-in user can submit:

```text
Rating: 1–5 stars
Review: Text
```

The review is stored inside the product's `reviews` array in `data/db.json`.

---

# 16. How Admin Security Works

The demo uses two levels of access:

### Normal User
Can:
- Shop
- Add to cart
- Place orders
- Write reviews
- View own orders

### Admin
Can additionally:
- View dashboard statistics
- Add products
- Delete products
- View all orders
- Change order status

The backend checks the admin session before allowing admin API operations.

---

# 17. Database

This project does not require MySQL or MongoDB.

Everything is stored in:

```text
data/db.json
```

It contains:

```text
products
users
orders
```

For a real production store, a proper database such as MySQL, PostgreSQL or MongoDB should be used.

---

# 18. Payment System

The project currently has **demo payment options only**:

```text
Cash on Delivery
UPI (Demo)
Card (Demo)
```

No real money is charged.

For a real online store, a payment gateway such as Razorpay or Stripe would need to be integrated securely on the backend.

---

# 19. Common Problems

## `npm is not recognized`

Install Node.js and restart VS Code.

Check:

```bash
node -v
npm -v
```

## `Cannot find module 'express'`

Run:

```bash
npm install
```

## Port 3000 is already in use

Stop the other Node.js server or change the port in `server.js`.

## Website does not open

Make sure this command is still running:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Product image does not appear

Check:
1. The image exists inside `public/images/`.
2. The filename is correct.
3. The product's image path matches the filename.
4. Restart the server if needed.

---

# 20. Stopping the Server

In the VS Code terminal press:

```text
Ctrl + C
```

This stops the Node.js server.

---

# 21. Recommended Development Flow

When modifying the project:

```text
1. Open ShopEasy in VS Code
        ↓
2. npm install
        ↓
3. npm start
        ↓
4. Open localhost:3000
        ↓
5. Make changes
        ↓
6. Refresh the browser
        ↓
7. Test the feature
```

---

# 22. Future Improvements

The project can be extended with:

- Real image upload from the computer
- Real payment gateway
- MySQL/MongoDB database
- Product quantity management
- Product editing in admin
- Customer address management
- Email order confirmation
- WhatsApp order notification
- Product categories page
- Product variants such as size/color
- Multiple product images
- Better admin authentication
- Password hashing
- Cloud image storage
- Deployment to a live hosting service

---

## Project Summary

**ShopEasy** demonstrates a complete basic e-commerce workflow:

```text
Customer
   ↓
Browse Products
   ↓
Search / Filter / Sort
   ↓
View Product
   ↓
Wishlist / Add to Cart
   ↓
Apply Coupon
   ↓
Login / Register
   ↓
Checkout
   ↓
Place Order
   ↓
Order = Processing
   ↓
Admin Updates Status
   ↓
Shipped
   ↓
Delivered
```

This project is suitable for **learning, college projects, demonstrations and further development into a full e-commerce application**.
