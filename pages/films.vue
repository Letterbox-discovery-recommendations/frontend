<script setup>
const filterStore = useFilterStore();

const { data: allMovies } = await useAsyncData("all-movies", () => {
  return queryCollection("movies").all();
});

const filteredMovies = computed(() => {
  if (!allMovies.value) return [];

  let filtered = allMovies.value;

  if (filterStore.hasGenreFilters) {
    filtered = filtered.filter((movie) =>
      filterStore.filters.genres.includes(movie.genre)
    );
  }

  if (filterStore.hasRatingFilter) {
    const ratingFilter = filterStore.filters.rating;
    if (ratingFilter === "Alto a bajo") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (ratingFilter === "Bajo a alto") {
      filtered = filtered.sort((a, b) => a.rating - b.rating);
    }
  }

  if (filterStore.hasDurationFilter) {
    const durationFilter = filterStore.filters.duracion;
    if (durationFilter === "Más de 120 min") {
      filtered = filtered.filter((movie) => movie.duration > 120);
    } else if (durationFilter === "Entre 90 y 120 min") {
      filtered = filtered.filter((movie) => movie.duration >= 90 && movie.duration <= 120);
    } else if (durationFilter === "Menos de 90 min") {
      filtered = filtered.filter((movie) => movie.duration < 90);
    }
  }

  if (!filterStore.hasAnyFilters) {
    return allMovies.value;
  }

  return filtered;
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
