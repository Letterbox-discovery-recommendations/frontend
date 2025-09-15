import { defineStore } from "pinia";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    filters: {
      genres: [],
      sort: null,
      estreno: null,
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
        estreno: null,
        duracion: null,
        sort: null,
        plataforma: [],
      };
    },
  },
  getters: {
    hasGenreFilters: (state) =>
      state.filters.genres && state.filters.genres.length > 0,
    hasDurationFilter: (state) => state.filters.duracion !== null,
    hasAnyFilters: (state) => {
      return (
        (state.filters.genres && state.filters.genres.length > 0) ||
        state.filters.sort !== null ||
        state.filters.duracion !== null
      );
    },
  },
});
