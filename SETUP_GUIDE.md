# ElectroMart - Quick Setup & Troubleshooting

## Issue: Backend returning 500 error

**Root cause:** MongoDB is not running.

## Solution: Start MongoDB Locally (3 options)

### Option 1: MongoDB Community Edition (Recommended)
1. Download & install from: https://www.mongodb.com/try/download/community
2. Start MongoDB service (Windows):
   - Press `Win + R`, type `services.msc`
   - Find "MongoDB Server" and click "Start"
   - Or in PowerShell (as Admin): `net start MongoDB`

Then verify connection:
```powershell
cd d:\DockerSetups\electromart\backend
node test-mongo.js
```

### Option 2: Docker (if Docker Desktop is running)
```powershell
docker run -d -p 27017:27017 --name electromart-mongo mongo:6.0
```

### Option 3: MongoDB Compass (Standalone)
1. Download: https://www.mongodb.com/products/tools/compass
2. Install & launch
3. It will auto-connect to local MongoDB (if available)
4. If not, use a free MongoDB Atlas cloud database:
   - Sign up at https://account.mongodb.com/account/register
   - Create a cluster
   - Get connection string
   - Update `backend/.env` with the connection string

## After Starting MongoDB

### 1. Seed sample data
```powershell
cd backend
npm run seed
```

### 2. Start backend (in terminal 1)
```powershell
cd backend
npm run dev
```

### 3. Start frontend (in terminal 2)
```powershell
cd frontend
npm run dev
```

### 4. Open browser
Visit: http://localhost:5173

You should now see 6 sample electrical products loaded!

## Verify All Services

Run this PowerShell script to check status:
```powershell
.\diagnose.ps1
```

---

## If Still Getting 500 Error

1. Check backend console for error message
2. Run: `node test-mongo.js` to verify MongoDB connection
3. Verify `backend/.env` has correct MONGODB_URI
4. Try seeding again: `npm run seed`
