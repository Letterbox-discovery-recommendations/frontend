<script setup lang="ts">
interface Friend {
  id: string;
  name: string;
  country: string;
  registration_date: string;
  profile_picture_url?: string;
}

interface Movie {
  id: number;
  titulo: string;
  posterUrl?: string;
  sinopsis?: string;
  duracionMinutos?: number;
  fechaEstreno?: string;
}

interface GroupRecommendation {
  movie: Movie;
  score: number;
}

// Friends modal state
const isFriendsModalOpen = ref(false);
const friendsSearchInput = ref("");
const selectedFriends = ref<string[]>([]);
const isGenerating = ref(false);
const amigos = ref<Friend[]>([]);
const isLoadingFriends = ref(false);

// Fetch friends from API
const fetchFriends = async () => {
  try {
    isLoadingFriends.value = true;
    const config = useRuntimeConfig();
    const baseUrl = config.public.backendUrl;

    const response = await $fetch<Friend[]>(
      `${baseUrl}/api/v1/recommendations/friends`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    amigos.value = response;
  } catch (error) {
    console.error("Error fetching friends:", error);
  } finally {
    isLoadingFriends.value = false;
  }
};

// Computed filtered friends list
const filteredFriends = computed(() => {
  if (!friendsSearchInput.value.trim()) {
    return amigos.value;
  }
  const searchTerm = friendsSearchInput.value.toLowerCase();
  return amigos.value.filter((amigo) =>
    amigo.name.toLowerCase().includes(searchTerm),
  );
});

// Toggle friend selection
const toggleFriendSelection = (friendId: string) => {
  const index = selectedFriends.value.indexOf(friendId);
  if (index > -1) {
    selectedFriends.value.splice(index, 1);
  } else {
    selectedFriends.value.push(friendId);
  }
};

// Check if friend is selected
const isFriendSelected = (friendId: string) => {
  return selectedFriends.value.includes(friendId);
};

// Generate collaborative recommendations
const generateGroupRecommendations = async () => {
  if (selectedFriends.value.length === 0) {
    console.log("No se seleccionaron amigos");
    return;
  }

  try {
    isGenerating.value = true;
    const config = useRuntimeConfig();
    const baseUrl = config.public.backendUrl;

    // Include the authenticated user ID along with selected friends
    const userIds = [
      parseInt(authStore.userId), // Current authenticated user
      ...selectedFriends.value.map((id) => parseInt(id)), // Selected friends
    ];

    // Call API with POST request
    const response = await $fetch<GroupRecommendation[]>(
      `${baseUrl}/api/v1/recommendations/group`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          user_ids: userIds,
        },
      },
    );

    console.log("Recomendaciones grupales:", response);

    // Store the recommendations and selected friends in the friends store
    const friendsStore = useFriendsStore();
    const selectedFriendsList = amigos.value.filter((friend) =>
      selectedFriends.value.includes(friend.id),
    );

    friendsStore.setSelectedFriends(selectedFriendsList);
    friendsStore.setGroupRecommendations(response);

    // Close the modal
    isFriendsModalOpen.value = false;

    // Navigate to the group recommendations page
    await router.push("/group-recommendations");
  } catch (error) {
    console.error("Error generando recomendaciones:", error);
  } finally {
    isGenerating.value = false;
  }
};

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

interface Movie {
  id: number;
  titulo: string;
  posterUrl?: string;
}

interface RecommendationItem {
  movie: Movie;
  score: number;
}

const movieProps = defineProps<MovieProps>();
const modalStore = useModalStore();
const { isOpen, selectedMovie } = storeToRefs(modalStore);

const searchStore = useSearchStore();
const router = useRouter();
const route = useRoute();
const juego = false;

const authStore = useAuthStore();

const handleLogin = () => {
  router.push("/login");
};

const searchInput = ref(searchStore.search || "");

// Sync input with store changes
watch(
  () => searchStore.search,
  (newSearch) => {
    searchInput.value = newSearch || "";
  },
);

// Watch searchInput and update search automatically
watch(searchInput, async (newValue) => {
  if (newValue.trim()) {
    // Update search store
    searchStore.setSearch(newValue.trim());

    // If ON films page, keep existing filters
    if (route.path === "/films") {
      // Just update search, keep current filters - reactive query will handle it
    } else {
      // If NOT on films page, clear filters and navigate
      const filterStore = useFilterStore();
      filterStore.clearFilters();

      await router.push({
        path: "/films",
        query: { search: newValue.trim() },
      });
    }
  } else {
    // If search is empty
    if (route.path === "/films") {
      // Clear search but keep filters
      searchStore.clearSearch();
    } else {
      // Not on films page with empty search - navigate to films
      await router.push("/films");
    }
  }
});

const handleQueVeoHoy = async () => {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.backendUrl;

    // Fetch collaborative recommendations
    const recommendations = await $fetch<(Movie | RecommendationItem)[]>(
      `${baseUrl}/api/v1/recommendations/collaborative`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    if (recommendations && recommendations.length > 0) {
      // Get a random recommendation instead of the first one
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      const randomRecommendation = recommendations[randomIndex];

      if (randomRecommendation) {
        // Extract movie data (handle both Movie and RecommendationItem structures)
        const movieData =
          "movie" in randomRecommendation
            ? randomRecommendation.movie
            : randomRecommendation;

        // Open modal with the movie
        modalStore.openModal(movieData);
      }
    } else {
      // Handle case where no recommendations are available
      console.log("No hay recomendaciones disponibles");
      // You could show a toast notification here
    }
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    // You could show an error toast here
  }
};

