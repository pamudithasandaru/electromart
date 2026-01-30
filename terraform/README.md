# ElectroMart Terraform Setup

This directory contains Terraform Infrastructure as Code (IaC) to deploy the ElectroMart application to AWS.

## Architecture

The Terraform configuration deploys:
- **VPC** with public and private subnets across 2 availability zones
- **Application Load Balancer (ALB)** for traffic distribution
- **ECS Fargate** cluster running containerized backend and frontend services
- **DocumentDB** (MongoDB-compatible) for the database
- **ECR** repositories for container images
- **CloudWatch** Log Groups for monitoring
- **NAT Gateways** for secure private subnet internet access

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Terraform** >= 1.0 installed
3. **AWS CLI** configured with credentials
4. Docker images pushed to Docker Hub:
   - `sang71315/electromart-backend:latest`
   - `sang71315/electromart-frontend:latest`

## Setup

### 1. Configure Variables

Create `terraform.tfvars` from the example:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your desired values:

```hcl
aws_region = "us-east-1"
project_name = "electromart"
environment = "prod"
```

### 2. Set Sensitive Variables

Set the MongoDB password securely using environment variables:

```bash
export TF_VAR_mongodb_password="your-secure-password"
```

Or add to `terraform.tfvars`:

```hcl
mongodb_password = "your-secure-password"
```

### 3. Initialize Terraform

```bash
terraform init
```

### 4. Plan Deployment

```bash
terraform plan -out=tfplan
```

Review the plan to ensure all resources are correct.

### 5. Apply Configuration

```bash
terraform apply tfplan
```

This will create:
- VPC with networking infrastructure
- ECS cluster with 2 services (backend & frontend)
- DocumentDB cluster for data storage
- Load balancer routing traffic
- CloudWatch logs for monitoring

### 6. Access Application

Once deployment completes, Terraform outputs the ALB DNS name:

```bash
terraform output application_url
```

Navigate to this URL to access your ElectroMart application.

## Key Resources

### Networking
- **VPC**: 10.0.0.0/16 CIDR block
- **Public Subnets**: For ALB (2 zones)
- **Private Subnets**: For ECS tasks and database (2 zones)
- **NAT Gateways**: For secure outbound traffic from private subnets
- **Security Groups**: Separate for ALB, ECS tasks, and DocumentDB

### Compute
- **ECS Cluster**: Fargate launch type
- **Backend Service**: Running backend API (port 5000)
- **Frontend Service**: Running React app via Nginx (port 80)
- **Task Definition**: 256 CPU, 512 MB memory per task
- **Desired Count**: 2 tasks per service for HA

### Database
- **DocumentDB Cluster**: MongoDB-compatible, multi-AZ
- **Cluster Instances**: 2 instances for redundancy
- **Storage Encrypted**: Yes
- **Backup Retention**: 7 days

### Monitoring
- **CloudWatch Log Groups**: Backend and frontend logs retained 7 days
- **Container Insights**: Enabled for cluster monitoring
- **Health Checks**: ALB configured with path-based checks

## Important Configuration Details

### API Routing
- Frontend requests to `/api/*` are routed to backend via ALB listener rules
- Other requests served by frontend (React SPA)

### Environment Variables
- Backend receives `MONGODB_URI` with DocumentDB endpoint
- Frontend built with Nginx reverse proxy configured

### Security
- All sensitive data (passwords) should use Terraform variables
- DocumentDB uses TLS encryption
- Private subnets restrict direct internet access
- NAT gateways provide secure outbound connectivity

## Destroying Resources

To delete all AWS resources:

```bash
terraform destroy
```

**Warning**: This will delete the DocumentDB cluster and all data. Ensure backups are taken if needed.

## Customization

### Change Database Type
To disable DocumentDB and use your own MongoDB:

```bash
terraform apply -var="enable_mongodb=false"
```

Then update backend environment variables with your MongoDB endpoint.

### Scale Services
Increase desired task count:

```bash
terraform apply -var="desired_count=4"
```

### Adjust Task Resources
For more powerful instances:

```bash
terraform apply -var="ecs_task_cpu=512" -var="ecs_task_memory=1024"
```

## State Management

By default, Terraform state is stored locally. For production, use S3 backend:

Uncomment the backend configuration in `main.tf` and run:

```bash
terraform init
```

This will prompt you to migrate state to S3.

## Troubleshooting

### ECS Tasks not starting
Check CloudWatch logs:

```bash
aws logs tail /ecs/electromart-backend --follow
aws logs tail /ecs/electromart-frontend --follow
```

### Application unreachable
- Verify ALB is healthy: `aws elbv2 describe-load-balancers`
- Check target group health: `aws elbv2 describe-target-health`
- Verify security group rules allow traffic

### DocumentDB connection issues
- Ensure backend is in private subnet with DocumentDB
- Verify security group allows port 27017 between ECS and DocumentDB
- Check connection string in environment variables

## Outputs

After successful `terraform apply`, view outputs:

```bash
terraform output
```

Key outputs:
- `application_url`: URL to access the application
- `alb_dns_name`: Load balancer DNS
- `ecs_cluster_name`: ECS cluster name
- `ecr_backend_repository_url`: Backend ECR repository
- `ecr_frontend_repository_url`: Frontend ECR repository
- `documentdb_cluster_endpoint`: Database endpoint
- `cloudwatch_log_group_*`: Log group names for debugging

## Next Steps

1. Set up continuous deployment (CI/CD)
2. Configure custom domain with Route 53
3. Add SSL/TLS with ACM certificates
4. Set up automated backups for DocumentDB
5. Enable auto-scaling based on metrics
6. Configure SNS alerts for infrastructure health

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review Terraform state: `terraform state list`
3. Verify AWS credentials and permissions
4. Consult AWS documentation for specific services
