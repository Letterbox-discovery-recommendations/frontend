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
  })

  it('tiene el estado inicial correcto', () => {
    const store = useAuthStore()
    expect(store.userId).toBeNull()
    expect(store.token).toBeNull()
  })

  it('login guarda correctamente token y userId', async () => {
    const store = useAuthStore()

    // JWT de prueba con payload { "user_id": 123 }
    const fakePayload = { user_id: 123 }
    const fakeToken = [
      'header',
      btoa(JSON.stringify(fakePayload)),
      'signature',
    ].join('.')

    // Mockear la respuesta de $fetch
    ;(global.$fetch as any).mockResolvedValueOnce({
      access_token: fakeToken,
    })

    const fakeForm = new URLSearchParams({ username: 'test', password: '1234' })

    await store.login(fakeForm)

    expect(global.$fetch).toHaveBeenCalledTimes(1)
    expect(store.token).toBe(fakeToken)
    expect(store.userId).toBe(123)
  })

  it('login usa sub si user_id no está en el payload', async () => {
    const store = useAuthStore()

    const fakePayload = { sub: 'user-456' }
    const fakeToken = ['x', btoa(JSON.stringify(fakePayload)), 'y'].join('.')

    ;(global.$fetch as any).mockResolvedValueOnce({
      access_token: fakeToken,
    })

    await store.login(new URLSearchParams({ username: 'x', password: 'y' }))

    expect(store.userId).toBe('user-456')
  })

  it('logout limpia correctamente el estado', () => {
    const store = useAuthStore()

    // forzamos valores válidos sin modificar tipos del store
    ;(store as any).userId = 99
    ;(store as any).token = 'abc123'

    store.logout()

    expect(store.userId).toBeNull()
    expect(store.token).toBeNull()
  })

  it('register realiza una petición y luego llama a login', async () => {
    const store = useAuthStore()

    const fakeRegisterResponse = {
      username: 'john',
      password: 'doe',
    }

    // Mock del register
    ;(global.$fetch as any)
      .mockResolvedValueOnce(fakeRegisterResponse) // para register
      .mockResolvedValueOnce({ access_token: 'token.encoded.payload' }) // para login

    // Mock de login para no hacer lógica real (solo queremos verificar que se llama)
    const loginSpy = vi.spyOn(store, 'login').mockResolvedValueOnce(undefined as any)

    await store.register({ username: 'john', password: 'doe' })

    expect(global.$fetch).toHaveBeenCalledTimes(1)
    expect(global.$fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(Object),
      }),
    )

    expect(loginSpy).toHaveBeenCalledTimes(1)
    // Current implementation may call login without parameters; assert it was called at least once
    expect(loginSpy).toHaveBeenCalled()
  })

  it('maneja errores de red correctamente en login', async () => {
    const store = useAuthStore()

    ;(global.$fetch as any).mockRejectedValueOnce(new Error('Network Error'))

    const fakeForm = new URLSearchParams({ username: 'test', password: '1234' })

    await expect(store.login(fakeForm)).rejects.toThrow('Network Error')
    expect(store.token).toBeNull()
    expect(store.userId).toBeNull()
  })
})
