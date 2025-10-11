<script setup lang="ts">
useSeoMeta({
  title: "cineTrack - Registrarse",
  description: "Crea una cuenta gratis para descubrir películas.",
});

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const lastName = ref("");
const role = ref("user");
const imageUrl = ref("");
const bio = ref("");
const location = ref("");
const website = ref("");
const birthDate = ref("");
const gender = ref("");
const experience = ref("");

async function handleRegister() {
  print(birthDate.value);
  try {
    const response = await $fetch(
      "http://users-prod-alb-1703954385.us-east-1.elb.amazonaws.com/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          username: username.value,
          password: password.value,
          email: email.value,
          name: name.value,
          last_name: lastName.value,
          role: role.value,
          image_url: imageUrl.value,
          bio: bio.value,
          location: location.value,
          website: website.value,
          birth_date: birthDate.value,
          gender: gender.value,
          experience: experience.value,
        },
      },
    );

    console.log("Usuario registrado exitosamente:", response);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
  }
}
</script>

<template>
  <form
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"
    @submit.prevent="handleRegister"
  >
    <div
      class="flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-white/10 bg-white/10 p-8 shadow-xl backdrop-blur-md"
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
        <!-- Basic Information -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField
            label="Nombre de usuario"
            description="Elige un nombre único para tu perfil."
          >
            <UInput
              v-model="username"
              placeholder="Ingresa tu nombre de usuario"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Email"
            description="Usaremos tu email para enviarte notificaciones."
          >
            <UInput
              v-model="email"
              placeholder="Ingresa tu email"
              type="email"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Password Fields -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField
            label="Contraseña"
            description="Debe tener al menos 8 caracteres."
          >
            <UInput
              v-model="password"
              placeholder="Crea una contraseña"
              type="password"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Confirmar contraseña"
            description="Repite tu contraseña para confirmar."
          >
            <UInput
              v-model="confirmPassword"
              placeholder="Confirmar contraseña"
              type="password"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Personal Information -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="Nombre" description="Tu nombre real.">
            <UInput
              v-model="name"
              placeholder="Ingresa tu nombre"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Apellido" description="Tu apellido.">
            <UInput
              v-model="lastName"
              placeholder="Ingresa tu apellido"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Profile Information -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField
            label="Fecha de nacimiento"
            description="Formato: YYYY-MM-DD"
          >
            <UInput
              v-model="birthDate"
              placeholder="1990-01-15"
              type="date"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Género" description="Tu género.">
            <UInput
              v-model="gender"
              placeholder="Masculino, Femenino, Otro"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="Ubicación" description="Tu ciudad y país.">
            <UInput
              v-model="location"
              placeholder="Buenos Aires, Argentina"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Sitio web"
            description="Tu página web personal (opcional)."
          >
            <UInput
              v-model="website"
              placeholder="https://tusitio.com"
              type="url"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Additional Information -->
        <UFormField
          label="URL de imagen de perfil"
          description="Link a tu foto de perfil (opcional)."
        >
          <UInput
            v-model="imageUrl"
            placeholder="https://example.com/tu-foto.jpg"
            type="url"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Biografía"
          description="Cuéntanos sobre ti y tus intereses cinematográficos."
        >
          <UTextarea
            v-model="bio"
            placeholder="Describe tu pasión por el cine, géneros favoritos, etc."
            :rows="3"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Experiencia"
          description="Tu experiencia relacionada con el cine (opcional)."
        >
          <UTextarea
            v-model="experience"
            placeholder="Describe tu experiencia en crítica de cine, producción, etc."
            :rows="3"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UButton
          label="Registrarme"
          size="lg"
          class="bg-red mt-2 flex items-center justify-center text-center font-bold text-white"
          type="submit"
        />
      </div>
      <div class="mt-2 flex flex-col items-center gap-1">
        <span class="text-sm text-gray-400">¿Ya tenés cuenta?</span>
        <NuxtLink to="/login" class="text-sm text-red-400 hover:underline"
          >Iniciá sesión</NuxtLink
        >
      </div>
    </div>
  </form>
</template>
