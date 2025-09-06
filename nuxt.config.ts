export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/image", "@nuxtjs/seo"],
  css: ["~/main.css"],
  ogImage: { enabled: false },
  nitro: {
    prerender: {
      ignore: ['/__sitemap__/style.xsl']
    }
  },
  image: {
    provider: 'static'
  },
  hooks: {
    'prerender:routes'({ routes }) {
      routes.clear()
    }
  },
});
