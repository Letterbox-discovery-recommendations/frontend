<script lang="ts" setup>
interface MovieProps {
  title: string;
  imgSrc?: string;
}

const props = defineProps<MovieProps>();
</script>

<template>
  <div
    class="0 mx-4 flex flex-col rounded-md border border-gray-400/10 bg-[#445566] shadow-lg backdrop-blur-md"
  >
    <div>
      <NuxtImg class="img" width="180" height="260" src="/images/cat.jpg" />
    </div>
    <div class="flex items-center rounded-b-md bg-[#445566] p-2">
      <h1 class="font-oswald text-base font-bold text-[#AABBCC]">
        {{ props.title.toUpperCase() }}
      </h1>
    </div>
  </div>
</template>

<style>
.img {
  border-top-left-radius: 0.34rem;
  border-top-right-radius: 0.34rem;
  border-left-color: var(--color-gray-400);
  border-right-color: var(--color-gray-400);
}
</style>
