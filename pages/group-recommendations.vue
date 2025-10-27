<script setup lang="ts">
const friendsStore = useFriendsStore();
const modalStore = useModalStore();
const router = useRouter();

// Redirect if no recommendations
onMounted(() => {
  if (friendsStore.groupRecommendations.length === 0) {
    router.push("/");
  }
});

// Clear recommendations when leaving the page
onUnmounted(() => {
  // Optional: uncomment if you want to clear on page leave
  // friendsStore.clearGroupRecommendations();
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="mb-4 text-4xl font-bold text-white">
          Recomendaciones Grupales
        </h1>

        <!-- Selected Friends -->
        <div v-if="friendsStore.selectedFriends.length > 0" class="mb-6">
          <h2 class="mb-3 text-lg font-semibold text-gray-300">Viendo con:</h2>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="friend in friendsStore.selectedFriends"
              :key="friend.id"
              class="bg-teal/20 flex items-center gap-2 rounded-full px-4 py-2"
            >
              <UIcon name="i-lucide-user" class="text-teal" />
              <span class="text-sm font-medium text-white">{{
                friend.name
              }}</span>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <p class="text-dimtext">
          {{ friendsStore.groupRecommendations.length }} películas recomendadas
        </p>
      </div>

      <!-- Movies Grid -->
      <div
        v-if="friendsStore.groupRecommendations.length > 0"
        class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        <div
          v-for="recommendation in friendsStore.groupRecommendations"
          :key="recommendation.movie.id"
          class="group relative cursor-pointer transition-transform hover:scale-105"
          @click="modalStore.openModal(recommendation.movie)"
        >
          <!-- Movie Poster -->
          <div class="relative overflow-hidden rounded-lg">
            <NuxtImg
              v-if="recommendation.movie.posterUrl"
              :src="recommendation.movie.posterUrl"
              :alt="recommendation.movie.titulo"
              class="h-auto w-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-96 w-full items-center justify-center bg-gray-800"
            >
              <UIcon name="i-lucide-image-off" class="text-4xl text-gray-600" />
            </div>

            <!-- Score Badge -->
            <div
              class="bg-teal absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-bold text-black"
            >
              {{ Math.round(recommendation.score * 100) }}%
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <UIcon name="i-lucide-play-circle" class="text-5xl text-white" />
            </div>
          </div>

          <!-- Movie Title -->
          <h3
            class="mt-2 line-clamp-2 text-sm font-semibold text-white"
            :title="recommendation.movie.titulo"
          >
            {{ recommendation.movie.titulo }}
          </h3>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-dimtext flex flex-col items-center justify-center py-20"
      >
        <UIcon name="i-lucide-users" class="mb-4 text-6xl" />
        <p class="text-xl">No hay recomendaciones disponibles</p>
        <UButton
          class="bg-red hover:bg-red/80 mt-4 font-bold text-white"
          @click="router.push('/')"
        >
          Volver al inicio
        </UButton>
      </div>

      <!-- Back Button -->
      <div class="mt-12 flex justify-center">
        <UButton
          icon="i-lucide-arrow-left"
          class="bg-teal hover:bg-teal/80 font-bold text-black"
          @click="router.push('/')"
        >
          Volver al inicio
        </UButton>
      </div>
    </div>
  </div>
</template>
