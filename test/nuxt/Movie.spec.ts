import { render, fireEvent } from '@testing-library/vue'
import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import MovieCard from '../../components/Movie.vue'

// Mock del componente NuxtImg (para que no intente cargar imágenes reales)
vi.mock('#components', () => ({
  NuxtImg: {
    template: '<img :src="src" :alt="alt" data-testid="nuxt-img" />',
    props: ['src', 'alt'],
  },
}))

describe('MovieCard.vue', () => {
  const movieProps = {
    id: 1,
    titulo: 'Inception',
    sinopsis: 'A mind-bending thriller',
    duracionMinutos: 148,
    fechaEstreno: '2010-07-16',
    posterUrl: '/images/inception.jpg',
    director: { id: 1, nombre: 'Christopher Nolan', genero: 1 },
    generos: [{ id: 1, nombre: 'Ciencia Ficción' }],
    plataformas: [{ id: 1, nombre: 'Netflix', logoUrl: '/logos/netflix.png' }],
    elenco: [
      {
        personaje: 'Cobb',
        orden: 1,
        actor: { id: 1, nombre: 'Leonardo DiCaprio', genero: 1 },
      },
    ],
  }

  const renderComponent = () => {
    // Creamos un mock de Pinia para interceptar la llamada a openModal
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    return render(MovieCard, {
      global: {
        plugins: [pinia],
      },
      props: movieProps,
    })
  }

  it('renderiza el título y la imagen correctamente', () => {
    const { getByText, getByTestId } = renderComponent()

    // Verifica el título en mayúsculas
    expect(getByText('INCEPTION')).toBeTruthy()

    // Verifica que NuxtImg reciba la src y alt correctos
    const img = getByTestId('nuxt-img') as HTMLImageElement
    expect(img.src).toContain(movieProps.posterUrl)
    expect(img.alt).toBe(movieProps.titulo)
  })

  it('llama a modalStore.openModal con las props al hacer click', async () => {
    const { getByRole } = renderComponent()
    const card = getByRole('button', { hidden: true }) || getByRole('img').closest('div')

    // Obtenemos el store de modal desde Pinia mockeada
    const { useModalStore } = await import('@/stores/modal')
    const modalStore = useModalStore()

    await fireEvent.click(card!)

    expect(modalStore.openModal).toHaveBeenCalledTimes(1)
    expect(modalStore.openModal).toHaveBeenCalledWith(movieProps)
  })
})
