import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // `server-only` throws when imported outside an RSC build. Stub it so the
      // pure functions in server modules remain unit-testable; the guard still
      // applies in the real Next.js build.
      "server-only": new URL("./test/stubs/server-only.ts", import.meta.url)
        .pathname,
    },
  },
  test: {
    pool: "threads",
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Playwright specs live in e2e/ and run under their own runner.
    exclude: ["e2e/**", "node_modules/**", ".next/**", ".firebase/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/components/ui/Button.tsx",
        "src/components/ui/Badge.tsx",
        "src/components/ui/ProgressRing.tsx",
        "src/components/app/shared/Markdown.tsx",
        "src/app/api/assistant/route_disabled.ts",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      }
    },
    server: {
      deps: {
        inline: [
          "@exodus/bytes",
          "html-encoding-sniffer",
          "jsdom",
        ],
      },
    },
  },
});
