# MartPulse — Full-Stack Mart Discovery & Rating Platform

**MartPulse** is a luxury mart rating and discovery web application built with a modern, high-performance tech stack: **React.js (Vite)** on the frontend, **Express.js (Node.js)** on the backend, and a **MySQL** relational database with **Sequelize ORM**.

---

## 💎 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, React Router DOM, Axios.
- **Backend:** Node.js, Express.js, JWT, bcryptjs, Sequelize ORM, mysql2.
- **Database:** MySQL (`martpulse_db`).

---

## 🚀 Quick Start Guide

### 1. Database Setup (MySQL)
Ensure your MySQL service is running on port `3306`.
Create the database:
```sql
CREATE DATABASE martpulse_db;
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

### 2. Backend Installation & Start
```bash
cd Backend
npm install
npm start
```
*Backend runs on: [http://localhost:5000](http://localhost:5000)*

---

### 3. Frontend Installation & Start
```bash
cd Frontend
npm install
npm run dev
```
*Frontend runs on: [http://localhost:3000](http://localhost:3000)*

---

## ⚡ Role-Based Demo Credentials

On the login page (`/login`), you can use 1-click demo login buttons or sign in with:

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@martpulse.com` | `Admin@12345` | `/admin/dashboard` |
| **Store Owner / Retailer** | `owner@martpulse.com` | `Owner@12345` | `/owner/dashboard` |
| **Normal User / Shopper** | `user@martpulse.com` | `User@12345` | `/user/dashboard` |

---

## 🛡️ Form Validations
- **Full Name:** 20–60 characters (live character counter).
- **Address:** Max 400 characters (live character counter).
- **Password:** 8–16 characters with at least 1 uppercase and 1 special character.
- **Email:** Standard RFC email validation.
- **Ratings:** Integer values 1 to 5.
