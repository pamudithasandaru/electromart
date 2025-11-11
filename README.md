# ElectroMart — Electrical Equipment Shop (Demo)

This repository contains a small demo e-commerce app (frontend + backend) for an electrical equipment shop.

## Overview
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (recommended: run locally with MongoDB Compass or via Docker-compose)
- Containerization: Docker + docker-compose
- CI: GitHub Actions (basic build workflow)

## Quickstart (Local, No Docker)

### 1. Start MongoDB locally
- **Option A:** Use [MongoDB Compass](https://www.mongodb.com/products/tools/compass) — connects to local MongoDB instance at `mongodb://localhost:27017`
- **Option B:** If you have MongoDB installed, start the service (Windows: `mongod`)
- **Option C:** Use Docker just for MongoDB: `docker run -d -p 27017:27017 mongo:6.0`

### 2. Start Backend
```powershell
cd backend
copy .env.example .env
# Edit .env if needed (default is mongodb://localhost:27017/electromart for local dev)
npm install
npm run seed     # Optional: populate sample electrical products
npm run dev      # Starts server on http://localhost:5000
```

### 3. Start Frontend (in a new terminal)
```powershell
cd frontend
npm install
npm run dev      # Starts dev server on http://localhost:5173
# Open the URL printed by Vite in your browser
```

### 4. Test the API
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/products (GET list, POST new product)
- MongoDB: Use MongoDB Compass to view `electromart` database

---

## Quickstart (Docker Compose)

**Prerequisites:** Docker Desktop must be running.

From the repository root:
```powershell
docker-compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: Runs inside container on 127.0.0.1:27017

---

## Backend Structure
- `server.js` — Express server entry point
- `models/product.js` — Mongoose Product schema
- `routes/products.js` — GET/POST /api/products
- `seed.js` — Populate sample data (run with `npm run seed`)

## Frontend Structure
- `index.html` — Entry HTML
- `src/main.jsx` — React root
- `src/App.jsx` — Product list component (fetches /api/products)
- `src/styles.css` — Basic styles

## CI/CD
- `.github/workflows/ci.yml` runs on push/PR to `main`
- Installs dependencies, builds frontend, and runs tests

## Next Steps / Ideas
- Add authentication (JWT)
- Add a small admin UI to add/edit products
- Add unit tests and linting rules
- Deploy to cloud (Vercel, Heroku, AWS, etc.)

---

## License
MIT
# electromart

