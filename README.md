# ⚡ MartPulse — Full-Stack Mart Discovery & Rating Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-martpulse.vercel.app-F59E0B?style=for-the-badge&logo=vercel&logoColor=white)](https://martpulse.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Ujesh2104%2FMartPulse-18181B?style=for-the-badge&logo=github)](https://github.com/Ujesh2104/MartPulse)

**MartPulse** is a full-stack mart discovery and rating web application engineered with **React.js (Vite)** on the frontend, **Express.js (Node.js)** on the backend, and a **MySQL** relational database with **Sequelize ORM**.

🔗 **Live Deployment:** **[https://martpulse.vercel.app](https://martpulse.vercel.app)**  
📁 **GitHub Repository:** **[https://github.com/Ujesh2104/MartPulse](https://github.com/Ujesh2104/MartPulse)**

---

## 💎 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js 18 (Vite), Tailwind CSS, Lucide Icons, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, JWT Authentication, bcryptjs, Sequelize ORM, mysql2 |
| **Database** | MySQL Server 8.x (`martpulse_db`) |
| **Design Theme** | Obsidian Luxury & Amber Gold (`#09090B`, `#F59E0B`) |
| **Deployment** | Vercel (Frontend SPA) & Render / Railway (Backend) |

---

## 🌟 Key Features & Role-Based Workflows

### 👑 1. System Administrator (`/admin/dashboard`)
- **Real-Time Analytics:** Live stat cards displaying Total Users, Total Stores, and Total Submitted Ratings.
- **Add Store Modal:** Register new stores into the catalog with category, address, and owner mapping.
- **Add User Modal:** Provision new accounts directly with specific roles (**Admin**, **Store Owner**, or **Normal User**).
- **Interactive Stores Table:** Search by Name, Address, and Email; Sort ascending/descending on Name, Email, Address, and Rating.
- **Interactive Users Table:** Search and filter by Role (Admin, Store Owner, Normal User).
  - *Store Owner Integration:* If a user is a Store Owner, their store's average star rating (e.g. `★ 4.8`) and store name are automatically displayed alongside their profile.
- **Change Password & Logout:** Account management from dashboard header and navigation menu.

### 🛒 2. Store Owner / Retailer (`/owner/dashboard`)
- **Store Performance Overview:** Prominent Average Rating Score card and ranking benchmark.
- **Star Distribution Chart:** Granular breakdown of customer ratings (5-star, 4-star, 3-star, 2-star, 1-star).
- **Customer Reviews Table:** Live chronological list of users who submitted reviews for their store, including user name, email, rating, written feedback, and submission date.
- **Password Management:** Update account credentials after logging in.

### 🛍️ 3. Normal User / Shopper (`/user/dashboard`)
- **Explore & Search Marts:** Filter registered stores by Name, Address, and category pills (Gourmet, Organic, Supermarket, Specialty).
- **Store Details & Ratings:** View store details, overall platform rating, total review count, and the user's own submitted rating.
- **1–5 Star Rating Modal:** Submit a new rating or modify an existing rating. The platform automatically recalculates the store's overall average rating in real-time.
- **Password Management:** Update security credentials securely.

---

## 🛡️ Strict Form Validations

Both client-side (real-time feedback) and server-side validation rules are strictly enforced:

| Field | Validation Rule |
| :--- | :--- |
| **Full Name** | Minimum 20 characters, Maximum 60 characters *(with live character counter)* |
| **Address** | Maximum 400 characters *(with live character counter)* |
| **Password** | 8–16 characters, must include at least 1 uppercase letter and 1 special character |
| **Email** | Standard RFC compliant email regex |
| **Rating** | Integer value between 1 and 5 stars |

---

## ⚡ Quick Demo Logins

On the login page ([https://martpulse.vercel.app/login](https://martpulse.vercel.app/login)), you can use the **1-Click Quick Demo Sign In** buttons or enter the credentials below:

| Role | Email | Password | Live Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@martpulse.com` | `Admin@12345` | [https://martpulse.vercel.app/admin/dashboard](https://martpulse.vercel.app/admin/dashboard) |
| **Store Owner** | `owner@martpulse.com` | `Owner@12345` | [https://martpulse.vercel.app/owner/dashboard](https://martpulse.vercel.app/owner/dashboard) |
| **Normal User** | `user@martpulse.com` | `User@12345` | [https://martpulse.vercel.app/user/dashboard](https://martpulse.vercel.app/user/dashboard) |

---

## 🚀 Running the Project Locally

### 1. Database Setup (MySQL)
Make sure MySQL is running on port `3306`.
```sql
CREATE DATABASE IF NOT EXISTS martpulse_db;
```

Configure your credentials in `Backend/.env`:
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

### 2. Start Backend Server
```bash
cd Backend
npm install
npm start
```
*Backend API runs on: [http://localhost:5000](http://localhost:5000)*  
*Health check endpoint: [http://localhost:5000/api/health](http://localhost:5000/api/health)*

---

### 3. Start Frontend App
```bash
cd Frontend
npm install
npm run dev
```
*Frontend runs on: [http://localhost:3000](http://localhost:3000)*

---

## 📡 REST API Documentation

```
POST /api/auth/login            --> Authenticate user & issue JWT token
POST /api/auth/register         --> Normal user registration with strict validation
POST /api/auth/change-password  --> Change password (requires auth)
GET  /api/auth/profile          --> Get authenticated user profile

GET  /api/stores                --> Get all stores (search, sort, filter)
POST /api/stores                --> Create a new store (Admin & Store Owner)

POST /api/ratings               --> Submit or update 1-5 star store rating
PUT  /api/ratings/:ratingId     --> Update existing rating
GET  /api/ratings/my-ratings    --> Get current user's submitted ratings

GET  /api/admin/stats           --> Get platform statistics (Users, Stores, Ratings)
GET  /api/admin/users           --> Get searchable, sortable list of users
POST /api/admin/users           --> Create user with specified role (Admin/Owner/User)

GET  /api/owner/dashboard       --> Get store metrics, average rating & customer reviews
```

---

## 🧪 Automated Integration Testing

To run the complete automated end-to-end integration test suite against the live MySQL database:

```bash
cd Backend
node test_integration.js
```

---

## 📄 License
MIT License. Developed for the FullStack Coding Challenge.
