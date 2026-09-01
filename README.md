# ⚡ MartPulse — Full-Stack Grocery Mart Discovery & Rating Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-martpulse.vercel.app-5B4DFF?style=for-the-badge&logo=vercel&logoColor=white)](https://martpulse.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Ujesh2104%2FMartPulse-0F172A?style=for-the-badge&logo=github)](https://github.com/Ujesh2104/MartPulse)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/Database-MySQL%20%7C%20Sequelize-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)

**MartPulse** is a full-stack, enterprise-grade mart discovery and rating platform built with **React 18 (Vite)** on the frontend, **Express.js (Node.js)** on the backend, and **MySQL** relational database with **Sequelize ORM**.

🔗 **Live Production URL:** **[https://martpulse.vercel.app](https://martpulse.vercel.app)**  
📁 **GitHub Repository:** **[https://github.com/Ujesh2104/MartPulse](https://github.com/Ujesh2104/MartPulse)**

---

## 💎 Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM, IntersectionObserver Animations |
| **Backend** | Node.js, Express.js REST API, JWT Authentication, bcryptjs, Sequelize ORM, mysql2 |
| **Database** | MySQL Server 8.x (`martpulse_db`) with relational foreign keys and cascading integrity |
| **Design System** | Modern Lavender-White Theme (`#F4F5FA`), Electric Indigo (`#5B4DFF`), Plus Jakarta Sans & Outfit |
| **Cloud Deployment** | Vercel (Frontend SPA with continuous GitHub CI/CD) |

---

## 🌟 Role-Based Portals & Key Features

### 👑 1. System Administrator Console (`/admin/dashboard`)
- **Live Metrics Dashboard:** Real-time summary cards displaying Total Registered Users, Total Stores, and Total Submitted Ratings.
- **Add Store Modal:** Register new stores into the catalog with direct Store Owner name typing and auto-datalist matching.
- **Add User Modal:** Provision new accounts directly with specific roles (**`ADMIN`**, **`STORE_OWNER`**, or **`NORMAL_USER`**).
- **Stores Management Table:** Instant search by name, email, or address; multi-column sorting (Name, Email, Address, Rating).
- **User Governance Table:** Search by name/email; filter by Role; view store owner average star ratings (e.g. `★ 4.8`) and store names directly in the user row.

### 🛒 2. Store Owner Management Console (`/owner/dashboard`)
- **Store Performance Overview:** Prominent Average Rating Score card and real-time community rating benchmark.
- **Star Distribution Breakdown:** Granular visual progress bars breaking down 5-star, 4-star, 3-star, 2-star, and 1-star ratings.
- **Customer Feedback Stream:** Live chronological list of authenticated shoppers who reviewed the store, including reviewer name, rating stars, written comments, and submission date.

### 🛍️ 3. Shopper Community Hub (`/user/dashboard`)
- **Explore & Search Marts:** Interactive category pill bar (`Gourmet & Hypermarket`, `Organic & Artisan`, `Premium Supermarket`, `Wine & Specialty`, `Departmental`).
- **Sidebar Filter Matrix:** Real-time search by mart name or address, 1★ to 5★ star rating checklist filter, and custom sort order.
- **1–5 Star Rating System:** Submit a new rating or modify an existing rating. The platform automatically recalculates the store's overall average score in real-time.

---

## 🔑 Quick Demo Login Credentials

On the login page ([https://martpulse.vercel.app/login](https://martpulse.vercel.app/login)), you can click the **1-Click Autofill Demo Buttons** or enter the credentials below:

| Role | Name | Email | Password | Direct Dashboard Link |
| :--- | :--- | :--- | :--- | :--- |
| **👑 System Admin** | `Ujesh Mishra (System Administrator)` | `admin@martpulse.com` | `Admin@12345` | **[Admin Console](https://martpulse.vercel.app/admin/dashboard)** |
| **🛒 Store Owner** | `Rajesh Sharma (Verified Store Owner)` | `owner@martpulse.com` | `Owner@12345` | **[Owner Console](https://martpulse.vercel.app/owner/dashboard)** |
| **🛍️ Normal User** | `Rohan Verma (Verified Shopper)` | `user@martpulse.com` | `User@12345` | **[Shopper Hub](https://martpulse.vercel.app/user/dashboard)** |

---

## 🛡️ Form Validations & Security Standards

Strict client-side and server-side validation rules are enforced:

| Field | Validation Rule |
| :--- | :--- |
| **Full Name** | Minimum 20 characters, Maximum 60 characters *(with real-time counter)* |
| **Address** | Maximum 400 characters *(with real-time counter)* |
| **Password** | 8–16 characters, must include at least 1 uppercase letter and 1 special character |
| **Email** | Standard RFC-compliant email regex |
| **Rating** | Integer value between 1 and 5 stars |
| **Security** | Passwords hashed with `bcryptjs` (salt factor 10), JWT Bearer token authentication |

---

## 📡 REST API Specification

```
POST /api/auth/login            --> Authenticate user & issue 7-day JWT token
POST /api/auth/register         --> Public user registration (auto-assigns ADMIN to 1st user if empty, else NORMAL_USER)
POST /api/auth/change-password  --> Update password for authenticated user
GET  /api/auth/profile          --> Retrieve profile of authenticated user

GET  /api/stores                --> Fetch stores list (with search, category filter, sorting)
POST /api/stores                --> Create a new store (Admin & Store Owner)

POST /api/ratings               --> Submit or update 1-5 star store rating
PUT  /api/ratings/:ratingId     --> Modify existing rating
GET  /api/ratings/my-ratings    --> Get current user's submitted ratings

GET  /api/admin/stats           --> Get platform statistics (Total Users, Stores, Ratings)
GET  /api/admin/users           --> Get searchable, sortable list of all registered users
POST /api/admin/users           --> Create user with specified role (ADMIN / STORE_OWNER / NORMAL_USER)

GET  /api/owner/dashboard       --> Get store metrics, average rating & customer reviews stream
```

---

## 🚀 Running Locally

### 1. Database Configuration (MySQL)
Ensure MySQL is running on port `3306`:
```sql
CREATE DATABASE IF NOT EXISTS martpulse_db;
```

Configure `Backend/.env`:
```env
PORT=5000
JWT_SECRET=martpulse_super_secret_jwt_key_2025
DB_HOST=localhost
DB_PORT=3306
DB_NAME=martpulse_db
DB_USER=root
DB_PASSWORD="your_mysql_password"
```

---

### 2. Start Backend API Server
```bash
cd Backend
npm install
node index.js
```
*Backend runs on: `http://localhost:5000`*  
*Health check: `http://localhost:5000/api/health`*

---

### 3. Start Frontend Development Server
```bash
cd Frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🧪 Automated Integration Tests

To run the complete automated integration test suite against the live MySQL database:

```bash
cd Backend
node test_integration.js
```

---

## 📄 License
Distributed under the MIT License.
