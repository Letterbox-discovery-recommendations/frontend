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
        <h1 class="mb-1 text-3xl font-bold text-white">Crear cuenta</h1>
        <p class="text-center text-base text-gray-300">
          Registrate gratis para descubrir y guardar tus películas favoritas.
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
            placeholder="Crea una contraseña"
            type="password"
            size="lg"
          />
        </UFormField>
        <UFormField label="Confirmar contraseña">
          <UInput
            class="w-full"
            v-model="confirmPassword"
            placeholder="Confirmar contraseña"
            type="password"
            size="lg"
          />
        </UFormField>
        <UButton
          label="Registrarme"
          size="lg"
          class="bg-red mt-2 flex items-center justify-center text-center font-bold text-white"
          @click="handleRegister"
        />
      </div>
      <div class="mt-2 flex flex-col items-center gap-1">
        <span class="text-sm text-gray-400">¿Ya tenés cuenta?</span>
        <NuxtLink to="/login" class="text-sm text-red-400 hover:underline"
          >Iniciá sesión</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

function handleRegister() {
  // Implement registration logic here
  console.log(
    "Email:",
    email.value,
    "Password:",
    password.value,
    "Confirm:",
    confirmPassword.value,
  );
}
</script>
