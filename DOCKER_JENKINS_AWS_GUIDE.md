# ElectroMart - Docker, Jenkins & AWS Deployment Guide

## Part 1: Docker (Containerization)

### What is Docker?
Docker packages your app + dependencies into containers (like virtual machines, but lighter).

### Current Setup
You already have:
- `backend/Dockerfile` - builds Node backend
- `frontend/Dockerfile` - builds React frontend  
- `docker-compose.yml` - runs both together locally

### Build & Test Locally with Docker

**Build containers:**
```powershell
cd d:\DockerSetups\electromart
docker-compose build
```

**Run containers:**
```powershell
docker-compose up
```

**Access services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

**Stop containers:**
```powershell
docker-compose down
```

### View Running Containers
```powershell
docker ps
docker logs <container-id>
```

---

## Part 2: Jenkins (CI/CD Pipeline)

### What is Jenkins?
Jenkins automates: test → build → push to registry → deploy

### Prerequisites
1. Install Jenkins locally or use [Jenkins Cloud](https://www.cloudbees.com/)
2. Install Jenkins plugins: Docker, Pipeline, Git
3. Have GitHub repo with source code

### Jenkins Setup (Local)

**Step 1: Install Jenkins**
```powershell
# Using Docker (easiest)
docker run -d -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
```

**Step 2: Access Jenkins**
- Open http://localhost:8080
- Get initial admin password: `docker logs <jenkins-container-id>`
- Install recommended plugins

**Step 3: Create a Pipeline Job**
1. Click "New Item"
2. Select "Pipeline"
3. Name it "ElectroMart"
4. Paste the `Jenkinsfile` content (see next section)

### Jenkinsfile (CI/CD Workflow)

Create `Jenkinsfile` at repository root:
```groovy
pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '123456789.dkr.ecr.us-east-1.amazonaws.com'
        IMAGE_TAG = "latest-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/pamudithasandaru/electromart.git'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm run lint || true'
                    sh 'npm test || true'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    sh '''
                    docker build -t ${ECR_REGISTRY}/electromart-backend:${IMAGE_TAG} ./backend
                    docker build -t ${ECR_REGISTRY}/electromart-frontend:${IMAGE_TAG} ./frontend
                    '''
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    docker push ${ECR_REGISTRY}/electromart-backend:${IMAGE_TAG}
                    docker push ${ECR_REGISTRY}/electromart-frontend:${IMAGE_TAG}
                    '''
                }
            }
        }
        
        stage('Deploy to AWS') {
            steps {
                script {
                    sh '''
                    # Update ECS service with new image (see AWS section below)
                    aws ecs update-service \
                        --cluster electromart-cluster \
                        --service electromart-backend \
                        --force-new-deployment
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Pipeline succeeded!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
```

Save this as `Jenkinsfile` at repo root.

---

## Part 3: AWS Deployment

### Architecture
```
GitHub (source code)
  ↓
Jenkins (CI/CD)
  ↓
AWS ECR (container registry)
  ↓
AWS ECS / App Runner (run containers)
  ↓
AWS RDS / MongoDB Atlas (database)
```

### Prerequisites
1. AWS account (free tier available)
2. AWS CLI installed
3. IAM user with permissions

### Step 1: Install & Configure AWS CLI

**Install AWS CLI:**
```powershell
# Using Chocolatey
choco install awscli

# Or download from: https://aws.amazon.com/cli/
```

**Configure AWS Credentials:**
```powershell
aws configure
```

Enter:
- AWS Access Key ID: (from IAM user)
- AWS Secret Access Key: (from IAM user)
- Default region: us-east-1
- Default output format: json

**Verify setup:**
```powershell
aws sts get-caller-identity
```

### Step 2: Create ECR (Elastic Container Registry)

**Create ECR repositories:**
```powershell
# Backend repository
aws ecr create-repository --repository-name electromart-backend --region us-east-1

# Frontend repository
aws ecr create-repository --repository-name electromart-frontend --region us-east-1
```

**Get repository URLs:**
```powershell
aws ecr describe-repositories --region us-east-1
```

### Step 3: Build & Push Docker Images to ECR

**Login to ECR:**
```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
```

**Build & tag backend:**
```powershell
cd backend
docker build -t electromart-backend:latest .
docker tag electromart-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/electromart-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/electromart-backend:latest
```

**Build & tag frontend:**
```powershell
cd frontend
docker build -t electromart-frontend:latest .
docker tag electromart-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/electromart-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/electromart-frontend:latest
```

### Step 4: Deploy to AWS App Runner (Simplest)

**Create App Runner service:**
```powershell
# For backend
aws apprunner create-service \
    --service-name electromart-backend \
    --source-configuration RepositoryType=ECR,ImageRepository="{RepositoryArn=arn:aws:ecr:us-east-1:<account-id>:repository/electromart-backend,ImageIdentifier=latest,ImageRepositoryType=ECR_PUBLIC}" \
    --instance-configuration InstanceRoleArn=arn:aws:iam::<account-id>:role/AppRunnerRole \
    --region us-east-1
```

**For frontend:**
```powershell
aws apprunner create-service \
    --service-name electromart-frontend \
    --source-configuration RepositoryType=ECR,ImageRepository="{RepositoryArn=arn:aws:ecr:us-east-1:<account-id>:repository/electromart-frontend,ImageIdentifier=latest,ImageRepositoryType=ECR_PUBLIC}" \
    --instance-configuration InstanceRoleArn=arn:aws:iam::<account-id>:role/AppRunnerRole \
    --region us-east-1
```

**Get service URL:**
```powershell
aws apprunner describe-service --service-arn <service-arn> --region us-east-1
```

### Step 5: Deploy to AWS ECS (More Control)

**Create ECS cluster:**
```powershell
aws ecs create-cluster --cluster-name electromart-cluster
```

**Create task definition (backend):**
```powershell
aws ecs register-task-definition \
    --family electromart-backend \
    --container-definitions '[{"name":"backend","image":"<account-id>.dkr.ecr.us-east-1.amazonaws.com/electromart-backend:latest","portMappings":[{"containerPort":5000,"hostPort":5000}],"environment":[{"name":"MONGODB_URI","value":"mongodb+srv://..."}]}]' \
    --requires-compatibilities FARGATE \
    --network-mode awsvpc \
    --cpu 256 \
    --memory 512
```

**Create ECS service:**
```powershell
aws ecs create-service \
    --cluster electromart-cluster \
    --service-name electromart-backend \
    --task-definition electromart-backend \
    --desired-count 1
```

---

## Workflow Summary

### Local Development
```powershell
npm run dev  # In backend & frontend folders
```

### Docker Compose (Local Testing)
```powershell
docker-compose up --build
```

### Push to Production
```powershell
# 1. Commit code
git add .
git commit -m "Feature: Add new products"
git push origin main

# 2. Jenkins automatically triggers (webhook)
# 3. Jenkins builds, tests, pushes to ECR
# 4. Jenkins deploys to AWS ECS/App Runner
# 5. Your app is live!
```

---

## Environment Variables for AWS

Store secrets in AWS Secrets Manager:
```powershell
aws secretsmanager create-secret \
    --name electromart/mongodb-uri \
    --secret-string "mongodb+srv://user:pass@cluster.mongodb.net/electromart"
```

Then reference in task definition or App Runner config.

---

## Monitoring & Logs

**View ECS service logs:**
```powershell
aws logs get-log-events \
    --log-group-name /ecs/electromart-backend \
    --log-stream-name ecs/electromart-backend/...
```

**View ECR images:**
```powershell
aws ecr describe-images --repository-name electromart-backend
```

---

## Cost Optimization

1. Use **App Runner** for simple deployments (cheaper than ECS)
2. Use **AWS Free Tier** for learning
3. Set **auto-scaling** for variable load
4. Use **CloudFront** for frontend caching

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker build fails | Check Dockerfile, ensure all dependencies in package.json |
| Jenkins can't push to ECR | Verify IAM permissions, AWS credentials configured |
| App Runner deploy fails | Check container logs: `aws apprunner describe-service` |
| MongoDB connection fails | Verify connection string in environment variables |

