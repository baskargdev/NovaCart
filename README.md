# NovaCart

NovaCart is a full-stack MERN e-commerce application designed to provide a modern, responsive, and user-friendly online shopping experience.

The project includes a customer-facing shopping application and a dedicated admin dashboard for managing products, orders, users, reviews, and other store operations.

## Features

### Customer Features

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

### Admin Features

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

## Tech Stack

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

## Project Structure

```text
NovaCart/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── pages/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md