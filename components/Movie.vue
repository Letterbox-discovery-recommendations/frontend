<script lang="ts" setup>
interface MovieProps {
  title: string;
  src?: string;
  views?: number;
  likes?: number;
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
        :src="props.src"
        :alt="props.title"
      />
    </div>
    <div class="flex h-auto items-center rounded-b-md bg-[#445566] p-2">
      <h1 class="font-oswald truncate text-sm font-bold text-[#AABBCC]">
        {{ props.title.toUpperCase() }}
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
