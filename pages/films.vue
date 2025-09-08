<script setup lang="ts">
useSeoMeta({
  title: "cineTrack - Films",
  description: "Filtra entre todas las peliculas .",
});

const movies = [
  // Row 1
  { title: "The Witch", src: "images/cat.jpg" },
  { title: "Alien Covenant", src: "https://picsum.photos/180/260?random=2" },
  { title: "I Saw the TV Glow", src: "https://picsum.photos/180/260?random=3" },
  { title: "Twin Peaks", src: "https://picsum.photos/180/260?random=4" },
  {
    title: "10 Things I Hate About U",
    src: "https://picsum.photos/180/260?random=5",
  },
  { title: "Movie 6", src: "https://picsum.photos/180/260?random=6" },

  // Row 2
  { title: "Blade Runner 2049", src: "https://picsum.photos/180/260?random=7" },
  { title: "Mad Max Fury Road", src: "https://picsum.photos/180/260?random=8" },
  { title: "The Matrix", src: "https://picsum.photos/180/260?random=9" },
  { title: "Interstellar", src: "https://picsum.photos/180/260?random=10" },
  { title: "Inception", src: "https://picsum.photos/180/260?random=11" },
  { title: "Pulp Fiction", src: "https://picsum.photos/180/260?random=12" },

  // Row 3
  { title: "The Dark Knight", src: "https://picsum.photos/180/260?random=13" },
  { title: "Fight Club", src: "https://picsum.photos/180/260?random=14" },
  { title: "Goodfellas", src: "https://picsum.photos/180/260?random=15" },
  {
    title: "The Shawshank Redemption",
    src: "https://picsum.photos/180/260?random=16",
  },
  { title: "Forrest Gump", src: "https://picsum.photos/180/260?random=17" },
  { title: "The Godfather", src: "https://picsum.photos/180/260?random=18" },

  // Row 4
  { title: "Schindler's List", src: "https://picsum.photos/180/260?random=19" },
  { title: "12 Angry Men", src: "https://picsum.photos/180/260?random=20" },
  {
    title: "The Lord of the Rings",
    src: "https://picsum.photos/180/260?random=21",
  },
  { title: "Star Wars", src: "https://picsum.photos/180/260?random=22" },
  { title: "Casablanca", src: "https://picsum.photos/180/260?random=23" },
  { title: "Citizen Kane", src: "https://picsum.photos/180/260?random=24" },
];
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
          v-for="movie in movies"
          :key="movie.title"
          :title="movie.title"
          :src="movie.src"
        />
      </div>
    </div>
  </div>
</template>
