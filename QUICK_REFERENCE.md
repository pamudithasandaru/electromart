# ElectroMart - Quick Reference Card

## 🚀 Common Commands

### Local Development
```powershell
# Backend
cd backend
npm install          # Install dependencies
npm run seed        # Populate sample data
npm run dev         # Start dev server (http://localhost:5000)
npm run lint        # Run linter
npm test            # Run tests
npm start           # Start production server

# Frontend
cd frontend
npm install         # Install dependencies
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Docker
```powershell
# Build & run locally
docker-compose build
docker-compose up
docker-compose down

# Build individual images
docker build -t electromart-backend ./backend
docker build -t electromart-frontend ./frontend

# List & manage containers
docker ps                    # View running containers
docker logs <container-id>   # View container logs
docker stop <container-id>   # Stop container
docker rm <container-id>     # Remove container
```

### AWS CLI
```powershell
# Configure credentials
aws configure
aws sts get-caller-identity  # Verify setup

# ECR (Container Registry)
aws ecr create-repository --repository-name electromart-backend --region us-east-1
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker push $ECR_REGISTRY/electromart-backend:latest

# ECS (Container Orchestration)
aws ecs create-cluster --cluster-name electromart-cluster
aws ecs list-clusters
aws ecs describe-services --cluster electromart-cluster --services electromart-backend
aws ecs update-service --cluster electromart-cluster --service electromart-backend --force-new-deployment

# Logs
aws logs tail /ecs/electromart-backend --follow
```

### Git
```powershell
git status
git add .
git commit -m "Feature: description"
git push origin main
git pull origin main
```

---

## 📍 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend (Local Dev) | http://localhost:5173 | Dev only |
| Backend (Local Dev) | http://localhost:5000 | Dev only |
| MongoDB Compass | Installed locally | Optional |
| Jenkins | http://localhost:8080 | If using Jenkins |
| AWS Console | https://console.aws.amazon.com | Production |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server entry point |
| `backend/seed.js` | Database seeding |
| `backend/models/product.js` | Mongoose schema |
| `backend/routes/products.js` | API endpoints |
| `frontend/src/App.jsx` | Main React component |
| `frontend/vite.config.js` | Vite proxy config |
| `docker-compose.yml` | Local dev containers |
| `Jenkinsfile` | CI/CD pipeline |
| `.env` | Environment variables (local, don't commit) |
| `README.md` | Project overview |

---

## 🔑 Environment Variables

### Backend `.env`
```bash
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/electromart
```

### Frontend (vite.config.js)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | `netstat -ano \| findstr :5000` then kill process |
| Frontend blank | Check browser console (F12) for errors |
| Backend 500 error | Check `.env`, verify MongoDB connection |
| Docker build fails | Clear cache: `docker system prune` |
| Cannot push to ECR | Re-login: `aws ecr get-login-password...` |
| MongoDB connection fails | Verify connection string in `.env` |

---

## 📊 API Endpoints Cheat Sheet

```bash
# Get all products
GET /api/products

# Create product
POST /api/products
Body: { name, description, price, inStock }

# Health check
GET /

# Test with curl
curl -X GET http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"LED","price":12.99}'
```

---

## 📦 Deployment Checklist

- [ ] Update `.env` with production MongoDB URI
- [ ] Run `npm run build` for frontend
- [ ] Test locally: `npm run dev`
- [ ] Test with Docker: `docker-compose up`
- [ ] Commit to GitHub: `git push origin main`
- [ ] Configure AWS: `aws configure`
- [ ] Run AWS setup: `bash scripts/aws-setup.sh`
- [ ] Push to ECR: `bash scripts/build-and-push.sh`
- [ ] Check ECS service: `aws ecs describe-services ...`
- [ ] Monitor logs: `aws logs tail /ecs/...`

---

## 🎯 Role-Based Guides

### Frontend Developer
→ Start with `frontend/` folder  
→ Run `npm run dev` in frontend  
→ Reference [API_DOCS.md](API_DOCS.md) for backend endpoints  

### Backend Developer
→ Start with `backend/` folder  
→ Run `npm run dev` in backend  
→ Use `npm run seed` to test with data  
→ Reference [API_DOCS.md](API_DOCS.md) for endpoint structure  

### DevOps/Infrastructure
→ Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)  
→ Run `aws configure` first  
→ Execute `scripts/aws-setup.sh`  
→ Monitor via AWS Console or CloudWatch  

### Full-Stack Developer
→ Read [README.md](README.md)  
→ Follow [GETTING_STARTED.md](GETTING_STARTED.md)  
→ Use [DOCKER_JENKINS_AWS_GUIDE.md](DOCKER_JENKINS_AWS_GUIDE.md) for deployment  

---

## 💾 Database

### MongoDB Atlas
- Connection: `mongodb+srv://...`
- No local installation needed
- Free tier available
- Access at: https://cloud.mongodb.com

### Collections
- `products` - Stores electrical equipment items

### Sample Documents
```json
{
  "name": "LED Bulb 60W",
  "description": "Energy-efficient LED bulb",
  "price": 12.99,
  "inStock": true
}
```

---

## 📈 Monitoring

### Local
```powershell
npm run dev   # Check terminal for errors
```

### Docker
```powershell
docker logs <container-id>
docker stats
```

### AWS
```powershell
# View logs
aws logs tail /ecs/electromart-backend --follow

# View service status
aws ecs describe-services --cluster electromart-cluster --services electromart-backend

# View container instances
aws ecs list-container-instances --cluster electromart-cluster
```

---

## 🔗 Useful Links

- [AWS Console](https://console.aws.amazon.com)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [GitHub](https://github.com)
- [Docker Hub](https://hub.docker.com)
- [Postman](https://www.postman.com)
- [Jenkins](https://www.jenkins.io)

---

## 📝 Notes

- Always commit before deploying
- Keep `.env` files out of git (use `.gitignore`)
- Use meaningful commit messages
- Test locally before pushing to main
- Monitor AWS costs regularly
- Keep dependencies up to date

---

**Last Updated:** November 12, 2025  
**Status:** Ready for Production ✅

