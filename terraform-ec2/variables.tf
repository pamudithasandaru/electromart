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
  description = "Environment"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "backend_image" {
  description = "Backend Docker image"
  type        = string
  default     = "sang71315/electromart-backend:latest"
}

variable "frontend_image" {
  description = "Frontend Docker image"
  type        = string
  default     = "sang71315/electromart-frontend:latest"
}

variable "mongodb_uri" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}
