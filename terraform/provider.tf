terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

# The provider will automatically look for VERCEL_API_TOKEN in your environment
provider "vercel" {
  api_token = var.vercel_token
}
