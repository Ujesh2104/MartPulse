# MartPulse — Frontend Web Application

**MartPulse** is a luxury mart rating and discovery platform engineered with React.js (Vite), Tailwind CSS, and Axios. Designed with an **Obsidian Luxury & Amber Gold** visual theme and API-first architecture ready to interface with an Express.js backend.

---

## 💎 Design System & Palette
- **Hero & Header**: Matte Obsidian Charcoal (`#18181B`, `#09090B`)
- **Primary Buttons & Accents**: Warm Amber Gold (`#F59E0B`, `#D97706`)
- **Canvas / Background**: Soft Pearl White (`#FAFAFA`, `#F4F4F5`)
- **Rating Stars**: Luminous Amber Gold (`#F59E0B`)
- **Typography**: Google Fonts *"Playfair Display"* (Headings) + *"Plus Jakarta Sans"* (UI Body)

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## ⚡ Role-Based Quick Demo Logins
On the `/login` page, you can use the one-click demo credentials:
1. **Admin**: `admin@martpulse.com` / `Admin@12345` -> `/admin/dashboard`
2. **Store Owner**: `owner@martpulse.com` / `Owner@12345` -> `/owner/dashboard`
3. **Normal User**: `user@martpulse.com` / `User@12345` -> `/user/dashboard`

---

## 🛡️ Form Validations
- **Full Name**: 20–60 characters (live character counter).
- **Address**: Max 400 characters (live character counter).
- **Password**: 8–16 characters with at least 1 uppercase and 1 special character.
- **Email**: Standard RFC email format.
- **Rating**: Integer 1 to 5 stars.
