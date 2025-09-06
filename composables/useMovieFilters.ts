/**
 * Composable para manejar filtros de películas
 * Proporciona funcionalidad para buscar, filtrar y gestionar resultados de películas
 */

export interface MovieFilters {
  genre?: string
  year?: number
  duration?: {
    min?: number
    max?: number
  }
  platform?: string
  searchText?: string
}

export interface Movie {
  id?: string | number
  title: string
  src?: string
  views?: number
  likes?: number
  genre?: string
  year?: number
  duration?: number
  platform?: string
  director?: string
  actors?: string[]
  rating?: number
}

export interface SearchResult {
  movies: Movie[]
  total: number
  page: number
  hasMore: boolean
}

export const useMovieFilters = () => {
  // Estados reactivos
  const filters = ref<MovieFilters>({})
  const searchResults = ref<Movie[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const hasMore = ref(false)

  /**
   * Ejecutar búsqueda con filtros
   */
  const search = async (newFilters?: MovieFilters, page: number = 1) => {
    isLoading.value = true
    error.value = null

    try {
      // Actualizar filtros si se proporcionan
      if (newFilters !== undefined) {
        filters.value = { ...newFilters }
      }

      // Aquí iría la llamada real a la API
      // Por ahora simulamos la búsqueda
      const result = await mockSearch(filters.value, page)
      
      if (page === 1) {
        searchResults.value = result.movies
      } else {
        // Para paginación, agregar a los resultados existentes
        searchResults.value.push(...result.movies)
      }
      
      total.value = result.total
      currentPage.value = result.page
      hasMore.value = result.hasMore

      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en la búsqueda'
      console.error('Error en búsqueda:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cargar más resultados (paginación)
   */
  const loadMore = async () => {
    if (hasMore.value && !isLoading.value) {
      await search(undefined, currentPage.value + 1)
    }
  }

  /**
   * Limpiar filtros y resultados
   */
  const clear = () => {
    filters.value = {}
    searchResults.value = []
    error.value = null
    total.value = 0
    currentPage.value = 1
    hasMore.value = false
  }

  /**
   * Función simulada de búsqueda (reemplazar con API real)
   */
  const mockSearch = async (filters: MovieFilters, page: number): Promise<SearchResult> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

    // Datos de ejemplo
    const allMovies: Movie[] = [
      {
        id: 1,
        title: "The Matrix",
        src: "/images/cat.jpg",
        views: 1200,
        likes: 450,
        genre: "scifi",
        year: 1999,
        duration: 136,
        platform: "netflix",
        director: "The Wachowskis",
        rating: 8.7
      },
      {
        id: 2,
        title: "Inception",
        src: "/images/cat.jpg", 
        views: 980,
        likes: 320,
        genre: "scifi",
        year: 2010,
        duration: 148,
        platform: "netflix",
        director: "Christopher Nolan",
        rating: 8.8
      },
      {
        id: 3,
        title: "The Godfather",
        src: "/images/cat.jpg",
        views: 1500,
        likes: 600,
        genre: "crime",
        year: 1972,
        duration: 175,
        platform: "hbo-max",
        director: "Francis Ford Coppola",
        rating: 9.2
      },
      {
        id: 4,
        title: "Pulp Fiction",
        src: "/images/cat.jpg",
        views: 1100,
        likes: 480,
        genre: "crime",
        year: 1994,
        duration: 154,
        platform: "amazon-prime",
        director: "Quentin Tarantino",
        rating: 8.9
      },
      {
        id: 5,
        title: "The Dark Knight",
        src: "/images/cat.jpg",
        views: 1300,
        likes: 520,
        genre: "action",
        year: 2008,
        duration: 152,
        platform: "hbo-max",
        director: "Christopher Nolan",
        rating: 9.0
      },
      {
        id: 6,
        title: "Forrest Gump",
        src: "/images/cat.jpg",
        views: 900,
        likes: 350,
        genre: "drama",
        year: 1994,
        duration: 142,
        platform: "disney-plus",
        director: "Robert Zemeckis",
        rating: 8.8
      }
    ]

    // Aplicar filtros
    let filteredMovies = allMovies

    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase()
      filteredMovies = filteredMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.director?.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.genre) {
      filteredMovies = filteredMovies.filter(movie => movie.genre === filters.genre)
    }

    if (filters.year) {
      filteredMovies = filteredMovies.filter(movie => movie.year === filters.year)
    }

    if (filters.platform) {
      filteredMovies = filteredMovies.filter(movie => movie.platform === filters.platform)
    }

    if (filters.duration?.min || filters.duration?.max) {
      filteredMovies = filteredMovies.filter(movie => {
        if (!movie.duration) return false
        const meetsMin = !filters.duration?.min || movie.duration >= filters.duration.min
        const meetsMax = !filters.duration?.max || movie.duration <= filters.duration.max
        return meetsMin && meetsMax
      })
    }

    // Simular paginación
    const pageSize = 4
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex)

    return {
      movies: paginatedMovies,
      total: filteredMovies.length,
      page,
      hasMore: endIndex < filteredMovies.length
    }
  }

  /**
   * Obtener filtros activos para mostrar en UI
   */
  const getActiveFilters = computed(() => {
    const active = []
    
    if (filters.value.searchText) {
      active.push({ type: 'search', label: `"${filters.value.searchText}"`, value: filters.value.searchText })
    }
    
    if (filters.value.genre) {
      active.push({ type: 'genre', label: filters.value.genre, value: filters.value.genre })
    }
    
    if (filters.value.year) {
      active.push({ type: 'year', label: filters.value.year.toString(), value: filters.value.year })
    }
    
    if (filters.value.platform) {
      active.push({ type: 'platform', label: filters.value.platform, value: filters.value.platform })
    }
    
    if (filters.value.duration?.min || filters.value.duration?.max) {
      const min = filters.value.duration?.min || 0
      const max = filters.value.duration?.max || '∞'
      active.push({ type: 'duration', label: `${min}-${max} min`, value: filters.value.duration })
    }

    return active
  })

  /**
   * Verificar si hay filtros activos
   */
  const hasActiveFilters = computed(() => getActiveFilters.value.length > 0)

  return {
    // Estado
    filters: readonly(filters),
    searchResults: readonly(searchResults),
    isLoading: readonly(isLoading),
    error: readonly(error),
    total: readonly(total),
    currentPage: readonly(currentPage),
    hasMore: readonly(hasMore),
    
    // Computadas
    getActiveFilters,
    hasActiveFilters,
    
    // Métodos
    search,
    loadMore,
    clear
  }
}
