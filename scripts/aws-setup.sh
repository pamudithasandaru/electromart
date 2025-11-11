#!/bin/bash
# AWS setup script for ElectroMart
# Run this once to set up AWS infrastructure

set -e

AWS_REGION=${AWS_REGION:-"us-east-1"}
PROJECT_NAME="electromart"

echo "🚀 ElectroMart AWS Setup"
echo "========================"

# Step 1: Get AWS Account ID
echo "📋 Getting AWS Account ID..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $AWS_ACCOUNT_ID"

# Step 2: Create ECR Repositories
echo ""
echo "📦 Creating ECR Repositories..."

for repo in backend frontend; do
    repo_name="${PROJECT_NAME}-${repo}"
    echo "Creating repository: $repo_name"
    aws ecr create-repository \
        --repository-name "$repo_name" \
        --region "$AWS_REGION" 2>/dev/null || echo "Repository already exists: $repo_name"
done

# Step 3: Create ECS Cluster
echo ""
echo "🐳 Creating ECS Cluster..."
CLUSTER_NAME="${PROJECT_NAME}-cluster"
aws ecs create-cluster \
    --cluster-name "$CLUSTER_NAME" \
    --region "$AWS_REGION" 2>/dev/null || echo "Cluster already exists: $CLUSTER_NAME"

# Step 4: Create CloudWatch Log Groups
echo ""
echo "📊 Creating CloudWatch Log Groups..."

for service in backend frontend; do
    log_group="/ecs/${PROJECT_NAME}-${service}"
    echo "Creating log group: $log_group"
    aws logs create-log-group \
        --log-group-name "$log_group" \
        --region "$AWS_REGION" 2>/dev/null || echo "Log group already exists: $log_group"
done

# Step 5: Create IAM Role for ECS Tasks
echo ""
echo "🔐 Creating IAM Role for ECS Tasks..."
ROLE_NAME="${PROJECT_NAME}-ecs-task-role"

# Create trust policy
cat > /tmp/trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document file:///tmp/trust-policy.json 2>/dev/null || echo "Role already exists: $ROLE_NAME"

# Attach policy to allow ECR pull
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" 2>/dev/null || echo "Policy already attached"

echo ""
echo "✅ AWS Infrastructure Setup Complete!"
echo ""
echo "📝 Summary:"
echo "  - AWS Account ID: $AWS_ACCOUNT_ID"
echo "  - Region: $AWS_REGION"
echo "  - ECR Repositories: ${PROJECT_NAME}-backend, ${PROJECT_NAME}-frontend"
echo "  - ECS Cluster: $CLUSTER_NAME"
echo "  - Log Groups: /ecs/${PROJECT_NAME}-backend, /ecs/${PROJECT_NAME}-frontend"
echo ""
echo "Next steps:"
echo "  1. Build and push Docker images:"
echo "     ./scripts/build-and-push.sh"
echo "  2. Create ECS services:"
echo "     ./scripts/create-ecs-services.sh"
