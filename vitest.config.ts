import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", ".next", "drizzle"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "drizzle/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
