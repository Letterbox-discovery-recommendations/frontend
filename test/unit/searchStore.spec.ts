import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '../../stores/search'

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tiene el estado inicial correcto', () => {
    const store = useSearchStore()
    expect(store.search).toBeNull()
  })

  it('setSearch actualiza correctamente el término de búsqueda', () => {
    const store = useSearchStore()

    store.setSearch('Matrix')

    expect(store.search).toBe('Matrix')
  })

  it('clearSearch limpia el término de búsqueda', () => {
    const store = useSearchStore()

    store.setSearch('Inception')
    expect(store.search).toBe('Inception')

    store.clearSearch()
    expect(store.search).toBeNull()
  })

  it('permite cambiar el término de búsqueda varias veces', () => {
    const store = useSearchStore()

    store.setSearch('Avatar')
    expect(store.search).toBe('Avatar')

    store.setSearch('Dune')
    expect(store.search).toBe('Dune')

    store.setSearch('Interstellar')
    expect(store.search).toBe('Interstellar')
  })

  it('mantiene el estado aislado entre tests (Pinia nueva por test)', () => {
    const store = useSearchStore()
    expect(store.search).toBeNull() // siempre limpio
  })
})
