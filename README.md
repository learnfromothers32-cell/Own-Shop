<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express" alt="Express 5">
  <img src="https://img.shields.io/badge/MongoDB_9-47A248?style=flat-square&logo=mongodb" alt="MongoDB 9">
  <img src="https://img.shields.io/badge/Stripe-635BFC?style=flat-square&logo=stripe" alt="Stripe">
  <img src="https://img.shields.io/badge/MTN_MoMo-FBCC05?style=flat-square" alt="MTN MoMo">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

<h1 align="center">Own-Shop</h1>

<p align="center">
  <strong>Full-stack e-commerce platform built for Ghanaian businesses.</strong><br>
  MTN Mobile Money, Stripe card payments, real-time admin notifications, and a comprehensive analytics dashboard — built with the MERN stack.
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## Live Demo

| Platform | URL | Status |
|----------|-----|--------|
| **Customer Store** | [my-shop-1.vercel.app](https://my-shop-1.vercel.app) | Live |
| **Admin Dashboard** | [own-shop-admin-1.vercel.app](https://own-shop-admin-1.vercel.app) | Live |
| **Backend API** | [own-shop-1.onrender.com](https://own-shop-1.onrender.com) | Live |
| **Health Check** | [/api/health](https://own-shop-1.onrender.com/api/health) | Operational |

---

## Features

### Customer Store
| Feature | Description |
|---------|-------------|
| **Product Browsing** | Browse by category/subcategory, search, best-seller highlights |
| **Shopping Cart** | Add/remove items by size, update quantities, persistent cart |
| **3 Payment Methods** | Stripe cards, MTN Mobile Money, Cash on Delivery |
| **MTN MoMo Checkout** | USSD prompt on phone, sandbox testing, automatic confirmation |
| **Order Tracking** | View order history with real-time status updates |
| **Responsive Design** | Mobile-first across all pages |
| **Email Notifications** | Order confirmations, newsletter welcome emails, contact replies |
| **Product Pages** | Image galleries, size selection, related products |

### Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Analytics Dashboard** | Total sales, order counts, 7-day sales trend chart |
| **Payment Breakdown** | MTN vs Stripe vs COD revenue split |
| **Order Management** | View all orders, update status (Placed → Packing → Shipped → Delivered) |
| **Product CRUD** | Add/edit/delete products with multi-image Cloudinary upload |
| **Real-time Alerts** | Socket.io-powered instant notifications for new orders |
| **User Management** | View registered customers |
| **Inventory Tracking** | Stock level monitoring |

### Platform
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure user registration/login with bcrypt hashing |
| **Admin Auth** | Separate admin role verification via email matching |
| **Push Notifications** | Web-push alerts for order status changes |
| **Newsletter** | Email subscription with Brevo API integration |
| **Contact Form** | Admin notification + auto-reply to customers |
| **Health Check** | `/api/health` endpoint with uptime and online admin count |
| **Graceful Shutdown** | SIGTERM handler for clean Socket.io + HTTP disconnect |

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│               CUSTOMER STORE (React 19 + Vite)               │
│     Tailwind CSS · Framer Motion · Socket.IO · React GA4     │
└───────────────────────┬───────────────────┬───────────────────┘
                        │ REST API          │ WebSocket
                        ▼                   ▼
┌───────────────────────────────────────────────────────────────┐
│               ADMIN DASHBOARD (React 19 + Vite)              │
│          Socket.IO Client · Framer Motion · Toasts           │
└───────────────────────┬───────────────────┬───────────────────┘
                        │                   │
                        ▼                   ▼
┌───────────────────────────────────────────────────────────────┐
│            EXPRESS 5 API + SOCKET.IO (Node.js)                │
│  5 Controllers · 7 Route Groups · 3 Mongoose Models          │
│  JWT Auth · Admin Auth · Rate Limiting · Helmet · Multer      │
└──────┬──────────┬──────────┬──────────┬───────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
   ┌───────┐ ┌────────┐ ┌────────┐ ┌──────────┐
   │MongoDB│ │Cloudin-│ │ Stripe │ │ MTN MoMo │
   │ Atlas │ │  ary   │ │  API   │ │   API    │
   └───────┘ └────────┘ └────────┘ └──────────┘
```

### Order Flow
```
Customer selects items → Cart → Checkout
  ├─ COD        → POST /api/order/place       → Order saved (payment: false)
  ├─ Stripe     → POST /api/order/stripe      → Stripe session → /verify callback
  └─ MTN MoMo   → POST /api/order/mtn         → USSD prompt → Order saved (payment: true)

All paths → notifyAdmins() via Socket.IO → push notification to customer
```

### Admin Notification Flow
```
Admin dashboard connects via Socket.IO
  → server registers admin in onlineAdmins Map
  → on new order/status change:
      io.to(adminSocketId).emit('new_order', { ... })
  → NotificationBell component receives event → toast + badge update
```

---

## Tech Stack

### Frontend — Customer Store
| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Build** | Vite | 7.2.4 |
| **Styling** | Tailwind CSS | 3.4.19 |
| **Routing** | React Router DOM | 7.13.0 |
| **Animation** | Framer Motion | 12.35.0 |
| **HTTP** | Axios | 1.13.5 |
| **Notifications** | React Toastify | 11.0.5 |
| **Real-time** | Socket.IO Client | 4.8.3 |
| **Analytics** | React GA4 | 2.1.0 |

### Frontend — Admin Dashboard
| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Build** | Vite | 7.3.1 |
| **Styling** | Tailwind CSS | 3.4.19 |
| **Routing** | React Router DOM | 7.13.0 |
| **Animation** | Framer Motion | 12.35.0 |
| **Notifications** | React Toastify | 11.0.5 |
| **Real-time** | Socket.IO Client | 4.8.3 |

### Backend
| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | ES Modules |
| **Framework** | Express | 5.2.1 |
| **Database** | MongoDB + Mongoose | 9.2.1 |
| **Auth** | JWT + bcrypt | jsonwebtoken 9.0.3, bcrypt 6.0.0 |
| **Payments** | Stripe | stripe 20.3.1 |
| **Payments** | MTN MoMo | mtnapimomo 1.2.7 |
| **Real-time** | Socket.IO | 4.8.3 |
| **Storage** | Cloudinary | 2.9.0 |
| **Email** | Brevo API | axios (REST) |
| **Push** | Web Push | 3.6.7 |
| **Upload** | Multer | 2.0.2 |
| **Security** | Helmet | 8.1.0 |
| **Rate Limiting** | express-rate-limit | 8.3.1 |
| **Validation** | express-validator | 7.3.1 |
| **Compression** | compression | 1.8.1 |

---

## Project Structure

```
Own-Shop/
├── backend/                            # Express 5 API
│   ├── config/
│   │   ├── mongoDb.js                  # MongoDB connection
│   │   └── cloudinary.js               # Cloudinary setup
│   ├── controllers/
│   │   ├── orderControllers.js         # Order + payment processing (COD, Stripe, MTN)
│   │   ├── adminController.js          # Dashboard analytics + payment breakdown
│   │   ├── productController.js        # Product CRUD + Cloudinary upload
│   │   ├── cartController.js           # Cart operations (add/update/get)
│   │   └── userController.js           # Auth (register/login/admin)
│   ├── middleware/
│   │   ├── auth.js                     # JWT user verification
│   │   ├── adminAuth.js                # Admin role verification
│   │   └── multer.js                   # File upload config
│   ├── models/
│   │   ├── orderModel.js               # Order schema (items, amount, paymentMethod, status)
│   │   ├── productModel.js             # Product schema (name, price, category, sizes, bestSeller)
│   │   └── userModel.js                # User schema (name, email, password, cartData)
│   ├── routes/
│   │   ├── orderRoutes.js              # /api/order/*
│   │   ├── adminRoutes.js              # /api/admin/*
│   │   ├── productRoutes.js            # /api/product/*
│   │   ├── cartRoutes.js               # /api/cart/*
│   │   ├── userRoute.js                # /api/user/*
│   │   ├── newsletterRoutes.js         # /api/newsletter/*
│   │   └── contactRoutes.js            # /api/contact/*
│   ├── utils/
│   │   └── emailService.js             # Brevo API + email templates
│   ├── uploads/                        # Local upload temp dir
│   ├── server.js                       # Entry point + Socket.IO setup
│   └── test-mtn-connection.js          # MTN sandbox test script
│
├── frontend/                           # React 19 customer store
│   └── src/
│       ├── components/
│       │   ├── MTNPaymentModal.jsx      # MTN MoMo payment modal
│       │   ├── Navbar.jsx, Footer.jsx   # Navigation
│       │   ├── Hero.jsx                 # Landing hero section
│       │   ├── LatestCollection.jsx     # New arrivals grid
│       │   ├── BestSeller.jsx           # Top products section
│       │   ├── ProductsItem.jsx         # Product card
│       │   ├── RelatedProducts.jsx      # Related items
│       │   ├── CartTotal.jsx            # Cart summary
│       │   ├── SearchBar.jsx            # Product search
│       │   ├── NewsLatestBox.jsx        # Newsletter signup
│       │   ├── OurPolicy.jsx            # Trust badges
│       │   └── Title.jsx                # Section headers
│       ├── pages/
│       │   ├── Home.jsx, Collection.jsx, Product.jsx
│       │   ├── Cart.jsx, PlaceOrder.jsx, Verify.jsx, Orders.jsx
│       │   ├── Login.jsx, About.jsx, Contact.jsx
│       │   ├── FAQ.jsx, Delivery.jsx, Privacy.jsx
│       ├── context/
│       │   └── shopContext.jsx           # Global state (auth, cart)
│       └── App.jsx                       # Router + routes
│
├── Admin/                              # React 19 admin dashboard
│   └── src/
│       ├── components/
│       │   ├── NotificationBell.jsx     # Real-time order alerts
│       │   ├── Sidebar.jsx              # Admin navigation
│       │   ├── Navbar.jsx               # Top bar
│       │   └── Login.jsx                # Admin login
│       ├── pages/
│       │   ├── Dashboard.jsx            # Analytics + 7-day chart
│       │   ├── Order.jsx                # Order list
│       │   ├── OrderDetails.jsx         # Single order view
│       │   ├── List.jsx                 # Product list
│       │   └── Add.jsx                  # Add product form
│       ├── context/
│       │   └── NotificationContext.jsx   # Socket.IO notification state
│       └── App.jsx
│
├── .gitignore
└── README.md
```

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/user/register` | Register new account | Public |
| POST | `/api/user/login` | Login (returns JWT) | Public |
| POST | `/api/user/admin` | Admin login | Public |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/product/list` | List all products | Public |
| POST | `/api/product/single` | Get single product | Public |
| POST | `/api/product/add` | Add product (multi-image) | Admin |
| POST | `/api/product/remove` | Delete product | Admin |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/cart/add` | Add item to cart | User |
| POST | `/api/cart/update` | Update cart quantity | User |
| POST | `/api/cart/get` | Get user cart | User |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/order/place` | Place COD order | User |
| POST | `/api/order/stripe` | Initiate Stripe payment | User |
| POST | `/api/order/mtn` | Process MTN MoMo payment | User |
| POST | `/api/order/verifyStripe` | Verify Stripe callback | User |
| GET | `/api/order/userOrders` | Get user's orders | User |
| POST | `/api/order/list` | List all orders | Admin |
| POST | `/api/order/status` | Update order status | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard analytics | Admin |

### Other
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter | Public |
| POST | `/api/contact/submit` | Submit contact form | Public |
| GET | `/api/health` | Health check | Public |

---

## Getting Started

### Prerequisites
- **Node.js** >= 14
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **Stripe Account** ([stripe.com](https://stripe.com))
- **MTN Developer Account** ([momodeveloper.mtn.com](https://momodeveloper.mtn.com))
- **Cloudinary Account** ([cloudinary.com](https://cloudinary.com))
- **Brevo Account** ([brevo.com](https://brevo.com)) for email

### 1. Clone & Install
```bash
git clone https://github.com/learnfromothers32-cell/Own-Shop.git
cd Own-Shop

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Admin
cd ../Admin && npm install
```

### 2. MTN MoMo Setup
```bash
cd backend
node mtn-manual-setup.js
# Generates MTN_API_USER and MTN_API_KEY — copy into .env
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
PORT=4000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
NODE_ENV=development

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

MTN_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_API_ENVIRONMENT=sandbox
MTN_COLLECTION_SUBSCRIPTION_KEY=your_key
MTN_CURRENCY=GHS
MTN_API_USER=your_uuid
MTN_API_KEY=your_key

BREVO_API_KEY=your_brevo_key
FROM_EMAIL=noreply@yourstore.com
ADMIN_EMAIL=your_email@gmail.com

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

**Frontend** (`frontend/.env`):
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Admin** (`Admin/.env`):
```env
VITE_BACKEND_URL=http://localhost:4000
```

### 4. Run Development
```bash
# Backend (port 4000)
cd backend && npm run dev

# Customer store (port 5173)
cd frontend && npm run dev

# Admin dashboard (port 5174)
cd Admin && npm run dev
```

### MTN MoMo Sandbox Test Numbers
| Phone | Result | Use Case |
|-------|--------|----------|
| `0240000000` | Success | Happy path |
| `0240000001` | Pending | Pending state |
| `0240000002` | Failed | Failure handling |
| `0240000003` | Delayed | Timeout scenarios |

---

## Deployment

### Backend — Render
1. Push to GitHub
2. Connect repository to Render
3. Add all environment variables
4. Deploy — Render handles SSL automatically

### Frontend & Admin — Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```
Set `VITE_BACKEND_URL` to your deployed Render backend URL.

---

## Security

| Layer | Implementation |
|-------|---------------|
| **Auth** | JWT tokens (7-day expiry) stored in memory |
| **Passwords** | bcrypt hashing with salt rounds |
| **Admin** | Separate admin auth middleware (email-based role check) |
| **Headers** | Helmet security headers |
| **Rate Limiting** | express-rate-limit on API endpoints |
| **Validation** | express-validator on write endpoints |
| **CORS** | Configured for production Vercel/Render origins |
| **Uploads** | Multer with file type/size validation |
| **Graceful Shutdown** | SIGTERM handler for clean Socket.io + HTTP disconnect |

---

## Roadmap

### Completed
- Core e-commerce (products, cart, orders)
- MTN Mobile Money integration (Ghana)
- Stripe card payments
- Cash on Delivery
- Admin dashboard with real-time analytics
- Email notifications (Brevo API)
- Real-time admin alerts (Socket.IO)
- Product management with Cloudinary image upload
- Order tracking with status updates
- Push notifications (web-push)
- Google Analytics integration
- Contact form with auto-reply
- Newsletter subscription

### Planned
- Mobile app (React Native)
- Multi-currency support
- SMS notifications
- Inventory automation
- AI product recommendations
- Vendor marketplace support
- WhatsApp Business integration

---

## Contributing

```bash
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## License

Distributed under the **MIT License**.

---

<p align="center">
  Built with the MERN Stack · Ghana
</p>
