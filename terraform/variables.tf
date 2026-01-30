variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "electromart"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "container_port_backend" {
  description = "Backend container port"
  type        = number
  default     = 5000
}

variable "container_port_frontend" {
  description = "Frontend container port"
  type        = number
  default     = 80
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
  default     = "sang71315/electromart-backend:latest"
}

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
  default     = "sang71315/electromart-frontend:latest"
}

variable "mongodb_port" {
  description = "MongoDB port"
  type        = number
  default     = 27017
}

variable "ecs_task_cpu" {
  description = "ECS task CPU"
  type        = string
  default     = "256"
}

variable "ecs_task_memory" {
  description = "ECS task memory"
  type        = string
  default     = "512"
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "enable_mongodb" {
  description = "Enable MongoDB DocumentDB"
  type        = bool
  default     = true
}

variable "mongodb_username" {
  description = "MongoDB master username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "mongodb_password" {
  description = "MongoDB master password"
  type        = string
  sensitive   = true
}
