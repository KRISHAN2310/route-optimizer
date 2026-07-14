# Smart Route Optimization System

Full-stack route optimization platform with real road routing (OSRM),
a modern SaaS-style frontend (light/dark mode), and production-ready
Docker Compose deployment.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + React Router + Axios + React Query + React Hook Form + Leaflet + Socket.io Client + Chart.js + react-icons
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL + Redis + JWT + Bcrypt + Socket.io + Multer
- Routing: self-hosted **OSRM** (Open Source Routing Machine) — no Google Maps API anywhere in this stack

## Road Routing (OSRM)
`backend/src/services/osrmService.ts` calls a self-hosted OSRM instance for:
- `/table` — pairwise road distance/duration matrix, used by the nearest-neighbor optimizer
- `/route` — real road geometry, total distance, total duration, and per-leg distance/duration for the final stop order

If OSRM is unreachable, `optimizationService.ts` automatically falls back to
the original straight-line (Haversine) calculation so route creation never
hard-fails — the map then draws a dashed straight line instead of the solid
road path.

## Quick Start — Docker Compose (recommended)
```
# one-time: prepare OSRM map data — see osrm-data/README.md
docker compose up -d --build
```
This starts Postgres, Redis, OSRM, the backend (`:5000`) and frontend (`:4173`).

## Quick Start — Manual / Local Dev
### 1. Start Postgres, Redis & OSRM
```
docker compose up -d postgres redis osrm
```
(OSRM requires pre-processed map data first — see `osrm-data/README.md`.
Without it, the app still works via the automatic Haversine fallback.)

### 2. Backend
```
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
Runs on `http://localhost:5000`. Health check: `GET /health`.

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### 4. Test the app — no dataset required, everything is created through the UI
1. Go to `http://localhost:5173/register` and create an **Admin** account.
2. Log in, go to **Vehicle Management** → add a vehicle (plate, type, capacity, efficiency, and optionally Max Weight / Max Volume / Current Load — Max Weight defaults to Capacity if left blank).
3. Register a second account with role **Driver**, noting its email.
4. Back in the admin session, go to **Driver Panel** → Add Driver → enter that **driver's email** (not an ID) → assign the vehicle. If the email doesn't match an existing account, you'll see "Driver not found."
5. Go to **Route Planner** → pick the vehicle/algorithm → upload `sample-stops.csv` (included) via the CSV dropzone → **Generate Optimized Route**. The result panel shows total distance, travel time, and ETA, and the map draws the real road path from OSRM.
6. Check **Dashboard** for total distance, total travel time, completed/pending deliveries, and next ETA.
7. Log in as the driver to see **My Assignments**: current route, remaining stops, remaining distance, and estimated arrival time — all recalculated live as stops are marked visited.

## Modules
Authentication, Dashboard, Route Planner, Vehicle Management, Driver Panel,
Analytics, Admin Panel, Live Tracking, CSV Upload, Road-Based Route
Optimization (OSRM), Fuel Estimation, Traffic Simulation (trafficFactor),
Reports, Vehicle Capacity Enforcement.

## Algorithms
Nearest Neighbor & Priority-First (now driven by OSRM road distance, with
Haversine fallback), Dijkstra, A*, ETA Calculation, Fuel Estimation,
Priority Scheduling, Vehicle Capacity Validation (`backend/src/algorithms/`).

## Vehicle Capacity
Each vehicle has `capacityKg` (legacy), plus `maxWeight`, `maxVolume`, and
`currentLoad`. Available capacity = `maxWeight ?? capacityKg` minus
`currentLoad`. Route creation is rejected (`422`) if the new stops' total
demand would exceed it; `currentLoad` is incremented on route creation and
released back on completion/cancellation. `maxVolume` is stored for display
but not yet enforced (no per-stop volume data is currently collected).

## Default Roles
ADMIN, DISPATCHER, DRIVER — register a user via `/register`, then create a
matching Driver profile from the Driver Management screen (ADMIN/DISPATCHER)
using that user's **email**.


