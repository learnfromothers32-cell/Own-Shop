A production-ready full-stack e-commerce platform built with the MERN Stack (MongoDB, Express.js, React, Node.js) featuring MTN Mobile Money integration for Ghanaian businesses, Stripe card payments, and a comprehensive admin dashboard with real-time analytics.

📋 Table of Contents
Live Demo

Key Features

Payment Integrations

Tech Stack

Project Structure

Installation Guide

Environment Configuration

MTN MoMo Integration

API Documentation

Deployment

Troubleshooting

Roadmap

Contributing

License

Author

🌍 Live Demo
Environment	URL	Status
Frontend (Customer)	https://my-shop-1.vercel.app	🟢 Live
Admin Dashboard	https://own-shop-admin-1.vercel.app	🟢 Live
Backend API	https://own-shop-1.onrender.com	🟢 Live
API Health Check	https://own-shop-1.onrender.com/api/health	🟢 Operational
🎯 Key Features
🛍️ Customer Features
Feature	Description
User Authentication	Secure JWT-based registration and login
Product Browsing	Filter products by categories and search
Shopping Cart	Add/remove items, update quantities in real-time
Multiple Payment Methods	Stripe, MTN MoMo, Cash on Delivery
Order Management	View order history and real-time status tracking
Email Notifications	Order confirmations and newsletter subscriptions
Responsive Design	Mobile-first approach works on all devices
👑 Admin Features
Feature	Description
Real-time Dashboard	Live sales analytics with charts and metrics
Order Management	View, update status, and process orders
Product Management	Add, edit, delete products with image upload
User Management	View and manage registered customers
Notification System	Real-time alerts for new orders
Payment Analytics	Track MTN MoMo vs Stripe vs COD payments
Inventory Tracking	Monitor stock levels and low inventory alerts
💰 Payment Integrations
Payment Method	Description	Status
📱 MTN Mobile Money	Ghana GHS payments with sandbox testing	✅ Live
💳 Stripe	International card payments (Visa, Mastercard, Amex)	✅ Live
💵 Cash on Delivery	Local payment option for customers	✅ Live
📱 MTN MoMo Features
✅ Sandbox testing environment

✅ Production-ready configuration

✅ Automatic payment confirmation

✅ Real-time order updates

✅ USSD prompt on customer phone

✅ Payment verification callbacks

🧠 Tech Stack
Frontend
js
{
  "framework": "React 18",
  "buildTool": "Vite",
  "styling": "Tailwind CSS",
  "routing": "React Router v6",
  "httpClient": "Axios",
  "animations": "Framer Motion",
  "notifications": "React Toastify",
  "analytics": "React GA4"
}
Backend
js
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "MongoDB with Mongoose",
  "auth": "JWT Authentication",
  "email": "Nodemailer (Brevo/Sendinblue)",
  "payments": ["Stripe SDK", "MTN MoMo API"],
  "realtime": "Socket.io",
  "fileUpload": "Cloudinary"
}
📂 Project Structure
text
e-commerce/
│
├── backend/                          # Node.js/Express backend
│   ├── controllers/                   # Business logic
│   │   ├── orderControllers.js       # Order processing & payments
│   │   ├── adminController.js        # Admin analytics
│   │   └── userController.js         # Authentication
│   ├── routes/                        # API routes
│   │   ├── orderRoutes.js            # Order endpoints
│   │   ├── adminRoutes.js            # Admin endpoints
│   │   └── userRoute.js              # Auth endpoints
│   ├── models/                        # MongoDB schemas
│   │   ├── orderModel.js
│   │   ├── userModel.js
│   │   └── productModel.js
│   ├── utils/                         # Helper functions
│   │   ├── emailService.js            # Email notifications
│   │   └── mtnMomoService.js          # MTN API integration
│   ├── middleware/                     # Auth middleware
│   │   ├── auth.js                    # User authentication
│   │   └── adminAuth.js               # Admin authentication
│   └── server.js                       # Main entry point
│
├── frontend/                          # React customer frontend
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── MTNPaymentModal.jsx    # MoMo payment modal
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/                      # Main pages
│   │   │   ├── Home.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Product.jsx
│   │   ├── context/                     # State management
│   │   │   └── shopContext.jsx
│   │   └── App.jsx                       # Root component
│   └── index.html
│
└── Admin/                              # React admin dashboard
    ├── src/
    │   ├── components/
    │   │   ├── NotificationBell.jsx    # Real-time alerts
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx           # Analytics dashboard
    │   │   ├── Order.jsx               # Order management
    │   │   ├── OrderDetails.jsx        # Single order view
    │   │   ├── Add.jsx                 # Add products
    │   │   └── List.jsx                # Product list
    │   ├── context/
    │   │   └── NotificationContext.jsx # Notification state
    │   └── App.jsx
    └── index.html
🔧 Installation Guide
Prerequisites
✅ Node.js v14 or higher

✅ MongoDB (local or MongoDB Atlas)

✅ Stripe account

✅ MTN Developer Account

✅ Git

