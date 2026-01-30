#!/bin/bash
# Destroy ElectroMart infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}================================${NC}"
echo -e "${RED}WARNING: Destroying Infrastructure!${NC}"
echo -e "${RED}================================${NC}"

echo -e "${YELLOW}\nThis will delete:${NC}"
echo "  - VPC and all networking resources"
echo "  - ECS cluster and services"
echo "  - DocumentDB cluster and data"
echo "  - Load balancer and related resources"
echo "  - CloudWatch log groups"
echo "  - All other managed resources"

echo -e "\n${RED}This action cannot be undone!${NC}"
echo -e "${YELLOW}Type 'destroy-electromart' to confirm:${NC}"
read -r confirmation

if [ "$confirmation" != "destroy-electromart" ]; then
    echo -e "${GREEN}Destroy cancelled${NC}"
    exit 0
fi

cd "$(dirname "$0")"

echo -e "\n${YELLOW}Destroying infrastructure...${NC}"
terraform destroy

echo -e "\n${GREEN}Infrastructure destroyed${NC}"
