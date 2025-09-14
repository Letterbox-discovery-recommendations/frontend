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
</script>

<template>
  <div
    class="flex h-[225px] w-[180px] flex-col justify-center rounded-md border border-gray-400/10 bg-[#445566] shadow-lg backdrop-blur-md"
  >
    <div class="w-full flex-1 overflow-hidden">
      <NuxtImg
        class="img h-full w-full object-cover"
        :src="props.posterUrl"
        :alt="props.titulo"
      />
    </div>
    <div class="flex h-auto items-center rounded-b-md bg-[#445566] p-2">
      <h1 class="font-oswald truncate text-sm font-bold text-[#AABBCC]">
        {{ props.titulo.toUpperCase() }}
      </h1>
    </div>
  </div>
</template>

<style scoped>
.img {
  border-top-left-radius: 0.34rem;
  border-top-right-radius: 0.34rem;
  border-left-color: var(--color-gray-400);
  border-right-color: var(--color-gray-400);
}
</style>
