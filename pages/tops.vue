<script lang="ts" setup>
useSeoMeta({
  title: "cineTrack - Top de películas",
  description: "Filtra entre las peliculas mas populares del momento.",
});
</script>

<template>
  <div
    class="from-nav to-footer flex flex-col items-center space-y-16 bg-gradient-to-t p-12 px-4 md:px-16 lg:px-64"
  >
    <MovieCarousel
      title="Movies by Platform"
      :filter="true"
      :filter-options="['Netflix', 'HBO', 'Amazon Prime', 'Disney+']"
      class="w-full"
    />
    <MovieCarousel title="Mejores pelis" class="w-full" />
    <MovieCarousel title="Mas vistas" class="w-full" />
  </div>
</template>
