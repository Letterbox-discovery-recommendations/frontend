import { defineStore } from "pinia";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    filters: {},
  }),
  actions: {
    setFilters(newFilters: Record<string, any>) {
      this.filters = newFilters;
    },
    clearFilters() {
      this.filters = {};
    },
    removeFilterItem(key: string) {
      if (this.filters.hasOwnProperty(key)) {
        delete this.filters[key];
      }
    },
  },
});
