<script setup>
import { useUserStore } from "@/stores/userStore.js";
import { useCourseStore } from "@/stores/courseStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const userStore = useUserStore();
const courseStore = useCourseStore();
const settingsStore = useSettingsStore();

const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

//All users will belong to a course, so just make a list of courses
const courses = ref([]);

async function fetchInstructorCourses() {
  let { data, error } = await client
    .from("classes")
    .select("*")
    .eq("instructor_id", userStore.getUserId);
  if (error) {
    console.log(error);
  } else {
    courses.value = data;
  }
}

async function fetchStudentCourses() {
  let { data, error } = await client
    .from("enrollments")
    .select(
      `
      id,
      classes (
        id,
        class_name,
        thumbnail_url,
        class_join_code,
        class_type,
        instructor_id
      )
    `
    )
    .eq("student_id", userStore.getUserId);
  if (error) {
    console.log(error);
  } else {
    // Transform the data
    courses.value = data.map((enrollment) => ({
      id: enrollment.classes.id,
      class_name: enrollment.classes.class_name,
      thumbnail_url: enrollment.classes.thumbnail_url,
    }));
  }
}

async function logOut() {
  console.log("Logging out");
  let { error } = await client.auth.signOut();
  console.log("Logged out");
  router.push("/login");
}

onMounted(async () => {
  if (user.value === null) {
    console.log("This ran");
  } else {
    //Set the id of the user
    userStore.setUserId(user.value.id);

    let { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", userStore.getUserId);
    if (error) {
      console.log(error);
    } else {
      userStore.setEmail(data[0].email);
      userStore.setFirstName(data[0].first_name);
      userStore.setLastName(data[0].last_name);
      userStore.setAccountType(data[0].account_type);
      userStore.setAge(data[0].age);
      userStore.setGender(data[0].gender);
    }

    //Fetch the courses based on user role
    if (userStore.getAccountType === "instructor") {
      fetchInstructorCourses();
    } else {
      fetchStudentCourses();
    }
  }
});
</script>

<template>
  <Navbar></Navbar>
  <!--- Main Login Page Screen-->
  <div
    class="grid min-w-screen min-h-screen place-items-center bg-gradient-to-b from-emerald-500 to-emerald-900"
  >
    <div flex v-if="userStore.getAccountType === 'instructor'">
      <div
        class="flex items-center justify-center text-2xl text-white font-bold mb-6"
      >
        Instructor Dashboard: Welcome {{ userStore.getFullName }}
      </div>
      <div
        class="flex flex-col md:flex-row items-center justify-center md:space-y-0 md:space-x-4"
      >
        <NuxtLink to="/addcourse">
          <button
            class="font-bold text-2xl px-4 py-2 rounded-lg bg-green-500 shadow focus:shadow-outline"
          >
            <Icon name="zondicons:add-outline" class="mb-1" />

            Create New Spatial Thinking Course
          </button>
        </NuxtLink>
        <NuxtLink to="/student-admin">
          <button
            class="font-bold text-2xl px-4 py-2 rounded-lg bg-green-500 shadow focus:shadow-outline"
          >
            <Icon name="grommet-icons:user-admin" class="mb-1" />
            Student Account Management
          </button>
        </NuxtLink>
        <NuxtLink to="/course-admin">
          <button
            class="font-bold text-2xl px-4 py-2 rounded-lg bg-green-500 shadow focus:shadow-outline"
          >
            <Icon name="eos-icons:cluster-management-outlined" class="mb-1" />
            Course Management Dashboard
          </button>
        </NuxtLink>
      </div>

      <!-- Center grid items without enforcing minimum height, allowing content to be centered in the parent -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 place-content-center">
        <div v-for="course in courses" :key="course">
          <NuxtLink
            :to="`/courses/${course.class_name}__${course.id}`"
            class="dashboard-thumbnail flex flex-col items-center px-4 py-2"
          >
            <img
              :src="course.thumbnail_url"
              class="add-course-thumbnail-preview"
            />
            <div class="dashboard-course-name mt-2">
              {{ course.class_name }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="flex items-center justify-center text-2xl text-white font-bold mb-6"
      >
        Student Dashboard: Welcome {{ userStore.getFullName }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 place-content-center">
        <div v-for="course in courses" :key="course">
          <NuxtLink
            :to="`/courses/${course.class_name}__${course.id}`"
            class="dashboard-thumbnail flex flex-col items-center px-4 py-2"
          >
            <img
              :src="course.thumbnail_url"
              class="add-course-thumbnail-preview"
            />
            <div class="dashboard-course-name mt-2">
              {{ course.class_name }}
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-if="courses.length === 0">
        <div
          class="flex items-center justify-center text-2xl text-white font-bold mb-6"
        >
          You are not enrolled in any courses.
        </div>
        <div>
          <NuxtLink :to="`/joincourse`">
            <button>Join Spatial Thinking Course</button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
