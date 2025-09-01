<script lang="ts" setup>
const links = [
  { text: "Sobre nosotros", url: "/about" },
  { text: "Términos y condiciones", url: "/terms" },
  { text: "Ayuda", url: "/help" },
];
</script>

<template>
  <div class="bg-footer flex w-full flex-col items-center gap-3 p-14">
    <div class="flex w-full justify-start gap-6">
      <NuxtLink
        v-for="link in links"
        :key="link.url"
        class="text-base font-bold text-[#99AABB] transition hover:opacity-80"
        :to="link.url"
        >{{ link.text }}</NuxtLink
      >
    </div>
    <p class="w-full justify-start text-sm text-[#9CB4CC]">
      © cineTrack - Todos los derechos reservados.
    </p>
  </div>
</template>
