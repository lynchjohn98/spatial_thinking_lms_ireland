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

const instructorData = ref({});
const moduleOrder = ["3", "2", "4", "7", "8", "10", "11", "9", "5", "6"];

onMounted(async () => {
  //Set course id to different value for testing
  //Fetch all enrollments for class
  if (userStore.getAccountType === "instructor") {
    try {
      const { data: enrollmentData, error } = await client
        .from("enrollments")
        .select(
          `
        student_id, 
        profiles:student_id (
            first_name, 
            last_name
        )
    `
        )
        .eq("class_id", courseStore.getCourseId);
      const studentIds = [...new Set(enrollmentData.map((e) => e.student_id))];
      if (studentIds.length === 0) {
        console.log("No students found for this class");
        return;
      }
      if (error) {
        console.log(error);
      }
      const { data: gradesData } = await client
        .from("grades")
        .select("*")
        .in("student_id", studentIds);

      //Filter data to combine grades with each student. The quizzes refers to each module quiz (1-10), the surveys refer to the pre/post surveys
      for (let enrollment of enrollmentData) {
        const gradesForStudent = gradesData.filter(
          (grade) => grade.student_id === enrollment.student_id
        );
        enrollment.grades = {
          quizzes: {
            // Default all normal quizzes to "Not Attempted" Each numerical string (ie: 3, 2, 8) references the quiz_id stored in supabase
            3: "Not Attempted",
            2: "Not Attempted",
            4: "Not Attempted",
            7: "Not Attempted",
            8: "Not Attempted",
            10: "Not Attempted",
            11: "Not Attempted",
            9: "Not Attempted",
            5: "Not Attempted",
            6: "Not Attempted",
          },
          surveys: {
            // Default to "Not Attempted" for each survey quiz
            1: "Not Attempted",
            2: "Not Attempted",
            3: "Not Attempted",
            6: "Not Attempted",
            7: "Not Attempted",
            8: "Not Attempted",
          },
        };
        gradesForStudent.forEach((grade) => {
          if (
            grade.quiz_id &&
            enrollment.grades.quizzes.hasOwnProperty(grade.quiz_id)
          ) {
            enrollment.grades.quizzes[grade.quiz_id] = grade.score;
          } else if (
            grade.survey_quiz_id &&
            enrollment.grades.surveys.hasOwnProperty(grade.survey_quiz_id)
          ) {
            enrollment.grades.surveys[grade.survey_quiz_id] = grade.score;
          }
        });
      }

      instructorData.value = enrollmentData;
      console.log("Got data", instructorData.value);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  }
});
</script>

<template>
  <CourseSidebar>
    <div v-if="userStore.getAccountType=== 'instructor'">
      <h2 class="font-bold text-white text-3xl pb-2">Grade Dashboard</h2>
      <div
        class="flex flex-col w-full justify-center items-center bg-emerald-500 rounded-lg p-6 mb-4"
      >
        <h3 class="text-white text-2xl mt-2 pb-2">Pre-Test Quizzes</h3>
        <table>
          <thead class="text-white py-0">
            <tr>
              <th class="py-0">Student Name</th>
              <th>PSVT:R Pre-Test (30 Points)</th>
              <th>DAT:SR Pre-Test (10 Points)</th>
              <th>Mathematics Pre-Test (14 Points)</th>
              <th>PSVT:R Post-Test (30 Points)</th>
              <th>DAT:SR Post-Test (10 Points)</th>
              <th>Mathematics Post-Test (14 Points)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in instructorData"
              :key="student.student_id"
              class="text-white py-0"
            >
              <td>
                {{ student.profiles.first_name }}
                {{ student.profiles.last_name }}
              </td>
              <td
                v-for="(grade, surveyId) in student.grades.surveys"
                :key="surveyId"
              >
                {{ grade }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col w-full justify-center items-center bg-emerald-500 rounded-lg p-6"
      >
        <h3 class="text-white text-2xl mt-2 pb-2">Module Quizzes</h3>
        <table>
          <thead class="text-white py-0">
            <tr>
              <th class="py-0">Student Name</th>
              <th>Module 1 (7)</th>
              <th>Module 2 (24)</th>
              <th>Module 3 (10)</th>
              <th>Module 4 (10)</th>
              <th>Module 5 (10)</th>
              <th>Module 6 (10)</th>
              <th>Module 7 (10)</th>
              <th>Module 8 (10)</th>
              <th>Module 9 (10)</th>
              <th>Module 10 (10)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in instructorData"
              :key="student.student_id"
              class="text-white py-0"
            >
              <td>
                {{ student.profiles.first_name }}
                {{ student.profiles.last_name }}
              </td>
              <td v-for="quizId in moduleOrder" :key="quizId">
                {{ student.grades.quizzes[quizId] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else>
      <h2>Student Role Grade Dashboard</h2>
    </div>
  </CourseSidebar>
</template>

<!-- Add your styles here -->
<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 3px solid black;
  text-align: center;
  padding: 8px;
}
</style>
