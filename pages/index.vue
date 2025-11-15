<script setup lang="ts">
useSeoMeta({
  title: "cineTrack - Inicio",
  description: "Descubrí las mejores películas.",
});

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div
    class="from-nav to-footer flex min-h-screen flex-col items-center space-y-16 bg-gradient-to-t p-12 px-8 md:px-16 lg:px-32"
  >
    <div
      v-if="!authStore.userId"
      class="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat opacity-85"
      style="background-image: url(&quot;/images/banner.png&quot;)"
    >
      <div class="absolute inset-0 bg-black/50" />

      <div class="relative z-10 max-w-4xl px-6 text-center">
        <h1 class="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Bienvenido a cineTrack
        </h1>
        <p class="mb-8 text-xl font-semibold text-white">
          Inicia sesión para disfrutar la experiencia completa
        </p>
        <UButton
          class="bg-red cursor-pointer px-8 py-3 text-lg font-bold text-white"
          @click="handleLogin"
        >
          Iniciar Sesión
        </UButton>
      </div>
    </div>
    <MovieCarousel
      v-if="authStore.userId"
      title="A usuarios como vos les gustó"
      endpoint="collaborative"
      class="w-full"
    />
    <MovieCarousel
      v-if="authStore.userId"
      title="Recomendaciones para vos"
      endpoint="content"
      class="w-full"
    />
    <MovieCarousel title="Top global" endpoint="global" class="w-full" />
    <MovieCarousel title="Virales" endpoint="viral" class="w-full" />
  </div>
</template>
