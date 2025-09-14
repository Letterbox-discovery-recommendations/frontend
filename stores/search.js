import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    search: null,
  }),
  actions: {
    setSearch(search) {
      this.search = search;
    },
    clearSearch() {
      this.search = null;
    },
  },
});
