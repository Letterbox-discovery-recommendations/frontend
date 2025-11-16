import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { createAndActivatePinia, mountWithPiniaAndSuspense } from '../helpers'

describe('Navbar.vue (nuxt)', () => {
  let pinia: any
  beforeEach(() => {
    pinia = createAndActivatePinia()
    ;(globalThis as any).useRuntimeConfig = () => ({ public: { backendUrl: 'http://test' } })
  })

  it('muestra el boton INICIAR SESIÓN cuando no hay userId', async () => {
    const { wrapper, inner } = mountWithPiniaAndSuspense(Navbar, {}, { stubs: { UButton: { template: '<button><slot/></button>' }, NuxtImg: true, UTooltip: { template: '<div><slot/></div>' } }, pinia })
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('INICIAR SESIÓN')
  })

  it('al escribir en el input actualiza el store de búsqueda', async () => {
    const UInputStub = {
      props: ['modelValue'],
      template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    }

  const { wrapper, inner } = mountWithPiniaAndSuspense(Navbar, {}, { stubs: { UInput: UInputStub, UButton: { template: '<button></button>' }, NuxtImg: true, UTooltip: { template: '<div><slot/></div>' } }, pinia })
    await wrapper.vm.$nextTick()

    const input = wrapper.find('input')
    await input.setValue('matrix')
    await nextTick()

    const { useSearchStore } = await import('../../stores/search.js')
    const search = useSearchStore()
    expect(search.search).toBe('matrix')
  })
})
