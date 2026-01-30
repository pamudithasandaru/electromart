#!/bin/bash
# Quick status check for ElectroMart deployment

set -e

echo "================================"
echo "ElectroMart Deployment Status"
echo "================================"

cd "$(dirname "$0")"

echo -e "\n📊 Infrastructure Outputs:"
terraform output

echo -e "\n🔗 Application URL:"
APP_URL=$(terraform output -raw application_url)
echo "$APP_URL"

echo -e "\n📈 ECS Services Status:"
CLUSTER=$(terraform output -raw ecs_cluster_name)
aws ecs list-services --cluster "$CLUSTER" --query 'serviceArns' --output text

echo -e "\n📋 Backend Service Status:"
aws ecs describe-services \
  --cluster "$CLUSTER" \
  --services "electromart-backend-service" \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}'

echo -e "\n📋 Frontend Service Status:"
aws ecs describe-services \
  --cluster "$CLUSTER" \
  --services "electromart-frontend-service" \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}'

echo -e "\n🎯 ALB Target Health:"
ALB=$(terraform output -raw alb_dns_name)
ALB_ARN=$(aws elbv2 describe-load-balancers --query "LoadBalancers[?DNSName=='$ALB'].LoadBalancerArn" --output text)
TARGET_GROUPS=$(aws elbv2 describe-target-groups --load-balancer-arn "$ALB_ARN" --query 'TargetGroups[*].TargetGroupArn' --output text)

for TG in $TARGET_GROUPS; do
    echo "Target Group: $(echo $TG | awk -F: '{print $NF}')"
    aws elbv2 describe-target-health --target-group-arn "$TG" --query 'TargetHealthDescriptions[*].{Target:Target.Id,State:TargetHealth.State}' --output table
done

echo -e "\n✅ Status check complete!"
