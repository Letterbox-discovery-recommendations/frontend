import { describe, it, expect, beforeEach, vi } from 'vitest'
import FilterForm from '../../components/FilterForm.vue'
import { createAndActivatePinia, mountWithPiniaAndSuspense } from '../helpers'

describe('FilterForm.vue (nuxt)', () => {
  let pinia: any
  beforeEach(() => {
    pinia = createAndActivatePinia()
  })

  it('handleClear resetea los filtros en el store', async () => {
    const { useFilterStore } = await import('../../stores/filter.js')
    const filter = useFilterStore()
    filter.setFilters({ genres: ['1'], duracion: 'Menos de 90 min', sort: 'titulo' })

    const UButtonStub = { template: '<button @click="$emit(\'click\')">LIMPIAR</button>' }
    const { wrapper, inner } = mountWithPiniaAndSuspense(FilterForm, {}, { stubs: { USelectMenu: true, UButton: UButtonStub }, pinia })
    await wrapper.vm.$nextTick()

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    expect(filter.filters.genres.length).toBe(0)
    expect(filter.filters.duracion).toBeNull()
    expect(filter.filters.sort).toBeNull()
  })

  it('expose.updateFilters llama a setFilters en el store', async () => {
    const { useFilterStore } = await import('../../stores/filter.js')
    const filter = useFilterStore()
    const spy = vi.spyOn(filter, 'setFilters')

    // Mount directly (no Suspense) for this test so the exposed methods are
    // available on the wrapper.vm proxy reliably.
    const { mount } = await import('@vue/test-utils')
    const wrapper = mount(FilterForm as any, {
      global: {
        stubs: { USelectMenu: true, UButton: true },
        plugins: [pinia],
      },
    })
    await wrapper.vm.$nextTick()

    // call exposed method on the vm proxy
    if ((wrapper.vm as any).updateFilters) {
      ;(wrapper.vm as any).updateFilters()
    } else {
      throw new Error('Could not locate exposed updateFilters on FilterForm mount')
    }

    expect(spy).toHaveBeenCalled()
  })
})
