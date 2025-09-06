<script lang="ts" setup>
useSeoMeta({
  title: "cineTrack - Top de películas",
  description: "Filtra entre las peliculas mas populares del momento.",
});
</script>

<template>
  <div
    class="from-nav to-footer flex flex-col items-center space-y-16 bg-gradient-to-t p-12 px-64"
  >
    <MovieCarousel
      title="Movies by Platform"
      :filter="true"
      :filter-options="['Netflix', 'HBO', 'Amazon Prime', 'Disney+']"
    />
    <MovieCarousel title="Mejores pelis" />
    <MovieCarousel title="Mas vistas" />
  </div>
</template>
