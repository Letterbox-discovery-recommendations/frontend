<script setup lang="ts">
const user = false;

const links = [
  {
    text: "USUARIO",
    url: "/user",
    tooltip: "Ir a mi perfil",
  },
  {
    text: "FILMS",
    url: "/films",
    tooltip: "Ver y filtrar películas",
  },
  {
    text: "¿QUÉ VEO HOY?",
    url: "/films",
    tooltip: "Descubrí qué ver hoy",
  },
  {
    text: "TOPS",
    url: "/tops",
    tooltip: "Ver las películas más populares",
  },
  {
    text: "CRÍTICAS POPULARES",
    url: "/criticas",
    tooltip: "Ver las críticas más populares",
  },
];

const linksUser = [
  {
    text: "FILMS",
    url: "/films",
    tooltip: "Ver y filtrar películas",
  },
  {
    text: "TOPS",
    url: "/tops",
    tooltip: "Ver las películas más populares",
  },
  {
    text: "CRÍTICAS POPULARES",
    url: "/criticas",
    tooltip: "Ver las críticas más populares",
  },
];
</script>

<template>
  <div
    class="bg-nav/90 border-nav sticky top-0 z-50 flex items-center justify-evenly border-b p-6 backdrop-blur-md"
  >
    <NuxtLink class="flex items-center gap-5 text-2xl font-bold" to="/">
      <NuxtImg src="/images/logo.png" alt="logo" width="54" height="37" />

      <span class="text-white">cineTrack</span>
    </NuxtLink>

    <div class="flex items-center gap-8">
      <UButton v-if="!user" class="bg-red hover:bg-red/80 font-bold text-white"
        >INICIAR SESIÓN</UButton
      >
      <UTooltip
        v-for="link in user ? links : linksUser"
        :key="link.url"
        :text="link.tooltip"
      >
        <NuxtLink
          class="text-dimtext text-base font-bold transition hover:opacity-80"
          :to="link.url"
        >
          {{ link.text }}
        </NuxtLink>
      </UTooltip>
      <UTooltip text="Juego">
        <UButton
          class="bg-red hover:bg-red/80 cursor-pointer rounded-full p-2 transition"
        >
          <UIcon name="i-lucide-gamepad-2" class="size-7 text-white" />
        </UButton>
      </UTooltip>
      <UInput
        size="lg"
        trailing-icon="i-lucide-search"
        color="info"
        variant="subtle"
        placeholder="Busca una película..."
      />
      <UButton
        v-if="user"
        class="bg-teal hover:bg-teal/80 font-bold text-black"
        icon="i-lucide-log-out"
      />
    </div>
  </div>
</template>
