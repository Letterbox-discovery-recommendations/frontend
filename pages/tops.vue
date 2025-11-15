<script lang="ts" setup>
useSeoMeta({
  title: "cineTrack - Top de películas",
  description: "Filtra entre las peliculas mas populares del momento.",
});
</script>

<template>
  <div
    class="from-nav to-footer flex flex-col items-center space-y-16 bg-gradient-to-t p-12 px-4 md:px-16 lg:px-32"
  >
    <MovieCarousel title="Top global" endpoint="global" class="w-full" />
    <MovieCarousel title="Virales" endpoint="viral" class="w-full" />
    <MovieCarousel title="Top por género" endpoint="genre" class="w-full" />
    <MovieCarousel
      title="Top por plataforma"
      endpoint="platform"
      class="w-full"
    />
  </div>
</template>
