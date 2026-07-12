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

AutoVault is an award-winning, full-stack vehicle fleet management and sales ledger console. Designed for executive operations, it features a glassmorphic user interface, real-time inventory telemetry, customer checkouts, audit trails, and an administrative replenishing cockpit.

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

## 🖼5 Application Showcase

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

## 📂 Project Directory Structure

```text
├── backend/
│   ├── prisma/             # Database connection, schemas, and pooling configs
│   └── src/
│       ├── config/         # System engine initializers, db pools, and loaders
│       ├── controllers/    # API request handlers mapping business and JSON responses
│       ├── middleware/     # JWT authentication, validators, and error exception handler
│       ├── routes/         # Express routes (v1 API endpoints)
│       ├── services/       # Core business logic (Bcrypt hashing, JWT signing)
│       └── tests/          # Off-line unit and integration Jest tests
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios interceptors inject JWT authorization headers
│   │   ├── components/     # Reusable layout UI blocks (Sidebar, Dashboard stats)
│   │   ├── context/        # Session hooks, token storages, and auth state triggers
│   │   ├── hooks/          # React Query hook handlers for vehicle schemas
│   │   ├── pages/          # Slate-themed pages (Dashboard Catalog, Orders, Activities)
│   │   ├── routes/         # Router guards (ProtectedRoute, AdminRoute redirects)
│   │   └── utils/          # Store utility functions and local tokens management
│   └── index.html          # Frontend HTML entryway
```

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph TD
    %% Custom Styles %%
    classDef client fill:#E8F0FE,stroke:#1A73E8,stroke-width:2px,color:#000;
    classDef gateway fill:#FCE8E6,stroke:#D93025,stroke-width:2px,color:#000;
    classDef data fill:#E6F4EA,stroke:#188038,stroke-width:2px,color:#000;
    classDef ci fill:#F1F8E9,stroke:#689F38,stroke-width:2px,color:#000;

    subgraph "🖥️ CLIENT TIER (Vite Single Page Application)"
        direction LR
        A["🎨 React 19 Frontend UI<br>(Vite, TS, Tailwind CSS)"] --- B["🔄 TanStack Query & Axios<br>(State & Request Handlers)"]
        class A,B client;
    end

    subgraph "⚙️ APPLICATION GATEWAY TIER (Express API Service)"
        direction TB
        C["🔒 CORS Control Middleware<br>(Origins Validation Filter)"] --> D["🛡️ Helmet Security Header Guard"]
        D --> E["🔑 JWT Session Authentication Handler"]
        E --> F["⚡ Express Controller Routing Layer"]
        F --> G["💎 Prisma Client v7 Core Engine"]
        class C,D,E,F,G gateway;
    end

    subgraph "🗄️ DATA STORAGE & CLUSTERING (Cloud PostgreSQL)"
        direction TB
        H["🔀 Supabase Transaction Pooler<br>(PgBouncer Port 6543)"] --> I[("🛢️ PostgreSQL Database<br>(Tables: User, Vehicle, PurchaseHistory)")]
        class H,I data;
    end

    subgraph "🤖 AUTOMATED DEPLOYMENT & CI/CD"
        direction LR
        J["😺 GitHub Action Runner"] -->|Prisma Generate & Typechecks| K["🐳 Cloud Build Environments"]
        L["▲ Vercel Hosting Platform"] --- M["☁️ Render Hosting Platform"]
        class J,K,L,M ci;
    end

    %% Node Connections %%
    B -->|HTTPS Requests + JWT Tokens| C
    G -->|Prisma PostgreSQL Adapter| H
    K -->|Sync Schema Push| I
    J -->|Trigger Deployment| L
    J -->|Trigger Deployment| M
```

---

## 🧭 User Navigation Walkthrough

* **Guest Catalog**: Unauthenticated visitors can view the vehicle showrooms and perform query filtering. Any attempt to click purchase triggers an automatic redirect to the registration page.
* **Client Orders**: Log in as a standard User. Browse the showroom catalog, select your favorite model, and click purchase. The application decrements stock units and adds transaction details to the **My Orders** ledger.
* **Admin Cockpit**: Log in as an Administrator. You gain absolute access to the inventory dashboards, allowing you to add new vehicles, modify specifications, restock units, or remove vehicles from the fleet.

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

All integration tests compile and run successfully both locally and in the GitHub Actions virtual environment.

### Test Execution Commands
* **Run Backend Integration Tests (Jest & Supertest)**:
  ```bash
  npm run test:backend
  ```

---

## 📊 Comprehensive Test Report

| Layer | Suite Path | Tests Passed | Status | Coverage Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API (Jest)** | `tests/integration/auth.test.ts` | 4 / 4 | **PASS** (✅) | User Registration validations, Duplicate Email constraints, Login token payload. |
| **Backend API (Jest)** | `tests/integration/vehicle.test.ts` | 6 / 6 | **PASS** (✅) | Paginated catalogs retrieval, Admin Auth gatekeeping, vehicle creations, checkouts, and stock exhaustion controls. |
| **Backend API (Jest)** | `tests/integration/health.test.ts` | 2 / 2 | **PASS** (✅) | Database reachability checks, server uptime health metrics, and database disconnect behaviors. |
| **TOTAL RUN DETAILS** | **12 / 12 Integration Tests** | **100% GREEN** | **PASS** (✅) | **All backend API integrations compile and run with 0 errors.** |

---

## 👥 Collaborators & Contributors

* 🧑‍💻 **Lead Developer**: **[Vansh060206 (Vansh Mankani)](https://github.com/Vansh060206)**
* 🤖 **AI Lead Assistant**: **Gemini-Antigravity** (Autonomous assistant by Google DeepMind)
* 💬 **AI Technical Consultant**: **ChatGPT** (OpenAI architecture consultant)

---

## 🤝 AI Pair-Programming Partnership & Usage

This project was built following a modern, AI-assisted development workflow.

### 1. AI Tools Leveraged
* **Antigravity**: Primary AI assistant utilized for visual page layout generation, React-Router-DOM setup, type-import separation, and automated CI/CD pipeline script configuration.
* **ChatGPT**: Utilized for architecture best practices, database query optimizations, mock data generation, Jest setups, and codebase reviews.

### 2. How AI Was Utilized
* **Clean Architecture & Decoupling**: Designed routes and controller layers to decouple routes from db transaction logic.
* **TDD Test Suite Construction**: Mocked Express routes configurations and generated database setups to ensure fast, offline runs.
* **Unified UI Fine-Tuning**: Structured scroll boundaries and sidebar navigation layouts, and cast imports as type-only imports to satisfy strict Vite 8 requirements.

### 3. Reflection & Impact
* **Efficiency**: Using agentic AI increased initial scaffolding speeds, allowing more time to focus on complex details like PostgreSQL pgBouncer connections, direct transaction ports, and environment secrets configurations.
* **Quality**: Kept the local workspace and cloud pipelines in perfect sync. All 12 integration tests run flawlessly.
