<script setup lang="ts">
interface FilterFormProps {
  modelValue?: {
    genre?: string
    year?: number
    duration?: { min?: number; max?: number }
    platform?: string
    searchText?: string
  }
}

interface FilterFormEmits {
  'update:modelValue': [value: FilterFormProps['modelValue']]
  'search': [filters: FilterFormProps['modelValue']]
  'clear': []
}

const props = withDefaults(defineProps<FilterFormProps>(), {
  modelValue: () => ({})
})

const emit = defineEmits<FilterFormEmits>()

// Estados reactivos para los filtros
const filters = ref({
  genre: props.modelValue?.genre || '',
  year: props.modelValue?.year || null,
  durationMin: props.modelValue?.duration?.min || null,
  durationMax: props.modelValue?.duration?.max || null,
  platform: props.modelValue?.platform || '',
  searchText: props.modelValue?.searchText || ''
})

// Opciones para los selectores
const genreOptions = [
  { value: '', label: 'Todos los géneros' },
  { value: 'action', label: 'Acción' },
  { value: 'adventure', label: 'Aventura' },
  { value: 'animation', label: 'Animación' },
  { value: 'comedy', label: 'Comedia' },
  { value: 'crime', label: 'Crimen' },
  { value: 'documentary', label: 'Documental' },
  { value: 'drama', label: 'Drama' },
  { value: 'family', label: 'Familiar' },
  { value: 'fantasy', label: 'Fantasía' },
  { value: 'horror', label: 'Terror' },
  { value: 'music', label: 'Musical' },
  { value: 'mystery', label: 'Misterio' },
  { value: 'romance', label: 'Romance' },
  { value: 'scifi', label: 'Ciencia Ficción' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'war', label: 'Guerra' },
  { value: 'western', label: 'Western' }
]

const platformOptions = [
  { value: '', label: 'Todas las plataformas' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'amazon-prime', label: 'Amazon Prime Video' },
  { value: 'disney-plus', label: 'Disney+' },
  { value: 'hbo-max', label: 'HBO Max' },
  { value: 'apple-tv', label: 'Apple TV+' },
  { value: 'paramount-plus', label: 'Paramount+' },
  { value: 'hulu', label: 'Hulu' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'other', label: 'Otra' }
]

// Años disponibles (últimos 50 años)
const currentYear = new Date().getFullYear()
const yearOptions = [
  { value: null, label: 'Cualquier año' },
  ...Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }))
]

// Función para ejecutar la búsqueda
const handleSearch = () => {
  const searchFilters: any = {
    genre: filters.value.genre || undefined,
    year: filters.value.year || undefined,
    platform: filters.value.platform || undefined,
    searchText: filters.value.searchText || undefined
  }
  
  // Solo incluir duration si tiene valores
  if (filters.value.durationMin || filters.value.durationMax) {
    searchFilters.duration = {
      min: filters.value.durationMin || undefined,
      max: filters.value.durationMax || undefined
    }
  }

  emit('update:modelValue', searchFilters)
  emit('search', searchFilters)
}

// Función para limpiar filtros
const clearFilters = () => {
  filters.value = {
    genre: '',
    year: null,
    durationMin: null,
    durationMax: null,
    platform: '',
    searchText: ''
  }
  
  emit('update:modelValue', {})
  emit('clear')
}

// Watcher para actualizar el modelo cuando cambian los filtros
watch(filters, () => {
  const searchFilters: any = {
    genre: filters.value.genre || undefined,
    year: filters.value.year || undefined,
    platform: filters.value.platform || undefined,
    searchText: filters.value.searchText || undefined
  }
  
  // Solo incluir duration si tiene valores
  if (filters.value.durationMin || filters.value.durationMax) {
    searchFilters.duration = {
      min: filters.value.durationMin || undefined,
      max: filters.value.durationMax || undefined
    }
  }

  emit('update:modelValue', searchFilters)
}, { deep: true })

