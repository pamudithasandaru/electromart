# Step-by-Step: Create Jenkins Pipeline Job

## Your Jenkins Credentials

**Jenkins URL:** http://localhost:8080
**Initial Admin Password:** `1f0e0bf170324a4c92c0a122aa5806b8`

---

## Step 1: Open Jenkins

1. Open your browser
2. Go to: **http://localhost:8080**
3. You should see a Jenkins login page

```
╔════════════════════════════════════════╗
║  Unlock Jenkins                        ║
║                                        ║
║  To ensure Jenkins is securely set    ║
║  up, the administrator password is    ║
║  required on first start.             ║
║                                        ║
║  [Paste the password below]            ║
║  ┌──────────────────────────────────┐ ║
║  │1f0e0bf170324a4c92c0a122aa5806b8 │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║              [Continue]                ║
╚════════════════════════════════════════╝
```

---

## Step 2: Enter Initial Admin Password

1. Copy this password: **`1f0e0bf170324a4c92c0a122aa5806b8`**
2. Paste it into the password field
3. Click **"Continue"**

---

## Step 3: Install Plugins

After entering the password, you'll see:

```
╔════════════════════════════════════════╗
║  Customize Jenkins                    ║
║                                        ║
║  ○ Install suggested plugins           ║
║  ○ Select plugins to install           ║
╚════════════════════════════════════════╝
```

✅ **Click: "Install suggested plugins"** (recommended)

This will install Docker, Pipeline, Git, and other essential plugins.

**Wait for installation to complete (~5-10 minutes)**

---

## Step 4: Create First Admin User

After plugins are installed:

```
╔════════════════════════════════════════╗
║  Create First Admin User              ║
║                                        ║
║  Username:    [________________]       ║
║  Password:    [________________]       ║
║  Confirm:     [________________]       ║
║  Full Name:   [________________]       ║
║  Email:       [________________]       ║
║                                        ║
║        [Create User]  [Skip]           ║
╚════════════════════════════════════════╝
```

**Example:**
- Username: `admin`
- Password: `password123` (or your choice)
- Full Name: `Admin User`
- Email: `admin@electromart.local`

Click **"Create User"**

---

## Step 5: Jenkins Configuration

Next page shows:

```
╔════════════════════════════════════════╗
║  Instance Configuration              ║
║                                        ║
║  Jenkins URL: http://localhost:8080/   ║
║                                        ║
║             [Save and Continue]        ║
╚════════════════════════════════════════╝
```

Click **"Save and Continue"**

---

## Step 6: Jenkins Ready

You'll see:

```
╔════════════════════════════════════════╗
║  Jenkins is ready!                    ║
║                                        ║
║           [Start using Jenkins]        ║
╚════════════════════════════════════════╝
```

Click **"Start using Jenkins"**

✅ **Jenkins is now running!**

---

## Step 7: Create New Pipeline Job

Now you're on the Jenkins Dashboard. **This is where you create your pipeline job:**

1. Look for button that says **"New Item"** (top left)
   ```
   [+ New Item]  [+ New View]  [+ New Job]
   ```

2. Click **"New Item"**

---

## Step 8: Configure Job - Part 1 (Item Name)

You'll see a form:

```
╔════════════════════════════════════════════════════════════╗
║  New Item                                                 ║
║                                                            ║
║  Enter an item name                                        ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ ElectroMart                                          │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  Choose a job type:                                        ║
║  ◯ Freestyle job                                           ║
║  ◯ Pipeline                        ←← SELECT THIS ONE     ║
║  ◯ Multibranch Pipeline                                    ║
║  ◯ Organization Folder                                    ║
║                                                            ║
║              [Create]  [Cancel]                           ║
╚════════════════════════════════════════════════════════════╝
```

**Steps:**
1. In the **"Enter an item name"** field, type: **`ElectroMart`**
2. Select: **"Pipeline"** (click the radio button)
3. Click **"Create"**

---

## Step 9: Configure Job - Part 2 (Pipeline Configuration)

You'll now see the job configuration page. Scroll down to find the **"Pipeline"** section:

