import { defineStore } from "pinia";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    filters: {
      genres: [],
      estreno: [],
      rating: null,
      duracion: null,
      plataforma: [],
    },
  }),
  actions: {
    setGenres(genres) {
      this.filters.genres = genres || [];
    },
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },
    clearFilters() {
      this.filters = {
        genres: [],
        estreno: [],
        rating: null,
        duracion: null,
        plataforma: [],
      };
    },
  },
  getters: {
    hasGenreFilters: (state) =>
      state.filters.genres && state.filters.genres.length > 0,
  },
});
