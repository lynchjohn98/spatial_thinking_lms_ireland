<script setup>
const router = useRouter();

async function logOut() {
  client.auth.signOut();
  router.push("/");
}

async function returnToLogIn() {
  router.push("/");
}

const isOpen = ref(false);

function menuToggle() {
  console.log(isOpen);
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <nav class="bg-emerald-700">
    <div class="flex md:flex md:flex-grow space-x-1 justify-between">
      <NuxtLink to="/" class="space-x-2">
        <div class="font-bold text-3xl m-1 whitespace-pre-line text-white">
          Spatial Thinking
          <Icon name="clarity:blocks-group-solid" class="mb-2" size="32" />
        </div>
      </NuxtLink>

      <div class="flex flex-row">
        <NuxtLink to="/account">
          <div class="text-white m-3 justify-start">
            <Icon name="codicon:account" class="mr-4" size="38" />
          </div>
        </NuxtLink>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg m-2"
          v-on:click="logOut"
        >
          Log Out
        </button>
      </div>
    </div>
  </nav>
</template>
