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
    hasRatingFilter: (state) => state.filters.rating !== null,
    hasDurationFilter: (state) => state.filters.duracion !== null,
    hasAnyFilters: (state) => {
      return (
        (state.filters.genres && state.filters.genres.length > 0) ||
        state.filters.rating !== null ||
        state.filters.duracion !== null
      );
    },
  },
});
