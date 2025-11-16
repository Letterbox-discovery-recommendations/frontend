import { vi } from 'vitest'
import { ref } from 'vue'

// Mock del sistema de auto-imports de Nuxt
vi.mock('#imports', () => ({
  useAsyncGql: vi.fn((opts: any) => {
    const operation = opts?.operation

    if (operation === 'GetGenres') {
      return {
        data: ref({ generos: [{ nombre: 'Acción' }, { nombre: 'Comedia' }, { nombre: 'Drama' }] }),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      }
    }

    if (operation === 'GetPlatforms') {
      return {
        data: ref({ plataformas: [{ nombre: 'Netflix' }, { nombre: 'Amazon Prime' }, { nombre: 'Disney+' }] }),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      }
    }

    return {
      data: ref(null),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    }
  }),
}))

// Common runtime mocks for both unit and nuxt tests
// Provide a stable shape for useRuntimeConfig, $fetch, navigateTo and useMovieVisit
;(globalThis as any).useRuntimeConfig = () => ({
  public: {
    backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://test',
    usersUrl: process.env.NUXT_USERS_URL || 'http://test',
  },
})

// Shape-compatible $fetch mock used across tests; tests can override with mockResolvedValueOnce
// Default $fetch resolves to an empty array to avoid components receiving `null` and
// later attempting to read `.length` on it during render (which causes test errors).
global.$fetch = Object.assign(vi.fn().mockResolvedValue([]), { raw: vi.fn(), create: vi.fn() })

// navigateTo is a Nuxt helper used by stores/pages — mock to noop
;(globalThis as any).navigateTo = vi.fn()

// Default useMovieVisit composable mock (tests that need to assert calls can override)
;(globalThis as any).useMovieVisit = () => ({ sendMovieVisit: vi.fn().mockResolvedValue({}) })

// Provide a safe default for useAsyncGql import if tests import it directly from globals
if (!(globalThis as any).useAsyncGql) {
  ;(globalThis as any).useAsyncGql = (opts: any) => ({ data: ref(null), pending: ref(false), error: ref(null), refresh: vi.fn() })
}
