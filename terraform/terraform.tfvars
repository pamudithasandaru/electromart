aws_region = "us-east-1"
project_name = "electromart"
environment = "prod"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

# Container Configuration
container_port_backend  = 5000
container_port_frontend = 80

# Docker Images
backend_image  = "sang71315/electromart-backend:latest"
frontend_image = "sang71315/electromart-frontend:latest"

# ECS Configuration
ecs_task_cpu = "256"
ecs_task_memory = "512"
desired_count = 2

# Database Configuration
enable_mongodb = false
# MongoDB Atlas connection string
mongodb_uri = "mongodb+srv://pamudithasandaru2002_db_user:dFnwOBk7KTdzTNuP@cluster0.s2fli9w.mongodb.net/electromart1?retryWrites=true&w=majority"
mongodb_password = ""
