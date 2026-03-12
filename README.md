🛒 Complete E-commerce Platform for Phone Accessories Shop

A full-stack e-commerce solution built with the MERN Stack (MongoDB, Express.js, React, Node.js) featuring MTN Mobile Money integration, Stripe payments, and a comprehensive admin dashboard.

✨ Features
🛍️ Customer Features

User Authentication – Register/Login using JWT

Product Browsing – Browse products by categories

Shopping Cart – Add/remove items and update quantities

Multiple Payment Methods

💳 Stripe – Card payments

📱 MTN Mobile Money – Direct MoMo payments

💵 Cash on Delivery – Pay when you receive

Order Management – View order history and status

Email Notifications – Order confirmations and newsletters

👑 Admin Features

Dashboard – Overview of sales, orders, and users

Product Management – Add, edit, and delete products

Order Management – View and update order status

User Management – View registered users

Analytics – Sales reports and insights

💰 Payment Integrations
📱 MTN Mobile Money (Ghana – GHS)

Sandbox testing environment

Production-ready configuration

Automatic payment confirmation

Real-time order updates

💳 Stripe

Supports international card payments

💵 Cash on Delivery

Local payment option for customers

🚀 Tech Stack
Frontend

React 18 (Vite)

Framer Motion – animations

React Router v6

Axios – API calls

React Toastify – notifications

Tailwind CSS – styling

Backend

Node.js

Express.js

MongoDB with Mongoose

JWT Authentication

Nodemailer – email services

Stripe SDK

MTN MoMo API via mtnapimomo

📋 Prerequisites

Before running the project ensure you have:

Node.js v14 or higher

MongoDB (local or MongoDB Atlas)

Stripe account

MTN Developer Account (for MoMo payments)

Git

🔧 Installation
1️⃣ Clone the Repository
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
2️⃣ Install Backend Dependencies
cd backend
npm install
3️⃣ Install Frontend Dependencies
cd ../frontend
npm install
4️⃣ Install Admin Panel Dependencies
cd ../Admin
npm install
⚙️ Environment Configuration
Backend .env

Create a file:

backend/.env
# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Configuration (Brevo / Sendinblue)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourstore.com
ADMIN_EMAIL=your_email@gmail.com

# MTN MoMo Configuration
MTN_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_API_ENVIRONMENT=sandbox
MTN_COLLECTION_SUBSCRIPTION_KEY=your_subscription_key
MTN_CURRENCY=GHS
MTN_API_USER=your_api_user
MTN_API_KEY=your_api_key
Frontend .env

Create:

frontend/.env
VITE_BACKEND_URL=http://localhost:4000
🚀 Running the Application
Start Backend
cd backend
npm run dev

Server runs on:

http://localhost:4000
Start Frontend
cd frontend
npm run dev

Frontend runs on:

http://localhost:5173
Start Admin Panel
cd Admin
npm run dev

Admin dashboard runs on:

http://localhost:5174
📱 MTN MoMo Integration Guide
Sandbox Testing

Create an account at
https://momodeveloper.mtn.com

Subscribe to Collections API

Get your Subscription Key

Generate API User & API Key

cd backend
node mtn-manual-setup.js

Update your .env file with generated credentials.

Test Numbers
Phone Number	Result
0240000000	✅ Successful payment
0240000001	⏳ Payment pending
0240000002	❌ Payment failed
Any other	✅ Immediate success
Testing Flow

Add items to cart

Proceed to checkout

Fill delivery information

Select MTN Mobile Money

Enter phone number

Click Pay Now

Order should be created successfully.

📁 Project Structure
e-commerce
│
├── backend
│   ├── controllers
│   │   └── orderControllers.js
│   ├── models
│   ├── routes
│   │   └── orderRoutes.js
│   ├── utils
│   │   ├── emailService.js
│   │   └── mtnMomoService.js
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── MTNPaymentModal.jsx
│   │   ├── pages
│   │   │   └── PlaceOrder.jsx
│   │   └── context
│   └── index.html
│
└── Admin
🧪 Testing MTN Payments

Test using sandbox numbers and verify payment status using:

GET /api/mtn/status/:ref
🛠️ Troubleshooting
MTN Modal Not Opening

Check browser console errors

Verify showMTNModal state

Ensure MTNPaymentModal is imported

Payment Success but Order Not Created

Check backend logs

Verify /api/order/mtn endpoint

Confirm placeOrderMTN function is exported

SMTP Errors

Verify email credentials in .env

Try port 2525 instead of 587

Confirm Brevo account is active

📝 API Endpoints
Orders
POST /api/order/place
POST /api/order/stripe
POST /api/order/mtn
POST /api/order/verifyStripe
GET  /api/order/userOrders
MTN
POST /api/mtn/pay
GET  /api/mtn/status/:ref
🔒 Security Best Practices

Never commit .env files

Use environment variables for secrets

Validate user inputs

Implement rate limiting

Use HTTPS in production

Keep dependencies updated

🚀 Deployment
Backend (Render / Heroku)

Push code to GitHub

Connect repository

Add environment variables

Deploy

Frontend (Vercel / Netlify)
Build Command: npm run build
Publish Directory: dist
🤝 Contributing

Fork the repository

Create a feature branch

git checkout -b feature/AmazingFeature

Commit changes

git commit -m "Add AmazingFeature"

Push changes

git push origin feature/AmazingFeature

Open a Pull Request

📄 License

Licensed under the MIT License.

🙏 Acknowledgements

MTN MoMo API Documentation

Stripe API

Nodemailer

Framer Motion

📞 Support

MTN Ghana Email

mmcommercial.GH@mtn.com

Developer Community

https://momodevelopercommunity.mtn.com
🎯 Roadmap

Basic e-commerce functionality

MTN MoMo integration

Stripe payments

Email notifications

React Native mobile app

Multi-currency support

Advanced analytics dashboard

Inventory management

❤️ Built with the MERN Stack
