<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const courseStore = useCourseStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const credentials = reactive({
  // Use reactive for better reactivity with Vue 3 Composition API
  password: "",
  confirmPassword: "", // added a confirmPassword property
});

async function updatePassword() {
  if (credentials.password !== credentials.confirmPassword) {
    alert("Password and confirmation password do not match!");
    return;
  }

  const response = await client.auth.updateUser({
    password: credentials.password,
  });
  if (response.data) {
    console.log("Password updated successfully");

    // Now, attempt to log in the user with the new password
    const { error } = await client.auth.signInWithPassword({
      email: user.value.email, // Assuming you have the user's email from the useSupabaseUser hook
      password: credentials.password,
    });

    if (error) {
      console.log("Error logging in after password update:", error.message);
      alert("Error logging in. Please sign in manually.");
      router.push("/login"); // Redirect to login page
    } else {
      alert("Password updated and logged in successfully");
      router.push("/dashboard");
    }
  } else {
    console.log("Error updating password", response.error);
    alert("Error updating password. Please try again.");
  }
}
</script>

<template>
  <div
    class="min-w-screen min-h-screen flex items-center justify-center px-5 py-5 bg-emerald-800"
  >
    <div
      class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full over p-5"
      style="max-width: 20rem"
    >
      <div class="text-center mb-10">
        <Icon
          name="clarity:blocks-group-solid"
          class="mb-5 main-icon"
          size="48"
        />
        <h1 class="font-bold text-3xl text-green-400 mb-5">
          Password Reset
        </h1>

        <div class="form-group">
          <label for="password">Enter New Password</label>
          <input type="password" id="password" v-model="credentials.password" />
          <small>Passwords must be longer than 6 characters</small>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <!-- Updated the v-model and id for confirmation -->
          <input
            type="password"
            id="confirmPassword"
            v-model="credentials.confirmPassword"
          />
          <small>Passwords must match</small>
        </div>
        <button
          @click="updatePassword()"
          type="submit"
        >
          Update my Password
        </button>
      </div>
    </div>
  </div>
</template>
