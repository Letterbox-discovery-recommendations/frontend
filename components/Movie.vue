<script lang="ts" setup>
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

interface MovieProps {
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
}

const props = defineProps<MovieProps>();

const modalStore = useModalStore();

const openMovieModal = () => {
  modalStore.openModal(props);
};
</script>

<template>
  <div
    class="group relative cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105"
    @click="openMovieModal"
  >
    <!-- Movie Poster -->
    <div class="relative">
      <NuxtImg
        v-if="props.posterUrl"
        :src="props.posterUrl"
        :alt="props.titulo"
        class="h-auto w-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-96 w-full items-center justify-center bg-gray-800"
      >
        <UIcon name="i-lucide-image-off" class="text-4xl text-gray-600" />
      </div>

      <!-- Hover Overlay -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <UIcon name="i-lucide-search" class="text-5xl text-white" />
      </div>
    </div>

    <!-- Movie Title - Bottom Section -->
    <div class="flex h-16 items-center bg-gray-700/80 px-3 py-2">
      <h3
        class="font-oswald line-clamp-2 text-sm font-semibold text-white"
        :title="props.titulo"
      >
        {{ props.titulo.toUpperCase() }}
      </h3>
    </div>
  </div>
</template>
