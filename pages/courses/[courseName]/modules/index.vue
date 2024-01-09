<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

import { useLocalStorage } from "@vueuse/core";
const client = useSupabaseClient();
const courseStore = useCourseStore();
const settingsStore = useSettingsStore();


onMounted(async () => {
  await settingsStore.fetchModuleSettings(courseStore.getCourseId, client);
});

</script>

<template>
  <Navbar></Navbar>
  <div class="h-full w-full bg-emerald-800">
    <CourseSidebar>
      <div class="font-bold text-white text-3xl">Spatial Thinking Modules</div>
      <div>
        <p class="text-white text-lg mb-5 mt-5">
          Please select a module to begin.
        </p>
      </div>
      <div class="">
        
        <ul>
          <!-- Loop through quizzes and render a NuxtLink only if visibility is true -->
          <li v-for="module in settingsStore.getModuleVisibility" :key="module.name">
            <NuxtLink
              v-if="module.visibility"
              :to="`/courses/${courseStore.getCourseURL}/modules/${module.name}`"
            >
              <div class="quiz-box mb-5">
                <div class="quiz-title text-white font-bold pl-2">
                  {{ module.title }}
                </div>
                <div class="quiz-description text-white pl-2">
                  {{ module.description }}
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </CourseSidebar>
  </div>
</template>
