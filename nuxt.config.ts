// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/image"],
  css: ["~/main.css"],

  // No es buena practica, necesario para correr el CI provisoriamente hasta tener las rutas enlazadas.
  nitro: {
    prerender: {
      failOnError: false
    }
  }
});
