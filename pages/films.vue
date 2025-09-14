<script setup lang="ts">
const filterStore = useFilterStore();

// Pagination setup
const route = useRoute();
const router = useRouter();
const page = ref(parseInt(route.query.page as string) || 1);
const moviesPerPage = 24;

const variables = computed(() => {
  let minYear, maxYear;
  if (filterStore.filters.estreno) {
    const year = parseInt(
      (filterStore.filters.estreno as string).replace("s", ""),
    );
    minYear = year;
    maxYear = year + 9;
    console.log(minYear, maxYear);
  }

  return {
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
    minYear,
    maxYear,
  };
});

const { data } = await useAsyncGql({
  operation: "GetMovies",
  variables: variables,
});

const allMovies = computed(() => data.value?.peliculas || []);

// Pagination calculations
const totalMovies = computed(() => {
  const count = allMovies.value.length;
  const expectedPages = Math.ceil(count / moviesPerPage);
  console.log("=== PAGINATION DEBUG ===");
  console.log("Total movies:", count);
  console.log("Movies per page:", moviesPerPage);
  console.log("Expected pages:", expectedPages);
  console.log("========================");
  return count;
});

const paginatedMovies = computed(() => {
  const start = (page.value - 1) * moviesPerPage;
  const end = start + moviesPerPage;
  const sliced = allMovies.value.slice(start, end);
  console.log(
    "Page:",
    page.value,
    "Start:",
    start,
    "End:",
    end,
    "Movies on page:",
    sliced.length,
  );
  return sliced;
});

// Navigation function for pagination
function to(pageNumber: number) {
  return {
    query: {
      ...route.query,
      page: pageNumber,
    },
  };
}

// Reset to page 1 when filters change
watch(
  variables,
  () => {
    page.value = 1;
    router.push({ query: { ...route.query, page: 1 } });
  },
  { deep: true },
);

// Watch route changes to update page
watch(
  () => route.query.page,
  (newPage) => {
    page.value = parseInt(newPage as string) || 1;
  },
);

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
      <!-- Movies count -->
      <div class="mb-6 text-center">
        <p class="text-gray-400">
          Mostrando {{ paginatedMovies.length }} de {{ totalMovies }} películas
        </p>
      </div>

      <!-- Movies grid -->
      <div class="mb-8 grid grid-cols-6 gap-6">
        <Movie
          v-for="movie in paginatedMovies"
          :id="movie.id"
          :key="movie.id"
          :titulo="movie.titulo"
          :poster-url="movie.posterUrl || undefined"
        />
      </div>

      <!-- Pagination -->
      <div class="flex justify-center">
        <UPagination
          v-model:page="page"
          :total="totalMovies"
          :items-per-page="moviesPerPage"
          :to="to"
          :sibling-count="1"
          show-edges
        />
      </div>
    </div>
  </div>
</template>
