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

const duracionItems = ref([
  "Más de 120 min",
  "Entre 90 y 120 min",
  "Menos de 90 min",
  "Cualquiera",
]);
const sortItems = ref([
  "titulo",
  "titulo_desc",
  "duracionMinutos",
  "duracionMinutos_desc",
  "fechaEstreno",
  "fechaEstreno_desc",
]);

const selectedSort = ref();
const selectedEstreno = ref();
const selectedGenero = ref([]);
const selectedDuracion = ref();
const selectedPlataforma = ref([]);

// Watch for changes in filter selections and automatically update store
watch(
  [
    selectedSort,
    selectedEstreno,
    selectedGenero,
    selectedDuracion,
    selectedPlataforma,
  ],
  () => {
    filterStore.setFilters({
      sort: selectedSort.value,
      genres: selectedGenero.value,
      estreno: selectedEstreno.value,
      duracion: selectedDuracion.value,
      plataforma: selectedPlataforma.value,
    });
    console.log("Filters updated:", selectedEstreno.value);
  },
  { deep: true },
);

// Expose method for potential external use
defineExpose({
  // Method to manually trigger filter update if needed
  updateFilters: () => {
    filterStore.setFilters({
      sort: selectedSort.value,
      genres: selectedGenero.value,
      estreno: selectedEstreno.value,
      duracion: selectedDuracion.value,
      plataforma: selectedPlataforma.value,
    });
  },
});

// Handle Enter key press on filter form (now just for consistency)
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    // Since filters auto-update, Enter key doesn't need to do anything special
    // But we can keep it for future functionality if needed
  }
};

const handleClear = () => {
  selectedSort.value = null;
  selectedEstreno.value = null;
  selectedGenero.value = [];
  selectedDuracion.value = null;
  selectedPlataforma.value = [];

  filterStore.clearFilters();
  console.log("Filters cleared");
};
</script>

<template>
  <div class="flex items-center gap-4" @keydown="handleKeyDown">
    <h2 class="text-base font-bold text-white">FILTRAR POR</h2>
    <USelectMenu
      v-model="selectedEstreno"
      placeholder="Año de estreno"
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
      v-model="selectedSort"
      placeholder="Ordenar por"
      :items="sortItems"
      value-attribute="value"
      option-attribute="label"
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
      label="LIMPIAR"
      @click="handleClear"
    />
  </div>
</template>
