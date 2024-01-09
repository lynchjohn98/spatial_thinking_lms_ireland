<script setup>
import { defineProps } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useLocalStorage } from '@vueuse/core';

const userStore = useUserStore();
const courseStore = useCourseStore();

</script>

<template>
  <div class="flex h-screen bg-emerald-100">
    <!-- Sidebar -->
    <div
      class="bg-gradient-to-b from-emerald-500 to-emerald-900 text-white w-2/12 h-full flex flex-col custom-border"
    >
      <!-- Header -->
      <div class="flex items-center justify-start p-4">
        <Icon name="clarity:blocks-group-solid" class="mr-4" size="48" />
        <div>
          <p class="text-sm">Logged in as:</p>
          <h3 class="font-bold text-lg">{{ userStore.getFullName }}</h3>
        </div>
        {{ userStore.getAccountType  }}
      </div>

      <!-- Links -->
      <div class="flex-grow flex flex-col justify-center space-y-4">
        <ul class="flex flex-col space-y-2">
          <li>
            <NuxtLink
              :to="'/courses/' + courseStore.getCourseURL"
              class="flex items-center justify-between py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon name="clarity:home-solid" class="ml-4" size="24" />
              <p class="mr-4">Course Home</p>
            </NuxtLink>
          </li>
          <li v-if="courseStore.getCourseType === 'experimental'">
            <NuxtLink
              :to="'/courses/' + courseStore.getCourseURL + '/modules'"
              class="flex items-center justify-between py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon
                name="material-symbols:library-books-outline-rounded"
                class="ml-4"
                size="24"
              />
              <p class="mr-4">Modules</p>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="'/courses/' + courseStore.getCourseURL + '/quizzes'"
              class="flex items-center justify-between py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon
                name="healthicons:i-exam-multiple-choice-outline"
                class="ml-4"
                size="24"
              />
              <p class="mr-4">Quizzes</p></NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="'/courses/' + courseStore.getCourseURL + '/grades'"
              class="flex items-center justify-between py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon name="fluent:quiz-new-48-regular" class="ml-4" size="24" />
              <p class="mr-4">Grades</p>
            </NuxtLink>
          </li>
          <li v-if="userStore.getAccountType == 'instructor'">
            <NuxtLink
              :to="'/courses/' + courseStore.getCourseURL + '/settings'"
              class="flex items-center justify-between py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon name="uil:setting" class="ml-4" size="24" />
              <p class="mr-4">Course Settings</p>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              :to="'/account'"
              class="flex items-center justify-between py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon name="mdi:account-outline" class="ml-4" size="24" />
              <p class="mr-4">My Account</p>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              :to="'/'"
              class="flex items-center justify-between m-45 py-4 border-t border-b border-gray-700 hover:bg-gray-700 w-full"
            >
              <Icon
                name="material-symbols:dashboard-outline"
                class="ml-4"
                size="24"
              />
              <p class="mr-4">Dashboard</p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-6 bg-emerald-600">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.custom-border {
  border-right: 12px solid #438d6f; /* Adjust the color as needed */
}

.container-border {
  border-top-left-radius: 15px;
}
</style>
