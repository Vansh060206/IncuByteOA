# 🚗 AutoVault — Premium Car Dealership Fleet & Inventory Console

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2d3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)

[![CI/CD Pipelines](https://img.shields.io/badge/GitHub_Actions-Passing-2088FF?style=for-the-badge&logo=github-actions)](https://github.com/Vansh060206/IncuByteOA/actions)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Frontend_Live-000000?style=for-the-badge&logo=vercel)](https://incu-byte-oa-frontend.vercel.app)
[![Render Deployment](https://img.shields.io/badge/Render-Backend_Live-46E3B7?style=for-the-badge&logo=render)](https://incubyteoa.onrender.com/api/v1)

AutoVault is a state-of-the-art, full-stack vehicle fleet management and sales ledger console. Designed for executive operations, it features a glassmorphic user interface, real-time inventory telemetry, customer checkouts, audit trails, and an administrative replenishing cockpit.

[Explore Live Frontend](https://incu-byte-oa-frontend.vercel.app) • [Explore Live Backend API Docs](https://incubyteoa.onrender.com/api/docs)

</div>

---

## 🏆 System Highlights
> [!IMPORTANT]
> **Production Ready**: Fully decoupled architecture separating the client SPA, Express serverless-ready APIs, and Supabase connection poolers.
> 
> **TDD Anchored**: Developed under strict Test-Driven Development (TDD) rules. Integrates 12 Jest test cases executing on every remote push.
> 
> **Next-Gen UI**: Designed with curated HSL dark mode colors, glassmorphic fields, custom asset telemetry stats, and interactive timeline logs.

---

## 🚀 Deployed Environments

| Target | Hosting Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | 🔗 [https://incu-byte-oa-frontend.vercel.app](https://incu-byte-oa-frontend.vercel.app) |
| **Backend REST API** | Render | 🔗 [https://incubyteoa.onrender.com/api/v1](https://incubyteoa.onrender.com/api/v1) |
| **Interactive API Documentation** | Swagger | 🔗 [https://incubyteoa.onrender.com/api/docs](https://incubyteoa.onrender.com/api/docs) |

---

## 📸 Interactive System Showcase

<table>
  <tr>
    <td width="50%" align="center">
      <h3>🔐 Registration Portal</h3>
      <img src="./docs/images/register.png" alt="Registration Portal" />
      <p><i>Features glassmorphic fields, auth validation, and premium branding side graphic.</i></p>
    </td>
    <td width="50%" align="center">
      <h3>🏠 Client Dashboard</h3>
      <img src="./docs/images/catalog.png" alt="Client Dashboard" />
      <p><i>Welcome hero banner with quick-search, spec badges, and showroom catalog grids.</i></p>
    </td>
  </tr>
</table>

### 💼 Executive Operations Cockpit
A control center showing real-time inventory metrics, total valuation assets ($232k), transaction ratios, and replenishment alerts.
![Admin Dashboard Showcase](./docs/images/admin.png)

### 📋 Fleet Inventory Administration
Enables administrators to adjust unit specs, update stock quantities, and remove vehicles with instant database synchronization.
![Admin Inventory Showcase](./docs/images/admin_inventory.png)

### 📊 Purchase Ledgers & Audit Logs
Cross-reference client checkouts, transaction status, operator keys, and checkout dates.
![Purchase Ledgers Showcase](./docs/images/purchase_ledgers.png)

### 🕒 System Activity Ledger
Audit timeline logging system database sync states, model creations, and purchases in chronological order.
![Activity Log Showcase](./docs/images/activity_timeline.png)

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph LR
    subgraph "Client Environment (Vercel)"
        A[React SPA / Tailwind CSS]
        B[React Query / Axios]
    end

    subgraph "API Environment (Render)"
        C[Express Controller Routing]
        D[JWT Authentication Middleware]
        E[Prisma ORM Client v7]
    end

    subgraph "Cloud Storage (Supabase)"
        F[(PostgreSQL Cluster)]
        G[(PgBouncer Connection Pooler)]
    end

    A -->|User Actions| B
    B -->|CORS Authorized HTTPS / JWT| C
    C -->|Authorization Guard| D
    D -->|Prisma Pg Adapter| E
    E -->|Port 6543| G
    G --> F
```

### Stack Details:
* **Frontend**: React (v19), TypeScript, Vite, Tailwind CSS, TanStack React Query, Axios, Lucide Icons, React Hook Form.
* **Backend**: Node.js, TypeScript, Express, Prisma ORM, `@prisma/adapter-pg` driver adapter.
* **Database**: PostgreSQL Hosted on Supabase (transaction pooling on port `6543`, direct queries on `5432`).
* **CI/CD & Testing**: Jest, Supertest, GitHub Actions.

---

## 💎 Features & Business Rules

1. **Role-Based Auth (JWT)**: Fully guarded admin routes. Standard `USER` accounts can view, search, and purchase vehicles. Only `ADMIN` accounts can create, edit, delete, and restock catalog units.
2. **Real-Time Stock Decrement**: Purchasing a vehicle automatically checks stock levels and decrements quantity by 1. If stock is 0, the operation is blocked to prevent overselling.
3. **Advanced Search Filters**: Allows client filtering by manufacturer, model, category, minimum price, or maximum price.
4. **Supply Chain Replenishment**: Express endpoint `/vehicles/:id/restock` allows admins to restock vehicle units, instantly logging actions on the timeline.
5. **Timeline Audits**: Chronological activity logs capturing system updates and fleet operations.

---

## 💻 Local Installation & Setup

Set up your local development environment with these simple commands:

### 1. Clone & Dependencies
```bash
git clone https://github.com/Vansh060206/IncuByteOA.git
cd IncuByteOA
npm install
```

### 2. Configure Local Environment
Create a `.env` file in the `backend/` directory:
```env
PORT=5005
NODE_ENV=development
DATABASE_URL="postgresql://postgres.bxrxmdshpvwtfistqggw:wMhMFM9wNaALAW3H@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.bxrxmdshpvwtfistqggw:wMhMFM9wNaALAW3H@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="autovault-secure-jwt-secret-string-2026"
JWT_EXPIRES_IN="7d"
```

### 3. Generate Database Client & Launch
```bash
# Generate type definitions
npx prisma generate --workspace=backend

# Start concurrent servers
npm run dev
```
* **Frontend Console**: `http://localhost:5180`
* **Swagger API Docs**: `http://localhost:5005/api/docs`

---

## 🧪 Automated Testing & CI/CD Pipelines

To guarantee software quality, AutoVault is backed by integration tests verifying database actions, authentication scopes, and CORS parameters.

Run the test suite locally:
```bash
npm run test:backend
```

### 100% Passing Test Suites Output:
```text
PASS tests/integration/health.test.ts
  GET /api/v1/health
    √ should return 200 and healthy status when DB is reachable (58 ms)
    √ should return 500 when database connection fails (9 ms)

PASS tests/integration/vehicle.test.ts
  Vehicle and Inventory Integration Tests
    GET /api/v1/vehicles
      √ should return 401 Unauthorized when request is unauthenticated (56 ms)
      √ should return paginated list of vehicles when authenticated (11 ms)
    POST /api/v1/vehicles
      √ should allow ADMIN to create a new vehicle (41 ms)
      √ should block USER role from creating a vehicle (10 ms)
    POST /api/v1/vehicles/:id/purchase
      √ should allow user to purchase vehicle (10 ms)
      √ should fail purchase if stock is empty (8 ms)

PASS tests/integration/auth.test.ts
  Auth Integration Tests
    POST /api/v1/auth/register
      √ should register a new user successfully (395 ms)
      √ should return 400 when email is already registered (12 ms)
    POST /api/v1/auth/login
      √ should log in existing user with correct credentials (11 ms)
      √ should return 401 on incorrect password (8 ms)

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
```

---

## 🤝 AI Pair-Programming Partnership

This ecosystem was engineered in partnership with **Gemini-Antigravity**, an autonomous AI coding assistant developed by Google DeepMind.

* **Git Attribution**: Collaborative commits are tagged with:
  `Co-authored-by: Gemini-Antigravity <antigravity@users.noreply.github.com>`
* **Workflow**: The AI assistant assisted with system configuration, Prisma schema migrations, and frontend styling templates. Business logic validators, Express middleware configurations, and cloud deployment pipelines were fully managed by the lead developer.
