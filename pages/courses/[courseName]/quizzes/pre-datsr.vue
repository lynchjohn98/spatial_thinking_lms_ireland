<script setup>
import { ref, reactive, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();
const courseStore = useCourseStore();

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
const basePath = "courses/" + courseStore.getCourseURL + "/quizzes";

onMounted(async () => {
  // console.log("This is now running");
  // const { data: gradeData, error: gradeError } = await client
  //   .from("grades")
  //   .select("*")
  //   .eq("survey_quiz_id", 2)
  //   .eq("student_id", user.value.id);
  // if (gradeError) {
  //   console.error("Error fetching grade data", gradeError);
  //   return; // Exit if there was an error
  // }
  // if (gradeData.length > 0) {
  //   submittedQuiz.value = false;
  //   return;
  // }

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
    .eq("id", 2)
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

async function handleSubmit() {
  console.log('Handling the submission of the quiz')
  console.log(selectedOptions.value);
  console.log('HGERE the submission of the quiz')
  const numQuestionsAnswered = Object.values(selectedOptions.value).filter(
    (v) => v !== null && v !== undefined && v !== ""
  ).length;
  if (numQuestionsAnswered < quiz.survey_questions.length) {
    alert(
      `Please answer all ${quiz.survey_questions.length} questions before submitting.`
    );
    return;
  }

  const correctAnswersObject = quiz.survey_answers.reduce((acc, answer) => {
    acc[answer.survey_quizzes_question_id] = answer.survey_quizzes_options_id;
    return acc;
  }, {});

  for (const [question, answer] of Object.entries(selectedOptions.value)) {
    //Check if empty answer and break and alert to answer all questions
    if (answer === null || answer === undefined || answer === "") {
      alert(
        `Please answer all ${quiz.survey_questions.length} questions before submitting.`
      );
      return;
    }
    if (correctAnswersObject[question] === answer) {
      quizScore.value += 1;
    }
  }
  console.log(numQuestionsAnswered);
  console.log(quizScore.value)
  console.log(correctAnswersObject);
  const payload = {
    student_id: user.value.id,
    survey_quiz_id: 2,
    score: quizScore.value,
    class_id: courseStore.getCourseId,
    answers: selectedOptions.value,
    attempt_count: 1,
  };
  console.log(quiz.survey_answers);
  console.log("Submitting quiz", payload, quizScore.value);
  const { data, error } = await client.from("grades").insert([payload]);
  if (error) {
    console.log("Error in submission", error);
  }
  submittedQuiz.value = true;
}

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

function handleBeforeUnload(event) {
  event.preventDefault();
  event.returnValue =
    "Leaving will submit your quiz. Are you sure you want to leave?";
}
</script>

<template>
  <div
    v-if="submittedQuiz"
    class="quiz-fullpage bg-emerald-700 min-h-screen w-full flex flex-col justify-center items-center"
  >
    <h1 class="text-white text-2xl text-center px-6 py-4">
      DAT:SR Pre-Test Quiz Submitted
    </h1>
    <!--- Can edit here to display the score if needed -->
    <NuxtLink
      :to="`/${basePath}`"
      class="bg-emerald-500 w-auto px-6 py-4 text-white text-2xl text-center rounded"
    >
      Return to All Quizzes
    </NuxtLink>
  </div>

  <div v-else class="quiz-fullpage bg-emerald-600">
    <form id="quiz-form">
      <div class="title text-white">{{ quiz.quizTitle }}</div>
      <div
        v-for="(question, index) in quiz.survey_questions"
        :key="index"
        class="question bg-emerald-500 border-gray-500 border rounded-lg m-2 p-2 w-1/2"
        :id="question.id"
      >
        <p class="text-white text-2xl">Question {{ index + 1 }}</p>
        <div class="image-container m-2" v-if="getImageUrl(question.id)">
          <img class="" :src="getImageUrl(question.id)" />
        </div>
        <div class="options-container">
          <div
            v-for="option in getOptions(question.id)"
            :key="option.id"
            class="option text-white font-bold"
          >
            <label>
              <input
                class="m-2 text-white"
                type="radio"
                :name="question.id"
                :value="option.id"
                v-model="selectedOptions[question.id]"
              />
              {{ option.option }}
            </label>
          </div>
        </div>
      </div>
      <button @click="handleSubmit">Submit</button>
    </form>
  </div>
</template>
