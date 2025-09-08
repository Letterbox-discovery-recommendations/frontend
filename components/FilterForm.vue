<script setup lang="ts">
const estrenoItems = ref([
  "2020s",
  "2010s",
  "2000s",
  "1990s",
  "1980s",
  "1970s",
  "1960s",
  "1950s",
  "1940s",
  "1930s",
  "1920s",
  "1910s",
  "1900s",
  "1800s",
]);

const generoItems = ref([
  "Acción",
  "Aventura",
  "Animación",
  "Comedia",
  "Crimen",
  "Documental",
  "Drama",
  "Familiar",
  "Fantasía",
  "Historia",
  "Horror",
  "Misterio",
  "Romance",
  "Ciencia ficción",
]);

const ratingItems = ref(["Alto a bajo", "Bajo a alto"]);

const duracionItems = ref([
  "Más de 120 min",
  "Entre 90 y 120 min",
  "Menos de 90 min",
  "Cualquiera",
]);

const plataformaItems = ref(["Netflix", "HBO", "Prime", "Disney+"]);

const selectedEstreno = ref([]);
const selectedGenero = ref([]);
const selectedRating = ref();
const selectedDuracion = ref();
const selectedPlataforma = ref([]);
</script>

<template>
  <div class="flex items-center gap-4">
    <h2 class="text-base font-bold text-white">FILTRAR POR</h2>
    <USelectMenu
      placeholder="Estreno"
      v-model="selectedEstreno"
      multiple
      :items="estrenoItems"
      class="w-48"
    />
    <USelectMenu
      placeholder="Género"
      v-model="selectedGenero"
      multiple
      :items="generoItems"
      class="w-48"
    />

    <USelectMenu
      placeholder="Rating"
      v-model="selectedRating"
      :items="ratingItems"
      class="w-48"
    />
    <USelectMenu
      placeholder="Duración"
      v-model="selectedDuracion"
      :items="duracionItems"
      class="w-48"
    />
    <USelectMenu
      placeholder="Plataforma"
      v-model="selectedPlataforma"
      multiple
      :items="plataformaItems"
      class="w-48"
    />

    <UButton
      class="bg-red hover:bg-red/80 px-4 font-bold text-white"
      label="APLICAR"
    />
  </div>
</template>
