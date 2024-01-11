<script setup>
import { ref } from "vue";

const client = useSupabaseClient();
const user = useSupabaseUser();

const email = ref("");
const instructorCode = ref("");
const magicLink = ref(""); // Added this to hold the magic link URL


</script>
<template>
  <div
    class="min-w-screen min-h-screen flex items-center justify-center px-5 py-5 bg-emerald-800"
  >
    <div
      class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full p-5"
      style="max-width: 20rem"
    >
      <div class="text-center mb-10">
        <h1 class="font-bold text-3xl mb-3">Spatial Thinking</h1>
        <Icon
          name="clarity:blocks-group-solid"
          class="mb-3 main-icon"
          size="48"
        />
        <h1 class="m-2 font-bold text-2xl text-green-400 mb-3">
          Login with Code
        </h1>
        <input
          class="w-full p-2 rounded-md mb-2 border border-gray-300"
          v-model="email"
          placeholder="Student Email"
        />
        <input
          class="password w-full p-2 rounded-md mb-3 border border-gray-300"
          v-model="instructorCode"
          placeholder="Instructor Code"
        />
        <button
          @click="loginWithCode"
          class="w-full p-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600"
        >
          Login
        </button>
      </div>
      <div>{{ magicLink }}</div>
    </div>
  </div>
</template>