const dropdownItems = computed(() => [
  {
    label: authStore.name ?? "",
    icon: "i-lucide-user",
  },
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    onSelect: () => {
      authStore.logout();
      navigateTo("/");
    },
  },
]);

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
    class="bg-nav/90 border-nav sticky top-0 z-50 flex items-center justify-evenly gap-0 border-b p-6 backdrop-blur-md md:gap-2"
  >
    <NuxtLink class="flex items-center gap-5 text-2xl font-bold" to="/">
      <NuxtImg
        src="/images/logo.png"
        alt="logo"
        width="54"
        height="37"
        class="h-[29px] w-[42px] md:h-[37px] md:w-[54px]"
      />
      <p class="hidden text-white/80 md:block md:text-xl">cineTrack</p>
    </NuxtLink>

    <div class="flex items-center gap-8">
      <UButton
        v-if="!authStore.userId"
        class="bg-red hover:bg-red/80 cursor-pointer text-sm font-bold text-white md:text-base"
        @click="handleLogin"
        >INICIAR SESIÓN</UButton
      >
      <UTooltip
        v-for="link in authStore.userId ? links : linksUser"
        :key="link.url"
        :text="link.tooltip"
      >
        <NuxtLink
          class="text-dimtext text-sm font-bold transition hover:opacity-80 md:text-base"
          :to="link.url"
        >
          {{ link.text }}
        </NuxtLink>
      </UTooltip>

      <UButton
        v-if="authStore.userId"
        icon="i-lucide-eye"
        class="bg-red cursor-pointer text-sm whitespace-nowrap text-white md:text-base"
        @click="handleQueVeoHoy"
      >
        <p class="hidden md:block">¿QUÉ VEO HOY?</p>
      </UButton>

      <!-- Friends button trigger -->
      <UButton
        v-if="authStore.userId"
        icon="i-lucide-users"
        class="bg-teal hover:bg-teal/80 active:bg-teal/70 cursor-pointer text-sm whitespace-nowrap transition md:text-base"
        @click="
          isFriendsModalOpen = true;
          fetchFriends();
        "
      >
        <p class="hidden md:block">VER CON AMIGOS</p>
      </UButton>

      <!-- Friends Modal -->
      <UModal
        v-model:open="isFriendsModalOpen"
        title="ELEGÍ TU GRUPO DE AMIGOS"
      >
        <template #body>
          <div class="flex flex-col gap-4">
            <!-- Search bar -->
            <UFormField label="Buscar amigos">
              <UInput
                v-model="friendsSearchInput"
                placeholder="Para buscar amigos, ingresa su nombre de usuario."
                class="w-full"
                color="neutral"
                variant="soft"
                icon="i-lucide-search"
                :disabled="isLoadingFriends"
              />
            </UFormField>

            <!-- Loading state -->
            <div
              v-if="isLoadingFriends"
              class="text-dimtext flex items-center justify-center gap-2 py-8"
            >
              <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
              <span>Cargando amigos...</span>
            </div>

            <!-- Friends list -->
            <div v-else class="flex max-h-96 flex-col gap-2 overflow-y-auto">
              <div
                v-for="user in filteredFriends"
                :key="user.id"
                class="flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                :class="{
                  'border-cyan-500': isFriendSelected(user.id),
                  'border-gray-200 dark:border-gray-700': !isFriendSelected(
                    user.id,
                  ),
                }"
                @click="toggleFriendSelection(user.id)"
              >
                <span class="flex items-center gap-2">
                  <UIcon name="i-lucide-user" class="text-lg" />
                  <span class="font-medium">{{ user.name }}</span>
                </span>
                <UIcon
                  :name="
                    isFriendSelected(user.id)
                      ? 'i-lucide-check'
                      : 'i-lucide-plus'
                  "
                  class="text-lg"
                  :class="{
                    'text-cyan-500': isFriendSelected(user.id),
                  }"
                />
              </div>

              <!-- Empty state -->
              <div
                v-if="filteredFriends.length === 0"
                class="text-dimtext py-8 text-center"
              >
                No se encontraron amigos
              </div>
            </div>

            <!-- Generate button -->
            <UButton
              class="bg-red hover:bg-red/80 mt-2 w-full cursor-pointer text-sm font-bold text-white md:text-base"
              :disabled="
                selectedFriends.length === 0 || isGenerating || isLoadingFriends
              "
              :loading="isGenerating"
              @click="generateGroupRecommendations"
            >
              GENERAR RECOMENDACIONES
              <template v-if="selectedFriends.length > 0">
                ({{ selectedFriends.length }})
              </template>
            </UButton>
          </div>
        </template>
      </UModal>

      <UInput
        v-model="searchInput"
        size="lg"
        trailing-icon="i-lucide-search"
        color="info"
        variant="subtle"
        placeholder="Busca una película..."
        class="hidden lg:block"
      />

      <UDropdownMenu v-if="authStore.userId" :items="dropdownItems">
        <UAvatar
          :alt="authStore.name ?? undefined"
          :chip="{
            inset: true,
            color: 'success',
          }"
          class="cursor-pointer"
          size="2xl"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
