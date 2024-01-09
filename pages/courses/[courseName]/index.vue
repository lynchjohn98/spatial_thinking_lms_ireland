<script setup>
import { computed, onMounted, watch } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const userStore = useUserStore();
const courseStore = useCourseStore();
const settingsStore = useSettingsStore();


const route = useRoute();
const course_url = route.params.courseName;
const [nameValue, course_id] = route.params.courseName.split("__");

// Computed property to check if quizzes are fetched and valid
function checkQuizzes() {
  const quizzes = settingsStore.quiz_visibility;
  if (quizzes === null || quizzes === undefined || quizzes.length < 17) {
    settingsStore.ensureDefaultQuizzes(client);
    return false;
  }
  for (const quiz of quizzes) {
    if (quiz.attempts === null || quiz.attempts === undefined) {
      settingsStore.ensureDefaultQuizzes(client);
      return false;
    }
  }
}

const isModulesFetched = computed(
  () =>
    settingsStore.module_visibility !== null &&
    settingsStore.module_visibility.length >= 0
);

onMounted(async () => {
  const { data, error } = await client
    .from("classes")
    .select("*")
    .eq("id", course_id);
  if (error) {
    console.log("Error fetching course data:", error);
    return;
  }

  // Set course data
  courseStore.setCourseName(data[0].class_name);
  courseStore.setCourseId(data[0].id);
  courseStore.setCourseInstructor(data[0].instructor_id);
  courseStore.setCourseType(data[0].class_type);
  courseStore.setCourseJoinCode(data[0].class_join_code);
  courseStore.setCourseURL(course_url);

  // Set settings in course
  settingsStore.setCourseId(data[0].id);
  await settingsStore.fetchModuleSettings(data[0].id, client);
  await settingsStore.fetchQuizSettings(data[0].id, client);
  checkQuizzes();

  // Set user data for grades

  userStore.retrieveGrades(client);
  console.log(userStore);
  console.log(courseStore);
  console.log(settingsStore);
});

watch(isModulesFetched, (newVal) => {
  if (newVal && settingsStore.module_visibility.length < 9) {
    console.log("Ensuring default modules");
    settingsStore.ensureDefaultModules(client);
  }
});
</script>

<template>
  <Navbar></Navbar>
  <CourseSidebar>
    <div class="flex flex-col align-middle">
      <h1 class="text-white font-bold text-3xl">
        Welcome to the {{ courseStore.getCourseName }} Spatial Thinking Course
      </h1>
      <h2 class="text-white font-bold text-1xl mt-2"> Use the links below to navigate your course. </h2>
      <ul class="p-10">
        <li>
          <NuxtLink
            class="text-white text-bold  m-5 text-2xl bg-emerald-500 rounded-lg pr-2 pl-2 pt-1 pb-1 hover:bg-emerald-600"
            :to="`/courses/${courseStore.getCourseURL}/modules`"
          >
            Modules
          </NuxtLink>
          <NuxtLink
            class="text-white text-bold  m-5 text-2xl bg-emerald-500 rounded-lg pr-2 pl-2 pt-1 pb-1 hover:bg-emerald-600"
            :to="`/courses/${courseStore.getCourseURL}/quizzes`"
          >
            Quizzes
          </NuxtLink>
          <NuxtLink
            class="text-white text-bold m-5 text-2xl bg-emerald-500 rounded-lg pr-2 pl-2 pt-1 pb-1 hover:bg-emerald-600"
            :to="`/courses/${courseStore.getCourseURL}/grades`"
          >
            Grades
          </NuxtLink>
          
        </li>
      </ul>
    </div>
    <!-- The rest of your template -->
  </CourseSidebar>
</template>
