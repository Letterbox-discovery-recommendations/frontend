<script setup>
useSeoMeta({
  title: "cineTrack - Iniciar Sesión",
  description:
    "Inicia sesión en tu cuenta para acceder a recomendaciones personalizadas.",
});

const username = ref("");
const password = ref("");

async function handleLogin() {
  if (!username.value || !password.value) {
    console.error("Por favor completa todos los campos");
    return;
  }

  console.log("Sending login data:", {
    username: username.value,
    password: password.value,
  });

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("scope", "");

    console.log("Form data:", formData.toString());

    const auth = useAuthStore();
    await auth.login(formData);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
  }
}
</script>

<template>
  <form
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-4 py-8"
    @submit.prevent="handleLogin"
  >
    <div
      class="flex w-full max-w-md flex-col gap-8 rounded-xl border border-white/10 bg-white/10 p-8 shadow-xl backdrop-blur-md"
    >
      <div class="flex flex-col items-center gap-2">
        <NuxtImg
          src="/images/logo.png"
          alt="logo"
          width="64"
          height="44"
          class="mb-2"
        />
        <h1 class="mb-1 text-3xl font-bold text-white">Iniciá sesión</h1>
        <p class="text-center text-base text-gray-300">
          Accedé a tus recomendaciones personalizadas y descubrí nuevas
          películas.
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <UFormField description="Ingresa tu nombre de usuario.">
          <UInput
            v-model="username"
            placeholder="Ingresa tu nombre de usuario"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField description="Ingresa tu contraseña.">
          <UInput
            v-model="password"
            placeholder="Ingresa tu contraseña"
            type="password"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UButton
          label="Iniciar sesión"
          size="lg"
          class="bg-red mt-2 flex items-center justify-center text-center font-bold text-white"
          type="submit"
        />
      </div>
      <div class="mt-2 flex flex-col items-center gap-1">
        <span class="text-sm text-gray-400">¿No tenés cuenta?</span>
        <a
          href="https://usuarios.cine-track.com.ar"
          target="_blank"
          class="text-sm text-red-400 hover:underline"
          >Registrate gratis</a
        >
      </div>
    </div>
  </form>
</template>
