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
