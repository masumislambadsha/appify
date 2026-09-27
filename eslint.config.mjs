import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    extends: [...nextCoreWebVitals, ...nextTypescript],
  },
  {
    // Vendored third-party WebGL component (FeralUI export, do not edit):
    // its engine intentionally writes refs and schedules outside render.
    ignores: ["components/ui/glass-headline-hero.tsx"],
  },
]);
