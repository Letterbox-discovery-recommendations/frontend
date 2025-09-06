export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/image", "@nuxtjs/seo"],
  css: ["~/main.css"],
  ogImage: { enabled: false },
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      ignore: ['/__sitemap__/style.xsl']
    }
  },
  image: {
    provider: 'cloudfront',
    providers: {
      cloudfront: {
        provider: 'ipx',
        options: {
          baseURL: '/images' // o el bucket estático
        }
      }
    }
  },
  hooks: {
    'prerender:routes'({ routes }) {
      routes.clear()
    }
  },
});
