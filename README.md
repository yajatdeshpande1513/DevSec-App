# DevSecOps Pipeline Dashboard

![DevSecOps Dashboard](https://img.shields.io/badge/DevSecOps-Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white)

A comprehensive DevSecOps pipeline and real-time visualization dashboard. This project integrates automated security scanning into the CI/CD workflow and surfaces the results in a beautiful, real-time React (Next.js) dashboard, ensuring security is never an afterthought.

## 🌟 Overview

Rather than digging through raw CI logs to understand the security posture of a build, **DevSec-App** runs a suite of security tools during every GitHub Actions run and publishes a summarized, live status report to a sleek frontend dashboard.

### Security Gates Included:
- **Gitleaks**: Secret scanning (preventing leaked API keys and tokens)
- **SonarQube**: Static Application Security Testing (SAST)
- **Snyk**: Dependency & vulnerability scanning (SCA)
- **Trivy**: Container image scanning
- **Checkov**: Infrastructure as Code (IaC) scanning for Terraform

---

## 🏗️ Architecture

1. **Trigger**: A developer pushes code to `main` (or opens a PR).
2. **GitHub Actions**: The `security.yml` workflow orchestrates a series of parallel and sequential security scans.
3. **Evaluation**: If any scan fails critically, the build is marked as `vulnerable` and deployment is halted.
4. **Reporting**: The workflow sends a signed `POST` request with a webhook secret to the Next.js API route (`/api/security-report`).
5. **Storage**: The Next.js API verifies the webhook signature and stores the latest report in an **Upstash Redis** database.
6. **Visualization**: The Next.js frontend polls the API, rendering a highly polished, responsive dashboard indicating the system's current security posture.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- An [Upstash Redis](https://upstash.com/) database (Free tier is sufficient)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/DevSec-App.git
cd DevSec-App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file based on the provided template:
```bash
cp .env.example .env
```
Fill in your Upstash Redis credentials and choose a strong `REPORT_WEBHOOK_SECRET`.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 GitHub Actions Setup

To enable the CI/CD pipeline in your own fork, you need to configure the following **Repository Secrets** in GitHub:

- `SONAR_TOKEN`: Token for SonarCloud/SonarQube analysis.
- `SNYK_TOKEN`: Token for Snyk dependency scanning.
- `VERCEL_TOKEN`: Token for automated deployment to Vercel (optional, if you use Vercel).
- `REPORT_WEBHOOK_SECRET`: A secure string used to authenticate the webhook from GitHub Actions to your Next.js API. Must match your `.env` value.
- `WEBHOOK_URL`: The full URL to your deployed API endpoint (e.g., `https://your-domain.com/api/security-report`).

---

## 🎨 UI/UX Features

- **Dynamic State Rendering**: The UI smoothly transitions colors, glows, and animations based on the `secure`, `vulnerable`, or `error` state.
- **Glassmorphism**: Premium frosted glass effects using Tailwind CSS backdrop blurs.
- **Micro-interactions**: Hover effects, pulse animations, and animated gradients for a "live operations center" feel.

---

*Designed and built with security in mind.*
