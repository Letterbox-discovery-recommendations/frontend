import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { useModalStore } from '../../stores/modal'
import { useSearchStore } from '../../stores/search'

// Mock global $fetch
global.$fetch = Object.assign(vi.fn(), {
  raw: vi.fn(),
  create: vi.fn(),
})

describe('Integración: Auth + Modal + Search Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('flujo completo de login → búsqueda → abrir modal → logout', async () => {
    const authStore = useAuthStore()
    const modalStore = useModalStore()
    const searchStore = useSearchStore()

    // Simulamos login exitoso
    const fakePayload = { user_id: 42 }
    const fakeToken = ['h', btoa(JSON.stringify(fakePayload)), 's'].join('.')

    ;(global.$fetch as any).mockResolvedValueOnce({
      access_token: fakeToken,
    })

    const loginData = new URLSearchParams({ username: 'tester', password: '1234' })
    await authStore.login(loginData)

    expect(authStore.userId).toBe(42)
    expect(authStore.token).toBe(fakeToken)

    // Simulamos búsqueda
    searchStore.setSearch('Inception')
    expect(searchStore.search).toBe('Inception')

    // Abrimos modal con resultados
    const movie = { id: 1, title: 'Inception', genre: 'Sci-Fi' }
    modalStore.openModal(movie)
    expect(modalStore.isOpen).toBe(true)
    expect(modalStore.selectedMovie).toEqual(movie)

    // Logout → debería limpiar auth, pero no otros stores (por ahora)
    authStore.logout()
    expect(authStore.userId).toBeNull()
    expect(authStore.token).toBeNull()

    // Verificamos que los otros stores mantienen su estado
    expect(searchStore.search).toBe('Inception')
    expect(modalStore.isOpen).toBe(true)

    // Luego simulamos cierre general (usuario cierra todo)
    searchStore.clearSearch()
    modalStore.closeModal()

    expect(searchStore.search).toBeNull()
    expect(modalStore.isOpen).toBe(false)
    expect(modalStore.selectedMovie).toBeNull()
  })

  it('reinicia todos los stores correctamente tras logout + limpieza', async () => {
    const authStore = useAuthStore()
    const modalStore = useModalStore()
    const searchStore = useSearchStore()

    // Forzamos estados
    ;(authStore as any).userId = 99
    ;(authStore as any).token = 'abc123'
    searchStore.setSearch('Matrix')
    modalStore.openModal({ id: 5, title: 'Matrix' })

    // Logout y limpieza
    authStore.logout()
    searchStore.clearSearch()
    modalStore.closeModal()

    expect(authStore.userId).toBeNull()
    expect(authStore.token).toBeNull()
    expect(searchStore.search).toBeNull()
    expect(modalStore.isOpen).toBe(false)
    expect(modalStore.selectedMovie).toBeNull()
  })
})
