<script setup lang="ts">
const filterStore = useFilterStore();

const { data: genres } = useAsyncGql({
  operation: "GetGenres",
});

const { data: platforms } = useAsyncGql({
  operation: "GetPlatforms",
});

const generoItems = computed(() => {
  return genres.value?.generos?.map((genre) => genre.nombre) || [];
});

const plataformaItems = computed(() => {
  return platforms.value?.plataformas?.map((platform) => platform.nombre) || [];
});

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

const ratingItems = ref(["Alto a bajo", "Bajo a alto"]);

const duracionItems = ref([
  "Más de 120 min",
  "Entre 90 y 120 min",
  "Menos de 90 min",
  "Cualquiera",
]);

const selectedEstreno = ref();
const selectedGenero = ref([]);
const selectedRating = ref();
const selectedDuracion = ref();
const selectedPlataforma = ref([]);

const applyFilters = () => {
  filterStore.setFilters({
    genres: selectedGenero.value,
    estreno: selectedEstreno.value,
    rating: selectedRating.value,
    duracion: selectedDuracion.value,
    plataforma: selectedPlataforma.value,
  });

  console.log("Filters applied:", filterStore.filters);
};

const handleClear = () => {
  selectedEstreno.value = null;
  selectedGenero.value = [];
  selectedRating.value = null;
  selectedDuracion.value = null;
  selectedPlataforma.value = [];

  filterStore.clearFilters();
  console.log("Filters cleared");
};
</script>

<template>
  <div class="flex items-center gap-4">
    <h2 class="text-base font-bold text-white">FILTRAR POR</h2>
    <USelectMenu
      v-model="selectedEstreno"
      placeholder="Estreno"
      :items="estrenoItems"
      class="w-48"
    />
    <USelectMenu
      v-model="selectedGenero"
      placeholder="Género"
      multiple
      :items="generoItems"
      class="w-48"
    />

    <USelectMenu
      v-model="selectedRating"
      placeholder="Rating"
      :items="ratingItems"
      class="w-48"
    />
    <USelectMenu
      v-model="selectedDuracion"
      placeholder="Duración"
      :items="duracionItems"
      class="w-48"
    />
    <USelectMenu
      v-model="selectedPlataforma"
      placeholder="Plataforma"
      multiple
      :items="plataformaItems"
      class="w-48"
    />

    <UButton
      class="bg-red hover:bg-red/80 px-4 font-bold text-white"
      label="APLICAR"
      @click="applyFilters"
    />
    <UButton
      class="bg-red hover:bg-red/80 px-4 font-bold text-white"
      label="LIMPIAR"
      @click="handleClear"
    />
  </div>
</template>