// Actualizar filtros cuando cambie el prop modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    filters.value = {
      genre: newValue.genre || '',
      year: newValue.year || null,
      durationMin: newValue.duration?.min || null,
      durationMax: newValue.duration?.max || null,
      platform: newValue.platform || '',
      searchText: newValue.searchText || ''
    }
  }
}, { deep: true })
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-4">
    <UCard 
      class="bg-[#445566]/90 backdrop-blur-md border-gray-400/20"
    >
      <template #header>
        <h2 class="text-xl font-oswald font-bold text-[#AABBCC] flex items-center gap-2">
          <UIcon name="i-heroicons-funnel" class="w-5 h-5" />
          Filtros de Búsqueda
        </h2>
      </template>

      <form @submit.prevent="handleSearch" class="space-y-6">
        <!-- Campo de búsqueda de texto libre -->
        <div>
          <UFormGroup label="Búsqueda" class="text-[#AABBCC]">
            <UInput
              v-model="filters.searchText"
              placeholder="Buscar por título, director, actor..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
              class="bg-[#121c2e]/50 text-[#AABBCC] placeholder-[#90a1b9]"
            />
          </UFormGroup>
        </div>

        <!-- Filtros principales en grid responsivo -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Género -->
          <UFormGroup label="Género" class="text-[#AABBCC]">
            <USelect
              v-model="filters.genre"
              :options="genreOptions"
              placeholder="Seleccionar género"
              class="bg-[#121c2e]/50 text-[#AABBCC]"
            />
          </UFormGroup>

          <!-- Año de estreno -->
          <UFormGroup label="Año de estreno" class="text-[#AABBCC]">
            <USelect
              v-model="filters.year"
              :options="yearOptions"
              placeholder="Cualquier año"
              class="bg-[#121c2e]/50 text-[#AABBCC]"
            />
          </UFormGroup>

          <!-- Plataforma -->
          <UFormGroup label="Plataforma" class="text-[#AABBCC]">
            <USelect
              v-model="filters.platform"
              :options="platformOptions"
              placeholder="Todas las plataformas"
              class="bg-[#121c2e]/50 text-[#AABBCC]"
            />
          </UFormGroup>

          <!-- Duración -->
          <UFormGroup label="Duración (min)" class="text-[#AABBCC]">
            <div class="flex gap-2 items-center">
              <UInput
                v-model.number="filters.durationMin"
                type="number"
                placeholder="Min"
                min="1"
                max="500"
                class="bg-[#121c2e]/50 flex-1 text-[#AABBCC] placeholder-[#90a1b9]"
              />
              <span class="text-[#90a1b9]">-</span>
              <UInput
                v-model.number="filters.durationMax"
                type="number"
                placeholder="Max"
                min="1"
                max="500"
                class="bg-[#121c2e]/50 flex-1 text-[#AABBCC] placeholder-[#90a1b9]"
              />
            </div>
          </UFormGroup>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <UButton
            type="submit"
            size="lg"
            color="primary"
            icon="i-heroicons-magnifying-glass"
            class="bg-[#16e0d4] hover:bg-[#16e0d4]/80 text-[#121c2e] font-bold"
          >
            Buscar Películas
          </UButton>
          
          <UButton
            type="button"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-heroicons-x-mark"
            @click="clearFilters"
            class="border-gray-400/30 text-[#AABBCC] hover:bg-[#121c2e]/30"
          >
            Limpiar Filtros
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Indicador de filtros activos -->
    <div v-if="filters.genre || filters.year || filters.platform || filters.durationMin || filters.durationMax || filters.searchText" 
         class="mt-4 p-3 bg-[#121c2e]/30 rounded-lg border border-gray-400/10">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm text-[#90a1b9] font-medium">Filtros activos:</span>
        
        <UBadge v-if="filters.searchText" 
                color="primary" 
                variant="solid"
                class="bg-[#16e0d4]/20 text-[#16e0d4]">
          "{{ filters.searchText }}"
        </UBadge>
        
        <UBadge v-if="filters.genre" 
                color="info" 
                variant="solid"
                class="bg-blue-500/20 text-blue-400">
          {{ genreOptions.find(g => g.value === filters.genre)?.label }}
        </UBadge>
        
        <UBadge v-if="filters.year" 
                color="success" 
                variant="solid"
                class="bg-green-500/20 text-green-400">
          {{ filters.year }}
        </UBadge>
        
        <UBadge v-if="filters.platform" 
                color="secondary" 
                variant="solid"
                class="bg-purple-500/20 text-purple-400">
          {{ platformOptions.find(p => p.value === filters.platform)?.label }}
        </UBadge>
        
        <UBadge v-if="filters.durationMin || filters.durationMax" 
                color="warning" 
                variant="solid"
                class="bg-orange-500/20 text-orange-400">
          {{ filters.durationMin || '0' }}-{{ filters.durationMax || '∞' }} min
        </UBadge>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales para mejorar la apariencia en dispositivos móviles */
@media (max-width: 640px) {
  .grid-cols-1 {
    gap: 1rem;
  }
}

/* Mejora la accesibilidad del formulario */
.form-group:focus-within {
  outline: 2px solid var(--color-teal);
  outline-offset: 2px;
  border-radius: 0.5rem;
}
</style>
