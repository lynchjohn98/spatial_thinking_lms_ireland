<script setup>
//Need to implement timer here

import { ref, reactive, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";

const quiz = reactive({
  quizTitle: "",
  survey_questions: [],
  survey_options: [],
  survey_images: [],
  survey_answers: [],
});

const quizScore = ref(0);
const classId = ref(0);
const selectedOptions = ref({});
const submittedQuiz = ref(false);

//Get objects
const user = useSupabaseUser();
const client = useSupabaseClient();
const quizStore = useQuizStore();
const courseStore = useCourseStore();
const basePath = "courses/" + courseStore.getCourseURL + "/quizzes";



onMounted(async () => {
  window.addEventListener("beforeunload", handleBeforeUnload);

  const { data: gradeData, error: gradeError } = await client
    .from("grades")
    .select("*")
    .eq("survey_quiz_id", 1)
    .eq("student_id", user.value.id);

  if (gradeError) {
    console.error("Error fetching grade data", gradeError);
    return; // Exit if there was an error
  }

  // Now fetch quiz data
  const { data: quizData, error: quizError } = await client
    .from("survey_quizzes")
    .select(
      `
      *,
      survey_quizzes_questions(*),
      survey_quizzes_images(*),
      survey_quizzes_options(*),
      survey_quizzes_correct_answers(*)
    `
    )
    .eq("id", 1)
    .single();

  if (quizError) {
    console.error("Error fetching quiz data", quizError);
    return;
  }

  quiz.quizTitle = quizData.survey_quiz_name;
  quiz.survey_questions = quizData.survey_quizzes_questions;
  quiz.survey_options = quizData.survey_quizzes_options;
  quiz.survey_images = quizData.survey_quizzes_images;
  quiz.survey_answers = quizData.survey_quizzes_correct_answers;
  const { data: enrollmentData, error: enrollmentError } = await client
    .from("enrollments")
    .select("class_id")
    .eq("student_id", user.value.id);

  if (enrollmentError) {
    console.log("Error in fetching data", enrollmentError);
  } else if (enrollmentData.length > 0) {
    classId.value = enrollmentData[0].class_id; // Assuming the first record contains the relevant class_id
  } else {
    console.log("No enrollment data found for this user.");
  }

  
});

function getImageUrl(questionId) {
  const image = quiz.survey_images.find(
    (img) => img.survey_quiz_question_id === questionId
  );
  return image ? image.image_url : "";
}

function getOptions(questionId) {
  return quiz.survey_options.filter(
    (option) => option.survey_quiz_question_id === questionId
  );
}
async function handleSubmit(autoSubmit = false) {
  console.log("In submit function");

  const numQuestionsAnswered = Object.values(selectedOptions.value).filter(
    (v) => v !== null && v !== undefined && v !== ""
  ).length;
  if (
    numQuestionsAnswered < quiz.survey_questions.length &&
    autoSubmit === false
  ) {
    alert(
      `Please answer all ${quiz.survey_questions.length} questions before submitting.`
    );
    return;
  }

  if (autoSubmit) {
    quiz.survey_questions.forEach((question) => {
      if (!selectedOptions.value.hasOwnProperty(question.id)) {
        selectedOptions.value[question.id] = null;
      }
    });
  }

  const correctAnswersObject = quiz.survey_answers.reduce((acc, answer) => {
    acc[answer.survey_quizzes_question_id] = answer.survey_quizzes_options_id;
    return acc;
  }, {});

  for (const [question, answer] of Object.entries(selectedOptions.value)) {
    if (correctAnswersObject[question] === answer) {
      quizScore.value += 1;
    }
  }

  const payload = {
    student_id: user.value.id,
    survey_quiz_id: 1,
    score: quizScore.value,
    class_id: courseStore.getCourseId,
    answers: selectedOptions.value,
    attempt_count: 1,
  };

  const { data, error } = await client.from("grades").insert([payload]);

  if (error) {
    console.log("Error in submission", error);
  }

  submittedQuiz.value = true;
}


//Refresh the main window:
</script>

<template>
 <div v-if="submittedQuiz" class="quiz-fullpage bg-emerald-700 min-h-screen w-full flex flex-col justify-center items-center">
    <h1 class="text-white text-2xl text-center px-6 py-4">PSVT:R Pre-Test Quiz Submitted</h1>
    <!--- Can edit here to display the score if needed -->
    <NuxtLink :to="`/${basePath}`" class="bg-emerald-500 w-auto px-6 py-4 text-white text-2xl text-center rounded">
      Return to All Quizzes
    </NuxtLink>
</div>
  <div v-else class="quiz-fullpage">
    <form id="quiz-form">
      <div class="title">{{ quiz.quizTitle }}</div>
      <div
        v-for="(question, index) in quiz.survey_questions"
        :key="index"
        class="bg-emerald-500 p-4 rounded-lg"
        :id="question.id"
      >
        <div class="image-container" v-if="getImageUrl(question.id)">
          <img
            class="rounded-lg mb-4 border-4 border-black"
            :src="getImageUrl(question.id)"
          />
        </div>
        <div class="options-container">
          <div
            v-for="option in getOptions(question.id)"
            :key="option.id"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <label>
              <input
                type="radio"
                :name="question.id"
                :value="option.id"
                v-model="selectedOptions[question.id]"
                class="m-2 w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-100 dark:focus:ring-emerald-600"
              />
              {{ option.option }}
            </label>
          </div>
        </div>
      </div>
      <button @click="handleSubmit">Submit PSVTR Quiz</button>
    </form>
  </div>
</template>
