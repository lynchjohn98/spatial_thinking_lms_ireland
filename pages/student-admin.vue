<script setup>
import { onMounted, ref } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const courseStore = useCourseStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const userEmail = ref("");
const foundUser = ref(null);
const errorMessage = ref("");

const searchUserByEmail = async () => {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("email", userEmail.value)
    .single();
  if (data) {
    foundUser.value = data;
    if (foundUser.value.account_type === "instructor") {
      errorMessage.value = "You cannot delete an instructor account!";
      foundUser.value = null;
      return;
    }
  } else {
    alert("User does not exist");
    errorMessage.value = "User not found!";
    return;
  }
};

const deleteUser = async () => {
  if (!foundUser.value) return;
  const userIdToDelete = foundUser.value.id;

  const { data, error } = await client.rpc("delete_user", {
    user_id: userIdToDelete,
  });
  if (error) {
    console.log(error);
    errorMessage.value = "Error deleting user!";
  } else {
    alert("User has been deleted");
    foundUser = !foundUser;
  }
};

const showPopup = ref(false);
const togglePopup = () => {
  showPopup.value = !showPopup.value;
};
</script>

<template>
  <Navbar></Navbar>

  <div class="absolute top-20 left-4">
      <NuxtLink to="/">
        <button class="bg-emerald-600 px-4 py-2 text-white rounded">
          <NuxtLink class="text-white" to="/">
            <Icon
              name="fluent-mdl2:back"
              class="mb-2 main-icon text-white"
              size="20"
            />
            Back to Dashboard
          </NuxtLink>
        </button>
      </NuxtLink>
    </div>
  <div
    class="min-w-screen min-h-screen flex items-center justify-center px-5 py-5 bg-gradient-to-b from-emerald-500 to-emerald-900"
  >
    <div
      v-if="userStore.getAccountType === 'instructor'"
      class="flex flex-col items-center justify-center space-y-4"
    >
      <!-- Title with Question Mark Icon -->
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl py-1 text-white font-bold">
          Delete Student Account
        </h1>

        <!-- Icon that triggers the popup -->
        <NuxtLink @click="togglePopup">
          <Icon
            name="streamline:interface-help-question-circle-circle-faq-frame-help-info-mark-more-query-question"
            class="text-white fill-current main-icon cursor-pointer"
            size="28"
          />
        </NuxtLink>
      </div>

      <!-- The Popup (Tooltip/Modal) -->
      <div
        v-if="showPopup"
        class="absolute w-56 p-4 bg-white border rounded shadow-xl"
      >
        <p>
          Delete a student account if their password reset or login is not
          working. This will remove all instances of grades, enrollments, and
          student data. Use as a last resort.
        </p>
        <button
          @click="togglePopup"
          class="mt-2 px-3 py-1 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>

      <p class="text-1xl text-white text-center">
        Remove a student account via email.
      </p>
      <input
        v-model="userEmail"
        placeholder="Enter user's email"
        class="mb-2 bg-white p-2 rounded shadow w-full max-w-sm"
      />
      <button
        class="bg-emerald-500 rounded shadow p-2 w-full max-w-sm"
        @click="searchUserByEmail"
      >
        Search Student Via Email
      </button>

      <!-- Display user details if found -->
      <div
        v-if="foundUser"
        class="flex flex-col items-center justify-center space-y-4"
      >
        <h4>User Details</h4>
        <p>Email: {{ foundUser.email }}</p>
        <p>Name: {{ foundUser.first_name }} {{ foundUser.last_name }}</p>
        <p>Account Type: {{ foundUser.account_type }}</p>
        <button
          class="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          @click="deleteUser"
        >
          Delete User Account
        </button>
      </div>
      <!-- Display error message if user not found -->
    </div>

    <div v-else>
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl py-1 text-white font-bold">
          Delete Student Account
        </h1>
      </div>
    </div>
  </div>
</template>
