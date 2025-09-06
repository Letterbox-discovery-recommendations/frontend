<script lang="ts" setup>
useSeoMeta({
  title: "cineTrack - Top de películas",
  description: "Filtra entre las peliculas mas populares del momento.",
});

// Estado para el formulario de filtros avanzados
const showAdvancedFilters = ref(false)
const filters = ref({})

const handleSearch = async (filterData: any) => {
  console.log('Búsqueda avanzada en tops:', filterData)
  // Aquí iría la lógica para filtrar los tops según los criterios
}

const handleClearFilters = () => {
  console.log('Filtros limpiados en tops')
}
</script>

<template>
  <div
    class="from-nav to-footer flex flex-col items-center space-y-16 bg-gradient-to-t p-12 px-4 md:px-16 lg:px-64"
  >
    <!-- Botón para mostrar filtros avanzados -->
    <div class="w-full flex justify-center mb-8">
      <UButton
        @click="showAdvancedFilters = !showAdvancedFilters"
        :icon="showAdvancedFilters ? 'i-heroicons-eye-slash' : 'i-heroicons-funnel'"
        color="neutral"
        variant="outline"
        class="border-[#16e0d4] text-[#16e0d4] hover:bg-[#16e0d4]/10"
      >
        {{ showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados' }}
      </UButton>
    </div>

    <!-- Formulario de filtros avanzados (colapsable) -->
    <div v-if="showAdvancedFilters" class="w-full max-w-6xl">
      <FilterForm 
        v-model="filters"
        @search="handleSearch"
        @clear="handleClearFilters"
      />
    </div>

    <!-- Carruseles de películas con filtros existentes -->
    <MovieCarousel
      title="Movies by Platform"
      :filter="true"
      :filter-options="['Netflix', 'HBO', 'Amazon Prime', 'Disney+']"
      class="w-full"
    />
    <MovieCarousel title="Mejores pelis" class="w-full" />
    <MovieCarousel title="Mas vistas" class="w-full" />
  </div>
</template>
