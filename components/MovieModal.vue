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
}

const modalStore = useModalStore();
const { isOpen, selectedMovie } = storeToRefs(modalStore);

// Estado para los datos completos de la película
const movieData = ref<Movie | null>(null);
const loading = ref(false);

const closeModal = () => {
  modalStore.closeModal();
  movieData.value = null;
};

watch(selectedMovie, async (newMovie) => {
  if (newMovie && (newMovie as any).id) {
    loading.value = true;
    try {
      const { data } = await useAsyncGql({
        operation: "GetMovie",
        variables: {
          id: (newMovie as any).id,
        },
      });
      movieData.value = (data.value?.pelicula as Movie) || null;
    } catch (error) {
      console.error("Error loading movie data:", error);
      movieData.value = newMovie as Movie; // Fallback a los datos básicos
    } finally {
      loading.value = false;
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
          class="relative mx-4 w-full max-w-4xl overflow-hidden rounded-lg border border-gray-600/30 bg-[#334455] shadow-2xl"
        >
          <button
            class="absolute top-4 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
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
                  class="font-oswald text-2xl font-bold tracking-wide text-white uppercase"
                >
                  {{ movieData?.titulo }}
                </h2>
                <p
                  v-if="movieData?.fechaEstreno"
                  class="mt-1 text-sm text-gray-400"
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
                  class="mb-1 text-sm font-semibold tracking-wide text-gray-300 uppercase"
                >
                  Géneros
                </h3>
                <p class="text-white">
                  {{ formatGenres(movieData?.generos) }}
                </p>
              </div>

              <!-- Sinopsis -->
              <div v-if="movieData?.sinopsis" class="text-left">
                <h3
                  class="mb-2 text-sm font-semibold tracking-wide text-gray-300 uppercase"
                >
                  Sinopsis
                </h3>
                <p class="text-sm leading-relaxed text-gray-200">
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
                  class="mb-2 text-sm font-semibold tracking-wide text-gray-300 uppercase"
                >
                  Disponible en
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="plataforma in movieData.plataformas"
                    :key="plataforma.id"
                    class="rounded-full bg-gray-700 px-3 py-1 text-xs text-white"
                  >
                    {{ plataforma.nombre }}
                  </span>
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
</style>
