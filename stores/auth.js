import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: null,
    token: null,
  }),
  actions: {
    async login(formData) {
      const config = useRuntimeConfig();
      const baseUrl = config.public.usersUrl;

      const response = await $fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      this.token = response.access_token;

      const payload = JSON.parse(atob(response.access_token.split(".")[1]));
      this.userId = payload.user_id || payload.sub;

      console.log("Token guardado:", this.token);
      console.log("User ID guardado:", this.userId);
      await navigateTo("/");
    },

    logout() {
      this.userId = null;
      this.token = null;
    },
  },
});
