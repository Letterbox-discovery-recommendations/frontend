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

const value = ref("");

const { data: genres } = await useAsyncGql({
  operation: "GetGenres",
});

const { data: platforms } = await useAsyncGql({
  operation: "GetPlatforms",
});

const dropdownItems = computed(() => {
  if (props.endpoint === "genre") {
    return genres.value?.generos?.map((genre) => genre.nombre) || [];
  } else if (props.endpoint === "platform") {
    return (
      platforms.value?.plataformas?.map((platform) => platform.nombre) || []
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

watch(value, () => {
  updateId();
  if (
    props.endpoint &&
    (props.endpoint === "genre" || props.endpoint === "platform")
  ) {
    $fetch(
      "http://localhost:8000/api/v1/rankings/" +
        props.endpoint +
        "/" +
        id.value,
    ).then((data) => {
      movies.value = data as (Movie | RecommendationItem)[];
    });
  }
});

onMounted(async () => {
  if (!props.endpoint) {
    return;
  }
  if (props.endpoint == "genre" || props.endpoint == "platform") {
    movies.value = await $fetch(
      "http://localhost:8000/api/v1/rankings/" +
        props.endpoint +
        "/" +
        id.value,
    );
  }
  movies.value = await $fetch(
    "http://localhost:8000/api/v1/rankings/" + props.endpoint,
  );
});
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
    <UCarousel
      v-slot="{ item }"
      arrows
      :items="movies"
      :ui="{ item: 'basis-1/5' }"
    >
      <Movie v-bind="getMovieData(item)" />
    </UCarousel>
  </div>
</template>
