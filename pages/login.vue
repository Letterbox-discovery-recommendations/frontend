<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");

function handleLogin() {
  // Implement login logic here
  console.log("Email:", email.value, "Password:", password.value);
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"
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
        <UFormField label="Email">
          <UInput
            class="w-full"
            v-model="email"
            placeholder="Ingresa tu email"
            size="lg"
          />
        </UFormField>
        <UFormField label="Contraseña">
          <UInput
            class="w-full"
            v-model="password"
            placeholder="Ingresa tu contraseña"
            type="password"
            size="lg"
          />
        </UFormField>
        <UButton
          label="Iniciar sesión"
          size="lg"
          class="bg-red mt-2 text-center font-bold text-white flex items-center justify-center"
          @click="handleLogin"
        />
      </div>
      <div class="mt-2 flex flex-col items-center gap-1">
        <span class="text-sm text-gray-400">¿No tenés cuenta?</span>
        <NuxtLink to="/register" class="text-sm text-red-400 hover:underline"
          >Registrate gratis</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
