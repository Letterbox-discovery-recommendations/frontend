<script setup>
const filterStore = useFilterStore();

const variables = computed(() => ({
  limit: 24,
  genre: filterStore.filters.genres.length
    ? filterStore.filters.genres[0]
    : undefined,
  minRating: filterStore.filters.rating === "Alto a bajo" ? 4.0 : undefined,
  maxRating: filterStore.filters.rating === "Bajo a alto" ? 3.0 : undefined,
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
  platform: filterStore.filters.plataforma.length
    ? filterStore.filters.plataforma[0]
    : undefined,
}));

const { data } = await useAsyncGql({
  operation: "GetMovies",
  variables: variables,
});

const filteredMovies = computed(() => data.value?.movies || []);

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

    <!-- Movies Grid - 4 rows x 6 columns -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-6 gap-6">
        <Movie
          v-for="movie in filteredMovies"
          :key="movie._id"
          :title="movie.title"
          :src="movie.src"
        />
      </div>
    </div>
  </div>
</template>
