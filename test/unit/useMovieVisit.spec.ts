import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { useMovieVisit } from '../../composables/useMovieVisit'

describe('useMovieVisit composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // mock runtime config and $fetch
    ;(globalThis as any).useRuntimeConfig = () => ({ public: { backendUrl: 'http://test' } })
    global.$fetch = Object.assign(vi.fn().mockResolvedValue({}), { raw: vi.fn(), create: vi.fn() })
    // ensure composable can find the auth store via auto-import (useAuthStore)
    ;(globalThis as any).useAuthStore = () => useAuthStore()
  })

  it('no envía visita si no hay token o userId', async () => {
    const auth = useAuthStore()
    auth.userId = null
    auth.token = null

    const { sendMovieVisit } = useMovieVisit()
    await sendMovieVisit(1)

    expect((global.$fetch as any)).not.toHaveBeenCalled()
  })

  it('envía visita cuando hay token y respeta debounce', async () => {
  const auth = useAuthStore()
  ;(auth as any).userId = 10
  ;(auth as any).token = 'token-xyz'

    const { sendMovieVisit } = useMovieVisit()

    // primera llamada: debe enviar
    await sendMovieVisit(5)
    // segunda llamada inmediata: debe ser ignorada por debounce
    await sendMovieVisit(5)

    expect((global.$fetch as any)).toHaveBeenCalled()
    expect((global.$fetch as any)).toHaveBeenCalledTimes(1)
  })
})
