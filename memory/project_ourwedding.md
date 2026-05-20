---
name: project-ourwedding
description: Full architecture overview of the ourWedding025 wedding planner app — stack, modules, data models, auth, and known patterns
metadata:
  type: project
---

# ourWedding025 — Wedding Planner App

**Repo:** https://github.com/fergieRdz/ourwedding025.git  
**Local path:** /Users/robertogarza/Desktop/Fernanda/ourWedding  
**Wedding date hardcoded in demo:** 2026-12-14 (Fergie & Jaime)

## Stack
- **Backend:** Node.js + Express 5, Sequelize ORM, MySQL, bcrypt, JWT, node-cron
- **Frontend:** React 19 + Vite, React Router v7, Axios, Recharts
- **DB:** MySQL (`ourwedding` database, port 3306)
- **Auth:** JWT stored in localStorage; 7-day expiry. Demo mode available (hardcoded token `'demo-token'`, user Fergie/Jaime).

## Project structure
```
ourWedding/
├── Backend/
│   └── src/
│       ├── app.js           — Express app, CORS, routes
│       ├── server.js        — DB sync + listen
│       ├── config/database.js — Sequelize MySQL connection
│       ├── middleware/authMiddleware.js — JWT verifyToken
│       ├── models/          — Sequelize models (see below)
│       ├── controllers/     — Business logic per feature
│       ├── routes/          — Express routers per feature
│       └── jobs/reminderJob.js — node-cron daily 8AM reminder
└── Frontend/
    └── src/
        ├── App.jsx          — Router + PrivateRoute guard
        ├── context/AuthContext.jsx — login/logout/demoLogin
        ├── services/api.js  — Axios instance, auto Bearer token, offline fallback
        ├── components/      — Layout, Sidebar (top nav), ImageInput
        └── pages/           — One page per feature
```

## API routes (all under /api, all behind verifyToken except /auth)
- /auth — register, login, GET /me, PUT /me
- /guests — CRUD
- /tables — CRUD
- /suppliers — CRUD
- /budget — CRUD + GET /summary + POST /gifts
- /calendar — CRUD
- /todos — CRUD
- /shopping — CRUD
- /moodboard — CRUD
- /honeymoon — CRUD

## Data models
| Model | Key fields |
|-------|-----------|
| User | name, email, password (bcrypt), weddingDate, partnerName |
| Guest | name, email, phone, status (confirmed/unconfirmed/pending), tableId |
| Table | tableNumber, capacity (default 8) |
| Supplier | name, category, phone, status (confirmed/pending), photoUrl, notes |
| BudgetItem | category, description, amount, paid, isDebt, date |
| GiftEntry | guestId, giverName, amount, message |
| CalendarEvent | title, date, time, reminderEnabled |
| TodoItem | title, date, time, completed |
| ShoppingItem | (purchased field implied) |
| MoodboardPhoto | photoUrl (base64 or URL) |
| Honeymoon | destination, photoUrl, startDate, endDate, tripLink, itinerary |

All models are user-scoped (userId FK, CASCADE DELETE).

## Notable patterns
- **Offline fallback:** `api.js` returns `{ data: [] }` on GET when backend is unreachable — UI never crashes.
- **Demo mode:** `demoLogin()` sets a fake token + static user object; backend requests will 403 but GETs silently return [].
- **Total budget:** stored in `localStorage` (not DB) — survives refresh but not cross-device.
- **Reminder cron:** logs to console only — no email/push integration yet.
- **Images:** stored as base64 TEXT('long') in DB (Supplier.photoUrl, Honeymoon.photoUrl, MoodboardPhoto) — no file upload service.
- **CORS:** open (`app.use(cors())`) — no origin restriction.

## Why / How to apply
**Why:** This is a personal wedding planner for Fergie (user) and Jaime. Roberto is working on it alongside Fernanda (likely the other partner or a collaborator).  
**How to apply:** Scope all suggestions to this wedding-specific domain. Prefer simple in-place fixes over abstractions. The app is close to production but has rough edges (open CORS, base64 images, localStorage budget, console-only reminders).
