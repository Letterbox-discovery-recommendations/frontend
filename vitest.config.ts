import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import path from 'path'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['html', 'text', 'json'],
      include: ['components/**/*.vue', 'composables/**/*.ts', 'pages/**/*.vue', 'stores/**/*.{ts,js}'],
      exclude: ['node_modules/', 'test/'],
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/{e2e,unit}/*.{test,spec}.ts"],
          environment: "node",
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/*.{test,spec}.ts"],
          environment: "nuxt",
          setupFiles: ["./test/setup.ts"], 
          environmentOptions: {
            nuxt: {
              mock: {
                intersectionObserver: true,
                indexedDb: true,
              },
            },
          },
        },
      }),
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})