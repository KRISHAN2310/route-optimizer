# Smart Route Optimization System

Full-stack production-grade route optimization platform.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + React Router + Axios + React Query + React Hook Form + Leaflet + Socket.io Client + Chart.js
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL + Redis + JWT + Bcrypt + Socket.io + Multer

## Backend Setup
```
cd backend
npm install
# configure .env (DATABASE_URL, REDIS_URL, JWT_SECRET)
npx prisma migrate dev --name init
npm run dev
```

## Frontend Setup
```
cd frontend
npm install
npm run dev
```

## Modules
Authentication, Dashboard, Route Planner, Vehicle Management, Driver Panel,
Analytics, Admin Panel, Live Tracking, CSV Upload, Route Optimization,
Fuel Estimation, Traffic Simulation (trafficFactor), Reports.

## Algorithms
Nearest Neighbor, Dijkstra, A*, ETA Calculation, Fuel Estimation,
Priority Scheduling, Vehicle Capacity Validation
(`backend/src/algorithms/`).

## Default Roles
ADMIN, DISPATCHER, DRIVER — register a user via `/register`, then create a
matching Driver profile from the Driver Management screen (ADMIN/DISPATCHER)
using that user's ID.
