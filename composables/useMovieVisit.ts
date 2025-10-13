// composables/useMovieVisit.ts
export const useMovieVisit = () => {
  const authStore = useAuthStore();

  // Map para trackear visitas recientes y evitar duplicados
  const recentVisits = new Map<number, number>();
  const DEBOUNCE_TIME = 5000; // 5 segundos para evitar múltiples visitas

  const sendMovieVisit = async (movieId: number) => {
    // Verificar si el usuario está autenticado y tiene token
    if (!authStore.userId || !authStore.token) {
      console.log(
        "Usuario no autenticado o sin token, no se enviará la visita",
      );
      return;
    }

    // Verificar debounce - evitar múltiples visitas en corto período
    const now = Date.now();
    const lastVisit = recentVisits.get(movieId);

    if (lastVisit && now - lastVisit < DEBOUNCE_TIME) {
      console.log("Visita reciente detectada, omitiendo envío");
      return;
    }

    try {
      // Registrar la visita actual
      recentVisits.set(movieId, now);

      // Crear el cuerpo del request según el nuevo formato
      const requestBody = {
        movie_id: movieId,
      };

      // Enviar al nuevo endpoint con Bearer token
      const response = await $fetch(
        "http://localhost:8000/api/v1/visits/visit",
        {
          method: "POST",
          body: requestBody,
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Visita a película enviada exitosamente:", {
        movieId,
        userId: authStore.userId,
        response,
      });
    } catch (error) {
      console.error("Error enviando visita a película:", error);
      // Remover de la cache en caso de error para permitir retry
      recentVisits.delete(movieId);
    }
  };

  return {
    sendMovieVisit,
  };
};
