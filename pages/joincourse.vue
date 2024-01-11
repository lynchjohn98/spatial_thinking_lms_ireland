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
const router = useRouter();

const isEnrolled = ref(false);
const courseCode = ref("");
const errorMessage = ref("");
const class_id = ref("");
const class_join_code = ref("");
const class_name = ref("");
const isSubmitting = ref(false);

onMounted(async () => {
  //Check if student is already enrolled in the course
  const { data: studentEnrollmentData, error: studentEnrollmentError } =
    await client
      .from("enrollments")
      .select("*")
      .eq("student_id", user.value.id)
      .single();
  //This indicates the student has already been enrolled in a course
  if (studentEnrollmentData) {
    isEnrolled.value = true;
  } else {
    isEnrolled.value = false;
  }
});

const validateCourseCode = async (code) => {
  // Check if the course code is valid by querying the classes table.
  const { data: classData, error } = await client
    .from("classes")
    .select(`class_name, instructor_id, id`)
    .eq("class_join_code", code)
    .single();
  if (error || !classData) {
    return false;
  } else {
    class_id.value = classData.id;
    class_join_code.value = code;
    class_name.value = classData.class_name;
  }
  // Query the profiles table to get the instructor name.
  const { data: instructorData } = await client
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", classData.instructor_id)
    .single();
  if (!instructorData) {
    errorMessage.value =
      "Failed to get instructor information. Please try again.";
    return false;
  }
  return {
    courseName: classData.class_name,
    instructorName: `${instructorData.first_name} ${instructorData.last_name}`,
  };
};

const submitCourseCode = async () => {
  // Validate the course code.
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;

  const validationResults = await validateCourseCode(courseCode.value);
  if (validationResults) {
    // Prompt the student with the course and instructor information.
    const confirmEnroll = confirm(
      `You are about to enroll in the course ${validationResults.courseName} instructed by ${validationResults.instructorName}. Do you want to proceed?`
    );

    if (!confirmEnroll) {
      isSubmitting.value = false;
      return;
    } else {
      // Enroll the student in the class.
      const { data: enrollmentData, error } = await client
        .from("enrollments")
        .insert({
          student_id: user.value.id,
          class_id: class_id.value,
          class_join_code: class_join_code.value,
          class_name: class_name.value,
        });
      if (error) {
        alert(
          "Failed to enroll in the class. Please check the course code and try again."
        );
      } else {
        alert("Successfully enrolled in the class!");
        router.push("/");
      }
    }
  }
  isSubmitting.value = false;
};
</script>

<template>
  <div v-if="isEnrolled === true" >
    <div>
      <p>You are already enrolled in a spatial thinking course.</p>
    </div>
  </div>
  <div v-else class="min-w-screen min-h-screen flex flex-col items-center justify-center px-5 py-5 bg-gradient-to-b from-emerald-500 to-emerald-900">
    <h1 class="font-semibold mb-4 text-white text-3xl">Join a Spatial Thinking Course</h1>
    <form @submit.prevent="submitCourseCode">
      <div class=" mb-4">
        <label for="courseCode" class="block  font-bold mb-2 text-white text-lg"
          >Course Code: (XXXX-XXXX)</label
        >
        <input
          type="text"
          id="courseCode"
          v-model="courseCode"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-4">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :class="{
            'bg-green-500 hover:bg-green-600 text-white': !isSubmitting,
            'bg-gray-400 text-gray-700 cursor-not-allowed': isSubmitting,
          }"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
