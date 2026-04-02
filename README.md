# 🚀 TaskFlow Pro
### **World-Class Productivity & Real-time Orchestration**

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

TaskFlow Pro is an enterprise-grade productivity engine designed for high-velocity teams and individuals. It combines a **premium, glassmorphic UI** with a powerful **Real-time Sync Engine** to ensure your workspace is always alive and perfectly synchronized across every device.

---

## ✨ Experience the "Next-Level"

### 🛡️ **Enterprise Architecture**
Built on **SOLID principles** and **Clean Architecture**. The backend is modular, using dependency injection for services and repositories, ensuring maximum testability and scalability.

### ⚡ **The Sync Engine**
Powered by **WebSockets (Socket.io)**. Experience instant updates. Create a task on your phone, and watch it glide onto your desktop dashboard in milliseconds without a single refresh.

### 📊 **Visual Powerhouse**
Switch between three professional perspectives:
*   **Dynamic List:** Focused execution with visual progress rings.
*   **Kanban Board:** High-end drag-and-drop orchestration using `@dnd-kit`.
*   **Calendar View:** Minimalist scheduling with `react-day-picker`.

### 📈 **Data Scientist Mode**
Beautiful, responsive analytics powered by **Recharts**. Track your 14-day completion trends with interactive gradients and custom-styled tooltips.

---

## 🛠️ Technical Arsenal

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express, Passport.js (Google OAuth) |
| **Database** | PostgreSQL |
| **Real-time** | Socket.io (WebSockets) |
| **Testing** | Vitest (Unit), Playwright (E2E) |
| **Docs** | Swagger (OpenAPI 3.0) |

---

## 🚀 Quick Start

### 1. Prerequisites
*   **Node.js** (v18+)
*   **PostgreSQL** (Local or via Docker)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yahyaegz/TaskFlow.git

# Enter the project
cd TaskFlow

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/taskflow
JWT_SECRET=your_premium_secret
CORS_ORIGIN=http://localhost:5173

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
```

### 4. Database Migrations
```bash
npm run migrate
```

### 5. Run the Engine
```bash
# Start both Frontend & Backend concurrently
npm run dev
```

---

## 🧪 Testing & Quality
Ensure the platform remains robust with our automated suites:
*   **Unit Tests:** `npm run test:unit` (Vitest)
*   **E2E Tests:** `npm run test:e2e` (Playwright)
*   **API Docs:** Visit `http://localhost:4000/api/docs`

---

## 🌍 Internationalization
TaskFlow Pro speaks your language. Fully localized in:
🇺🇸 **English** | 🇪🇸 **Español** | 🇫🇷 **Français** | 🇩🇪 **Deutsch**

---

Designed with ❤️ for the modern professional.
