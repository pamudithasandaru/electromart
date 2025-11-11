#!/bin/bash
# Build and push Docker images to AWS ECR

set -e

AWS_REGION=${AWS_REGION:-"us-east-1"}
PROJECT_NAME="electromart"
IMAGE_TAG=${IMAGE_TAG:-"latest"}

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "🐳 ElectroMart Docker Build & Push"
echo "===================================="
echo "Registry: $ECR_REGISTRY"
echo "Image Tag: $IMAGE_TAG"
echo ""

# Step 1: Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
    docker login --username AWS --password-stdin "$ECR_REGISTRY"

# Step 2: Build and push backend
echo ""
echo "📦 Building and pushing backend..."
BACKEND_IMAGE="${ECR_REGISTRY}/${PROJECT_NAME}-backend:${IMAGE_TAG}"
docker build -t "$BACKEND_IMAGE" ./backend
docker push "$BACKEND_IMAGE"
echo "✅ Backend pushed: $BACKEND_IMAGE"

# Step 3: Build and push frontend
echo ""
echo "📦 Building and pushing frontend..."
FRONTEND_IMAGE="${ECR_REGISTRY}/${PROJECT_NAME}-frontend:${IMAGE_TAG}"
docker build -t "$FRONTEND_IMAGE" ./frontend
docker push "$FRONTEND_IMAGE"
echo "✅ Frontend pushed: $FRONTEND_IMAGE"

echo ""
echo "✅ All images built and pushed successfully!"
echo ""
echo "Images:"
echo "  - Backend: $BACKEND_IMAGE"
echo "  - Frontend: $FRONTEND_IMAGE"
