import { defineStore } from "pinia";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    filters: {},
  }),
  actions: {
    setFilters(newFilters) {
      this.filters = newFilters.flat();
    },
    clearFilters() {
      this.filters = {};
    },
  },
});
