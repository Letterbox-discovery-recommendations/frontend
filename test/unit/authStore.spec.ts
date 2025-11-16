import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

// We'll (re)assign a fresh mock for `global.$fetch` in beforeEach to avoid
// cross-test contamination of mock implementations (mockResolvedValueOnce, ...)

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Reset all mocks and create a fresh $fetch mock for each test
    vi.resetAllMocks()
    global.$fetch = Object.assign(vi.fn(), {
      raw: vi.fn(),
      create: vi.fn(),
    })
    // Nuxt runtime config is used inside the auth store; mock it for unit tests
    ;(globalThis as any).useRuntimeConfig = () => ({ public: { usersUrl: 'http://test' } })
    // Mock navigateTo to avoid ReferenceError when login calls it
    ;(globalThis as any).navigateTo = vi.fn()
  })

  it('tiene el estado inicial correcto', () => {
    const store = useAuthStore()
    expect(store.userId).toBeNull()
    expect(store.token).toBeNull()
  })


  it('maneja errores de red correctamente en login', async () => {
    const store = useAuthStore()

    ;(global.$fetch as any).mockRejectedValueOnce(new Error('Network Error'))

    const fakeForm = new URLSearchParams({ username: 'test', password: '1234' })

    await expect(store.login(fakeForm)).rejects.toThrow('Network Error')
    expect(store.token).toBeNull()
    expect(store.userId).toBeNull()
  })

  it('login exitoso guarda token y userId', async () => {
    const store = useAuthStore()

    const fakePayload = { user_id: 42 }
    const fakeToken = ['h', Buffer.from(JSON.stringify(fakePayload)).toString('base64'), 's'].join('.')

    ;(global.$fetch as any).mockResolvedValueOnce({ access_token: fakeToken })

    const form = new URLSearchParams({ username: 'tester', password: '1234' })

    await store.login(form)

    expect(store.token).toBe(fakeToken)
    expect(store.userId).toBe(42)
    // navigateTo should have been called to navigate after login
    expect((globalThis as any).navigateTo).toHaveBeenCalled()
  })
})
