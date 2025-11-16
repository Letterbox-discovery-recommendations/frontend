import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import MovieModal from '../../components/MovieModal.vue'
import { useModalStore } from '../../stores/modal'

describe('MovieModal.vue', () => {
  let pinia: any
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    // Mock runtime config for baseUrl
    ;(globalThis as any).useRuntimeConfig = () => ({ public: { backendUrl: 'http://test' } })

    // Mock useAsyncGql for GetMovie (component calls this when selectedMovie changes)
    ;(globalThis as any).useAsyncGql = (opts: any) => {
      if (opts?.operation === 'GetMovie') {
        return { data: ref({ pelicula: { id: 1, titulo: 'Inception', posterUrl: '/img.jpg', generos: [{ id: 1, nombre: 'Sci-Fi' }] } }), pending: ref(false), error: ref(null), refresh: () => {} }
      }
      return { data: ref(null), pending: ref(false), error: ref(null), refresh: () => {} }
    }

    // Mock composable useMovieVisit
    ;(globalThis as any).useMovieVisit = () => ({ sendMovieVisit: vi.fn().mockResolvedValue({}) })

    // Mock $fetch for similar movies
    global.$fetch = Object.assign(vi.fn().mockResolvedValue([{ movie: { id: 2, titulo: 'Similar', posterUrl: '' }, score: 0.8 }]), { raw: vi.fn(), create: vi.fn() })
  })

  it('carga datos de la película, envia visita y carga similares', async () => {
    const modalStore = useModalStore()

    const wrapper = mount(MovieModal as any, {
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
          NuxtImg: { props: ['src', 'alt'], template: '<img :src="src" :alt="alt" />' },
        },
        plugins: [pinia],
      },
    })

    // Open modal with a basic movie object
    modalStore.openModal({ id: 1, titulo: 'Inception' })

    // Wait microtask to allow watchers and async calls
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

    // After loading, the modal should have movieData and similarMovies via $fetch
    // Access component internals
    const vm: any = wrapper.vm
    expect(vm.movieData).toBeTruthy()
    expect(vm.movieData.id).toBe(1)

    // similarMovies fetched via mocked $fetch
    expect((global.$fetch as any)).toHaveBeenCalled()
  })
})
