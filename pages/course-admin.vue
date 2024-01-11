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

const courses = ref({});

onMounted(async () => {
  fetchCourses();
});

const showStudents = ref(false);
const expandedCourseId = ref(null);
const selectedClassId = ref(null);
const prevClassId = ref(null);

function toggleStudents(courseId) {
  expandedCourseId.value =
    expandedCourseId.value === courseId ? null : courseId;
}

const toggleMoveClassDiv = ref(false);
const studentToMoveData = ref({
  id: null,
  first_name: null,
  last_name: null,
  email: null,
  prevClass: null,
});

async function runMoveCommand(id, first_name, last_name, email, previousClass) {
  prevClassId.value = previousClass;
  toggleMoveClassDiv.value = true;
  studentToMoveData.value = {
    id: id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    prevClass: previousClass,
  };
}

async function finalMoveCommand(id, prevClassId, newClassData) {
  console.log(newClassData);
  const { data, error } = await client
    .from("enrollments")
    .update({
      class_id: newClassData.id,
      class_join_code: newClassData.class_join_code,
      class_name: newClassData.class_name,
    })
    .eq("class_id", prevClassId)
    .eq("student_id", id);

  if (error) {
    console.error("Error updating enrollment:", error);
    return;
  }
  console.log("Successfully updated enrollment:", data);
  toggleMoveClassDiv.value = false;
  await fetchCourses();
}

async function deleteCourse(id, name, type) {
  // Delete associated enrollments
  const { data: enrollmentData, error: enrollmentError } = await client
    .from("enrollments")
    .delete()
    .eq("class_id", id);

  if (enrollmentError) {
    console.error("Error deleting enrollments:", enrollmentError);
    alert("Error deleting associated enrollments. Please try again.");
    return;
  }
  const { data: settingsData, error: settingsError } = await client
    .from("classes_settings")
    .delete()
    .eq("class_id", id);

  if (settingsError) {
    console.error("Error deleting from classes_settings:", settingsError);
    alert("Error deleting from classes_settings. Please try again");
    return;
  }

  // Delete the class itself
  const { data, error } = await client.from("classes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting class:", error);
    alert("Error deleting class. Please try again.");
    return;
  }
  await fetchCourses();
}

async function runRemoveCommand(class_data) {
  //Can you add a confirm button that the user must click confirm to run the rest of the removal code
  console.log(class_data);
  const msg = "Are you sure you wish to remove " + class_data.student.first_name + " " + class_data.student.last_name + " from course " + class_data.class_name + "?";
  if (confirm(msg) == true) {
    const {data, error }= await client
      .from('enrollments')
      .delete()
      .eq('class_id', class_data.class_id)
      .eq('student_id', class_data.student_id);
    if (error) {
      console.error("Error removing student:", error);
      alert("Error removing student. Please try again.");
      return;
    }
    console.log("Successfully removed student:", data);
  }
}

async function fetchCourses() {
  const { data, error } = await client
    .from("classes")
    .select(
      `
    *,
    instructor:instructor_id (id, first_name, last_name, email),
    enrollments (
      *,
      student:student_id (id, first_name, last_name, email)
    )
  `
    )
    .eq("instructor_id", user.value.id);

  if (data) {
    courses.value = data;
  } else {
    console.log("Error fetching data: ", error);
  }
}

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
        <h1 class="text-2xl py-1 text-white font-bold">Your Courses</h1>

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
        class="absolute w-1/2 p-4 bg-white border rounded shadow-xl"
      >
        <p>
          Use this table to delete a full course and associated data or swap
          students between your courses. When you move a student, all their information and grade data will still be the same from their previous course.
        </p>
        <button
          @click="togglePopup"
          class="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red"
        >
          Close
        </button>
      </div>

      <table class="border">
        <thead class="">
          <tr class="text-white font-bold text-3l">
            <th>Class Name</th>
            <th>Total Enrolled Students</th>
            <th>Course Type</th>
            <th>View Students</th>
            <th>Delete Class</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="course in courses" :key="course.id">
            <tr class="text-white">
              <td>{{ course.class_name }} </td>
              <td>{{ course.enrollments.length }}</td>
              <td>{{ course.class_type }}</td>

              <td>
                <NuxtLink @click="toggleStudents(course.id)">
                  <Icon
                    name="mdi:arrow-down-drop-circle"
                    class=""
                    size="32"
                  ></Icon>
                </NuxtLink>
              </td>
              <td>
                <Button
                  @click="
                    deleteCourse(
                      course.id,
                      course.class_name,
                      course.class_type
                    )
                  "
                  class="bg-red-500 font-bold"
                >
                  Delete
                </Button>
              </td>
            </tr>
            <!-- Embedded table for enrolled students -->
            <tr v-if="expandedCourseId === course.id">
              <td colspan="5">
                <table class="border mt-2">
                  <thead>
                    <tr class="text-white">
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Move Student</th>
                      <th>Remove Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="data in course.enrollments"
                      :key="data.id"
                      class="text-white"
                    >
                      <td>{{ data.student.first_name }}</td>
                      <td>{{ data.student.last_name }}</td>
                      <td>{{ data.student.email }}</td>
                      <td>{{}}</td>
                      <td>
                        <Button
                          class="bg-orange-500 font-bold"
                          @click="
                            runMoveCommand(
                              data.student.id,
                              data.student.first_name,
                              data.student.last_name,
                              data.student.email,
                              data.class_id
                            )
                          "
                        >
                          Move
                        </Button>
                      </td>
                      <td>
                        <Button
                          class="bg-red-400 font-bold"
                          @click="runRemoveCommand(data)"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Modal Wrapper -->
      <div
        v-if="toggleMoveClassDiv"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-8 w-1/2">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Move Student</h2>
            <button
              class="w-10 bg-red-600"
              @click="toggleMoveClassDiv = !toggleMoveClassDiv"
            >
              &times;
            </button>
          </div>
          <p class="mt-4">
            This will move a student to a different course you have created.
          </p>
          <div class="py-2">
            <p>
              Move
              {{ studentToMoveData.first_name }}
              {{ studentToMoveData.last_name }} ({{ studentToMoveData.email }})
              to course:
            </p>
          </div>
          <div>
            <select
              v-model="selectedClassId"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-lg"
            >
              <option
                v-for="course in courses"
                :key="course.id"
                :value="course"
              >
                {{ course.class_name }}
              </option>
            </select>
          </div>
          <button
            class="mt-2 justify-center text-center"
            @click="
              finalMoveCommand(
                studentToMoveData.id,
                studentToMoveData.prevClass,
                selectedClassId
              )
            "
          >
            Move
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
