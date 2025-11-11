# ElectroMart - Quick Deployment Guide

## 🎯 Overview

This guide walks you through deploying ElectroMart to AWS using Docker, Jenkins, and AWS services.

---

## ✅ Prerequisites

1. **AWS Account** - Sign up at https://aws.amazon.com
2. **AWS CLI** installed - Download from https://aws.amazon.com/cli/
3. **Docker** installed - Download from https://www.docker.com
4. **GitHub account** with your repo
5. **Jenkins** (optional, can use GitHub Actions instead)

---

## 📋 Step-by-Step Deployment

### Phase 1: Local Preparation

#### 1. Verify Local Setup Works
```powershell
# Start frontend dev server
cd frontend
npm install
npm run dev

# In another terminal, start backend
cd backend
npm install
npm run dev

# Verify frontend loads on http://localhost:5173
# Verify backend API on http://localhost:5000/api/products
```

#### 2. Test Docker Locally
```powershell
cd d:\DockerSetups\electromart

# Build all containers
docker-compose build

# Run containers
docker-compose up

# Access on http://localhost:3000
docker-compose down
```

---

### Phase 2: AWS Setup

#### 1. Configure AWS CLI
```powershell
aws configure

# Enter:
# AWS Access Key ID: [from IAM user]
# AWS Secret Access Key: [from IAM user]
# Default region: us-east-1
# Default output format: json

# Verify setup
aws sts get-caller-identity
```

#### 2. Create AWS Resources

**Option A: Using Script (Recommended)**
```powershell
bash scripts/aws-setup.sh
```

**Option B: Manual Setup**
```powershell
# Get account ID
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
echo "Account ID: $ACCOUNT_ID"

# Create ECR repositories
aws ecr create-repository --repository-name electromart-backend --region us-east-1
aws ecr create-repository --repository-name electromart-frontend --region us-east-1

# Create ECS cluster
aws ecs create-cluster --cluster-name electromart-cluster --region us-east-1

# Create CloudWatch log groups
aws logs create-log-group --log-group-name /ecs/electromart-backend --region us-east-1
aws logs create-log-group --log-group-name /ecs/electromart-frontend --region us-east-1
```

#### 3. Store MongoDB URI in AWS Secrets Manager
```powershell
aws secretsmanager create-secret `
    --name electromart/mongodb-uri `
    --secret-string "mongodb+srv://user:pass@cluster.mongodb.net/electromart" `
    --region us-east-1
```

---

### Phase 3: Build & Push Docker Images

#### 1. Login to ECR
```powershell
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$ECR_REGISTRY = "$ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com"

aws ecr get-login-password --region us-east-1 | `
    docker login --username AWS --password-stdin $ECR_REGISTRY
```

#### 2. Build & Push Backend
```powershell
cd backend

$BACKEND_IMAGE = "$ECR_REGISTRY/electromart-backend:latest"

docker build -t $BACKEND_IMAGE .
docker push $BACKEND_IMAGE

echo "✅ Backend pushed to: $BACKEND_IMAGE"
```

#### 3. Build & Push Frontend
```powershell
cd frontend

$FRONTEND_IMAGE = "$ECR_REGISTRY/electromart-frontend:latest"

docker build -t $FRONTEND_IMAGE .
docker push $FRONTEND_IMAGE

echo "✅ Frontend pushed to: $FRONTEND_IMAGE"
```

#### 4. Verify Images in ECR
```powershell
aws ecr describe-images --repository-name electromart-backend --region us-east-1
aws ecr describe-images --repository-name electromart-frontend --region us-east-1
```

---

### Phase 4: Deploy to AWS ECS

#### 1. Register Task Definitions

**Backend:**
```powershell
aws ecs register-task-definition `
    --family electromart-backend `
    --network-mode awsvpc `
    --requires-compatibilities FARGATE `
    --cpu 256 `
    --memory 512 `
    --execution-role-arn arn:aws:iam::$ACCOUNT_ID:role/ecsTaskExecutionRole `
    --container-definitions "[{
        'name': 'backend',
        'image': '$BACKEND_IMAGE',
        'portMappings': [{'containerPort': 5000, 'hostPort': 5000}],
        'environment': [{'name': 'PORT', 'value': '5000'}],
        'secrets': [{'name': 'MONGODB_URI', 'valueFrom': 'arn:aws:secretsmanager:us-east-1:$ACCOUNT_ID:secret:electromart/mongodb-uri'}],
        'logConfiguration': {
            'logDriver': 'awslogs',
            'options': {
                'awslogs-group': '/ecs/electromart-backend',
                'awslogs-region': 'us-east-1',
                'awslogs-stream-prefix': 'ecs'
            }
        }
    }]" `
    --region us-east-1
```

**Frontend:**
```powershell
aws ecs register-task-definition `
    --family electromart-frontend `
    --network-mode awsvpc `
    --requires-compatibilities FARGATE `
    --cpu 256 `
    --memory 512 `
    --execution-role-arn arn:aws:iam::$ACCOUNT_ID:role/ecsTaskExecutionRole `
    --container-definitions "[{
        'name': 'frontend',
        'image': '$FRONTEND_IMAGE',
        'portMappings': [{'containerPort': 80, 'hostPort': 80}],
        'logConfiguration': {
            'logDriver': 'awslogs',
            'options': {
                'awslogs-group': '/ecs/electromart-frontend',
                'awslogs-region': 'us-east-1',
                'awslogs-stream-prefix': 'ecs'
            }
        }
    }]" `
    --region us-east-1
