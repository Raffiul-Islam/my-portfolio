import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    ".tools/**",
    ".resume-build/**",
    ".resume-backups/**",
    "next-env.d.ts",
    // Browser worker copied from pdfjs-dist; it is a generated vendor asset.
    "public/pdf.worker.min.mjs",
  ]),
]);

export default eslintConfig;
