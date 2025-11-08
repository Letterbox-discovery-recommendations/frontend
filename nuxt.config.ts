// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/seo",
    "@pinia/nuxt",
    "nuxt-graphql-client",
    "@nuxt/test-utils/module",
  ],
  css: ["~/main.css"],

  nitro: {
    prerender: {
      failOnError: false,
    },
  },

  runtimeConfig: {
    public: {
      GQL_HOST: process.env.NUXT_GRAPHQL_BACKEND,
      backendUrl: process.env.NUXT_BACKEND,
    },
  },
});
