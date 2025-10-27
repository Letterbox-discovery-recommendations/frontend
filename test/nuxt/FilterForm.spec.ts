import { vi } from 'vitest'

// Mock `useAsyncGql` from `#imports` so the component setup doesn't throw
vi.mock('#imports', async () => {
  const actual = await vi.importActual('#imports')
  const { ref } = (await vi.importActual('vue')) as any
  return {
    ...actual,
    useAsyncGql: vi.fn((opts: any) => {
      if (opts?.operation === 'GetGenres') {
        return {
          data: ref({ generos: [{ nombre: 'Acción' }, { nombre: 'Comedia' }, { nombre: 'Drama' }] }),
          pending: ref(false),
          error: ref(null),
          refresh: vi.fn(),
        }
      }
      if (opts?.operation === 'GetPlatforms') {
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
  }
})
// Also provide a fallback global in case the component expects `useAsyncGql` as a runtime global
;(async () => {
  const { ref } = (await vi.importActual('vue')) as any
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.useAsyncGql = (opts: any) => {
    if (opts?.operation === 'GetGenres') {
      return {
        data: ref({ generos: [{ nombre: 'Acción' }, { nombre: 'Comedia' }, { nombre: 'Drama' }] }),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      }
    }
    if (opts?.operation === 'GetPlatforms') {
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
  }

  // Increase default timeout for these nuxt-mount tests which can be slower
  // `vi.setTimeout` is not present in this environment, so we'll set per-test timeouts instead.
})()

import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import FilterForm from '~/components/FilterForm.vue'
import { useFilterStore } from '~/stores/filter'

describe('FilterForm', () => {
  let filterStore: ReturnType<typeof useFilterStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    filterStore = useFilterStore()
  })

  it('renderiza correctamente todos los elementos del formulario', async () => {
    const wrapper = await mountSuspended(FilterForm)
    expect(wrapper.text()).toContain('FILTRAR POR')
    expect(wrapper.text()).toContain('LIMPIAR')
  }, 20000)


  it('carga los géneros correctamente desde GraphQL', async () => {
    const wrapper = await mountSuspended(FilterForm)

    await wrapper.vm.$nextTick()

    const component = wrapper.vm as any
    
    // Verificar que los géneros se cargaron correctamente
    expect(component.generoItems).toEqual(['Acción', 'Comedia', 'Drama'])
  }, 20000)

  it('carga las plataformas correctamente desde GraphQL', async () => {
    const wrapper = await mountSuspended(FilterForm)

    await wrapper.vm.$nextTick()

    const component = wrapper.vm as any
    
    // Verificar que las plataformas se cargaron correctamente
    expect(component.plataformaItems).toEqual(['Netflix', 'Amazon Prime', 'Disney+'])
  }, 20000)

  
})