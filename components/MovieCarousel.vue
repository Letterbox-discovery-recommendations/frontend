<script setup lang="ts">
interface MovieCarouselProps {
  title: string;
  filter?: boolean;
  filterOptions?: Array<string>;
  movies?: Array<{
    title: string;
    src: string;
  }>;
}

const props = defineProps<MovieCarouselProps>();

const value = ref("");
if (props?.filterOptions) {
  value.value = props.filterOptions[0];
}

// Default mock movies if none provided
const defaultMovies = [
  { title: "The Witch", src: "images/cat.jpg" },
  { title: "Alien Covenant", src: "https://picsum.photos/180/260?random=2" },
  { title: "I Saw the TV Glow", src: "https://picsum.photos/180/260?random=3" },
  { title: "Twin Peaks", src: "https://picsum.photos/180/260?random=4" },
  {
    title: "10 Things I Hate About U",
    src: "https://picsum.photos/180/260?random=5",
  },
  { title: "Movie 6", src: "https://picsum.photos/180/260?random=6" },
];

const movies = computed(() => props.movies || defaultMovies);
</script>
<template>
  <div class="flex w-full flex-col justify-center gap-4">
    <div class="flex items-center gap-4">
      <h2 class="text-2xl font-bold text-white">
        {{ props.title }}
      </h2>
      <USelectMenu
        v-if="props.filter"
        v-model="value"
        :items="props.filterOptions"
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
      <Movie :src="item.src" :title="item.title" />
    </UCarousel>
  </div>
</template>