1️⃣ Clone Repository
bash
git clone https://github.com/learnfromothers32-cell/Own-Shop.git
cd Own-Shop
2️⃣ Install Backend Dependencies
bash
cd backend
npm install
3️⃣ Install Frontend Dependencies
bash
cd ../frontend
npm install
4️⃣ Install Admin Panel Dependencies
bash
cd ../Admin
npm install
5️⃣ Set Up MTN MoMo Credentials
bash
cd ../backend
node mtn-manual-setup.js
# This will generate your MTN_API_USER and MTN_API_KEY
⚙️ Environment Configuration
Backend .env (backend/.env)
env
# Server Configuration
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

# MTN MoMo
MTN_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_API_ENVIRONMENT=sandbox
MTN_COLLECTION_SUBSCRIPTION_KEY=your_subscription_key
MTN_CURRENCY=GHS
MTN_API_USER=your_api_user_uuid
MTN_API_KEY=your_api_key
Frontend .env (frontend/.env)
env
VITE_BACKEND_URL=http://localhost:4000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
Admin .env (Admin/.env)
env
VITE_BACKEND_URL=http://localhost:4000
📱 MTN MoMo Integration
Sandbox Testing Setup
Create MTN Developer Account: https://momodeveloper.mtn.com

Subscribe to Collections API

Get your Subscription Key from the dashboard

Generate API User & Key using the setup script:

bash
cd backend
node mtn-manual-setup.js
Test Phone Numbers
Phone Number	Expected Result	Use Case
0240000000	✅ Successful	Test successful payment flow
0240000001	⏳ Pending	Test payment pending state
0240000002	❌ Failed	Test payment failure handling
0240000003	⏱️ Delayed	Test timeout scenarios
Payment Flow Testing
Add items to cart

Proceed to checkout

Fill delivery information

Select "MTN Mobile Money"

Enter test phone number (e.g., 0240000000)

Click "Pay Now"

Verify order is created successfully

📡 API Documentation
Order Endpoints
Method	Endpoint	Description	Auth
POST	/api/order/place	Place COD order	✅ User
POST	/api/order/stripe	Initiate Stripe payment	✅ User
POST	/api/order/mtn	Process MTN MoMo payment	✅ User
POST	/api/order/verifyStripe	Verify Stripe payment	✅ User
GET	/api/order/userOrders	Get user's orders	✅ User
POST	/api/order/list	List all orders (admin)	✅ Admin
POST	/api/order/status	Update order status	✅ Admin
MTN MoMo Endpoints
Method	Endpoint	Description	Auth
POST	/api/mtn/pay	Initiate MTN payment	✅ User
GET	/api/mtn/status/:reference	Check payment status	✅ User
Admin Endpoints
Method	Endpoint	Description	Auth
GET	/api/admin/stats	Dashboard statistics	✅ Admin
GET	/api/admin/order/:orderId	Get single order	✅ Admin
POST	/api/admin/update-status	Update order status	✅ Admin
🚀 Deployment
Backend Deployment (Render)
Push code to GitHub

Connect repository to Render

Configure environment variables in Render dashboard

Deploy with automatic SSL

Frontend Deployment (Vercel)
Connect repository to Vercel

Configure build settings:

json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
Add environment variables in Vercel dashboard

Deploy automatically on push

Admin Panel Deployment (Vercel)
Follow same steps as frontend deployment

Ensure VITE_BACKEND_URL points to production backend

🔍 Troubleshooting
Common Issues & Solutions
Issue	Solution
MTN Modal not opening	Check browser console errors, verify showMTNModal state
Payment success but order not created	Check backend logs, verify /api/order/mtn endpoint
Admin notifications not working	Verify Socket.io connection, check browser console
SMTP connection errors	Verify email credentials, try port 2525 instead of 587
JWT expired error	Log in again, check JWT_EXPIRE in environment
CORS errors	Verify backend CORS settings include your frontend URL
🛣️ Roadmap
✅ Completed
Basic e-commerce functionality

MTN MoMo integration

Stripe payments

Cash on Delivery

Admin dashboard with analytics

Email notifications

Real-time admin alerts

Product management

Order tracking

🚧 In Progress
Mobile app (React Native)

Multi-currency support

SMS notifications

Inventory automation

📅 Planned
AI product recommendations

Vendor marketplace support

Advanced analytics with predictive insights

WhatsApp business integration

🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository

Create a feature branch:

bash
git checkout -b feature/amazing-feature
Commit your changes:

bash
git commit -m 'Add some amazing feature'
Push to the branch:

bash
git push origin feature/amazing-feature
Open a Pull Request

📄 License
This project is MIT Licensed - see the LICENSE file for details.

👨‍💻 Author
Kelvin Asante

🏠 Location: Ghana 🇬🇭

💼 Role: Full-Stack MERN Developer

🎯 Expertise: E-commerce, Payment Integrations, Real-time Applications

📧 Email: learnfromothers32@gmail.com

🐙 GitHub: @learnfromothers32-cell

Connect With Me
💼 LinkedIn: Kelvin Asante

🐦 Twitter: @yourhandle

🌐 Portfolio: yourportfolio.com

🙏 Acknowledgements
MTN MoMo API Documentation

Stripe API

Nodemailer

Framer Motion

Tailwind CSS
