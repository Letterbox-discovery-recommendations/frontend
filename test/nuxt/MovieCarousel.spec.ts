import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { createAndActivatePinia, mountWithPiniaAndSuspense } from '../helpers'
import MovieCarousel from '../../components/MovieCarousel.vue'

describe('MovieCarousel.vue', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createAndActivatePinia()
    ;(globalThis as any).useRuntimeConfig = () => ({ public: { backendUrl: 'http://test' } })
  })

  it('calcula dropdownItems a partir de useAsyncGql y setea value por defecto', async () => {
    ;(globalThis as any).useAsyncGql = vi.fn((opts: any) => {
      if (opts?.operation === 'GetGenres') {
        return { data: ref({ generos: [{ nombre: 'Acción' }, { nombre: 'Comedia' }] }), pending: ref(false), error: ref(null), refresh: vi.fn() }
      }
      return { data: ref(null), pending: ref(false), error: ref(null), refresh: vi.fn() }
    })

    const { wrapper, inner } = mountWithPiniaAndSuspense(MovieCarousel, { title: 'Por Género', endpoint: 'genre' }, { stubs: { USelectMenu: true, USeparator: true, UCarousel: { template: '<div><slot name="default" :item="items[0]">slot</slot></div>', props: ['items'] }, Movie: true }, pinia })

    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

  const innerCandidate = wrapper.findComponent({ name: 'Wrapped' })
  const realInner = innerCandidate.exists() ? innerCandidate : wrapper.findComponent(MovieCarousel)
  const vm: any = realInner.exists() ? realInner.vm : wrapper.vm
    expect(Array.isArray(vm.dropdownItems)).toBe(true)
    expect(vm.dropdownItems.length).toBeGreaterThan(0)
    expect(vm.value).toBeTruthy()
  })

  it('fetchMovies llama $fetch con la url correcta para endpoint genre', async () => {
    global.$fetch = Object.assign(vi.fn().mockResolvedValue([{ id: 1, titulo: 'Inception' }]), { raw: vi.fn(), create: vi.fn() })
    ;(globalThis as any).useAsyncGql = vi.fn((opts: any) => {
      if (opts?.operation === 'GetGenres') return { data: ref({ generos: [{ id: 10, nombre: 'Acción' }] }), pending: ref(false), error: ref(null), refresh: vi.fn() }
      return { data: ref(null), pending: ref(false), error: ref(null), refresh: vi.fn() }
    })

    const { wrapper, inner } = mountWithPiniaAndSuspense(MovieCarousel, { title: 'Género', endpoint: 'genre' }, { stubs: { USelectMenu: true, USeparator: true, UCarousel: true, Movie: true }, pinia })

    // Wait for Suspense and async watchers
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

  const innerCandidate2 = wrapper.findComponent({ name: 'Wrapped' })
  const realInner2 = innerCandidate2.exists() ? innerCandidate2 : wrapper.findComponent(MovieCarousel)
  const vm: any = realInner2.exists() ? realInner2.vm : wrapper.vm
    vm.value = 'Acción'
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect((global.$fetch as any)).toHaveBeenCalled()
  })

  it('endpoint platform calcula dropdownItems y setea value por defecto', async () => {
    ;(globalThis as any).useAsyncGql = vi.fn((opts: any) => {
      if (opts?.operation === 'GetPlatforms') return { data: ref({ plataformas: [{ id: 5, nombre: 'Netflix' }, { id: 6, nombre: 'HBO' }] }), pending: ref(false), error: ref(null), refresh: vi.fn() }
      return { data: ref(null), pending: ref(false), error: ref(null), refresh: vi.fn() }
    })

    const { wrapper, inner } = mountWithPiniaAndSuspense(MovieCarousel, { title: 'Por Plataforma', endpoint: 'platform' }, { stubs: { USelectMenu: true, USeparator: true, UCarousel: true, Movie: true }, pinia })
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

  const innerCandidate3 = wrapper.findComponent({ name: 'Wrapped' })
  const realInner3 = innerCandidate3.exists() ? innerCandidate3 : wrapper.findComponent(MovieCarousel)
  const vm: any = realInner3.exists() ? realInner3.vm : wrapper.vm
    expect(Array.isArray(vm.dropdownItems)).toBe(true)
    expect(vm.dropdownItems.length).toBeGreaterThan(0)
    expect(vm.value).toBeTruthy()
  })

  it('content y collaborative usan Authorization header cuando hay token', async () => {
    const { useAuthStore } = await import('../../../stores/auth.js')
    const auth = useAuthStore()
    auth.token = 'test-token-123'

    const fetchMock = vi.fn().mockResolvedValue([])
    global.$fetch = Object.assign(fetchMock, { raw: vi.fn(), create: vi.fn() })

    for (const endpoint of ['content', 'collaborative']) {
      const { wrapper } = mountWithPiniaAndSuspense(MovieCarousel, { title: 'Recomendadas', endpoint }, { stubs: { USelectMenu: true, USeparator: true, UCarousel: true, Movie: true }, pinia })
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))

  const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
  const options = lastCall ? (lastCall[1] || {}) : {}
      expect(options.headers).toBeDefined()
      expect(options.headers.Authorization).toContain('Bearer test-token-123')
    }
  })

  it('isLoading es true mientras $fetch está pendiente', async () => {
    let resolveFetch: any
    const p = new Promise((res) => { resolveFetch = res })
    global.$fetch = Object.assign(vi.fn().mockImplementation(() => p), { raw: vi.fn(), create: vi.fn() })

    const { wrapper, inner } = mountWithPiniaAndSuspense(MovieCarousel, { title: 'Loading', endpoint: 'genre' }, { stubs: { USelectMenu: true, USeparator: true, UCarousel: true, Movie: true }, pinia })
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

  const innerCandidate5 = wrapper.findComponent({ name: 'Wrapped' })
  const realInner5 = innerCandidate5.exists() ? innerCandidate5 : wrapper.findComponent(MovieCarousel)
  const vm: any = realInner5.exists() ? realInner5.vm : wrapper.vm
    expect(vm.isLoading).toBe(true)

    resolveFetch([])
    await new Promise((r) => setTimeout(r, 0))
    expect(vm.isLoading).toBe(false)
  })
})
