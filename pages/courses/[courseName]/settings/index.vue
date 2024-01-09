<script setup>
import { ref, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const courseStore = useCourseStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const moduleTableVisible = ref(true);
const quizTableVisible = ref(true);

const toggleModuleTableVisibility = () => {
  moduleTableVisible.value = !moduleTableVisible.value;
  console.log("here now", moduleTableVisible.value);
};

const toggleQuizTableVisibility = () => {
  quizTableVisible.value = !quizTableVisible.value;
  console.log("here now", quizTableVisible.value);
};

onMounted(async () => {
  await settingsStore.fetchModuleSettings(courseStore.getCourseId, client);
  await settingsStore.fetchQuizSettings(courseStore.getCourseId, client);
});
</script>

<template>
  <Navbar></Navbar>
  <div class="bg-emerald-800">
    <CourseSidebar>
      <div
        v-if="userStore.getAccountType === 'instructor'"
        class="flex flex-col justify-center text-center"
      >
      <div>
        <h1 class="text-white font-bold 3xl"> Course Settings Page </h1>
      </div>
        <!--- Module Settings Table-->
        <!--- Header  -->
        <div class="flex items-center justify-center space-x-2 mt-5">
          <h3 class="text-2xl text-white">Module Settings:</h3>
          <!-- Button -->
          <button @click="toggleModuleTableVisibility" class="flex items-center">
            <Icon
              size="48"
              v-if="moduleTableVisible"
              name="tabler:circle-arrow-up-filled"
              class=""
            />
            <Icon size="48" v-else name="tabler:circle-arrow-down-filled" />
          </button>
        </div>

        <!--- Table -->
        <div v-show="moduleTableVisible" class="overflow-x-auto text-white">
          <thead>
            <td class="p-2 whitespace-normal">Module Title</td>
            <td class="p-2 whitespace-normal">Module Description</td>
            <td class="p-2 whitespace-normal">Visibility</td>
          </thead>
          <tbody>
            <tr
              v-for="module in settingsStore.module_visibility"
              :key="module.name"
            >
              <td class="p-2 whitespace-normal">{{ module.title }}</td>
              <td class="p-2 whitespace-normal">{{ module.description }}</td>
              <td class="p-2 whitespace-normal">
                <input
                  type="checkbox"
                  v-model="module.visibility"
                  @change="
                    settingsStore.toggleModuleVisibility(
                      module.name,
                      client,
                      courseStore.getCourseId
                    )
                  "
                />
              </td>
            </tr>
          </tbody>
        </div>

        <!--- Quiz Settings Table-->
        <!--- Header -->
        <div class="flex items-center justify-center space-x-2 mt-5">
          <h3 class="text-2xl text-white">Quiz Settings:</h3>
          <!-- Button -->
          <button @click="toggleQuizTableVisibility" class="flex items-center">
            <Icon
              size="48"
              v-if="quizTableVisible"
              name="tabler:circle-arrow-up-filled"
              class=""
            />
            <Icon size="48" v-else name="tabler:circle-arrow-down-filled" />
          </button>
        </div>
        <!--- Table -->
        <div v-show="quizTableVisible" class="overflow-x-auto text-white">
          <thead>
            <td class="p-2 whitespace-normal">Quiz Title</td>
            <td class="p-2 whitespace-normal">Quiz Attempts</td>
            <td class="p-2 whitespace-normal">Visibility</td>
          </thead>
          <tbody class="text-white text-large">
            <tr v-for="quiz in settingsStore.quiz_visibility" :key="quiz.name">
              <td class="p-2 whitespace-normal">{{ quiz.title }}</td>
              <td class="p-2 whitespace-normal">
                <select
                  class="text-black"
                  v-model="quiz.attempts"
                  @change="
                    settingsStore.updateQuizAttempts(
                      quiz.name,
                      quiz.attempts,
                      client,
                      courseStore.getCourseId
                    )
                  "
                >
                  <option disabled value="">Quiz attempts</option>
                  <option v-for="number in 10" :key="number" :value="number">
                    {{ number }}
                  </option>
                </select>
              </td>
              <td class="p-2 whitespace-normal">
                <input
                  type="checkbox"
                  v-model="quiz.visibility"
                  @change="
                    settingsStore.toggleQuizVisibility(
                      quiz.name,
                      client,
                      courseStore.getCourseId
                    )
                  "
                />
              </td>
            </tr>
          </tbody>
        </div>
      </div>

      <div v-else>
        <h1 class="text-2xl text-white font-bold">Access to page Denied</h1>
      </div>
    </CourseSidebar>
  </div>
</template>
