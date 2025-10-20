import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: null,
    token: null,
  }),
  actions: {
    async login(formData) {
      const response = await $fetch(
        "http://users-prod-alb-1703954385.us-east-1.elb.amazonaws.com/api/v1/auth/login",
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

      console.log("Token guardado:", this.token);
      console.log("User ID guardado:", this.userId);
    },

    async register(body) {
      const response = await $fetch(
        "http://users-prod-alb-1703954385.us-east-1.elb.amazonaws.com/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        },
      );

      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", response.username);
      formData.append("password", response.password);
      formData.append("scope", "");

      this.login();
    },

    logout() {
      this.userId = null;
      this.token = null;
    },
  },
});
