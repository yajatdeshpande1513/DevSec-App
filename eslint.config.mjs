import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  // core-web-vitals alone only checks perf/best-practice rules — it doesn't
  // catch eval(), unsafe regex, insecure randomness, etc. This is what
  // actually makes this step deserve the "SAST" label in CI.
  security.configs.recommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
