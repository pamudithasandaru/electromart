# 🐳 Docker Setup Guide

## Current Status
✅ Docker installed and running
✅ Dockerfiles configured
✅ docker-compose.yml ready
🔄 Building containers...

## Services Running

### 1. **MongoDB** (mongo:6.0)
- Port: 27017
- Volume: mongo-data (persistent)
- Status: Building...

### 2. **Backend** (Node.js + Express)
- Port: 5000 → 5000
- Environment: MONGODB_URI=mongodb://mongo:27017/electromart
- Status: Building...

### 3. **Frontend** (React + Nginx)
- Port: 3000 → 80
- Access: http://localhost:3000
- Status: Building...

## What's Happening

```bash
docker-compose up --build

# This command:
1. Builds backend Docker image from ./backend/Dockerfile
2. Builds frontend Docker image from ./frontend/Dockerfile
3. Pulls MongoDB 6.0 image
4. Creates and starts all 3 containers
5. Sets up networking between services
6. Mounts persistent volume for MongoDB
```

## Expected Timeline

1. **MongoDB Pull** (~2-3 min): Downloading mongo:6.0 image
2. **Backend Build** (~1-2 min): npm install + copy code
3. **Frontend Build** (~2-3 min): npm install + npm run build
4. **Nginx Start** (~10 sec): Serving built React app
5. **Ready** ✅: All services running

## Access Points (When Ready)

```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
MongoDB:   localhost:27017
API:       http://localhost:5000/api/products
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Stop containers
docker-compose down

# Remove volumes (data)
docker-compose down -v

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up --build

# Just start (no rebuild)
docker-compose up

# In background
docker-compose up -d

# View resource usage
docker stats
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
```

### Containers Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Connection to MongoDB Failed
```bash
# Verify MongoDB is running
docker-compose ps mongo

# Check logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

## Monitoring

Open a new terminal:
```bash
# Watch container logs in real-time
docker-compose logs -f

# Or specific service
docker-compose logs -f backend
```

## Next Steps (When Ready ✅)

1. Wait for all containers to start
2. Check http://localhost:3000 in browser
3. Should see ElectroMart with 6 products
4. Backend API: http://localhost:5000/api/products

## Environment Variables

The services use these internal environment variables:

```
Backend:
  MONGODB_URI=mongodb://mongo:27017/electromart

Frontend:
  (Uses Vite proxy to backend)

MongoDB:
  (Default MongoDB settings)
```

## Data Persistence

- MongoDB data stored in `mongo-data` volume
- Data persists even if containers stop
- Remove with: `docker-compose down -v`

## Performance

- MongoDB: 6.0 (latest stable)
- Node: 18-alpine (lightweight)
- Nginx: stable-alpine (efficient)
- Total image size: ~500 MB

---

**Status:** 🔄 Building... Check back in 5-10 minutes!
