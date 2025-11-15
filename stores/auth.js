import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: null,
    token: null,
    name: null,
  }),
  actions: {
    async login(formData) {
      const config = useRuntimeConfig();
      const baseUrl = config.public.usersUrl;

      const response = await $fetch(
        `https://usuariosbe.cine-track.com.ar/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        },
      );

      this.token = response.access_token;

      const payload = JSON.parse(atob(response.access_token.split(".")[1]));
      this.userId = payload.user_id || payload.sub;

      // Persist to localStorage
      if (import.meta.client) {
        localStorage.setItem("auth_token", this.token);
        localStorage.setItem("auth_userId", this.userId);
        if (this.name) {
          localStorage.setItem("auth_name", this.name);
        }
      }

      console.log("Token guardado:", this.token);
      console.log("User ID guardado:", this.userId);
      await navigateTo("/");
    },

    setName(name) {
      this.name = name;
      // Persist name to localStorage
      if (import.meta.client && name) {
        localStorage.setItem("auth_name", name);
      }
    },

    logout() {
      this.userId = null;
      this.token = null;
      this.name = null;

      // Clear localStorage
      if (import.meta.client) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_userId");
        localStorage.removeItem("auth_name");
      }
    },

    // Initialize auth from localStorage
    initAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem("auth_token");
        const userId = localStorage.getItem("auth_userId");
        const name = localStorage.getItem("auth_name");

        if (token && userId) {
          this.token = token;
          this.userId = userId;
          this.name = name;
          console.log("Session restored from localStorage");
        }
      }
    },
  },
});
