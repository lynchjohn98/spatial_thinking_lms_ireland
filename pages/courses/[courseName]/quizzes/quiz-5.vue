<script setup>
import { ref, onMounted, reactive } from "vue";
import { useQuizStore } from "@/stores/quizStore.js";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { handleSubmitQuiz } from "@/services/quizFunctions.js";
import { useRouter } from 'vue-router';

const courseStore = useCourseStore();

const userScore = ref(0);

const router = useRouter();
const client = useSupabaseClient();
const user = useSupabaseUser();
const isLoading = ref(false);
const submittedQuiz = ref(false);
const maxScore = 20;
const quiz = ref({});
const questionNumber = 1;
const studentAttempts = ref(0);
const selectedAnswers = reactive({});
const subChoiceQuestions = reactive([]);
const correctAnswers = reactive({});
const score = ref(0);

//const selectedIndices = [0,1];
const selectedIndices = [0, 1, 2, 3, 10, 11, 12, 13, 17];

onMounted(async () => {
  const { data, error } = await client
    .from("quizzes")
    .select(
      `
      *,
      questions (
        *,
        options (*),
        images (*),
        correct_answers(*),
        sub_questions (
          *,
          options (*),
          parts(
            *,
            options(*)
          )
        )
      )
    `
    )
    .eq("id", 8)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }
  //Set up to analyze the attempts
  const { data: studentData, error: studentError } = await client
    .from("grades")
    .select("*")
    .eq("student_id", user.value.id)
    .eq("quiz_id", 7)
    .order("id", { ascending: false });
  if (studentError) {
    console.log("Error fetching student data", studentError);
  } else {
    console.log("Found this data", studentData);
    //Get quiz visibility data
    const { data: quizData, error: quizError } = await client
      .from("classes_settings")
      .select("quiz_visibility")
      .eq("class_id", courseStore.course_id);
    if (quizError) {
      console.log("Error fetching quiz visibility data", quizError);
    } else {
      const quiz4 = quizData[0].quiz_visibility.filter(
        (quiz) => quiz.name === "quiz-4"
      );
      //Check if student has taken the quiz before, if the length is 0 then it means they haven't
      if (studentData.length > 0) {
        studentAttempts.value = studentData[0].attempt_count;
        if (studentAttempts.value >= quiz4[0].attempts) {
          canTakeQuiz.value = false; //user is over the max allowed attempts
        }
      } else {
        canTakeQuiz.value = true;
      }
    }
  }

  quiz.value = updateQuizData(data);

  // Clear the existing subChoiceQuestions and correctAnswers
  subChoiceQuestions.length = 0;
  Object.keys(correctAnswers).forEach((key) => {
    delete correctAnswers[key];
  });

  // Populate subChoiceQuestions and correctAnswers based on selectedIndices
  selectedIndices.forEach((index) => {
    const question = quiz.value.subChoiceQuestions[index];
    if (question) {
      subChoiceQuestions.push(question);
      // Check for correct_answers and reformat them
      if (question.correct_answers) {
        question.correct_answers.forEach((ca) => {
          if (!correctAnswers[ca.sub_question_id]) {
            correctAnswers[ca.sub_question_id] = [];
          }
          correctAnswers[ca.sub_question_id].push(ca.option_id);
        });
      }
    }
  });
});
function submitAnswers() {
  isLoading.value = true;

  // Introduce a slight delay for UX purposes
  setTimeout(() => {
    gradeQuiz();
  }, 1000); // Removed extra parenthesis here
}

function gradeQuiz() {
  // Check if all sub-questions have been answered
  let allAnswered = true;
  for (const subQuestion of subChoiceQuestions) {
    for (const sq of subQuestion.sub_questions) {
      if (!selectedAnswers[sq.id] || selectedAnswers[sq.id] === "") {
        alert(`Please answer all questions before submitting.`);
        allAnswered = false;
        break; // Break out of the inner loop
      }
    }
    if (!allAnswered) {
      break; // Break out of the outer loop if an unanswered question is found
    }
  }

  // Only continue with grading if all questions have been answered
  if (allAnswered) {
    score.value = 0; // Reset the score to 0 before calculating

    // Loop through the selected answers and compare with correct answers
    for (const [subQuestionId, userAnswerId] of Object.entries(
      selectedAnswers
    )) {
      const correctOptionIds = correctAnswers[subQuestionId];

      // If correctOptionIds is an array and includes the user's answer, increment the score
      if (
        Array.isArray(correctOptionIds) &&
        correctOptionIds.includes(userAnswerId)
      ) {
        score.value += 1; // Increment score for a correct answer
      }
    }

    // Once grading is done, display the final score, submit the data, and update the state
    userScore.value = score.value; // Update the reactive userScore with the calculated score
    submittedQuiz.value = true; // Update the state to show that the quiz has been submitted
    submitStudentData(); // Call the function to submit student data to the backend
  }

  isLoading.value = false; // Turn off the loading indicator
  window.scrollTo(0, 0); // Scroll to the top of the page to show the score
}

//Code to run after the student has submitted the quiz
async function submitStudentData() {
  let attemptPayload = studentAttempts.value + 1;
  const { data: quizData, error: quizError } = await client
    .from("grades")
    .insert([
      {
        class_id: courseStore.course_id,
        student_id: user.value.id,
        quiz_id: 8,
        score: userScore.value,
        attempt_count: attemptPayload,
      },
    ]);
  if (quizError) {
    console.log("Error inserting payload", quizError);
  } else {
    console.log("Quiz data inserted successfully", quizData);
  }
}
</script>

<template>
  <div class="quiz-fullpage">
    <div class="title rounded-lg flex justify-between items-center">
      Module 5 Quiz: Rotation of Objects About a Single Axis
      <span class="font-bold" v-if="submittedQuiz"
        >Final Score: {{ userScore }} / 20</span
      >
    </div>
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="loader"></div>
      <h3 class="text-white mt-4">Grading Quiz...</h3>
    </div>

    <!--- Subchoice questions -->
    <div
      v-for="(question, qIndex) in subChoiceQuestions"
      :key="qIndex"
      class="question subchoice-question"
    >
      <h2 class="font-bold text-white text-3xl flex">
        Question {{ qIndex + 1 }}
      </h2>
      <h3 class="font-bold text-white text-2xl lg:p-1 md:p-2 sm:m-2">
        {{ question.question_text }}
      </h3>
      <div
        class="image-container"
        v-for="(image, index) in question.images"
        :key="index"
      >
        <img
          class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
          :src="image.image_url"
        />
      </div>
      <div
        v-for="(subQuestion, sqIndex) in question.sub_questions"
        :key="sqIndex"
        class="subchoice-question"
      >
        <div class="subchoice-question-row text-white 2xl m-5">
          <h3>{{ subQuestion.sub_question_text }}</h3>

          <div class="dropdown-container">
            <select
              class="text-black"
              v-model="selectedAnswers[subQuestion.id]"
            >
              <option selected value="" disabled>[ Select ]</option>
              <option
                v-for="(option, optIndex) in subQuestion.options"
                :key="optIndex"
                :value="option.id"
              >
                {{ option.option_text }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button v-if="!allAnswered" @click="submitAnswers">Submit Answers</button>
  <button v-else @click=router.push(basePath)> Return to Quizzes </button>
</template>
