# ============================================================
# Default Variable Values — AWS Academy
# ============================================================

aws_region     = "us-east-1"
project_name   = "shopsmart"
environment    = "production"
s3_bucket_name = "shopsmart-artifacts-sainath2212"

# Networking
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]

# Container ports
backend_container_port  = 5001
frontend_container_port = 80

# ECS configuration
ecs_task_cpu     = 256
ecs_task_memory  = 512
ecs_desired_count = 1

# EKS configuration
eks_node_instance_type = "t3.medium"
eks_node_desired       = 2
eks_node_min           = 2
eks_node_max           = 3
