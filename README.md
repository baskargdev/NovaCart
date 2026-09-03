# NovaCart

NovaCart is a full-stack MERN e-commerce application built to provide a modern, responsive, and user-friendly online shopping experience.

The application includes a customer-facing shopping platform and a dedicated admin dashboard for managing products, orders, users, reviews, contact messages, and store operations.

## 🌐 Live Demo

**Live Website:**  
https://nova-cart-ruby.vercel.app/

**GitHub Repository:**  
https://github.com/baskargdev/NovaCart

## ✨ Features

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Product browsing
- Product search
- Category-based browsing
- Product filtering
- Price range filtering
- Brand filtering
- Customer rating filtering
- Product sorting
- Product details
- Product reviews and ratings
- Shopping cart
- Wishlist
- Saved shipping address
- Checkout
- Cash on Delivery
- Razorpay payment integration
- Order placement
- Order history
- Order details
- Order cancellation
- User profile management
- Change password
- Responsive design for desktop and mobile

### 🛠️ Admin Features

- Admin authentication
- Admin dashboard
- Product management
- Add products
- Edit products
- Delete products
- Product image uploads
- Order management
- User management
- Customer review management
- Contact message management
- Store statistics and dashboard information

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Lucide React
- React Icons
- Swiper
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cloudinary
- Multer
- Razorpay

## ☁️ Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |
| Payment Gateway | Razorpay |

## 📁 Project Structure

```text
NovaCart/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── pages/
│   ├── .gitignore
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
└── README.md