```
╔════════════════════════════════════════════════════════════╗
║  Pipeline                                                  ║
║                                                            ║
║  Definition: [▼ Pipeline script from SCM]  ← SELECT THIS  ║
║                                                            ║
║  SCM: [▼ Git]  ← SELECT THIS                              ║
║                                                            ║
║  Repository URL:                                           ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ https://github.com/pamudithasandaru/electromart.git  │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  Branches to build:                                        ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ */main                                               │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  Script Path:                                              ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Jenkinsfile                    ← THIS ONE           │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║        [Save]  [Cancel]                                   ║
╚════════════════════════════════════════════════════════════╝
```

**Fill in these fields:**

### Field 1: Definition
- Click the dropdown: **"Pipeline script from SCM"**

### Field 2: SCM
- Click the dropdown: **"Git"**

### Field 3: Repository URL
```
https://github.com/pamudithasandaru/electromart.git
```

### Field 4: Branches to build
```
*/main
```
(default is usually correct)

### Field 5: Script Path
```
Jenkinsfile
```

---

## Step 10: Save the Job

After filling all fields, click **"Save"** at the bottom

```
You should see the job configuration is saved and you're on the job page:

╔════════════════════════════════════════╗
║  ElectroMart                          ║
║                                        ║
║  [Build Now]  [Delete Job]  [Config] ║
║                                        ║
║  No builds yet.                       ║
╚════════════════════════════════════════╝
```

---

## Step 11: Test the Pipeline

Now click **"Build Now"** to test if the pipeline works:

```
[Build Now]
```

Jenkins will:
1. Clone your GitHub repo
2. Read the Jenkinsfile
3. Run each stage:
   - ✓ Checkout
   - ✓ Build Backend
   - ✓ Build Frontend
   - ✓ Build Docker Images
   - ✓ Push to ECR (may fail if AWS creds not added)
   - ✓ Deploy to ECS (may fail if AWS resources not created)

---

## Expected Output

After clicking "Build Now", you'll see:

```
╔════════════════════════════════════════════════════════════╗
║  ElectroMart                                               ║
║                                                            ║
║  Build History                                             ║
║  ┌────────────────────────────────────────────────────┐   ║
║  │ #1                                                  │   ║
║  │ Started: 2025-11-12 (running...)                   │   ║
║  │ Progress: ████████░░░░░░░░░░░░░░ 35%               │   ║
║  └────────────────────────────────────────────────────┘   ║
║                                                            ║
║  Click on #1 to see live logs                            ║
╚════════════════════════════════════════════════════════════╝
```

Click on **"#1"** to see detailed logs of the build.

---

## ✅ You're Done!

Your Jenkins Pipeline Job is now created and ready to:

1. **Pull your code from GitHub** ✓
2. **Build backend and frontend** ✓
3. **Build Docker images** ✓
4. **Push to ECR** (after AWS setup) 
5. **Deploy to ECS** (after AWS setup)

---

## Next Steps (Optional)

### To enable AWS deployment:

1. Add AWS credentials to Jenkins
2. Deploy the CloudFormation stack
3. Jenkins will automatically push images and deploy!

### To auto-run on every push:

1. Setup GitHub webhook
2. Jenkins runs every time you push to main branch

---

## Troubleshooting

**Build fails at "Build Backend" or "Build Frontend"?**
- Jenkins might not have npm installed
- Solution: Install Node.js inside Jenkins container or use a Docker-based agent

**Build fails at "Push to ECR"?**
- AWS credentials not configured
- Solution: Add AWS credentials in Jenkins (Manage Jenkins → Credentials)

**Can't clone GitHub repo?**
- Check GitHub URL is correct
- Solution: Verify URL: `https://github.com/pamudithasandaru/electromart.git`

---

## Quick Reference

| Field | Value |
|-------|-------|
| Job Name | ElectroMart |
| Definition | Pipeline script from SCM |
| SCM | Git |
| Repository URL | https://github.com/pamudithasandaru/electromart.git |
| Branch | */main |
| Script Path | Jenkinsfile |

