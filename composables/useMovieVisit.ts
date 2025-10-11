// composables/useMovieVisit.ts
export const useMovieVisit = () => {
  const authStore = useAuthStore();
  
  // Map para trackear visitas recientes y evitar duplicados
  const recentVisits = new Map<number, number>();
  const DEBOUNCE_TIME = 5000; // 5 segundos para evitar múltiples visitas

  const sendMovieVisit = async (movieId: number) => {
    // Verificar si el usuario está autenticado
    if (!authStore.userId) {
      console.log('Usuario no autenticado, no se enviará la visita');
      return;
    }

    // Verificar debounce - evitar múltiples visitas en corto período
    const now = Date.now();
    const lastVisit = recentVisits.get(movieId);
    
    if (lastVisit && (now - lastVisit) < DEBOUNCE_TIME) {
      console.log('Visita reciente detectada, omitiendo envío');
      return;
    }

    try {
      // Registrar la visita actual
      recentVisits.set(movieId, now);

      // Crear el cuerpo del evento según la especificación
      const currentDate = new Date();
      const eventBody = {
        id: `visit-${movieId}-${authStore.userId}-${now}`,
        type: "pelicula.visitada",
        source: "/discovery/api",
        datacontenttype: "application/json",
        sysDate: [
          currentDate.getFullYear(),
          currentDate.getMonth() + 1, // JavaScript months are 0-indexed
          currentDate.getDate(),
          currentDate.getHours(),
          currentDate.getMinutes()
        ],
        data: {
          evento: "pelicula_visitada",
          movie_id: movieId,
          user_id: authStore.userId
        },
        _origin: "core"
      };

      // Enviar al endpoint especificado
      const response = await $fetch('http://core-letterboxd.us-east-2.elasticbeanstalk.com/events/receive?routingKey=discovery.pelicula.visitada', {
        method: 'POST',
        body: eventBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Visita a película enviada exitosamente:', {
        movieId,
        userId: authStore.userId,
        response
      });

    } catch (error) {
      console.error('Error enviando visita a película:', error);
      // Remover de la cache en caso de error para permitir retry
      recentVisits.delete(movieId);
    }
  };

  return {
    sendMovieVisit
  };
};