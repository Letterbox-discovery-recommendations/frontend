<script setup lang="ts">
const filterStore = useFilterStore();
const searchStore = useSearchStore();

// Paginatipon setup
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
    titulo: searchStore.search || undefined, // Add search parameter
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
    sort: filterStore.filters.sort || undefined,
    minYear,
    maxYear,
  };
});

// Use ref for movies data and fetch manually
const data = ref<any>(null);
const isLoadingMovies = ref(false);

const fetchMovies = async () => {
  isLoadingMovies.value = true;
  try {
    data.value = await GqlGetMovies(variables.value);
  } catch (error) {
    console.error("Error fetching movies:", error);
    data.value = null;
  } finally {
    isLoadingMovies.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchMovies();
});

// Watch variables and refetch when they change
watch(
  variables,
  () => {
    fetchMovies();
  },
  { deep: true },
);

// Sync search with URL params
onMounted(() => {
  const searchQuery = route.query.search as string;
  if (searchQuery && searchQuery !== searchStore.search) {
    searchStore.setSearch(searchQuery);
  }

  // Initial fetch is already done above, but keep this for search sync
});

// Watch for search changes and update URL
watch(
  () => searchStore.search,
  (newSearch) => {
    const query = { ...route.query };
    if (newSearch) {
      query.search = newSearch;
    } else {
      delete query.search;
    }
    router.push({ query });
  },
);

const allMovies = computed(() => data.value?.peliculas || []);

// Pagination calculations
const totalMovies = computed(() => {
  return allMovies.value.length;
});

const paginatedMovies = computed(() => {
  const start = (page.value - 1) * moviesPerPage;
  const end = start + moviesPerPage;
  return allMovies.value.slice(start, end);
});

// Navigation function for pagination
function to(pageNumber: number) {
  const query: Record<string, string | number> = {
    ...route.query,
    page: pageNumber,
  };

  // Preserve search parameter
  if (searchStore.search) {
    query.search = searchStore.search;
  }

  return { query };
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

// Clear filters and search when leaving the films page
onBeforeUnmount(() => {
  filterStore.clearFilters();
  searchStore.clearSearch();
});

useSeoMeta({
  title: "Films",
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
      <div class="mb-6 flex flex-col items-center justify-center text-center">
        <p class="text-gray-400">
          Mostrando {{ paginatedMovies.length }} de {{ totalMovies }} películas
        </p>
        <!-- Search term display -->
        <p v-if="searchStore.search" class="mt-2 text-base text-gray-400">
          Búsqueda: "{{ searchStore.search }}"
        </p>
      </div>

      <!-- Movies grid -->
      <div class="mb-8 grid grid-cols-3 gap-6 md:grid-cols-6">
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
