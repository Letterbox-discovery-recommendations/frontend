export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Initialize auth from localStorage when the app starts
  authStore.initAuth();
});
