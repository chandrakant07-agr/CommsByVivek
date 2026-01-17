# 🎬 Professional Filmmaker Portfolio & Client Management System

A full-stack MERN application designed for professional filmmakers to showcase their portfolio, manage client communications, and collect authentic client testimonials through a unique **Token-Based Rating System**. This platform combines stunning visual presentation with powerful backend management capabilities.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-2ea44f?style=for-the-badge)](https://preview-commsbyvivek.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/chandrakant07-agr/CommsByVivek)

</div>

---

## 📑 Table of Contents

- [🌐 Live Demo](#-live-demo)
- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔐 Environment Variables](#-environment-variables)
- [📸 Screenshots](#-screenshots)
- [🎯 Unique Selling Point](#-unique-selling-point)
- [🤝 Acknowledgements](#-acknowledgements)
- [📄 License](#-license)

---

## 🌐 Live Demo

**Experience the application live:** [https://preview-commsbyvivek.netlify.app/](https://preview-commsbyvivek.netlify.app/)

### Quick Links
- 🏠 **Homepage**: Explore the filmmaker's portfolio and hero banner
- 🎬 **Portfolio**: Browse projects with infinite scroll and category filters
- 💬 **Testimonials**: View approved client reviews and ratings
- 📞 **Contact**: Send messages through the contact form
- 🔐 **Admin Panel**: `/admin` (Demo credentials available on request)

> **Note**: This is a preview deployment. Some features may have limited functionality for security reasons.

---

## ✨ Key Features

### 🎨 Frontend Features
- **Dynamic Portfolio Showcase** - Infinite scroll gallery with category-based filtering
- **Responsive Design** - Mobile-first approach with smooth animations using Framer Motion
- **Interactive UI Components** - Custom star ratings, modals, and rich text editor integration
- **Client Rating Portal** - Secure token-based system for clients to submit feedback without login
- **Real-time Notifications** - Toast notifications for user actions and feedback
- **Advanced Routing** - Hash-link navigation and protected routes for admin sections
- **Dark/Light Theme Support** - Theme toggle with Redux state management

### 🛡️ Backend Features
- **JWT Authentication** - Access & refresh token rotation for enhanced security
- **Role-Based Access Control** - Protected admin routes with middleware authentication
- **RESTful API Architecture** - Well-structured endpoints with versioning (v1)
- **Media Management** - Cloudinary integration for optimized video and image delivery
- **Token-Based Rating System** - Cryptographically secure one-time-use rating links
- **Advanced Query Capabilities** - Search, filter, sort, and pagination across all resources
- **Input Sanitization** - Protection against XSS attacks using sanitize-html
- **Error Handling** - Centralized error handling middleware with custom API responses
- **Database Seeding** - Quick setup with pre-populated sample data

### 📊 Admin Dashboard
- **Analytics Dashboard** - Real-time statistics and data visualization with CountUp animations
- **Full CRUD Operations** - Complete management of projects, ratings, messages, and content
- **Gallery Management** - Upload, edit, and organize portfolio items with category support
- **Review Management** - Approve/reject client testimonials before public display
- **Message Center** - View and manage client inquiries from contact form
- **Hero Banner Control** - Dynamic homepage banner management
- **Contact Details** - Update social media links and contact information
- **Backup & Restore** - Database backup functionality for data security

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Redux Toolkit (RTK Query), React Router v7, Framer Motion, PrimeReact, Quill Editor |
| **Backend** | Node.js, Express.js 5, Mongoose, JWT, Bcrypt, Multer |
| **Database** | MongoDB (NoSQL) |
| **Cloud Services** | Cloudinary (Media Storage & Optimization) |
| **Build Tools** | Vite, ESLint, Prettier |
| **Authentication** | JSON Web Tokens (Access & Refresh Token Rotation) |
| **UI Libraries** | React Icons, React Toastify, React Select, React Hook Form |

---

## 🚢 Deployment Readiness

- CORS configured for multi-origin environments
- Cookie-based authentication for secure sessions
- Environment-based configuration (dev / prod)
- Optimised build setup using Vite

---

## 📁 Project Structure

```
CommsByVivek/
│
├── client/                             # React Frontend Application
│   ├── utils/                          # Utility functions
│   │   └── cloudinaryUtils.js
|   |
│   ├── public/                         # Static assets
│   │   ├── assets/                     # Icons and logos
│   │   └── _redirects                  # Netlify/Vercel redirects
│   │
│   ├── store/                          # Redux Store Configuration
│   │   ├── store.js
│   │   ├── api/                        # RTK Query API slices
│   │   │   ├── baseApiSlice.js
│   │   │   ├── galleryApiSlice.js
│   │   │   ├── ratingApiSlice.js
│   │   │   └── ...
│   │   └── slices/                     # Redux slices
│   │       ├── Auth.Slice.js
│   │       └── Theme.Slice.js
|   |
│   ├── src/
│   │   ├── admin/                      # Admin Panel Components
│   │   │   ├── components/             # Admin layout, persist login, protected routes
│   │   │   └── pages/                  # Dashboard, gallery, messages, reviews, etc.
│   │   │
│   │   ├── components/                 # Reusable UI Components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── styles/
│   │   │
│   │   ├── pages/                      # Public Pages
│   │   │   ├── Landing.Page.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── RateProject.jsx         # Token-based rating page
│   │   │   └── styles/
│   │   │
│   │   ├── constants/                  # Constants
│   │   │   └── socialPlatforms.jsx
│   │   │
│   │   ├── App.jsx                     # Main App component
│   │   └── main.jsx                    # Entry point
│   │
│   ├── config/                         # Environment configuration
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── server/                             # Express Backend Application
    ├── config/
    │   ├── db.connection.js            # MongoDB connection
    │   └── cookieConfig.js             # Cookie settings
    │
    ├── controllers/                    # Route Controllers
    │   ├── admin.controller.js
    │   ├── rating.controller.js        # Token-based rating logic
    │   ├── gallery.controller.js
    │   ├── message.controller.js
    │   └── ...
    │
    ├── models/                         # Mongoose Models
    │   ├── admin.model.js
    │   ├── rating.model.js          # Rating schema with token
    │   ├── gallery.model.js
    │   ├── category.model.js
    │   └── ...
    │
    ├── routers/                     # Express Routes
    │   ├── admin.routes.js
    │   ├── rating.routes.js
    │   ├── gallery.routes.js
    │   └── ...
    │
    ├── middlewares/                 # Custom Middlewares
    │   ├── auth.middleware.js       # JWT verification
    │   ├── globalErrorHandler.middleware.js
    │   └── multer.middleware.js     # File upload handling
    │
    ├── utils/                       # Utility Functions
    │   ├── asyncHandler.js          # Async error wrapper
    │   ├── cloudinary.js            # Cloudinary configuration
    │   ├── jwtUtils.js              # JWT generation & verification
    │   ├── responseHandler.js       # Standardized API responses
    │   └── sanitizeInputField.js    # XSS protection
    │
    ├── public/temp/                 # Temporary file uploads
    ├── index.js                     # Express server entry point
    ├── seeder.js                    # Database seeding script
    └── package.json
```

---

## 🏗️ Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite) - Port 5173                            │   │
│  │  ├─ Public Routes (Portfolio, Contact, Rating)           │   │
│  │  └─ Protected Admin Routes (Dashboard, Management)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓ ↑                                │
│                         HTTP/HTTPS + Cookies                    │
│                              ↓ ↑                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Redux Store (RTK Query)                                 │   │
│  │  ├─ API Slices (Caching, Auto-refetching)                │   │
│  │  ├─ Auth Slice (Token management)                        │   │
│  │  └─ Theme Slice                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                    REST API Calls (JSON)
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server - Port 5000                           │   │
│  │  ├─ CORS Middleware                                      │   │
│  │  ├─ Cookie Parser                                        │   │
│  │  ├─ Auth Middleware (JWT Verification)                   │   │
│  │  └─ Global Error Handler                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓ ↑                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  RESTful API Routes (/api/v1/*)                          │   │
│  │  ├─ /admin (Login, Profile, Dashboard)                   │   │
│  │  ├─ /gallery (CRUD Portfolio Items)                      │   │
│  │  ├─ /rating (Token Generation & Submission)              │   │
│  │  ├─ /message (Contact Form)                              │   │
│  │  └─ /cloudinary (Media Management)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓ ↑                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Business Logic (Controllers)                            │   │
│  │  ├─ Input Validation & Sanitization                      │   │
│  │  ├─ Token Generation (crypto.randomBytes)                │   │
│  │  ├─ Password Hashing (bcrypt)                            │   │
│  │  └─ File Upload Processing (Multer)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                      Mongoose ODM Queries
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB Database                                        │   │
│  │  ├─ admins (Credentials, Refresh Tokens)                 │   │
│  │  ├─ galleries (Portfolio Projects)                       │   │
│  │  ├─ ratings (Client Feedback with Tokens)                │   │
│  │  ├─ categories (Project Categories)                      │   │
│  │  ├─ messages (Contact Inquiries)                         │   │
│  │  └─ ... (Other collections)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Cloudinary CDN                                          │   │
│  │  ├─ Image Optimization & Transformation                  │   │
│  │  ├─ Video Streaming                                      │   │
│  │  └─ Asset Management                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architecture Highlights

#### **Authentication Flow**
1. Admin logs in with credentials
2. Server validates and generates **access token** (15m expiry) & **refresh token** (7d expiry)
3. Access token sent as JSON, refresh token stored in httpOnly cookie
4. On access token expiry, client automatically requests new token using refresh token
5. Refresh token rotation implemented for enhanced security

#### **Token-Based Rating System**
1. Admin generates a unique cryptographic token for a specific project
2. Token-embedded URL sent to client (e.g., `/rate/abc123xyz...`)
3. Client accesses the link without authentication
4. Client submits rating, testimonial, and details
5. Token marked as "submitted" (one-time use)
6. Admin approves/rejects before public display on Testimonials page

#### **State Management**
- **RTK Query** for server state (automatic caching, refetching, optimistic updates)
- **Redux Slices** for client state (auth tokens, theme preferences)
- **Persistent Login** using refresh tokens stored in cookies

#### **Media Handling**
- Files uploaded via Multer to local temp storage
- Server uploads to Cloudinary with transformations
- Frontend displays optimized URLs from Cloudinary CDN
- Deletion removes from both Cloudinary and database

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Cloudinary Account** (Free tier available)
- **Git**

### Step 1: Clone the Repository

You can clone this repository using **either HTTPS or SSH**, depending on your GitHub setup.

#### Option A: Clone using HTTPS

```bash
git clone https://github.com/chandrakant07-agr/CommsByVivek.git
```

#### Option B: Clone using SSH (Recommended for contributors)

Make sure your SSH key is added to your GitHub account.

```bash
git clone git@github.com:chandrakant07-agr/CommsByVivek.git
```

Navigate into the project directory.

```bash
cd CommsByVivek
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
# or
yarn install

# Create .env file (see Environment Variables section below)
touch .env

# Seed the database with sample data (optional)
npm run seed
# or
yarn seed

# Start development server
npm run dev
# or
yarn dev
```

The backend server will run on **http://localhost:5000**

### Step 3: Frontend Setup

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install
# or
yarn install

# Create .env file for client (see Environment Variables section)
touch .env

# Start development server
npm run dev
# or
yarn dev
```

The frontend application will run on **http://localhost:5173**

### Step 4: Access the Application

- **Public Site**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **API Documentation**: http://localhost:5000/api/v1

---

## 🔐 Environment Variables

### Backend (.env in /server)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/commsbyvivek
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/commsbyvivek

# CORS Origins (Frontend URLs)
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_ONE=http://localhost:5174   (optional)
CORS_ORIGIN_TWO=http://127.0.0.1:5173   (optional)

# JWT Secrets (use strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_here_min_32_chars
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_min_32_chars
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env in /client)

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Generating JWT Secrets

You can generate secure random strings using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📸 Screenshots

<div align="center">
    <img width="45%" alt="Image" src="https://github.com/user-attachments/assets/aa4a5ab7-23d9-440d-b09f-07b213096961" />
    <img width="45%" alt="Image" src="https://github.com/user-attachments/assets/4700bf7c-add8-4ddc-a6f4-c86b2b75bfa9" />
    <img width="45%" alt="Image" src="https://github.com/user-attachments/assets/ef108773-5af3-4cad-aa41-97fea8325b7d" />
    <img width="45%" alt="Image" src="https://github.com/user-attachments/assets/7b1d7eb8-2906-4f01-93bb-65b8dd5ad655" />
    <img width="45%" alt="Image" src="https://github.com/user-attachments/assets/ec000c0c-0331-40b7-ab0d-d7ab039f56df" />
</div>

---

## 🎯 Unique Selling Point

### Token-Based Rating System

Unlike traditional review systems that require user registration and login, this platform implements a **secure, one-time-use token system** that offers several advantages:

#### How It Works

```
Admin → Generates Token → Sends Link to Client → Client Submits Rating → Token Invalidated
```

#### Benefits

✅ **Frictionless UX** - Clients don't need to create accounts or remember passwords  
✅ **High Response Rate** - Single-click access increases completion rates  
✅ **Authenticity** - Each token is tied to a specific project, preventing spam  
✅ **Security** - Cryptographically secure tokens (crypto.randomBytes)  
✅ **One-Time Use** - Tokens automatically invalidated after submission  
✅ **Admin Control** - Manual approval prevents fake testimonials  

#### Technical Implementation

```javascript
// Token Generation (Server-side)
const token = crypto.randomBytes(32).toString("hex");
await Rating.create({ project: projectId, token });

// Public rating URL
const ratingURL = `${FRONTEND_URL}/rate/${token}`;

// Client accesses URL and submits feedback
// Token status changes: pending → submitted → approved
```

This approach perfectly suits the filmmaker use case where clients complete projects and want to provide quick feedback without technical barriers.

---

## 🤝 Acknowledgements

This project was built with the support of the incredible open-source community. Special thanks to:

- **React Team** - For the amazing React library and ecosystem
- **Vercel** - For Vite, the lightning-fast build tool
- **Redux Toolkit Team** - For simplifying state management
- **MongoDB Team** - For the flexible NoSQL database
- **Cloudinary** - For powerful media management APIs
- **PrimeReact** - For beautiful UI components
- **Express.js Contributors** - For the minimalist web framework
- **All NPM Package Maintainers** - For the tools that make modern web development possible

Developed as a custom solution for CommsByVivek

A heartfelt thank you to the open-source community for making projects like this achievable. 🙏

---

## 🧪 Production Considerations

- Access & refresh token rotation prevents long-lived token abuse
- httpOnly cookies protect refresh tokens from XSS attacks
- Centralised error handling ensures consistent API responses
- Input sanitisation prevents malicious script injection
- Cloudinary CDN reduces server load and improves media delivery
- Modular architecture supports future scalability (roles, payments, bookings)

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Developer

**Chandrakant Agrawal** - Full Stack MERN Developer

Feel free to explore the codebase, and if you have any questions or suggestions, please open an issue or reach out!
