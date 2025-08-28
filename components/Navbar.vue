<script setup lang="ts">
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
];
</script>

<template>
  <div class="bg-nav flex justify-around items-center p-6">
    <NuxtLink class="font-bold text-2xl" to="/">cineTrack</NuxtLink>

    <div
      class="font-bold font-montserrat text-base text-dimtext flex items-center gap-8"
    >
      <NuxtLink v-for="link in links" :key="link.url" :to="link.url">{{
        link.text
      }}</NuxtLink
      >=
      <UButton class="bg-red rounded-full p-2">
        <UIcon name="i-lucide-gamepad-2" class="text-white size-7" />
      </UButton>
      <UInput
        trailing-icon="i-lucide-search"
        color="neutral"
        variant="soft"
        placeholder="Busca una película..."
      />
    </div>
  </div>
</template>