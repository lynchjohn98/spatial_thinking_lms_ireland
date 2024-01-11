<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const courseStore = useCourseStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const credentials = {
  email: "",
};

async function resetPassword() {
  console.log("This has been used");
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("email", credentials.email)
    .single();

  //Update this with the correct netlify address
  if (data) {
    try {
      await client.auth.resetPasswordForEmail(credentials.email, {
        redirectTo: "https://localhost:3000/update",
      });
      alert(
        "Email sent, please close this window and continue to the link provided in the email."
      );
    } catch (err) {
      console.error("Error during password reset request:", err);
      alert(
        "There was an error sending the reset email. Please try again later."
      );
    }
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
      <NuxtLink to="/">
        <Icon name="fluent-mdl2:back" class="mb-5 main-icon" size="24" />
      </NuxtLink>
      <div class="md:flex w-full justify-center">
        <div class="text-center mb-10">
          <Icon
            name="clarity:blocks-group-solid"
            class="mb-5 main-icon"
            size="48"
          />
          <h1 class="font-bold text-3xl text-green-400 mb-5">
            Reset Account Password
          </h1>
          <div class="form-group">
            <label for="email">Please Enter Your Email:</label>
            <input type="email" id="email" v-model="credentials.email" />
          </div>

          <button
            @click="resetPassword()"
            type="submit"
          >
            Send Password Reset Email
          </button>
          <small>
           Please check your email for a link to use
            to redirect you to a new password entry.
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
