<script setup lang="ts">
interface Movie {
  id: number;
  titulo: string;
  posterUrl?: string;
}

interface RecommendationItem {
  movie: Movie;
  score: number;
}

interface MovieCarouselProps {
  title: string;
  endpoint?: string;
}

const props = defineProps<MovieCarouselProps>();

const authStore = useAuthStore();

const value = ref("");

// Load platforms and genres at component setup
const platforms = ref<any>(null);
const genres = ref<any>(null);

onMounted(async () => {
  try {
    platforms.value = await GqlGetPlatforms();
    genres.value = await GqlGetGenres();
  } catch (error) {
    console.error("Error loading dropdown data:", error);
  }
  
  // Fetch movies after data is loaded
  fetchMovies();
  console.log(dropdownItems.value);
});

const dropdownItems = computed(() => {
  if (props.endpoint === "genre") {
    return genres.value?.generos?.map((genre: any) => genre.nombre) || [];
  } else if (props.endpoint === "platform") {
    return (
      platforms.value?.plataformas?.map((platform: any) => platform.nombre) || []
    );
  }
  return [];
});

watchEffect(() => {
  if (dropdownItems.value.length > 0 && !value.value) {
    value.value = dropdownItems.value[0] || "";
  }
});

const movies = ref<(Movie | RecommendationItem)[]>([]);
const isLoading = ref(false);

const getMovieData = (item: Movie | RecommendationItem): Movie => {
  if ("movie" in item) {
    return item.movie;
  }
  return item;
};

const id = ref("");

const updateId = () => {
  if (props.endpoint == "genre") {
    const selectedGenre = genres.value?.generos?.find(
      (genre) => genre.nombre === value.value,
    );
    id.value = selectedGenre?.id?.toString() || "";
  } else if (props.endpoint == "platform") {
    const selectedPlatform = platforms.value?.plataformas?.find(
      (platform) => platform.nombre === value.value,
    );
    id.value = selectedPlatform?.id?.toString() || "";
  }
};

updateId();

const fetchMovies = async () => {
  if (!props.endpoint) {
    return;
  }

  isLoading.value = true;
  const config = useRuntimeConfig();
  const baseUrl = config.public.backendUrl;

  try {
    if (props.endpoint === "genre" || props.endpoint === "platform") {
      movies.value = await $fetch(
        `${baseUrl}/api/v1/rankings/${props.endpoint}/${id.value}`,
      );
    } else if (props.endpoint === "content") {
      movies.value = await $fetch(`${baseUrl}/api/v1/recommendations/content`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } else if (props.endpoint === "collaborative") {
      movies.value = await $fetch(
        `${baseUrl}/api/v1/recommendations/collaborative`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } else {
      movies.value = await $fetch(
        `${baseUrl}/api/v1/rankings/${props.endpoint}`,
      );
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movies.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(value, () => {
  updateId();
  if (props.endpoint === "genre" || props.endpoint === "platform") {
    fetchMovies();
  }
});

// Remove the old onMounted call since we moved it above
// onMounted is now integrated with the async setup above
</script>
<template>
  <div class="flex w-full flex-col justify-center gap-4">
    <div class="flex items-center gap-4">
      <h2 class="text-2xl font-bold text-white">
        {{ props.title }}
      </h2>
      <USelectMenu
        v-if="props.endpoint === 'genre' || props.endpoint === 'platform'"
        v-model="value"
        :items="dropdownItems"
        class="w-48"
      />
    </div>
    <USeparator />

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="flex gap-4 overflow-hidden">
      <div
        v-for="n in 5"
        :key="n"
        class="flex min-w-0 flex-shrink-0 flex-col gap-2"
        style="flex-basis: 20%"
      >
        <USkeleton class="aspect-[2/3] w-full rounded-lg" />
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-3 w-1/2" />
      </div>
    </div>

    <!-- Movie carousel -->
    <div v-if="!isLoading && movies.length === 0" class="py-8 text-center">
      <p class="text-lg text-gray-300">No hay películas disponibles</p>
    </div>

    <UCarousel
      v-else-if="!isLoading"
      v-slot="{ item }"
      :items="movies"
      :ui="{ item: 'basis-1/3 md:basis-1/4 lg:basis-1/5' }"
    >
      <Movie v-bind="getMovieData(item)" />
    </UCarousel>
  </div>
</template>
