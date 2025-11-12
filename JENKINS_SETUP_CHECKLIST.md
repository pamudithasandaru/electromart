# Jenkins Setup - What You Have vs. What You Need to Do

## ✅ What You've ALREADY Done

### 1. **Jenkinsfile Created** ✓
- Location: `/Jenkinsfile` (at root)
- Includes complete CI/CD pipeline with stages:
  - ✅ Checkout from GitHub
  - ✅ Build Backend (npm ci, lint, test)
  - ✅ Build Frontend (npm ci, build)
  - ✅ Build Docker Images
  - ✅ Push to ECR (Elastic Container Registry)
  - ✅ Deploy to ECS (only on main branch)
  - ✅ Verify Deployment

### 2. **CloudFormation Template** ✓
- Location: `/infrastructure/electromart-stack.yaml`
- Defines AWS resources:
  - ECS Cluster
  - ECR Repositories
  - Security Groups
  - IAM Roles
  - Task Definitions
  - Services

### 3. **Documentation** ✓
- DOCKER_JENKINS_AWS_GUIDE.md
- DEPLOYMENT_GUIDE.md
- QUICK_REFERENCE.md

---

## 🔄 What You STILL Need to Do (To Activate Jenkins)

### **Step 1: Install & Run Jenkins Locally**

```powershell
# Option 1: Using Docker (Recommended)
docker run -d -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins:lts

# Get initial password (needed for first login)
docker logs jenkins

# Access Jenkins
# Open: http://localhost:8080
```

**Or Option 2: Install directly on Windows**
- Download: https://www.jenkins.io/download/
- Follow Windows installer

---

### **Step 2: Initial Jenkins Setup**

1. Open http://localhost:8080
2. Enter the admin password from logs
3. Click "Install suggested plugins"
4. Create first admin user
5. Complete setup

---

### **Step 3: Install Required Jenkins Plugins**

Go to **Manage Jenkins → Manage Plugins → Available**

Search for and install:
- [ ] **Docker Pipeline** - Build and push Docker images
- [ ] **Docker** - Docker integration
- [ ] **Pipeline** - Jenkins pipeline support
- [ ] **Git** - GitHub integration
- [ ] **AWS Steps** - AWS CLI commands
- [ ] **Blue Ocean** - Better pipeline visualization

---

### **Step 4: Add AWS Credentials to Jenkins**

1. Go to **Manage Jenkins → Manage Credentials**
2. Click **Global** scope
3. Click **Add Credentials**
4. Select: **AWS Credentials**
5. Enter:
   - Access Key ID: `YOUR_AWS_ACCESS_KEY`
   - Secret Access Key: `YOUR_AWS_SECRET_KEY`
   - ID: `aws-credentials`

---

### **Step 5: Create Jenkins Pipeline Job**

1. Click **New Item**
2. Enter name: `ElectroMart`
3. Select: **Pipeline**
4. Click **OK**
5. Under **Pipeline** section, select:
   - **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/pamudithasandaru/electromart.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
6. Click **Save**
7. Click **Build Now** to test

---

### **Step 6: Configure GitHub Webhook (Optional but Recommended)**

This makes Jenkins automatically run when you push code:

1. Go to your GitHub repo
2. Settings → Webhooks → Add webhook
3. Payload URL: `http://YOUR_JENKINS_URL:8080/github-webhook/`
4. Content type: `application/json`
5. Let me know when you push!
6. Click **Add webhook**

---

### **Step 7: Setup AWS Resources**

Before Jenkins can deploy, AWS needs the infrastructure:

```powershell
# Deploy CloudFormation stack
aws cloudformation create-stack `
  --stack-name electromart-stack `
  --template-body file://infrastructure/electromart-stack.yaml `
  --region us-east-1 `
  --capabilities CAPABILITY_IAM
```

This creates:
- ECR repositories
- ECS cluster
- Networking setup
- Security groups

---

## 📊 Jenkins Pipeline Flow (What Will Happen)

```
You push code to GitHub
           ↓
GitHub triggers Jenkins webhook
           ↓
Jenkins Pipeline Starts:
   ① Checkout code
   ② Build backend (npm ci, test, lint)
   ③ Build frontend (npm ci, build)
   ④ Build Docker images
   ⑤ Push to ECR
   ⑥ Deploy to ECS (if on 'main' branch)
   ⑦ Verify deployment
           ↓
Your app running on AWS ECS!
```

---

## 🎯 Quick Checklist

### To Get Jenkins Running:

- [ ] Install Jenkins (Docker or Windows)
- [ ] Access http://localhost:8080
- [ ] Install recommended plugins
- [ ] Install Docker, AWS Steps, Blue Ocean plugins
- [ ] Add AWS credentials
- [ ] Create "ElectroMart" Pipeline job
- [ ] Point to: `https://github.com/pamudithasandaru/electromart.git`
- [ ] Set script path: `Jenkinsfile`
- [ ] Click "Build Now"
- [ ] Watch the pipeline run!

### To Deploy to AWS:

- [ ] Setup AWS account and credentials
- [ ] Deploy CloudFormation stack
- [ ] Jenkins will automatically push to ECR & deploy to ECS

---

## ⚠️ Important Notes

1. **Your Jenkinsfile is ready** - No changes needed!
2. **CloudFormation template is ready** - Just deploy it
3. **You need AWS account** - Jenkins will push images to ECR
4. **GitHub webhook is optional** - For now, you can click "Build Now" manually

---

## 🚀 Next Steps

1. Install Jenkins locally (Docker easiest)
2. Configure plugins and AWS credentials
3. Create the pipeline job
4. Test with "Build Now"
5. Once working, setup AWS resources and deploy!

Would you like me to help with any of these steps?
