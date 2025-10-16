// test/nuxt/FilterForm.spec.ts
/*import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, beforeEach, vi } from 'vitest'
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
  })


  it('carga los géneros correctamente desde GraphQL', async () => {
    const wrapper = await mountSuspended(FilterForm)

    await wrapper.vm.$nextTick()

    const component = wrapper.vm as any
    
    // Verificar que los géneros se cargaron correctamente
    expect(component.generoItems).toEqual(['Acción', 'Comedia', 'Drama'])
  })

  it('carga las plataformas correctamente desde GraphQL', async () => {
    const wrapper = await mountSuspended(FilterForm)

    await wrapper.vm.$nextTick()

    const component = wrapper.vm as any
    
    // Verificar que las plataformas se cargaron correctamente
    expect(component.plataformaItems).toEqual(['Netflix', 'Amazon Prime', 'Disney+'])
  })

  it('actualiza el store cuando se selecciona un género', async () => {
    const wrapper = await mountSuspended(FilterForm)

    // Simular selección de género (accediendo a las refs internas)
    const component = wrapper.vm as any
    component.selectedGenero = ['Acción']

    // Esperar a que el watcher se ejecute
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verificar que el store se actualizó
    expect(filterStore.filters.genres).toEqual(['Acción'])
  })

  it('actualiza el store cuando se selecciona ordenamiento', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    component.selectedSort = 'titulo'

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(filterStore.filters.sort).toBe('titulo')
  })

  it('actualiza el store cuando se selecciona año de estreno', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    component.selectedEstreno = '2020s'

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(filterStore.filters.estreno).toBe('2020s')
  })

  it('actualiza el store cuando se selecciona duración', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    component.selectedDuracion = 'Más de 120 min'

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(filterStore.filters.duracion).toBe('Más de 120 min')
  })

  it('actualiza el store cuando se selecciona plataforma', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    component.selectedPlataforma = ['Netflix']

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(filterStore.filters.plataforma).toEqual(['Netflix'])
  })

  it('limpia todos los filtros al hacer click en LIMPIAR', async () => {
    const wrapper = await mountSuspended(FilterForm)

    // Establecer algunos valores primero
    const component = wrapper.vm as any
    component.selectedGenero = ['Acción']
    component.selectedSort = 'titulo'
    component.selectedEstreno = '2020s'
    component.selectedDuracion = 'Más de 120 min'
    component.selectedPlataforma = ['Netflix']

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Encontrar y hacer click en el botón LIMPIAR
    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')

    await wrapper.vm.$nextTick()

    // Verificar que los valores se limpiaron
    expect(component.selectedGenero).toEqual([])
    expect(component.selectedSort).toBeNull()
    expect(component.selectedEstreno).toBeNull()
    expect(component.selectedDuracion).toBeNull()
    expect(component.selectedPlataforma).toEqual([])

    // Verificar que el store también se limpió
    expect(filterStore.filters.genres).toEqual([])
    expect(filterStore.filters.sort).toBeNull()
    expect(filterStore.filters.estreno).toBeNull()
    expect(filterStore.filters.duracion).toBeNull()
    expect(filterStore.filters.plataforma).toEqual([])
  })

  it('actualiza múltiples filtros simultáneamente', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    component.selectedGenero = ['Acción', 'Comedia']
    component.selectedPlataforma = ['Netflix', 'Disney+']
    component.selectedSort = 'titulo_desc'

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(filterStore.filters.genres).toEqual(['Acción', 'Comedia'])
    expect(filterStore.filters.plataforma).toEqual(['Netflix', 'Disney+'])
    expect(filterStore.filters.sort).toBe('titulo_desc')
  })

  it('expone el método updateFilters', async () => {
    const wrapper = await mountSuspended(FilterForm)

    // Verificar que el método está expuesto
    expect(wrapper.vm.updateFilters).toBeDefined()
    expect(typeof wrapper.vm.updateFilters).toBe('function')

    // Establecer valores
    const component = wrapper.vm as any
    component.selectedGenero = ['Drama']

    // Llamar al método expuesto manualmente
    wrapper.vm.updateFilters()

    await wrapper.vm.$nextTick()

    expect(filterStore.filters.genres).toEqual(['Drama'])
  })

  it('contiene todos los items de estreno correctos', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    const expectedItems = [
      "2020s", "2010s", "2000s", "1990s", "1980s", 
      "1970s", "1960s", "1950s", "1940s", "1930s", 
      "1920s", "1910s", "1900s", "1800s"
    ]

    expect(component.estrenoItems).toEqual(expectedItems)
  })

  it('contiene todos los items de duración correctos', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    const expectedItems = [
      "Más de 120 min",
      "Entre 90 y 120 min",
      "Menos de 90 min",
      "Cualquiera"
    ]

    expect(component.duracionItems).toEqual(expectedItems)
  })

  it('contiene todos los items de ordenamiento correctos', async () => {
    const wrapper = await mountSuspended(FilterForm)

    const component = wrapper.vm as any
    const expectedItems = [
      "titulo",
      "titulo_desc",
      "duracionMinutos",
      "duracionMinutos_desc",
      "fechaEstreno",
      "fechaEstreno_desc"
    ]

    expect(component.sortItems).toEqual(expectedItems)
  })
})*/