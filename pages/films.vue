<script setup>
const filterStore = useFilterStore();

const { data: allMovies } = await useAsyncData("all-movies", () => {
  return queryCollection("movies").all();
});

const filteredMovies = computed(() => {
  if (!allMovies.value) return [];

  if (!filterStore.hasGenreFilters) {
    return allMovies.value;
  }

  return allMovies.value.filter((movie) =>
    filterStore.filters.genres.includes(movie.genre),
  );
});

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
