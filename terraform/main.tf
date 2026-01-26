resource "vercel_project" "nextjs" {
  name      = "nextjs-devsecops"
  framework = "nextjs"
  
  git_repository = {
    type = "github"
    repo = "yajatdeshpande1513/DevSec-App"
  }
}

# Add a protection rule for the production branch
resource "vercel_project_deployment_retention" "retention" {
  project_id = vercel_project.nextjs.id
  production_retention_period = 30
}