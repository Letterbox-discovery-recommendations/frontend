import { render, fireEvent } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import MovieCard from '../../components/Movie.vue'

// 🧩 Mock del componente NuxtImg para evitar cargas reales de imágenes
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

  // 🧱 Función auxiliar para renderizar el componente con Pinia mockeado
  const renderComponent = () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn, // Permite interceptar las llamadas a los stores
    })

    return render(MovieCard, {
      global: {
        plugins: [pinia],
      },
      props: movieProps,
    })
  }

  // 🔹 TEST 1: Renderización visual básica
  it('renderiza el título y la imagen correctamente', () => {
    const { getByText, getByAltText } = renderComponent()

    // Verifica el título renderizado en mayúsculas
    expect(getByText('INCEPTION')).toBeTruthy()

    // Verifica que el componente NuxtImg reciba las props correctas
    const img = getByAltText('Inception') as HTMLImageElement
    expect(img.src).toContain(movieProps.posterUrl)
    expect(img.alt).toBe(movieProps.titulo)
  })

})
