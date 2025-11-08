import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFilterStore } from '../../stores/filter'

describe('Filter Store', () => {
  beforeEach(() => {
    // Crear una nueva instancia de Pinia antes de cada test
    setActivePinia(createPinia())
  })

  it('tiene el estado inicial correcto', () => {
    const store = useFilterStore()

    expect(store.filters).toEqual({
      genres: [],
      sort: null,
      estreno: null,
      duracion: null,
      plataforma: [],
    })
  })

  describe('setFilters action', () => {
    it('actualiza los filtros correctamente', () => {
      const store = useFilterStore()

      store.setFilters({
        genres: ['Acción'],
        sort: 'titulo',
      })

      expect(store.filters.genres).toEqual(['Acción'])
      expect(store.filters.sort).toBe('titulo')
    })

    it('actualiza parcialmente los filtros manteniendo otros valores', () => {
      const store = useFilterStore()

      // Establecer algunos filtros iniciales
      store.setFilters({
        genres: ['Acción'],
        sort: 'titulo',
      })

      // Actualizar solo algunos filtros
      store.setFilters({
        duracion: 'Más de 120 min',
      })

      // Los filtros anteriores deben mantenerse
      expect(store.filters.genres).toEqual(['Acción'])
      expect(store.filters.sort).toBe('titulo')
      expect(store.filters.duracion).toBe('Más de 120 min')
    })

    it('puede actualizar múltiples filtros a la vez', () => {
      const store = useFilterStore()

      store.setFilters({
        genres: ['Acción', 'Comedia'],
        sort: 'titulo_desc',
        estreno: '2020s',
        duracion: 'Más de 120 min',
        plataforma: ['Netflix', 'Disney+'],
      })

      expect(store.filters).toEqual({
        genres: ['Acción', 'Comedia'],
        sort: 'titulo_desc',
        estreno: '2020s',
        duracion: 'Más de 120 min',
        plataforma: ['Netflix', 'Disney+'],
      })
    })
  })

  describe('clearFilters action', () => {
    it('limpia todos los filtros', () => {
      const store = useFilterStore()

      // Establecer algunos filtros primero
      store.setFilters({
        genres: ['Acción', 'Drama'],
        sort: 'titulo',
        estreno: '2020s',
        duracion: 'Más de 120 min',
        plataforma: ['Netflix'],
      })

      // Limpiar
      store.clearFilters()

      // Verificar que todo volvió al estado inicial
      expect(store.filters).toEqual({
        genres: [],
        sort: null,
        estreno: null,
        duracion: null,
        plataforma: [],
      })
    })
  })

  describe('hasGenreFilters getter', () => {
    it('retorna false cuando no hay géneros seleccionados', () => {
      const store = useFilterStore()
      expect(store.hasGenreFilters).toBe(false)
    })

    it('retorna true cuando hay géneros seleccionados', () => {
      const store = useFilterStore()
      store.setFilters({ genres: ['Acción'] })
      expect(store.hasGenreFilters).toBe(true)
    })

    it('retorna false cuando genres es un array vacío', () => {
      const store = useFilterStore()
      store.setFilters({ genres: [] })
      expect(store.hasGenreFilters).toBe(false)
    })
  })

  describe('hasDurationFilter getter', () => {
    it('retorna false cuando no hay duración seleccionada', () => {
      const store = useFilterStore()
      expect(store.hasDurationFilter).toBe(false)
    })

    it('retorna true cuando hay duración seleccionada', () => {
      const store = useFilterStore()
      store.setFilters({ duracion: 'Más de 120 min' })
      expect(store.hasDurationFilter).toBe(true)
    })
  })

  describe('hasAnyFilters getter', () => {
    it('retorna false cuando no hay filtros aplicados', () => {
      const store = useFilterStore()
      expect(store.hasAnyFilters).toBe(false)
    })

    it('retorna true cuando hay géneros seleccionados', () => {
      const store = useFilterStore()
      store.setFilters({ genres: ['Acción'] })
      expect(store.hasAnyFilters).toBe(true)
    })

    it('retorna true cuando hay sort seleccionado', () => {
      const store = useFilterStore()
      store.setFilters({ sort: 'titulo' })
      expect(store.hasAnyFilters).toBe(true)
    })

    it('retorna true cuando hay duración seleccionada', () => {
      const store = useFilterStore()
      store.setFilters({ duracion: 'Más de 120 min' })
      expect(store.hasAnyFilters).toBe(true)
    })

    it('retorna false cuando plataforma tiene valores pero otros no', () => {
      const store = useFilterStore()
      store.setFilters({ plataforma: ['Netflix'] })
      // Nota: según el getter actual, plataforma no se considera en hasAnyFilters
      expect(store.hasAnyFilters).toBe(false)
    })

    it('retorna true cuando hay múltiples filtros', () => {
      const store = useFilterStore()
      store.setFilters({
        genres: ['Acción'],
        sort: 'titulo',
        duracion: 'Más de 120 min',
      })
      expect(store.hasAnyFilters).toBe(true)
    })
  })

  describe('integración de acciones', () => {
    it('puede hacer múltiples operaciones en secuencia', () => {
      const store = useFilterStore()

      // Establecer filtros
      store.setFilters({ genres: ['Acción'], sort: 'titulo' })
      expect(store.hasAnyFilters).toBe(true)

      // Agregar más filtros
      store.setFilters({ duracion: 'Más de 120 min' })
      expect(store.hasDurationFilter).toBe(true)

      // Limpiar todo
      store.clearFilters()
      expect(store.hasAnyFilters).toBe(false)
      expect(store.hasGenreFilters).toBe(false)
      expect(store.hasDurationFilter).toBe(false)
    })
  })
})