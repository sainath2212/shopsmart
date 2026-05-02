# ============================================================
# Terraform Provider Configuration
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state backend — persists state across CI runs
  # The state bucket is created by the pipeline bootstrap step
  backend "s3" {
    bucket = "shopsmart-tfstate-sainath2212"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data source to get current AWS account ID and caller identity
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
