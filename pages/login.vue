<script setup>
const email = ref("");
const password = ref("");

const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

async function logIn() {
    console.log('Running login function')
    if (email.value === "" || password.value === "") {
        alert("Email or password is empty. Please try again.");
        return;
    }
    let {data, error} = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });
    if (error) {
        console.log(error);
        alert("Error logging in. Please check password and try again.");
    } else {
        console.log(data);
        router.push("/");
    }
}

</script>

<template>
<!--- Main Login Page Screen-->
<div class="grid h-screen place-items-center bg-emerald-600">
    <section class="rounded-3xl border border-gray-700 p-5">
      <div class="flex flex-col items-center justify-center p-5">
        <h1 class="text-3xl font-bold text-white">Spatial Thinking</h1>
        <p class="text-center text-white">Please login or register for an account</p>
        <div class="m-4">
          <div>
            <label for="email" class="block text-sm font-medium text-white"
              >Email:</label
            >
            <input
              type="text"
              v-model="email"
              name="email"
              id="email"
              class="mt-1 p-2 border border-gray-700 rounded-md w-full"
              placeholder="Email address"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-white"
              >Password:</label
            >
            <input
              type="password"
              v-model="password"
              name="password"
              id="password"
              class="mt-1 p-2 border border-gray-700 rounded-md w-full"
              placeholder="Password"
            />
          </div>
        </div>
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          v-on:click="logIn"
        >
          Log In
        </button>
        <div>
          <p>No Account?</p>
          <button
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4"
            @click="router.push('/register')"
          >
            Register
          </button>
        </div>
      </div>
    </section>
  </div>

</template>