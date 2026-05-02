# ============================================================
# ShopSmart — Terraform Infrastructure
# ============================================================
#
# This is the root module. All resources are organized into
# separate files by concern:
#
#   providers.tf    — AWS provider and data sources
#   variables.tf    — Input variables
#   terraform.tfvars — Default variable values
#   s3.tf           — S3 artifact bucket
#   ecr.tf          — ECR container repositories
#   vpc.tf          — VPC, subnets, gateways, route tables
#   ecs.tf          — ECS cluster, ALB, task definitions, services
#   eks.tf          — EKS cluster, managed node group
#   outputs.tf      — Output values
#
# Usage:
#   terraform init
#   terraform validate
#   terraform plan -out=tfplan
#   terraform apply tfplan
#
# ============================================================
