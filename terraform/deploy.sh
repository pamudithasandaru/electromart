#!/bin/bash
# Deploy ElectroMart infrastructure using Terraform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}ElectroMart Terraform Deployment${NC}"
echo -e "${YELLOW}================================${NC}"

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed${NC}"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Terraform installed${NC}"
echo -e "${GREEN}✓ AWS CLI installed${NC}"

# Verify AWS credentials
echo -e "\n${YELLOW}Verifying AWS credentials...${NC}"
if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✓ AWS credentials valid (Account: $ACCOUNT_ID)${NC}"
else
    echo -e "${RED}AWS credentials not configured${NC}"
    exit 1
fi

# Initialize Terraform
echo -e "\n${YELLOW}Initializing Terraform...${NC}"
cd "$(dirname "$0")"
terraform init

# Validate configuration
echo -e "\n${YELLOW}Validating Terraform configuration...${NC}"
if terraform validate; then
    echo -e "${GREEN}✓ Configuration is valid${NC}"
else
    echo -e "${RED}Configuration validation failed${NC}"
    exit 1
fi

# Plan deployment
echo -e "\n${YELLOW}Planning deployment...${NC}"
terraform plan -out=tfplan

# Ask for confirmation
echo -e "\n${YELLOW}Review the plan above. Do you want to proceed? (yes/no)${NC}"
read -r confirmation

if [ "$confirmation" != "yes" ]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    rm -f tfplan
    exit 0
fi

# Apply configuration
echo -e "\n${YELLOW}Applying Terraform configuration...${NC}"
terraform apply tfplan

# Display outputs
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n${YELLOW}Access your application:${NC}"
terraform output application_url

echo -e "\n${YELLOW}Other useful outputs:${NC}"
echo -e "ALB DNS: $(terraform output alb_dns_name)"
echo -e "ECS Cluster: $(terraform output ecs_cluster_name)"

echo -e "\n${YELLOW}View logs:${NC}"
echo "Backend:  aws logs tail $(terraform output cloudwatch_log_group_backend) --follow"
echo "Frontend: aws logs tail $(terraform output cloudwatch_log_group_frontend) --follow"

rm -f tfplan

echo -e "\n${GREEN}Done!${NC}"
