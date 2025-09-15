<script setup lang="ts">
const searchStore = useSearchStore();
const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const handleLogin = () => {
  const userId = prompt(
    "Ingrese su ID de usuario para simular el inicio de sesión:",
  );
  authStore.login(userId);
};

const searchInput = ref(searchStore.search || "");

// Sync input with store changes
watch(
  () => searchStore.search,
  (newSearch) => {
    searchInput.value = newSearch || "";
  },
);

// Handle search submission
const handleSearch = async () => {
  if (searchInput.value.trim()) {
    // Update search store
    searchStore.setSearch(searchInput.value.trim());

    // If ON films page, keep existing filters (like APLICAR button)
    if (route.path === "/films") {
      // Just update search, keep current filters - reactive query will handle it
      // This mimics the APLICAR button behavior
    } else {
      // If NOT on films page, store is already updated with current selections
      // Clear filters and navigate (search by name only)
      const filterStore = useFilterStore();
      filterStore.clearFilters();

      await router.push({
        path: "/films",
        query: { search: searchInput.value.trim() },
      });
    }
  } else {
    // If search is empty
    if (route.path === "/films") {
      // Clear search but keep filters (like APLICAR with no search)
      searchStore.clearSearch();
    } else {
      // Not on films page with empty search - navigate to films
      await router.push("/films");
    }
  }
};

const links = [
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
      <UButton
        v-if="!authStore.userId"
        class="bg-red hover:bg-red/80 font-bold text-white"
        @click="handleLogin"
        >INICIAR SESIÓN</UButton
      >
      <UTooltip
        v-for="link in authStore.userId ? links : linksUser"
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
        v-model="searchInput"
        size="lg"
        trailing-icon="i-lucide-search"
        color="info"
        variant="subtle"
        placeholder="Busca una película..."
        @keyup.enter="handleSearch"
      />
      <UButton
        v-if="authStore.userId"
        class="bg-teal hover:bg-teal/80 font-bold text-black"
        icon="i-lucide-log-out"
        @click="authStore.logout()"
      />
    </div>
  </div>
</template>
