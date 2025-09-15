import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: null,
  }),
  actions: {
    login(userId) {
      this.userId = userId;
    },
    logout() {
      this.userId = null;
    },
  },
});
