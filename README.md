<div align="center">

# 🛒 MERN E-Commerce Platform
### Phone Accessories Store with MTN Mobile Money

![Node.js](https://img.shields.io/badge/Node.js-v14%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)

<br/>

A **production-ready full-stack e-commerce platform** built with the MERN stack — featuring MTN Mobile Money for Ghanaian businesses, Stripe card payments, real-time admin notifications, and a comprehensive analytics dashboard.

<br/>

[🌐 Live Store](https://my-shop-1.vercel.app) · [📊 Admin Dashboard](https://own-shop-admin-1.vercel.app) · [🔗 Backend API](https://own-shop-1.onrender.com) · [🐛 Report Bug](#) · [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Payment Integrations](#-payment-integrations)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation Guide](#-installation-guide)
- [Environment Configuration](#-environment-configuration)
- [MTN MoMo Integration](#-mtn-momo-integration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌍 Live Demo

| Environment | URL | Status |
|---|---|---|
| Frontend (Customer) | [my-shop-1.vercel.app](https://my-shop-1.vercel.app) | 🟢 Live |
| Admin Dashboard | [own-shop-admin-1.vercel.app](https://own-shop-admin-1.vercel.app) | 🟢 Live |
| Backend API | [own-shop-1.onrender.com](https://own-shop-1.onrender.com) | 🟢 Live |
| API Health Check | [/api/health](https://own-shop-1.onrender.com/api/health) | 🟢 Operational |

---

## 🎯 Key Features

### 🛍️ Customer Features

| Feature | Description |
|---|---|
| User Authentication | Secure JWT-based registration and login |
| Product Browsing | Filter by categories and search |
| Shopping Cart | Add/remove items, update quantities in real-time |
| Multiple Payment Methods | Stripe, MTN MoMo, Cash on Delivery |
| Order Management | View order history and real-time status tracking |
| Email Notifications | Order confirmations and newsletter subscriptions |
| Responsive Design | Mobile-first — works on all devices |

### 👑 Admin Features

| Feature | Description |
|---|---|
| Real-time Dashboard | Live sales analytics with charts and metrics |
| Order Management | View, update status, and process orders |
| Product Management | Add, edit, delete products with image upload |
| User Management | View and manage registered customers |
| Notification System | Real-time alerts for new orders |
| Payment Analytics | Track MTN MoMo vs Stripe vs COD breakdown |
| Inventory Tracking | Monitor stock levels and low inventory alerts |

---

## 💰 Payment Integrations

| Method | Description | Status |
|---|---|---|
| 📱 MTN Mobile Money | Ghana GHS payments with sandbox testing | ✅ Live |
| 💳 Stripe | International card payments (Visa, Mastercard, Amex) | ✅ Live |
| 💵 Cash on Delivery | Local payment option for customers | ✅ Live |

### 📱 MTN MoMo Highlights

- ✅ Sandbox testing environment
- ✅ Production-ready configuration
- ✅ Automatic payment confirmation
- ✅ Real-time order updates
- ✅ USSD prompt on customer phone
- ✅ Payment verification callbacks

---

## 🧠 Tech Stack

### Frontend

| Library | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Framer Motion | Animations & transitions |
| React Toastify | In-app notifications |
| React GA4 | Google Analytics integration |

### Backend

| Library | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| Nodemailer (Brevo) | Email delivery |
| Stripe SDK | Card payment processing |
| MTN MoMo API | Mobile Money integration |
| Socket.io | Real-time admin notifications |
| Cloudinary | Cloud image storage |

---

## 📂 Project Structure

```
Own-Shop/
│
├── backend/                            # Node.js/Express API
│   ├── controllers/
│   │   ├── orderControllers.js         # Order processing & payments
│   │   ├── adminController.js          # Admin analytics
│   │   └── userController.js           # Authentication
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── userRoute.js
│   ├── models/
│   │   ├── orderModel.js
│   │   ├── userModel.js
│   │   └── productModel.js
│   ├── utils/
│   │   ├── emailService.js             # Email notifications
│   │   └── mtnMomoService.js           # MTN API integration
│   ├── middleware/
│   │   ├── auth.js                     # User authentication
│   │   └── adminAuth.js                # Admin authentication
│   └── server.js
│
├── frontend/                           # React customer store
│   └── src/
│       ├── components/
│       │   ├── MTNPaymentModal.jsx      # MoMo payment modal
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── PlaceOrder.jsx
│       │   ├── Orders.jsx
│       │   └── Product.jsx
│       ├── context/
│       │   └── shopContext.jsx
│       └── App.jsx
│
└── Admin/                              # React admin dashboard
    └── src/
        ├── components/
        │   ├── NotificationBell.jsx    # Real-time alerts
        │   └── Sidebar.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Order.jsx
        │   ├── OrderDetails.jsx
        │   ├── Add.jsx
        │   └── List.jsx
        ├── context/
        │   └── NotificationContext.jsx
        └── App.jsx
```

---

## 🔧 Installation Guide

### Prerequisites

- ✅ Node.js v14 or higher
- ✅ MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- ✅ [Stripe Account](https://stripe.com)
- ✅ [MTN Developer Account](https://momodeveloper.mtn.com)
- ✅ [Cloudinary Account](https://cloudinary.com)

### 1. Clone Repository

```bash
git clone https://github.com/learnfromothers32-cell/Own-Shop.git
cd Own-Shop
```

### 2. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Admin Panel
cd ../Admin && npm install
```

### 3. Set Up MTN MoMo Credentials

```bash
cd backend
node mtn-manual-setup.js
# Generates MTN_API_USER and MTN_API_KEY — copy into your .env
```

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

```env
# Server
PORT=4000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Email (Brevo/Sendinblue)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourstore.com
ADMIN_EMAIL=your_email@gmail.com

# MTN Mobile Money
MTN_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_API_ENVIRONMENT=sandbox
MTN_COLLECTION_SUBSCRIPTION_KEY=your_subscription_key
MTN_CURRENCY=GHS
MTN_API_USER=your_api_user_uuid
MTN_API_KEY=your_api_key
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Admin (`Admin/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Run Development Servers

```bash
# Backend  →  http://localhost:4000
cd backend && npm run dev

# Frontend  →  http://localhost:5173
cd frontend && npm run dev

# Admin Panel  →  http://localhost:5174
cd Admin && npm run dev
```

---

## 📱 MTN MoMo Integration

### Sandbox Setup

1. Register at [momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Subscribe to the **Collections API**
3. Copy your **Subscription Key** from the dashboard
4. Generate credentials:

```bash
cd backend
node mtn-manual-setup.js
```

5. Add the generated values to your `backend/.env`

### Sandbox Test Numbers

| Phone Number | Expected Result | Use Case |
|---|---|---|
| `0240000000` | ✅ Successful | Test successful payment flow |
| `0240000001` | ⏳ Pending | Test pending payment state |
| `0240000002` | ❌ Failed | Test payment failure handling |
| `0240000003` | ⏱️ Delayed | Test timeout scenarios |

### Test Payment Flow

1. Add items to cart
2. Proceed to checkout
3. Fill in delivery information
4. Select **MTN Mobile Money**
5. Enter a test phone number (e.g. `0240000000`)
6. Click **Pay Now**
7. Verify order is created successfully

---

## 📡 API Documentation

### Order Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/order/place` | Place COD order | ✅ User |
| `POST` | `/api/order/stripe` | Initiate Stripe payment | ✅ User |
| `POST` | `/api/order/mtn` | Process MTN MoMo payment | ✅ User |
| `POST` | `/api/order/verifyStripe` | Verify Stripe transaction | ✅ User |
| `GET` | `/api/order/userOrders` | Get user's orders | ✅ User |
| `POST` | `/api/order/list` | List all orders | ✅ Admin |
| `POST` | `/api/order/status` | Update order status | ✅ Admin |

### MTN Mobile Money Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/mtn/pay` | Initiate MTN payment | ✅ User |
| `GET` | `/api/mtn/status/:reference` | Check payment status | ✅ User |

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard statistics | ✅ Admin |
| `GET` | `/api/admin/order/:orderId` | Get single order details | ✅ Admin |
| `POST` | `/api/admin/update-status` | Update order status | ✅ Admin |

---

## 🚀 Deployment

### Backend — [Render](https://render.com)

1. Push code to GitHub
2. Connect repository to Render
3. Add all environment variables from `backend/.env`
4. Deploy — Render handles SSL automatically

### Frontend & Admin — [Vercel](https://vercel.com)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

Set `VITE_BACKEND_URL` to your deployed Render backend URL.

---

## 🔍 Troubleshooting

| Issue | Solution |
|---|---|
| MTN modal not opening | Check browser console; verify `showMTNModal` state; confirm `MTNPaymentModal` is imported |
| Payment success but order not created | Check backend logs; verify `/api/order/mtn` endpoint; confirm `placeOrderMTN` is exported |
| Admin notifications not working | Verify Socket.io connection; check browser console for errors |
| SMTP connection errors | Verify credentials in `.env`; try port `2525` instead of `587` |
| JWT expired error | Log in again; check `JWT_EXPIRE` in environment variables |
| CORS errors | Verify backend CORS settings include your frontend URL |

---

## 🛣️ Roadmap

### ✅ Completed
- [x] Core e-commerce functionality
- [x] MTN Mobile Money integration (Ghana)
- [x] Stripe card payments
- [x] Cash on Delivery
- [x] Admin dashboard with real-time analytics
- [x] Email notifications
- [x] Real-time admin alerts (Socket.io)
- [x] Product management with image uploads
- [x] Order tracking

### 🚧 In Progress
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] SMS notifications
- [ ] Inventory automation

### 📅 Planned
- [ ] AI product recommendations
- [ ] Vendor marketplace support
- [ ] Advanced predictive analytics
- [ ] WhatsApp Business integration

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add some amazing feature'

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👨‍💻 Author

**Kelvin Asante**

- 🏠 Location: Ghana 🇬🇭
- 💼 Role: Full-Stack MERN Developer
- 🎯 Expertise: E-commerce · Payment Integrations · Real-time Applications
- 📧 Email: [learnfromothers32@gmail.com](mailto:learnfromothers32@gmail.com)
- 🐙 GitHub: [@learnfromothers32-cell](https://github.com/learnfromothers32-cell)
- 💼 LinkedIn: [Kelvin Asante](#)
- 🌐 Portfolio: [yourportfolio.com](#)

---

## 🙏 Acknowledgements

- [MTN MoMo API Documentation](https://momodeveloper.mtn.com)
- [Stripe API](https://stripe.com/docs)
- [Nodemailer](https://nodemailer.com)
- [Framer Motion](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

**Built with ❤️ using the MERN Stack · Ghana 🇬🇭**

[![GitHub](https://img.shields.io/badge/GitHub-learnfromothers32--cell-181717?style=for-the-badge&logo=github)](https://github.com/learnfromothers32-cell)

</div>
