<script setup>
const filterStore = useFilterStore();

const variables = computed(() => ({
  generos: filterStore.filters.genres.length
    ? filterStore.filters.genres
    : undefined,
  minDuration:
    filterStore.filters.duracion === "Más de 120 min"
      ? 120
      : filterStore.filters.duracion === "Entre 90 y 120 min"
        ? 90
        : undefined,
  maxDuration:
    filterStore.filters.duracion === "Entre 90 y 120 min"
      ? 120
      : filterStore.filters.duracion === "Menos de 90 min"
        ? 90
        : undefined,
  plataformas: filterStore.filters.plataforma.length
    ? filterStore.filters.plataforma
    : undefined,
}));

const { data } = await useAsyncGql({
  operation: "GetMovies",
  variables: variables,
});

console.log(data);

const filteredMovies = computed(() => data.value?.peliculas || []);

useSeoMeta({
  title: "cineTrack - Films",
  description: "Filtra entre todas las peliculas .",
});
</script>

<template>
  <div
    class="from-nav to-footer flex min-h-screen flex-col items-center bg-gradient-to-t py-8"
  >
    <FilterForm />

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-6 gap-6">
        <Movie
          v-for="movie in filteredMovies"
          :key="movie.id"
          :title="movie.titulo"
          :src="movie.posterUrl"
        />
      </div>
    </div>
  </div>
</template>
