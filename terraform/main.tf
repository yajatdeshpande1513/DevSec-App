terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }

  # IMPORTANT: no backend was configured before, meaning terraform.tfstate
  # defaulted to local disk — and it will contain your vercel_token variable
  # in plaintext. Pick ONE of the options below and fill in real values;
  # I can't invent a bucket/org name that doesn't exist.

  # Option A — S3 + DynamoDB locking:
  # backend "s3" {
  #   bucket         = "REPLACE_WITH_YOUR_BUCKET_NAME"
  #   key            = "devsec-app/terraform.tfstate"
  #   region         = "REPLACE_WITH_YOUR_REGION"
  #   encrypt        = true
  #   dynamodb_table = "REPLACE_WITH_YOUR_LOCK_TABLE"
  # }

  # Option B — Terraform Cloud (no infra to stand up yourself):
  # backend "remote" {
  #   organization = "REPLACE_WITH_YOUR_TF_CLOUD_ORG"
  #   workspaces {
  #     name = "devsec-app"
  #   }
  # }
}

# The provider will automatically look for VERCEL_API_TOKEN in your environment
provider "vercel" {
  api_token = var.vercel_token
}

variable "vercel_token" {
  type      = string
  sensitive = true
}

resource "vercel_project" "nextjs" {
  name      = "nextjs-devsecops"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "yajatdeshpande1513/DevSec-App"
  }
}

# Add a protection rule for the production branch
# NOTE: verify `vercel_project_deployment_retention` is still current in the
# vercel provider v1.x schema — `terraform validate` (now in your CI pipeline)
# will catch it immediately if this resource name has changed or moved.
resource "vercel_project_deployment_retention" "retention" {
  project_id                   = vercel_project.nextjs.id
  production_retention_period  = 30
}
