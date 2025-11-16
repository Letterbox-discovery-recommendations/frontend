import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import FilmsPage from '../../../pages/films.vue'
import { createAndActivatePinia, mountWithPiniaAndSuspense } from '../helpers'

describe('pages/films.vue', () => {
  let pinia: any
  beforeEach(() => {
    pinia = createAndActivatePinia()

    // Mock useAsyncGql for GetMovies to return a list of peliculas
    ;(globalThis as any).useAsyncGql = (opts: any) => {
      if (opts?.operation === 'GetMovies') {
        return { data: { value: { peliculas: Array.from({ length: 50 }).map((_, i) => ({ id: i + 1, titulo: `Movie ${i + 1}`, posterUrl: '' })) } }, pending: { value: false }, error: { value: null }, refresh: vi.fn() }
      }
      return { data: { value: null }, pending: { value: false }, error: { value: null }, refresh: vi.fn() }
    }
  })

  it('muestra el conteo correcto y pagina los resultados', async () => {
    const { wrapper, inner } = mountWithPiniaAndSuspense(FilmsPage, {}, { stubs: { FilterForm: true, Movie: { template: '<div class="movie" />' }, UPagination: true }, pinia })

    // Access computed props from the component
    const vm: any = inner.exists() ? inner.vm : wrapper.vm
    // totalMovies viene de allMovies.length
    expect(vm.totalMovies).toBeGreaterThanOrEqual(50)
    // paginatedMovies should have at most moviesPerPage (24)
    expect(vm.paginatedMovies.length).toBeLessThanOrEqual(24)

    // Check that the rendered grid contains Movie stubs
    const movies = wrapper.findAll('.movie')
    // paginatedMovies are rendered as Movie components; we used a Movie stub so check count > 0
    expect(movies.length).toBeGreaterThan(0)
  })

  it('resetea la pagina a 1 y llama router.push cuando cambian los filtros', async () => {
    const pushMock = vi.fn()
    ;(globalThis as any).useRouter = () => ({ push: pushMock })
    ;(globalThis as any).useRoute = () => ({ query: {} })

    const { wrapper: wrapper2, inner: inner2 } = mountWithPiniaAndSuspense(FilmsPage, {}, { stubs: { FilterForm: true, Movie: { template: '<div class="movie" />' }, UPagination: true }, pinia })

    const { useFilterStore } = await import('../../../stores/filter.js')
    const filter = useFilterStore()

    // simulate changing filters
    filter.setFilters({ genres: ['1'] })
    // wait for watchers to run
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect(pushMock).toHaveBeenCalled()
    const pushed = pushMock.mock.calls[0] ? pushMock.mock.calls[0][0] : undefined
    expect(pushed).toBeDefined()
    expect(pushed.query).toBeDefined()
    expect(pushed.query.page).toBe(1)
  })

  it('sync de search con la URL via router.push cuando cambia searchStore.search', async () => {
    const pushMock = vi.fn()
    ;(globalThis as any).useRouter = () => ({ push: pushMock })
    ;(globalThis as any).useRoute = () => ({ query: {} })

    const { wrapper: wrapper3, inner: inner3 } = mountWithPiniaAndSuspense(FilmsPage, {}, { stubs: { FilterForm: true, Movie: { template: '<div class="movie" />' }, UPagination: true }, pinia })

    const { useSearchStore } = await import('../../../stores/search.js')
    const search = useSearchStore()
    search.setSearch('matrix')

    await nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect(pushMock).toHaveBeenCalled()
    const pushed = pushMock.mock.calls[0] ? pushMock.mock.calls[0][0] : undefined
    expect(pushed.query.search).toBe('matrix')
  })
})
