<div align="center">

# 🛒 MERN E-Commerce Platform
### Phone Accessories Store with MTN Mobile Money

![Node.js](https://img.shields.io/badge/Node.js-v14%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)

<br/>

A **production-ready full-stack e-commerce platform** built for African markets — featuring MTN Mobile Money (Ghana), Stripe card payments, and a powerful admin analytics dashboard.

<br/>

[🌐 Live Demo — Store](#) · 
[📊 Admin Dashboard](#) · 
[🔗 API Docs](#) · [🐛 Report Bug](#) ·
[✨ Request Feature](#)

</div>

---

## 📸 Screenshots

| Store Frontend | Admin Dashboard |
|---|---|
| *(add screenshot)* | *(add screenshot)* |
| *(add screenshot)* | *(add screenshot)* |

> **Tip:** Add screenshots inside a `/screenshots` folder in the repo root, then replace the placeholders above.

---

## ✨ Features at a Glance

### 🛍️ Customer-Facing
- **JWT Authentication** — Secure register & login flow
- **Product Browsing** — Filter by category, search, and sort
- **Shopping Cart** — Add, remove, and update item quantities
- **Order History** — View past orders with live status tracking
- **Email Notifications** — Order confirmations & newsletter support

### 💳 Payment Methods

| Method | Description | Currency |
|---|---|---|
| **MTN Mobile Money** | Ghana MoMo — direct mobile payments | GHS |
| **Stripe** | Visa, Mastercard, Amex — international cards | Multi |
| **Cash on Delivery** | Pay on arrival — local customers | Any |

### 👑 Admin Dashboard
- **Sales Analytics** — Revenue insights and order trends
- **Product Management** — Add, edit, delete products with image upload
- **Order Management** — View all orders and update statuses
- **User Management** — Browse and manage registered customers

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

### Backend
| Library | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| Nodemailer | Email delivery (via Brevo) |
| Stripe SDK | Card payment processing |
| mtnapimomo | MTN Mobile Money integration |
| Cloudinary | Cloud image storage |

---

## 📂 Project Structure

```
mern-ecommerce/
│
├── backend/
│   ├── controllers/
│   │   └── orderControllers.js
│   ├── models/
│   ├── routes/
│   │   └── orderRoutes.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── mtnMomoService.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── MTNPaymentModal.jsx
│       ├── pages/
│       │   └── PlaceOrder.jsx
│       └── context/
│
└── admin/
    ├── components/
    ├── pages/
    └── dashboard/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- [Stripe Account](https://stripe.com)
- [MTN Developer Account](https://momodeveloper.mtn.com)
- [Cloudinary Account](https://cloudinary.com)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-ecommerce-momo.git
cd mern-ecommerce-momo
```

### 2. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Admin Panel
cd ../admin && npm install
```

### 3. Configure Environment Variables

Create `backend/.env`:

```env
# Server
PORT=4000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email (Brevo / Sendinblue)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourstore.com
ADMIN_EMAIL=admin@yourstore.com

# MTN Mobile Money
MTN_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_API_ENVIRONMENT=sandbox
MTN_COLLECTION_SUBSCRIPTION_KEY=your_subscription_key
MTN_CURRENCY=GHS
MTN_API_USER=your_api_user
MTN_API_KEY=your_api_key
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### 4. Run Development Servers

```bash
# Backend → http://localhost:4000
cd backend && npm run dev

# Frontend → http://localhost:5173
cd frontend && npm run dev

# Admin Panel → http://localhost:5174
cd admin && npm run dev
```

---

## 📱 MTN Mobile Money Integration

### Setup (Sandbox)

1. Register at [momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Subscribe to the **Collections API**
3. Copy your **Subscription Key**
4. Generate API credentials:

```bash
cd backend
node mtn-manual-setup.js
```

5. Update your `.env` with the generated credentials.

### Sandbox Test Numbers

| Phone Number | Expected Result |
|---|---|
| `0240000000` | ✅ Successful payment |
| `0240000001` | ⏳ Pending payment |
| `0240000002` | ❌ Failed payment |
| Any other number | ✅ Immediate success |

### Test Payment Flow

1. Add items to cart
2. Proceed to checkout
3. Fill in delivery info
4. Select **MTN Mobile Money**
5. Enter a test phone number
6. Click **Pay Now**

---

## 🔗 API Endpoints

### Orders

```
POST   /api/order/place          # Cash on Delivery
POST   /api/order/stripe         # Stripe payment
POST   /api/order/mtn            # MTN MoMo payment
POST   /api/order/verifyStripe   # Verify Stripe transaction
GET    /api/order/userOrders     # Fetch user orders
```

### MTN Mobile Money

```
POST   /api/mtn/pay              # Initiate MoMo payment
GET    /api/mtn/status/:ref      # Check payment status
```

---

## 🔒 Security

- JWT-based authentication with token expiry
- Sensitive credentials stored in environment variables (never committed)
- Input validation on all API endpoints
- HTTPS enforced in production
- Rate limiting recommended for production deployments
- **Never commit `.env` files** — add to `.gitignore`

---

## 🚀 Deployment

### Backend — [Render](https://render.com) / [Railway](https://railway.app)

1. Push code to GitHub
2. Connect your repo to Render/Railway
3. Add all environment variables from `.env`
4. Deploy

### Frontend & Admin — [Vercel](https://vercel.com) / [Netlify](https://netlify.com)

```
Build Command:     npm run build
Publish Directory: dist
```

Set `VITE_BACKEND_URL` to your deployed backend URL.

---

## 🛠️ Troubleshooting

| Issue | Solution |
|---|---|
| MTN modal not opening | Check browser console; verify `showMTNModal` state; confirm `MTNPaymentModal` is imported |
| Payment success but no order | Check backend logs; verify `/api/order/mtn` endpoint; confirm `placeOrderMTN` is exported |
| SMTP errors | Verify credentials in `.env`; try port `2525`; confirm Brevo account is active |

---

## 📈 Roadmap

- [x] Core e-commerce functionality
- [x] MTN Mobile Money integration (Ghana)
- [x] Stripe card payments
- [x] Email notifications
- [ ] React Native mobile app
- [ ] Multi-currency support
- [ ] AI product recommendations
- [ ] SMS notifications (Arkesel / Twilio)
- [ ] Vendor marketplace support
- [ ] Advanced inventory automation

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add AmazingFeature"

# 4. Push to your branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements

- [MTN MoMo API Docs](https://momodeveloper.mtn.com)
- [Stripe API Docs](https://stripe.com/docs)
- [Nodemailer](https://nodemailer.com)
- [Framer Motion](https://www.framer.com/motion)
- [Brevo (formerly Sendinblue)](https://www.brevo.com)

---

## 📞 Support

| Channel | Link |
|---|---|
| MTN Ghana Commercial | mmcommercial.GH@mtn.com |
| MTN Developer Community | [momodevelopercommunity.mtn.com](https://momodevelopercommunity.mtn.com) |

---

<div align="center">

**Built with ❤️ using the MERN Stack · Ghana 🇬🇭**

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?style=for-the-badge&logo=github)](https://github.com/yourusername)

</div>
