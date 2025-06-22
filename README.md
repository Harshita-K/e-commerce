# 🛒 Buy-Sell MERN Marketplace

A full-stack e-commerce marketplace built with the MERN stack, featuring modern UI/UX design with glassmorphism effects, secure authentication, and comprehensive product management.

## 🚀 Features

### 🔐 Authentication & User Management
- **User Registration** with password confirmation validation
- **Secure Login System** with JWT token authentication
- **Profile Management** with user information display
- **Protected Routes** ensuring secure access to features
- **Session Management** with automatic token expiration handling

### 🛍️ Product Management
- **Product Listing** with detailed information display
- **Advanced Search** functionality by product name
- **Category Filtering** with multi-select options
- **Product Details Modal** with comprehensive information
- **Image Display** with hover effects and scaling
- **Category Tags** displayed as separate styled blocks
- **Responsive Product Grid** with modern card design

### 🛒 Shopping Cart
- **Add to Cart** functionality with real-time updates
- **Cart Management** with item removal capabilities
- **Quantity Tracking** for each product
- **Visual Cart Status** showing added/ordered states
- **Cart Summary** with total calculations
- **Persistent Cart** across user sessions

### 📦 Order Management
- **Order Placement** with secure transaction processing
- **Order History** for buyers with detailed information
- **Order Status Tracking** with real-time updates
- **OTP Generation** for delivery verification
- **Order Fulfillment** system for sellers

### 🚚 Delivery System
- **Delivery Management** for sellers
- **OTP Verification** for secure delivery confirmation
- **Transaction Tracking** with unique IDs
- **Delivery Status Updates** in real-time
- **Buyer-Seller Communication** through order system

### 🎨 Modern UI/UX Design
- **Glassmorphism Effects** with backdrop blur and transparency
- **Gradient Backgrounds** with beautiful color schemes
- **Smooth Animations** and hover effects throughout
- **Responsive Design** optimized for all devices
- **Professional Typography** with consistent styling
- **Interactive Elements** with visual feedback
- **Loading States** with animated spinners
- **Error Handling** with beautiful error messages

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with advanced features
  - Glassmorphism effects
  - CSS Grid and Flexbox
  - Animations and transitions
  - Responsive design
  - Custom checkboxes and form elements

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcrypt** - Password hashing and encryption
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Development server with auto-restart
- **Concurrently** - Run multiple npm scripts simultaneously

## 📁 Project Structure

```
buy sell/
├── backend/
│   ├── controllers/
│   │   ├── usercontroller.js     # User authentication logic
│   │   ├── productcontroller.js  # Product management
│   │   └── ordercontroller.js    # Order processing
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── productModel.js       # Product schema
│   │   └── orderModel.js         # Order schema
│   ├── routes/
│   │   ├── userRoute.js          # Authentication routes
│   │   ├── productRoute.js       # Product routes
│   │   └── orderRoute.js         # Order routes
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   └── server.js                 # Express server configuration
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── navbar.jsx         # Navigation component
    │   ├── pages/
    │   │   ├── login.jsx          # Login page
    │   │   ├── signin.jsx         # Registration page
    │   │   ├── shop.jsx           # Product marketplace
    │   │   ├── SellItem.jsx       # Product listing form
    │   │   ├── myrpoduct.jsx      # Seller's products
    │   │   ├── cart.jsx           # Shopping cart
    │   │   ├── orders.jsx         # Order history
    │   │   └── delivery.jsx       # Delivery management
    │   └── styles/
    │       ├── login.css          # Login page styling
    │       ├── signin.css         # Registration styling
    │       ├── shop.css           # Marketplace styling
    │       ├── sellItem.css       # Product form styling
    │       ├── myrpoduct.css      # Product management styling
    │       ├── cart.css           # Cart styling
    │       ├── orders.css         # Order styling
    │       └── navbar.css         # Navigation styling
    └── public/
```

## 🎯 Key Functionalities

### For Buyers
1. **Browse Products** with advanced search and filtering
2. **View Product Details** in interactive modals
3. **Add Items to Cart** with real-time updates
4. **Place Orders** with secure processing
5. **Track Order Status** with detailed history
6. **Receive OTP** for delivery verification

### For Sellers
1. **List Products** with comprehensive details
2. **Manage Inventory** with edit/delete capabilities
3. **Process Orders** with status updates
4. **Generate Delivery OTP** for verification
5. **Track Sales** with order management
6. **Update Product Information** dynamically

### Admin Features
- **User Management** through authentication system
- **Product Moderation** with CRUD operations
- **Order Processing** with status tracking
- **Secure Data Handling** with encryption

## 🔒 Security Features

- **Password Encryption** using bcrypt
- **JWT Token Authentication** with expiration
- **Protected API Routes** with middleware
- **Input Validation** on frontend and backend
- **CORS Configuration** for secure requests
- **Environment Variables** for sensitive data
- **OTP Verification** for delivery confirmation

## 📱 Responsive Design

- **Mobile-First Approach** with responsive breakpoints
- **Touch-Friendly Interface** for mobile devices
- **Adaptive Layouts** for tablets and desktops
- **Optimized Images** with proper scaling
- **Cross-Browser Compatibility** testing

## 🎨 Design Highlights

- **Modern Glassmorphism** with backdrop filters
- **Beautiful Gradients** throughout the application
- **Smooth Animations** for enhanced user experience
- **Professional Typography** with consistent hierarchy
- **Interactive Elements** with hover and focus states
- **Loading States** with animated feedback
- **Error Handling** with user-friendly messages

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "buy sell"
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/buysell
JWT_SECRET=your_jwt_secret_key
PORT=8080
```

5. **Start the application**
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm start
```

## 📧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Products
- `GET /api/products/shop` - Get all products
- `POST /api/products/add` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart & Orders
- `POST /api/products/addtocart` - Add to cart
- `GET /api/products/cart` - Get cart items
- `POST /api/orders/buynow` - Place order
- `GET /api/orders/myorders` - Get user orders

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request


## 👨‍💻 Author

**Harshita Kumari** - Full Stack Developer

---

*Built with ❤️ using the MERN stack*