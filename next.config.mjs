/**
 * NOTE: I never saw your full original next.config.mjs — only the `headers()`
 * block, quoted back to me earlier in this conversation. If your original
 * file had other config (images, redirects, rewrites, etc.), merge that
 * back in — this file only reconstructs what I've verified.
 *
 * `experimental.reactCompiler` added because `babel-plugin-react-compiler`
 * is in package.json's devDependencies but wasn't enabled anywhere.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables a minimal standalone server output — required for the Dockerfile,
  // which copies only .next/standalone + .next/static instead of the full
  // node_modules.
  output: 'standalone',

  experimental: {
    reactCompiler: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // 'unsafe-inline' removed from script-src. If you rely on inline
            // <script> tags anywhere, switch to a nonce-based CSP via Next.js
            // middleware instead of re-adding 'unsafe-inline' here.
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
