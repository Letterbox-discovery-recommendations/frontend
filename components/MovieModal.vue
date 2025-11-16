<script setup lang="ts">
import { storeToRefs } from "pinia";

interface Director {
  id: number;
  nombre: string;
  imagenUrl?: string;
  genero: number;
}

interface Genre {
  id: number;
  nombre: string;
}

interface Platform {
  id: number;
  nombre: string;
  logoUrl?: string;
}

interface Actor {
  id: number;
  nombre: string;
  imagenUrl?: string;
  genero: number;
}

interface CastMember {
  personaje: string;
  orden: number;
  actor: Actor;
}

interface Movie {
  id: number;
  titulo: string;
  sinopsis?: string;
  duracionMinutos?: number;
  fechaEstreno?: string;
  posterUrl?: string;
  director?: Director;
  generos?: Genre[];
  plataformas?: Platform[];
  elenco?: CastMember[];
  ratingPelicula?: number;
  score?: number;
}

const modalStore = useModalStore();
const { isOpen, selectedMovie } = storeToRefs(modalStore);

const authStore = useAuthStore();

// Usar el composable para manejar visitas a películas
const { sendMovieVisit } = useMovieVisit();

// Estado para los datos completos de la película
const movieData = ref<Movie | null>(null);
const loading = ref(false);

// Estado para películas similares
const similarMovies = ref<Movie[]>([]);
const loadingSimilar = ref(false);

// Función para cargar películas similares
const loadSimilarMovies = async (movieId: number) => {
  loadingSimilar.value = true;
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.backendUrl;

    const response = await $fetch<Array<{ movie: Movie; score: number }>>(
      `${baseUrl}/api/v1/recommendations/similar/${movieId}`,
    );

    // Extraer solo las películas del array de respuesta
    similarMovies.value = response
      ? response.map((item) => ({ ...item.movie, score: item.score }))
      : [];
  } catch (error) {
    console.error("Error cargando películas similares:", error);
    similarMovies.value = [];
  } finally {
    loadingSimilar.value = false;
  }
};

// Función para cargar detalles completos de la película
const loadMovieDetails = async (movieId: number) => {
  loading.value = true;
  try {
    // Use GqlGetMovie directly with $fetch to get fresh data every time
    const data = await GqlGetMovie({ id: movieId });
    movieData.value = (data?.pelicula as Movie) || null;
  } catch (error) {
    console.error("Error loading movie data:", error);
    movieData.value = null;
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  modalStore.closeModal();
  movieData.value = null;
  similarMovies.value = [];
};

watch(selectedMovie, async (newMovie) => {
  if (newMovie && (newMovie as any).id) {
    const movieId = (newMovie as any).id;
    
    try {
      // Load fresh movie details
      await loadMovieDetails(movieId);

      // If load failed, use basic data as fallback
      if (!movieData.value) {
        movieData.value = newMovie as Movie;
      }

      // Enviar visita a película cuando se carga exitosamente
      if (movieData.value?.id) {
        await sendMovieVisit(movieData.value.id);
        // Cargar películas similares
        await loadSimilarMovies(movieData.value.id);
      }
    } catch (error) {
      console.error("Error loading movie data:", error);
      movieData.value = newMovie as Movie; // Fallback a los datos básicos

      // Enviar visita incluso con datos básicos si hay ID
      if (movieId) {
        await sendMovieVisit(movieId);
        // Cargar películas similares
        await loadSimilarMovies(movieId);
      }
    }
  }
});

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen.value) {
      closeModal();
    }
  };
  document.addEventListener("keydown", handleEscape);

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});

// Formatear géneros para mostrar
const formatGenres = (genres?: Genre[]) => {
  if (!genres || genres.length === 0) return "Sin géneros";
  return genres.map((g) => g.nombre).join(", ");
};

