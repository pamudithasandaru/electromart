# ElectroMart — Electrical Equipment Shop (Demo)

This repository contains a small demo e-commerce app (frontend + backend) for an electrical equipment shop.

## 🚀 Quick Links

- **🏃 [Quick Start](SETUP_GUIDE.md)** - Get running locally in 5 minutes
- **🐳 [Docker, Jenkins & AWS Guide](DOCKER_JENKINS_AWS_GUIDE.md)** - Deploy with containerization & CI/CD
- **📦 [Full Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step AWS deployment
- **📊 [API Documentation](API_DOCS.md)** - Backend endpoints

## 📋 Overview

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Cloud) |
| Containerization | Docker + Docker Compose |
| CI/CD | Jenkins / GitHub Actions |
| Cloud | AWS (ECR, ECS, Fargate) |

## ⚡ Local Development (5 min)

```powershell
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Open http://localhost:5173 in your browser
```

## 🐳 Docker (Local Testing)

```powershell
docker-compose up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## ☁️ Production Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for AWS deployment with Jenkins/GitHub Actions.

### Quick Deploy Steps
1. Configure AWS CLI: `aws configure`
2. Run setup: `bash scripts/aws-setup.sh`
3. Build & push images: `bash scripts/build-and-push.sh`
4. Deploy: `Jenkinsfile` triggers on git push

## 📁 Project Structure

```
electromart/
├── backend/                 # Node.js + Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── Dockerfile          # Backend container
│   └── package.json
├── frontend/               # React + Vite UI
│   ├── src/                # React components
│   ├── Dockerfile          # Frontend container
│   └── package.json
├── scripts/                # Deployment scripts
│   ├── aws-setup.sh
│   └── build-and-push.sh
├── infrastructure/         # CloudFormation templates
│   └── electromart-stack.yaml
├── docker-compose.yml      # Local dev containers
├── Jenkinsfile            # CI/CD pipeline
└── DEPLOYMENT_GUIDE.md    # AWS deployment docs
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product

See [API_DOCS.md](API_DOCS.md) for details.

## 🛠️ Tech Stack Features

✅ Full-stack e-commerce demo  
✅ Docker containerization  
✅ CI/CD with Jenkins  
✅ Cloud deployment (AWS ECS/Fargate)  
✅ MongoDB Atlas for scalable database  
✅ GitHub Actions alternative CI/CD  
✅ Environment-based configuration  
✅ Seed data for quick testing  

## 🚀 Next Steps

1. **Add Authentication** - JWT tokens for user login
2. **Add Admin Panel** - Manage products via UI
3. **Add Shopping Cart** - Store items in session/DB
4. **Add Payment Integration** - Stripe/PayPal
5. **Scale to Production** - Add caching, CDN, etc.

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Local development setup
- [Docker & AWS Guide](DOCKER_JENKINS_AWS_GUIDE.md) - Containerization & deployment
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Step-by-step AWS deployment
- [API Docs](API_DOCS.md) - Backend API reference

## 🐛 Troubleshooting

**Frontend shows blank page?**
- Check browser console for errors (F12)
- Verify backend is running on port 5000
- Check vite.config.js proxy settings

**Backend returns 500 error?**
- Verify MongoDB connection string in `.env`
- Check backend logs: `npm run dev`
- Seed database: `npm run seed`

**Docker build fails?**
- Check Dockerfile syntax
- Ensure all dependencies in package.json
- Try: `docker build --no-cache`

See [Troubleshooting](DOCKER_JENKINS_AWS_GUIDE.md#troubleshooting) section for more.

## 💡 Tips

- Use `npm run seed` to populate sample electrical products
- MongoDB Atlas is used for cloud database (no local setup needed)
- Vite proxy (vite.config.js) forwards /api calls to backend
- GitHub Actions also available as alternative to Jenkins

## 📝 License

MIT

## 👨‍💻 Author

Created by: pamudithasandaru  
Repository: https://github.com/pamudithasandaru/electromart

---

**Questions?** See the guides above or check the troubleshooting section!
# electromart

