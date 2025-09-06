// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/image", "@nuxtjs/seo"],
  css: ["~/main.css"],
  nitro: {
    prerender: {
      ignore: ['/__sitemap__/style.xsl']
    }
  }
});
