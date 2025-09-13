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
    "@nuxt/content",
    "nuxt-graphql-client",
  ],
  css: ["~/main.css"],

  runtimeConfig: {
    public: {
      GQL_HOST: "http://127.0.0.1:8000/graphql",
    },
  },
});
