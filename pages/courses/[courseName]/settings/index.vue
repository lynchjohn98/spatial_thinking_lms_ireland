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

const allStudentData = reactive({
  students: [],
});

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
  fetchEnrolledStudents();
});

//Change class type between control and experimental if they did not create this earlier
const handleCourseTypeChange = (event) =>{
  const selectedCourseType = event.target.value;
  updateCourseType(selectedCourseType); 
};

async function updateCourseType(courseType) {
  const { data, error } = await client
    .from("classes")
    .update({ class_type: courseType })
    .eq("id", courseStore.getCourseId)
    .eq("instructor_id", userStore.getUserId)
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
}
//Zip files for powerpoints downloads
async function downloadAllZips() {
  const zipUrls = [
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/spatial_lms_m4-m6.zip",
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/spatial_lms_m7-m8-m10.zip",
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/spatial_lms_m9.zip",
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/spatial_lms_pre-m3.zip",
  ];

  for (let url of zipUrls) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

async function downloadForms() {
  const formUrls = [
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/Consent%20forms.pdf",
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/information%20sheet%20and%20recruitment%20letter%20%20.pdf",
  ];
  for (let url of formUrls) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

async function downloadCourseGuide() {
  const formUrls = [
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/teacher_guide_ireland_final.pdf",
  ];
  for (let url of formUrls) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

async function downloadExtensionExercises() {
  const formUrls = [
    "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/instructor_powerpoints/ExtensionExcercises.docx",
  ];
  for (let url of formUrls) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Assuming this is your fetch method:
async function fetchEnrolledStudents() {
  //Populate student enrollment data:
  const { data: studentListData, error: studentListError } = await client
    .from("enrollments")
    .select(
      `
          *,
          profiles:student_id (id, email, first_name, last_name)
        `
    )
    .eq("class_id", courseStore.getCourseId);
  if (studentListError) {
    console.log("Error fetching student data", studentListError);
  } else {
    allStudentData.students = studentListData.map((student) => ({
      ...student,
      ...student.profiles,
    }));
  }
}

//Student removal of function
async function removeStudent(
  studentId,
  studentFirstName,
  studentLastName,
  studentEmail
) {
  const confirmed = window.confirm(
    `Are you sure you want to remove student ${
      studentFirstName + " " + studentLastName
    } (email: ${studentEmail}) from the course ${courseStore.getCourseName}?`
  );
  if (!confirmed) {
    return; // Exit the function if not confirmed
  }

  const { data, error } = await client
    .from("enrollments")
    .delete()
    .eq("student_id", studentId)
    .eq("class_id", courseStore.getCourseId);

  if (error) {
    console.log("Error removing student", error);
  } else {
    console.log("Successfully removed student", data);

    // Remove the student from the local array
    allStudentData.students = allStudentData.students.filter(
      (student) => student.id !== studentId
    );
  }
}


</script>

<template>
  <Navbar></Navbar>
  <div class="bg-emerald-800">
    <CourseSidebar>
      <div
        v-if="userStore.getAccountType === 'instructor'"
        class="flex flex-col bg-center bg-cover bg-no-repeat bg-emerald-700 justify-center items-center"
      >
        <h2 class="font-bold text-white text-3xl pb-2">Course Settings</h2>

        <div
          class="flex flex-col w-1/2 justify-center items-center bg-emerald-600 rounded-lg m-4"
        >
          <h3 class="text-white text-2xl text-center items-center mt-2">
            Course Join Code:
          </h3>
          <h4
            class="text-2xl text-center text-bold"
            style="color: white; font-weight: bold; font-size: larger"
          >
            {{ courseStore.courseJoinCode }}
          </h4>
          <h3 class="text-white text-2xl text-center mt-2">Course Type:</h3>
          <p class="text-white text-center">
            Experimental courses have access to modules and quizzes. Control
            courses only have quizzes.
          </p>

          <select
            name="class-type-select"
            @change="handleCourseTypeChange"
            v-model="courseStore.courseType"
            class="m-2 text-center justify-center items-center rounded-md p-1 text-md"
          >
            <option disabled selected value>-- Select a course type --</option>
            <option value="control">Control</option>
            <option value="experimental">Experimental</option>
          </select>
        </div>

        <div
          class="flex flex-col w-1/2 justify-center items-center bg-emerald-600 rounded-lg m-4"
        >
          <h3 class="text-white text-2xl text-center items-center mt-2 mb-2">
            Course Resources:
          </h3>

          <button
            class="items-between font-bold text-1xl px-4 py-2 rounded-lg w-2/3 bg-green-500 shadow focus:shadow-outline"
            @click="downloadAllZips"
          >
            <Icon
              name="streamline:interface-content-book-2-library-content-books-book-shelf-stack"
              class="mb-1"
            />
            Download Pre-Module to Module 10 Powerpoints
          </button>
          <button
            class="font-bold text-1xl px-4 py-2 m-2 rounded-lg w-2/3 bg-green-500 shadow focus:shadow-outline"
            @click="downloadForms"
          >
            <Icon name="carbon:checkmark-outline" class="mb-1" />
            Download Consent Form and Information Sheet
          </button>
          <button
            class="font-bold text-1xl px-4 py-2 rounded-lg w-2/3 bg-green-500 shadow focus:shadow-outline mb-2"
            @click="downloadCourseGuide"
          >
            <Icon name="ep:guide" class="mb-1" />
            Download Spatial Thinking Course Guide
          </button>
          <button
            class="font-bold text-1xl px-4 py-2 rounded-lg w-2/3 bg-green-500 shadow focus:shadow-outline mb-2"
            @click="downloadExtensionExercises"
          >
            <Icon name="ep:add-location" class="mb-1" />
            Download Spatial Thinking Course Extension Excercises
          </button>
        </div>

        <div>
          <h1 class="text-white font-bold 3xl">Course Visibility Settings</h1>
        </div>
        <!--- Module Settings Table-->
        <!--- Header  -->
        <div class="flex items-center justify-center space-x-2 mt-5">
          <h3 class="text-2xl text-white">Module Settings:</h3>
          <!-- Button -->
          <button
            @click="toggleModuleTableVisibility"
            class="flex items-center"
          >
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

        <h3 class="text-bold text-white text-2xl m-4 p-4">Enrolled Students:</h3>

      <table class="text-white border-4 border-black">
        <thead class="border-4 border-black">
          <th>Student Name:</th>
          <th>Student Email:</th>
          <th>Remove Student from Course:</th>
        </thead>
        <tbody>
          <tr v-for="(student, index) in allStudentData.students" :key="index">
            <td>{{ student.first_name }} {{ student.last_name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <button
                @click="
                  removeStudent(
                    student.id,
                    student.first_name,
                    student.last_name,
                    student.email
                  )
                "
                class="bg-red-400 w-1/2"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

        
      </div>
      

      <div v-else>
        <h1 class="text-2xl text-white font-bold">Access to page Denied</h1>
      </div>
    </CourseSidebar>
  </div>
</template>
