<script setup lang="ts">
useSeoMeta({
  title: "cineTrack - Inicio",
  description: "Descubrí las mejores películas.",
});

// Importar el composable manualmente
const { useMovieFilters } = await import("~/composables/useMovieFilters");

// Usar el composable de filtros de películas
const {
  filters,
  searchResults,
  isLoading,
  error,
  total,
  hasActiveFilters,
  getActiveFilters,
  hasMore,
  search,
  loadMore,
  clear,
} = useMovieFilters();

// Función para manejar la búsqueda desde el formulario
const handleSearch = async (filterData: any) => {
  try {
    await search(filterData);
  } catch (error) {
    console.error("Error en la búsqueda:", error);
  }
};

// Función para limpiar filtros
const handleClearFilters = async () => {
  clear();
};
</script>

<template>
  <div class="from-nav to-footer min-h-screen bg-gradient-to-t py-8">
    <div class="container mx-auto px-4">
      <!-- Formulario de filtros -->
      <FilterForm
        v-model="filters"
        @search="handleSearch"
        @clear="handleClearFilters"
        class="mb-8"
      />

      <!-- Mensaje de error -->
      <div v-if="error" class="py-6 text-center">
        <UAlert
          color="error"
          variant="solid"
          :title="'Error en la búsqueda'"
          :description="error"
          :close-button="{
            icon: 'i-heroicons-x-mark-20-solid',
            color: 'white',
            variant: 'link',
          }"
          @close="error = null"
        />
      </div>

      <!-- Indicador de carga -->
      <div
        v-else-if="isLoading && searchResults.length === 0"
        class="flex items-center justify-center py-12"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="h-8 w-8 animate-spin text-[#16e0d4]"
        />
        <span class="ml-2 text-[#AABBCC]">Buscando películas...</span>
      </div>

      <!-- Resultados de búsqueda -->
      <div v-else-if="searchResults.length > 0" class="space-y-6">
        <div
          class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <h2 class="font-oswald text-2xl font-bold text-[#AABBCC]">
            Resultados de Búsqueda
          </h2>
          <div class="flex items-center gap-3">
            <UBadge
              color="primary"
              variant="solid"
              class="bg-[#16e0d4]/20 text-[#16e0d4]"
            >
              {{ total }}
              {{
                total === 1 ? "película encontrada" : "películas encontradas"
              }}
            </UBadge>

            <UButton
              v-if="hasActiveFilters"
              @click="handleClearFilters"
              size="sm"
              color="neutral"
              variant="outline"
              icon="i-heroicons-x-mark"
              class="border-[#90a1b9]/30 text-[#90a1b9] hover:bg-[#121c2e]/30"
            >
              Limpiar
            </UButton>
          </div>
        </div>

        <!-- Grid de películas -->
        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <Movie
            v-for="movie in searchResults"
            :key="movie.id || movie.title"
            :title="movie.title"
            :src="movie.src"
            :views="movie.views"
            :likes="movie.likes"
          />
        </div>

        <!-- Botón para cargar más resultados -->
        <div v-if="hasMore" class="flex justify-center pt-8">
          <UButton
            @click="loadMore"
            :loading="isLoading"
            size="lg"
            color="primary"
            variant="outline"
            icon="i-heroicons-arrow-down"
            class="border-[#16e0d4] text-[#16e0d4] hover:bg-[#16e0d4]/10"
          >
            Cargar más películas
          </UButton>
        </div>

        <!-- Indicador de carga al cargar más -->
        <div
          v-if="isLoading && searchResults.length > 0"
          class="flex items-center justify-center py-6"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="h-6 w-6 animate-spin text-[#16e0d4]"
          />
          <span class="ml-2 text-[#AABBCC]">Cargando más películas...</span>
        </div>
      </div>

      <!-- Estado inicial o sin resultados -->
      <div v-else class="py-12 text-center">
        <UIcon
          name="i-heroicons-film"
          class="mx-auto mb-4 h-16 w-16 text-[#90a1b9]"
        />
        <h3 class="font-oswald mb-2 text-xl font-bold text-[#AABBCC]">
          Descubrí las mejores películas
        </h3>
        <p class="mx-auto max-w-md text-[#90a1b9]">
          Usa los filtros de arriba para encontrar exactamente lo que estás
          buscando. Filtra por género, año, plataforma y más.
        </p>
      </div>
    </div>
  </div>
</template>
