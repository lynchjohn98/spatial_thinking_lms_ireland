<script setup>
import { useUserStore } from "@/stores/userStore.js";

const userStore = useUserStore();
const router = useRouter();
const first_name = ref(userStore.getFirstName);
const last_name = ref(userStore.getLastName);

async function updateAccountInformation() {
  //update the store information
  userStore.setFirstName(first_name);
  userStore.setLastName(last_name);

}

</script>
<template>
  <Navbar></Navbar>
  <div
    class="min-w-screen min-h-screen flex flex-col sm:flex-row items-center justify-center px-5 py-5 bg-gradient-to-b from-emerald-500 to-emerald-900"
  >
    <div>
      <Icon
        name="codicon:account"
        class="text-white fill-current main-icon mr-5 sm:mr-20"
        size="128"
      />
    </div>

    <!-- Add @submit.prevent here -->
    <form
      class="flex flex-col w-full max-w-md"
      @submit.prevent="updateAccountInformation"
    >
      <label class="text-white">First Name:</label>
      <input type="text" v-model="first_name" class="rounded-sm m-4 p-2" />

      <label class="text-white">Last Name:</label>
      <input type="text" v-model="last_name" v-bind:placeholder="last_name" class="rounded-sm m-4 p-2" />

      <button type="submit" class="rounded bg-gray-50 m-5">
        Update my account information
      </button>
    </form>
  </div>
</template>
