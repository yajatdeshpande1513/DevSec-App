import "../styles/globals.css";

export const metadata = {
  title: "DevSecOps | Automated Security Pipeline",
  description: "Real-time CI/CD security monitoring dashboard — Gitleaks, Snyk, SonarQube, Trivy, Checkov.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}