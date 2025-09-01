<script setup lang="ts">
const user = false;

const links = [
  {
    text: "USUARIO",
    url: "/user",
  },
  {
    text: "FILMS",
    url: "/films",
  },
  {
    text: "¿QUÉ VEO HOY?",
    url: "/films",
  },
  {
    text: "TOPS",
    url: "/tops",
  },
  {
    text: "CRÍTICAS POPULARES",
    url: "/criticas",
  },
];

const linksUser = [
  {
    text: "FILMS",
    url: "/films",
  },
  {
    text: "TOPS",
    url: "/tops",
  },
  {
    text: "CRÍTICAS POPULARES",
    url: "/criticas",
  },
];
</script>

<template>
  <div
    class="bg-nav/90 border-nav sticky top-0 z-50 flex items-center justify-evenly border-b p-6 backdrop-blur-md"
  >
    <NuxtLink class="flex items-center gap-5 text-2xl font-bold" to="/">
      <NuxtImg src="/images/logo.png" alt="logo" width="54" height="37" />
      cineTrack</NuxtLink
    >

    <div class="flex items-center gap-8">
      <UButton v-if="!user" class="bg-red hover:bg-red/80 font-bold text-white"
        >INICIAR SESIÓN</UButton
      >
      <NuxtLink
        v-for="link in user ? links : linksUser"
        :key="link.url"
        class="font-montserrat text-dimtext text-base font-bold transition hover:opacity-80"
        :to="link.url"
      >
        {{ link.text }}
      </NuxtLink>
      <UButton
        class="bg-red hover:bg-red/80 cursor-pointer rounded-full p-2 transition"
      >
        <UIcon name="i-lucide-gamepad-2" class="size-7 text-white" />
      </UButton>
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
