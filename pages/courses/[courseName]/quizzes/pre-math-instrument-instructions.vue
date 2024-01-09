<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
const courseStore = useCourseStore();
const basePath = "courses/" + courseStore.getCourseURL + "/quizzes";
</script>

<template>
  <div
    class="bg-emerald-500 h-screen flex flex-col justify-center items-center px-4"
  >
    <NuxtLink :to="`/${basePath}`" class="space-x-2">
      <div class="font-bold text-2xl m-1 whitespace-pre-line text-white">
        <Icon name="openmoji:return-back-button" class="white-icon" size="48" />
        Return to All Quizzes
      </div>
    </NuxtLink>
    <div class="text-center max-w-lg mx-auto mb-8">
      <h2 class="mb-4 mt-4 text-white text-lg">
        The following test will contain 11 mathematical questions. Please click
        the button below when you are ready to begin. Leaving the page or
        closing the browser will automatically submit the quiz
      </h2>
      <NuxtLink
        class="bg-emerald-400 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
        :to="`/${basePath}/pre-math-instrument`"
      >
        Begin Mathematics Test
      </NuxtLink>
    </div>
  </div>
</template>