const formatYear = (fecha?: string) => {
  if (!fecha) return "";
  return new Date(fecha).getFullYear();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && movieData"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="relative mx-4 max-h-[90vh] w-full max-w-6xl overflow-hidden overflow-y-auto rounded-lg bg-neutral-500 shadow-2xl"
        >
          <button
            class="absolute top-4 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-black/70"
            @click="closeModal"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Contenido del modal con layout horizontal -->
          <div class="flex h-auto flex-row">
            <!-- Imagen del póster a la izquierda -->
            <div class="min-h-[400px] w-1/3 flex-shrink-0 bg-gray-800">
              <NuxtImg
                v-if="movieData?.posterUrl"
                :src="movieData.posterUrl"
                :alt="movieData.titulo"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-gray-400"
              >
                Sin imagen
              </div>
            </div>

            <!-- Información de la película a la derecha -->
            <div class="flex-1 space-y-4 p-6">
              <!-- Título y año -->
              <div class="text-left">
                <h2
                  class="font-oswald text-2xl font-bold tracking-wide text-neutral-900 uppercase"
                >
                  {{ movieData?.titulo }}
                </h2>
                <p
                  v-if="movieData?.fechaEstreno"
                  class="mt-1 text-sm font-medium text-gray-300"
                >
                  Dirigida por
                  {{ movieData?.director?.nombre || "Director desconocido" }} •
                  {{ formatYear(movieData?.fechaEstreno) }}
                </p>
              </div>

              <!-- Rating (estrellas) -->
              <div class="flex items-center justify-start">
                <div class="flex items-center">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="mr-1 text-xl"
                    :class="
                      star <= Math.floor(movieData?.ratingPelicula || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    "
                  >
                    ★
                  </span>
                </div>
              </div>

              <!-- Géneros -->
              <div class="text-left">
                <h3
                  class="mb-1 text-sm font-semibold tracking-wide text-neutral-900 uppercase"
                >
                  Géneros
                </h3>
                <p class="text-neutral-900">
                  {{ formatGenres(movieData?.generos) }}
                </p>
              </div>

              <!-- Sinopsis -->
              <div v-if="movieData?.sinopsis" class="text-left">
                <h3
                  class="mb-2 text-sm font-semibold tracking-wide text-neutral-900 uppercase"
                >
                  Sinopsis
                </h3>
                <p class="text-sm leading-relaxed text-neutral-900">
                  {{ movieData.sinopsis }}
                </p>
              </div>

              <!-- Plataformas disponibles -->
              <div
                v-if="
                  movieData?.plataformas && movieData.plataformas.length > 0
                "
                class="text-left"
              >
                <h3
                  class="mb-2 text-sm font-semibold tracking-wide text-neutral-900 uppercase"
                >
                  Disponible en
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="plataforma in movieData.plataformas"
                    :key="plataforma.id"
                    class="rounded-full bg-neutral-600 px-3 py-1 text-xs font-bold text-neutral-200"
                  >
                    {{ plataforma.nombre }}
                  </span>
                </div>
              </div>

              <!-- Películas Similares -->
              <div class="text-left">
                <h3
                  class="mb-3 text-sm font-semibold tracking-wide text-neutral-900 uppercase"
                >
                  Films Similares
                </h3>

                <!-- Loading state -->
                <div
                  v-if="loadingSimilar"
                  class="flex items-center justify-center py-8"
                >
                  <div class="text-sm text-gray-400">
                    Cargando películas similares...
                  </div>
                </div>

                <!-- Películas similares grid -->
                <div
                  v-else-if="similarMovies.length > 0"
                  class="grid grid-cols-5 gap-2"
                >
                  <div
                    v-for="movie in similarMovies"
                    :key="movie.id"
                    class="group cursor-pointer"
                    @click="modalStore.openModal(movie)"
                  >
                    <!-- Poster -->
                    <div
                      class="relative mb-2 aspect-[2/3] overflow-hidden rounded-lg bg-gray-700"
                    >
                      <NuxtImg
                        v-if="movie.posterUrl"
                        :src="movie.posterUrl"
                        :alt="movie.titulo"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center text-xs text-gray-500"
                      >
                        Sin imagen
                      </div>

                      <!-- Overlay con info al hover -->
                      <div
                        class="absolute inset-0 flex flex-col justify-end bg-black/70 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <div
                          class="text-md flex items-center font-bold text-gray-300"
                        >
                          <span
                            >{{
                              typeof movie.score === "number"
                                ? (movie.score * 100).toFixed(0)
                                : "N/A"
                            }}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Botón con nombre de película -->
                    <button
                      class="line-clamp-2 w-full cursor-pointer rounded bg-neutral-700 px-2 py-1 text-[10px] font-bold tracking-wide uppercase transition-colors duration-200 hover:bg-neutral-600"
                    >
                      {{ movie.titulo }}
                    </button>
                  </div>
                </div>

                <!-- Estado vacío -->
                <div v-else class="py-8 text-center text-sm text-gray-400">
                  No hay películas similares disponibles
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Estilos para el scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