```

#### 2. Create ECS Services

**Backend Service:**
```powershell
aws ecs create-service `
    --cluster electromart-cluster `
    --service-name electromart-backend `
    --task-definition electromart-backend `
    --desired-count 1 `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" `
    --region us-east-1
```

**Frontend Service:**
```powershell
aws ecs create-service `
    --cluster electromart-cluster `
    --service-name electromart-frontend `
    --task-definition electromart-frontend `
    --desired-count 1 `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" `
    --region us-east-1
```

#### 3. Get Service URLs
```powershell
aws ecs describe-services `
    --cluster electromart-cluster `
    --services electromart-backend electromart-frontend `
    --region us-east-1 | jq '.services[] | {name: .serviceName, status: .status}'
```

---

### Phase 5: CI/CD with Jenkins

#### 1. Install Jenkins
```powershell
# Using Docker
docker run -d `
    -p 8080:8080 `
    -p 50000:50000 `
    --name jenkins `
    jenkins/jenkins:lts
```

#### 2. Configure Jenkins
- Open http://localhost:8080
- Get admin password: `docker logs jenkins | grep -i "password"`
- Install recommended plugins
- Add GitHub credentials in Credentials section
- Add AWS credentials

#### 3. Create Pipeline Job
- New Item → Pipeline → Name: "ElectroMart"
- Pipeline → Definition: Pipeline script from SCM
- SCM: Git
- Repository URL: `https://github.com/pamudithasandaru/electromart.git`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

#### 4. Add GitHub Webhook
- GitHub Repo → Settings → Webhooks → Add webhook
- Payload URL: `http://your-jenkins-domain:8080/github-webhook/`
- Content type: `application/json`
- Events: Push events

---

### Phase 6: Monitor Deployment

#### Check Service Status
```powershell
aws ecs describe-services `
    --cluster electromart-cluster `
    --services electromart-backend electromart-frontend `
    --region us-east-1
```

#### View Logs
```powershell
# Backend logs
aws logs tail /ecs/electromart-backend --follow

# Frontend logs
aws logs tail /ecs/electromart-frontend --follow
```

#### Scale Service
```powershell
aws ecs update-service `
    --cluster electromart-cluster `
    --service electromart-backend `
    --desired-count 3 `
    --region us-east-1
```

---

## 🔄 Typical Workflow

### For New Features
```powershell
# 1. Create feature branch
git checkout -b feature/new-product-category

# 2. Make changes locally
# ... edit files ...

# 3. Test locally
npm run dev

# 4. Docker test (optional)
docker-compose up --build

# 5. Commit and push
git add .
git commit -m "Feature: Add product categories"
git push origin feature/new-product-category

# 6. Create Pull Request on GitHub
# 7. Jenkins runs CI tests
# 8. Merge to main when approved
# 9. Jenkins auto-deploys to AWS
```

---

## 💰 Cost Optimization

| Service | Estimated Cost | Optimization |
|---------|---|---|
| ECS Fargate | $0.015/hour per task | Use App Runner or Lambda for simpler apps |
| ECR | $0.10/GB-month | Delete old images |
| CloudWatch Logs | $0.50/GB ingested | Set retention to 7-30 days |
| Data Transfer | $0.09/GB out | Use CloudFront for static content |

**Free Tier Available:** Most AWS services have free tier for 12 months.

---

## 🆘 Troubleshooting

### Docker Build Fails
```powershell
# Check Dockerfile syntax
docker build --no-cache -t test:latest .

# Check dependencies
cat backend/package.json
cat frontend/package.json
```

### ECS Task Fails to Start
```powershell
# Check logs
aws logs tail /ecs/electromart-backend --follow

# Check task definition
aws ecs describe-task-definition --task-definition electromart-backend
```

### Cannot Push to ECR
```powershell
# Re-login to ECR
aws ecr get-login-password --region us-east-1 | `
    docker login --username AWS --password-stdin $ECR_REGISTRY
```

### MongoDB Connection Fails
```powershell
# Verify secret exists
aws secretsmanager get-secret-value --secret-id electromart/mongodb-uri

# Update task definition with correct connection string
```

---

## 📚 Useful Commands

```powershell
# View all resources
aws ecs list-clusters
aws ecs list-services --cluster electromart-cluster
aws ecr describe-repositories

# Update service with new image
aws ecs update-service `
    --cluster electromart-cluster `
    --service electromart-backend `
    --force-new-deployment

# Delete resources
aws ecs delete-service --cluster electromart-cluster --service electromart-backend
aws ecs delete-cluster --cluster electromart-cluster
aws ecr delete-repository --repository-name electromart-backend --force
```

---

## 🎉 You're All Set!

Your app should now be deployed on AWS and automatically deployed whenever you push to main!

Next steps:
- Set up CloudFront CDN for frontend
- Add Route53 domain mapping
- Set up WAF (Web Application Firewall)
- Configure auto-scaling policies

