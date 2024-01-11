<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const userStore = useUserStore();
const courseStore = useCourseStore();
const settingsStore = useSettingsStore();


//Combine the quiz visibility and grade data to determine which ones to show
const quizzesWithStatus = computed(() => {
  console.log('Here: ', settingsStore.getQuizVisibility);
  console.log('Grades', userStore.getGrades);
  //Below is for later if we want to limit the amount of times a user can take a quiz
  return settingsStore.getQuizVisibility.map((quiz) => {
    const grade = userStore.getGrades.find((g) => g.name === quiz.name);
    const remainingAttempts = grade ? quiz.attempts - grade.attemptsTaken : quiz.attempts;
    const canTakeQuiz = quiz.visibility && remainingAttempts > 0;
    return {
      ...quiz,
      remainingAttempts,
      canTakeQuiz,
    };
  });
})

onMounted(async () => {
  console.log('Running');
  await settingsStore.fetchQuizSettings(courseStore.getCourseId, client);
  console.log(settingsStore.getQuizVisibility);
});
</script>

<template>
  <Navbar></Navbar>
  <CourseSidebar>
    <div class="flex flex-col">
      <div class="font-bold text-white text-3xl">Spatial Thinking Quizzes</div>
      <div>
        <p class="text-white text-lg mb-5 mt-5">
          Please select a quiz to begin.
        </p>
      </div>
      <div class="">
        <ul>
          <!-- Loop through quizzes and render a NuxtLink only if visibility is true -->
          <li v-for="quiz in settingsStore.getQuizVisibility" :key="quiz.name" v-show="quiz.visibility">
            <NuxtLink
              :to="`/courses/${courseStore.getCourseURL}/quizzes/${quiz.name}`"
              :class="{ 'opacity-50': quiz.remainingAttempts === 0 }"
            >
              <div class="quiz-box mb-5">
                <div class="quiz-title text-white font-bold pl-2">
                  {{ quiz.title }}
                </div>
                <div class="quiz-description text-white pl-2">
                 
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </CourseSidebar>
</template>