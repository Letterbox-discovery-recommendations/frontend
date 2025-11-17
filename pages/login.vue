<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const toast = useToast();

useSeoMeta({
  title: "Iniciar Sesión",
  description:
    "Inicia sesión en tu cuenta para acceder a recomendaciones personalizadas.",
});

const schema = z.object({
  username: z.string().min(1, "Por favor ingresa un nombre de usuario válido."),
  password: z.string().min(1, "Por favor ingresa tu contraseña."),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
});

const showPsswd = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log("Sending login data:", event.data);

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", event.data.username);
    formData.append("password", event.data.password);
    formData.append("scope", "");

    console.log("Form data:", formData.toString());

    const auth = useAuthStore();
    await auth.login(formData);
    if (state.username && state.username.length > 0) {
      auth.setName(state.username);
    }

    toast.add({
      title: "Inicio de sesión exitoso",
      description: `¡Bienvenido de nuevo, ${event.data.username}!`,
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    toast.add({
      title: "Error al iniciar sesión",
      description: "Revisa tus credenciales e intentá nuevamente.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-12 md:p-16 lg:p-32"
  >
    <UForm
      :schema="schema"
      :state="state"
      class="flex w-full max-w-md flex-col gap-8 rounded-xl border border-white/10 bg-white/10 p-8 shadow-xl backdrop-blur-md"
      @submit="onSubmit"
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
        <UFormField label="Nombre de usuario" name="username">
          <UInput
            v-model="state.username"
            placeholder="Ingresa tu nombre de usuario"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Contraseña" name="password">
          <UInput
            v-model="state.password"
            placeholder="Ingresa tu contraseña"
            :type="showPsswd ? 'text' : 'password'"
            size="lg"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPsswd ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showPsswd ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
                :aria-pressed="showPsswd"
                aria-controls="password"
                @click="showPsswd = !showPsswd"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          label="Iniciar sesión"
          size="lg"
          class="bg-red mt-2 flex cursor-pointer items-center justify-center text-center font-bold text-white"
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
    </UForm>
  </div>
</template>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
