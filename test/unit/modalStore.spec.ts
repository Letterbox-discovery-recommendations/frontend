import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useModalStore } from '../../stores/modal'

describe('Modal Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tiene el estado inicial correcto', () => {
    const store = useModalStore()

    expect(store.isOpen).toBe(false)
    expect(store.selectedMovie).toBeNull()
  })

  it('openModal abre el modal y asigna la película seleccionada', () => {
    const store = useModalStore()

    const fakeMovie = {
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
    }

    store.openModal(fakeMovie)

    expect(store.isOpen).toBe(true)
    expect(store.selectedMovie).toEqual(fakeMovie)
  })

  it('closeModal cierra el modal y limpia la película seleccionada', () => {
    const store = useModalStore()

    const fakeMovie = { id: 2, title: 'Matrix' }
    store.openModal(fakeMovie)

    store.closeModal()

    expect(store.isOpen).toBe(false)
    expect(store.selectedMovie).toBeNull()
  })

  it('getter modalIsOpen refleja correctamente el estado', () => {
    const store = useModalStore()

    expect(store.modalIsOpen).toBe(false)

    store.openModal({ id: 3, title: 'Avatar' })
    expect(store.modalIsOpen).toBe(true)

    store.closeModal()
    expect(store.modalIsOpen).toBe(false)
  })

  it('getter currentMovie retorna la película seleccionada', () => {
    const store = useModalStore()

    expect(store.currentMovie).toBeNull()

    const fakeMovie = { id: 5, title: 'The Batman' }
    store.openModal(fakeMovie)

    expect(store.currentMovie).toEqual(fakeMovie)
  })

  it('permite abrir, cerrar y volver a abrir sin perder consistencia', () => {
    const store = useModalStore()
    const movie1 = { id: 1, title: 'Interstellar' }
    const movie2 = { id: 2, title: 'Dune' }

    store.openModal(movie1)
    expect(store.currentMovie).toEqual(movie1)
    expect(store.modalIsOpen).toBe(true)

    store.closeModal()
    expect(store.modalIsOpen).toBe(false)
    expect(store.currentMovie).toBeNull()

    store.openModal(movie2)
    expect(store.currentMovie).toEqual(movie2)
    expect(store.modalIsOpen).toBe(true)
  })
})
