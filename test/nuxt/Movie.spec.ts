import { describe, it, expect, beforeEach } from 'vitest'
import Movie from '../../components/Movie.vue'
import { createAndActivatePinia, mountWithPiniaAndSuspense } from '../helpers'

describe('Movie.vue (nuxt)', () => {
  let pinia: any
  beforeEach(() => {
    pinia = createAndActivatePinia()
  })

  it('renderiza poster cuando existe posterUrl y usa alt correcto', async () => {
    const NuxtImgStub = { props: ['src', 'alt'], template: '<img :src="src" :alt="alt" />' }
    const { wrapper, inner } = mountWithPiniaAndSuspense(Movie, { id: 1, titulo: 'Inception', posterUrl: '/img.jpg' }, { stubs: { NuxtImg: NuxtImgStub }, pinia })
    await wrapper.vm.$nextTick()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Inception')
    expect(img.attributes('src')).toBe('/img.jpg')
  })

  it('al hacer click llama a modalStore.openModal con la pelicula', async () => {
    const { useModalStore } = await import('../../stores/modal.js')
    const modal = useModalStore()
    const { wrapper, inner } = mountWithPiniaAndSuspense(Movie, { id: 5, titulo: 'Matrix' }, { stubs: { NuxtImg: true }, pinia })
    await wrapper.vm.$nextTick()

    // click on the wrapper root element
    await wrapper.trigger('click')

    expect(modal.isOpen).toBe(true)
    expect(modal.selectedMovie).toBeTruthy()
    expect(modal.selectedMovie.titulo).toBe('Matrix')
  })
})
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Movie from '../../components/Movie.vue'
import { useModalStore } from '../../stores/modal'

describe('Movie.vue', () => {
  let pinia: any
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renderiza el título y la imagen correctamente y abre modal al click', async () => {
    const modalStore = useModalStore()

    const wrapper = mount(Movie as any, {
      props: {
        id: 1,
        titulo: 'Inception',
        posterUrl: '/_ipx/_/images/inception.jpg',
      },
      global: {
        stubs: {
          NuxtImg: {
            props: ['src', 'alt'],
            template: `<img :src="src" :alt="alt" />`,
          },
          UIcon: { template: '<i />' },
        },
        plugins: [pinia],
      },
    })

    // título en mayúsculas
    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.text()).toBe('INCEPTION')

    // imagen con alt
    const img = wrapper.find('img[alt="Inception"]')
    expect(img.exists()).toBe(true)

    // click abre modal con las props
    await wrapper.trigger('click')

    expect(modalStore.isOpen).toBe(true)
    expect(modalStore.selectedMovie).toMatchObject({ id: 1, titulo: 'Inception' })
  })
})
