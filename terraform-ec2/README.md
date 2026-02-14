# ElectroMart EC2 Deployment

This Terraform creates an EC2 instance running your Docker containers.

## What Gets Created

- VPC with public subnet
- EC2 instance (t3.small) with Docker installed
- Security group allowing HTTP (80), HTTPS (443), SSH (22), API (5000)
- Elastic IP for consistent public address

## Prerequisites

### 1. Generate SSH Key Pair

Run this command to generate an SSH key:

```bash
ssh-keygen -t rsa -b 4096 -f electromart-key -N ""
```

This creates:
- `electromart-key` (private key - keep safe!)
- `electromart-key.pub` (public key - paste in terraform.tfvars)

### 2. Update terraform.tfvars

Edit `terraform.tfvars` and replace `PASTE_YOUR_PUBLIC_KEY_HERE` with the contents of `electromart-key.pub`:

```bash
cat electromart-key.pub
```

### 3. Configure AWS Credentials

```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

## Deploy

```bash
terraform init
terraform plan
terraform apply
```

## Access

After deployment:
- **Frontend**: http://<PUBLIC_IP>
- **Backend API**: http://<PUBLIC_IP>:5000
- **SSH**: `ssh -i electromart-key ec2-user@<PUBLIC_IP>`

## Update Containers on EC2

SSH into the instance and run:

```bash
cd /home/ec2-user/electromart
docker-compose pull
docker-compose up -d
```

## Destroy

```bash
terraform destroy
```
