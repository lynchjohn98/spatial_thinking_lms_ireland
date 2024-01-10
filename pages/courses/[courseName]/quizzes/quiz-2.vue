<script setup>
import { ref, onMounted, reactive } from "vue";
import { useQuizStore } from "@/stores/quizStore.js";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { handleSubmitQuiz } from "@/services/quizFunctions.js";
import { useRouter } from 'vue-router';

//Get old url for reference later
const router = useRouter();
const basePath = router.currentRoute.value.fullPath.replace(/\/quiz-\d+$/, '');


//Get objects
const user = useSupabaseUser();
const client = useSupabaseClient();
const quizStore = useQuizStore();
const courseStore = useCourseStore();

const submittedQuiz = ref(false);
const isLoading = ref(false);
const userScore = ref(0);
const maxScore = ref(0);
const studentAttempts = ref(0);
const canTakeQuiz = ref(true);

//Set up the program to get the quiz data from the user entry and the correct answers
const selectedOptions = reactive({
  multipleChoiceQuestions: {},
  multipleSelectQuestions: {
    ms_q1: [],
    ms_q2: [],
    ms_q3: [],
    ms_q4: [],
    ms_q5: [],
    ms_q6: [],
  },
  subChoiceQuestions: {
    sc_q1: ["", "", "", ""], //We need a blank string for each selected option.
  },
  multipleSubchoiceQuestions: {
    msc_q1: ["", "", "", "", "", "", "", ""],
  },
});

const correctOptions = reactive({
  multipleChoiceQuestions: {},
  multipleSelectQuestions: {
    ms_q1: ["A", "C"], // Correct answers for Question 1
    ms_q2: ["C", "D"], // Correct answers for Question 2
    ms_q3: ["A", "B", "D"], // Correct answers for Question 3
    ms_q4: ["B"], // Correct answers for Question 4
    ms_q5: ["A", "D"], // Correct answers for Question 5
    ms_q6: ["C", "D"], // Correct answers for Question 6
  },
  subChoiceQuestions: {
    sc_q1: ["X", "Z", "Y", "Z"], // Correct answers for Question 7
  },
  multipleSubchoiceQuestions: {
    msc_q1: ["180", "X", "270", "Z2", "270", "X2", "90", "Z"],
  },
});

//Store scores of each user question here:
const questionScores = reactive({
  ms_q1: null,
  ms_q2: null,
  ms_q3: null,
  ms_q4: null,
  ms_q5: null,
  ms_q6: null,
  sc_q1: null,
  msc_q1: null,
});

function resetQuestionScores() {
  console.log("Reset question scores called");
  for (let question in questionScores) {
    questionScores[question] = null;
  }
}

function gradeQuestions() {
  // MultipleSelect question grading
  for (let question in selectedOptions.multipleSelectQuestions) {
    const correctAnswers = correctOptions.multipleSelectQuestions[question];
    const userAnswers = selectedOptions.multipleSelectQuestions[question];

    if (userAnswers.length === 0) {
      alert(
        `Please make sure you make a selection for ${formatQuestionIDMS(
          question
        )}.`
      );
      resetQuestionScores();
      return false;
    }

    const correctCount = userAnswers.filter((answer) =>
      correctAnswers.includes(answer)
    ).length;
    const incorrectCount = userAnswers.filter(
      (answer) => !correctAnswers.includes(answer)
    ).length;
    questionScores[question] = Math.max(0, correctCount - incorrectCount);
  }

  // SubChoice question grading
  for (let question in selectedOptions.subChoiceQuestions) {
    const correctAnswers = correctOptions.subChoiceQuestions[question];
    const userAnswers = selectedOptions.subChoiceQuestions[question];

    if (userAnswers.includes("")) {
      alert("Please make a selection for each dropdown.");
      resetQuestionScores();
      return false;
    }

    const correctCount = userAnswers.filter(
      (answer, index) => answer === correctAnswers[index]
    ).length;

    // Set score as the number of correct answers
    questionScores[question] = correctCount;
  }

  // MultipleSubChoice question grading
  for (let question in selectedOptions.multipleSubchoiceQuestions) {
    const correctAnswers = correctOptions.multipleSubchoiceQuestions[question];
    const userAnswers = selectedOptions.multipleSubchoiceQuestions[question];

    if (userAnswers.includes("")) {
      console.log("Here", question, userAnswers);
      alert(
        `Please make a selection for both dropdowns of ${formatQuestionIDMSC(
          question
        )}.`
      );
      resetQuestionScores();
      return false;
    }

    const correctCount = userAnswers.filter(
      (answer, index) => answer === correctAnswers[index]
    ).length;

    // Set score as the number of correct answers
    questionScores[question] = correctCount;
  }

  return true; // return true to indicate all questions are graded
}

function updateFinalScores() {
  userScore.value = Object.values(questionScores).reduce(
    (acc, score) => acc + score,
    0
  );
  maxScore.value =
    Object.values(correctOptions.multipleSelectQuestions).reduce(
      (acc, answers) => acc + answers.length,
      0
    ) +
    Object.values(correctOptions.subChoiceQuestions).reduce(
      (acc, answers) => acc + answers.length,
      0
    ) +
    Object.values(correctOptions.multipleSubchoiceQuestions).reduce(
      (acc, answers) => acc + answers.length,
      0
    );
}

function isCorrect(questionId, option) {
  return (
    selectedOptions.multipleSelectQuestions[questionId].includes(option) &&
    correctOptions.multipleSelectQuestions[questionId].includes(option)
  );
}

function isCorrectSC(questionId, index, option) {
  return correctOptions.subChoiceQuestions[questionId][index] === option;
}

function isCorrectMSC(questionId, index, value) {
  return (
    selectedOptions.multipleSubchoiceQuestions[questionId][index] ===
      value &&
    correctOptions.multipleSubchoiceQuestions[questionId][index] === value
  );
}

function checkAnswers() {
  isLoading.value = true;
  setTimeout(() => {
    const allQuestionsGraded = gradeQuestions();
    if (allQuestionsGraded) {
      updateFinalScores();
      submittedQuiz.value = true;
      window.scrollTo(0, 0);
      submitStudentData();
    }
    isLoading.value = false;
  }, 750);
  console.log("Check answers has ran");
}

// Utility function to format the question ID for display
function formatQuestionIDMS(questionID) {
  console.log(questionID);
  let formattedQuestion = questionID
    .replace("ms_", "Question ")
    .replace("q", "");
  return formattedQuestion;
}

function formatQuestionIDSC(questionID) {
  console.log(questionID);
  let formattedQuestion = questionID.replace("ms_", "Question ");
  return formattedQuestion;
}

function formatQuestionIDMSC(questionID) {
  console.log(questionID);
  let formattedQuestion = questionID.replace("msc_", "Question ");
  return formattedQuestion;
}

onMounted(async () => {
  //Set up to analyze the attempts
  const { data: studentData, error: studentError } = await client
    .from("grades")
    .select("*")
    .eq("student_id", user.value.id)
    .eq("quiz_id", 2)
    .order("id", { ascending: false });
  if (studentError) {
    console.log("Error fetching student data", studentError);
  } else {
    const { data: quizData, error: quizError } = await client
      .from("classes_settings")
      .select("quiz_visibility")
      .eq("class_id", courseStore.getCoruseId);
    if (quizError) {
      console.log("Error fetching quiz visibility data", quizError);
    } else {
      const quiz2 = quizData[0].quiz_visibility.filter(
        (quiz) => quiz.name === "quiz-2"
      );
      console.log("Found quiz:", quiz2[0].attempts);
      //Check if student has taken the quiz before, if the length is 0 then it means they haven't
      if (studentData.length > 0) {
        studentAttempts.value = studentData[0].attempt_count
        if (studentAttempts.value >=  quiz2[0].attempts) {
          canTakeQuiz.value = false; //user is over the max allowed attempts
        }
      } else {
        canTakeQuiz.value = true;
      }
    }
  }
});

//Code to run after the student has submitted the quiz
async function submitStudentData() {
  let attemptPayload = studentAttempts.value + 1;
  const { data: quizData, error: quizError } = await client
    .from("grades")
    .insert([
      {
        class_id: courseStore.getCourseId,
        student_id: user.value.id,
        quiz_id: 2,
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
      <div
        v-if="isLoading"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="loader"></div>
        <h3 class="text-white mt-4">Grading Quiz...</h3>
      </div>

      <div class="title rounded-lg flex justify-between items-center">
        Module 2 Quiz: Surfaces and Solids of Revolution
        <span class="font-bold" v-if="submittedQuiz"
          >Final Score: {{ userScore }} / {{ maxScore }}</span
        >
      </div>

      <div v-if="!canTakeQuiz">
        <div class="text-white text-2xl">
          You have already taken this quiz the maximum number of times.
        </div>
        <div class="text-white text-2xl">
          Please return to the quizzes page to view your scores.
        </div>
        <div class="flex justify-center">
          <button
            class="bg-emerald-500 rounded-md mb-2 mt-4"
            @click="returnToQuizzes()"
          >
            Return to Quizzes
          </button>
        </div>
      </div>

      <div v-else>
        <!--- Question 1 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 1:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.ms_q1 }} / 2
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter corresponding to the object or objects that were
            formed by revolving the wire-frame shape shown on the left about an
            axis. There may be more than one answer per problem.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjEucG5nIiwiaWF0IjoxNjk2MzA0MjI0LCJleHAiOjE3Mjc4NDAyMjR9.oKogT5Zy114eMqn9uToizfqqVzY_ejJpAN4UI5SblCU&t=2023-10-03T03%3A37%3A04.930Z"
          />
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q1A" class="flex-1 text-left"
                >A
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q1', 'A'),
                  }"
                >
                </span>
              </label>
              <input
                type="checkbox"
                id="ms_q1A"
                value="A"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q1"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q1B" class="flex-1 text-left"
                >B
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q1', 'B'),
                  }"
                >
                </span>
              </label>
              <input
                type="checkbox"
                id="ms_q1B"
                value="B"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q1"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q1C" class="flex-1 text-left"
                >C
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q1', 'C'),
                  }"
                >
                </span>
              </label>
              <input
                type="checkbox"
                id="ms_q1C"
                value="C"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q1"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q1D" class="flex-1 text-left"
                >D
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q1', 'D'),
                  }"
                >
                </span>
              </label>
              <input
                type="checkbox"
                id="ms_q1D"
                value="D"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q1"
              />
            </div>
          </div>
        </div>

        <!--- Question 2 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 2:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.ms_q2 }} / 2
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter corresponding to the object or objects that were
            formed by revolving the wire-frame shape shown on the left about an
            axis. There may be more than one answer per problem.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjIucG5nIiwiaWF0IjoxNjk2ODgxNDU3LCJleHAiOjE3Mjg0MTc0NTd9.ylsD_sbjWCNWmLhbo9XnBBLVwTsjxTnMlAXCTitZ0sk&t=2023-10-09T19%3A57%3A37.016Z"
          />
          <!---HTML of options for each --->
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q2A" class="flex-1 text-left"
                >A<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q2', 'A'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q2A"
                value="A"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q2"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q2B" class="flex-1 text-left"
                >B<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q2', 'B'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q2B"
                value="B"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q2"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q2C" class="flex-1 text-left"
                >C<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q2', 'C'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q2C"
                value="C"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q2"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q2D" class="flex-1 text-left"
                >D<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q2', 'D'),
                  }"
                >
                </span
              ></label>
              <input
                type="checkbox"
                id="ms_q2D"
                value="D"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q2"
              />
            </div>
          </div>
        </div>

        <!--- Question 3 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 3</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.ms_q3 }} / 3
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter corresponding to the object or objects that were
            formed by revolving the wire-frame shape shown on the left about an
            axis. There may be more than one answer per problem.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjMucG5nIiwiaWF0IjoxNjk2ODgxNjM3LCJleHAiOjE3Mjg0MTc2Mzd9.-C-vIoh6MUGjMOHlGk8DkQjaMUgHPyqTqCfzdgGIsKw&t=2023-10-09T20%3A00%3A37.652Z"
          />
          <!---HTML of options for each --->
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q3A" class="flex-1 text-left"
                >A<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q3', 'A'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q3A"
                value="A"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q3"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q3B" class="flex-1 text-left"
                >B<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q3', 'B'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q3B"
                value="B"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q3"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q3C" class="flex-1 text-left"
                >C<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q3', 'C'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q3C"
                value="C"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q3"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q3D" class="flex-1 text-left"
                >D<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q3', 'D'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q3D"
                value="D"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q3"
              />
            </div>
          </div>
        </div>

        <!--- Question 4 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 4:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.ms_q4 }} / 1
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter corresponding to the object or objects that were
            formed by revolving the wire-frame shape shown on the left about an
            axis. There may be more than one answer per problem.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjQucG5nIiwiaWF0IjoxNjk2ODgxNzQ3LCJleHAiOjE3Mjg0MTc3NDd9.u35r4kjr6beo7q4Zs12s-jXYlK8CYJn_oLccyJeCI3M&t=2023-10-09T20%3A02%3A27.841Z"
          />
          <!---HTML of options for each --->
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q4A" class="flex-1 text-left"
                >A<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q4', 'A'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q4A"
                value="A"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q4"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q4B" class="flex-1 text-left"
                >B<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q4', 'B'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q4B"
                value="B"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q4"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q4C" class="flex-1 text-left"
                >C<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q4', 'C'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q4C"
                value="C"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q4"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q4D" class="flex-1 text-left"
                >D<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q4', 'D'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q4D"
                value="D"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q4"
              />
            </div>
          </div>
        </div>

        <!--- Question 5 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 5:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.ms_q5 }} / 2
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter corresponding to the object or objects that were
            formed by revolving the wire-frame shape shown on the left about an
            axis. There may be more than one answer per problem.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question5.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjUucG5nIiwiaWF0IjoxNjk2ODgzMjUzLCJleHAiOjE3Mjg0MTkyNTN9.sLn9-hKjylKBAso0BhiwrT8Y5hM_h5rPVYZKl_fvlOg&t=2023-10-09T20%3A27%3A33.975Z"
          />
          <!---HTML of options for each --->
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q5A" class="flex-1 text-left"
                >A<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q5', 'A'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q5A"
                value="A"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q5"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q5B" class="flex-1 text-left"
                >B<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q5', 'B'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q5B"
                value="B"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q5"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q5C" class="flex-1 text-left"
                >C<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q5', 'C'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q5C"
                value="C"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q5"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q5D" class="flex-1 text-left"
                >D<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q5', 'D'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q5D"
                value="D"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q5"
              />
            </div>
          </div>
        </div>

        <!--- Question 6 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 6:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.ms_q6 }} / 2
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter corresponding to the object or objects that were
            formed by revolving the wire-frame shape shown on the left about an
            axis. There may be more than one answer per problem.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjYucG5nIiwiaWF0IjoxNjk2ODgzNTI4LCJleHAiOjE3Mjg0MTk1Mjh9.H1XhXjsWba1uz1V4Xa5U-udRKtzWoWNXTpLmCPWFv-w&t=2023-10-09T20%3A32%3A09.473Z"
          />
          <!---HTML of options for each --->
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q6A" class="flex-1 text-left"
                >A<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q6', 'A'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q6A"
                value="A"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q6"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q6B" class="flex-1 text-left"
                >B<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q6', 'B'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q6B"
                value="B"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q6"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q6C" class="flex-1 text-left"
                >C<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q6', 'C'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q6C"
                value="C"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q6"
              />
            </div>
            <div
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label for="ms_q6D" class="flex-1 text-left"
                >D<span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrect('ms_q6', 'D'),
                  }"
                ></span
              ></label>
              <input
                type="checkbox"
                id="ms_q6D"
                value="D"
                class="form-checkbox h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleSelectQuestions.ms_q6"
              />
            </div>
          </div>
        </div>

        <!--- Question 7 --->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 7:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.sc_q1 }} / 4
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Indicate the axis about which the 2-D shape was revolved around to
            obtain the given solid.
          </h3>
          <!--- Individual subchoice questions -->
          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question7_a.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjdfYS5wbmciLCJpYXQiOjE2OTY4ODUxOTcsImV4cCI6MTcyODQyMTE5N30.VUjNAPVaODj9kQBx5G22ir22Ogr69v-G68BLjHEjgnY&t=2023-10-09T20%3A59%3A57.339Z"
            />
            <div class="flex flex-col">
              <label for="selectBox1" class="mb-2 text-white"
                >Revolved About Which Axis:
              </label>
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[0]"
                  id="selectBox1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="X">X</option>
                  <option value="Z">Z</option>
                  <option value="X2">X2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC(
                      'sc_q1',
                      0,
                      selectedOptions.subChoiceQuestions.sc_q1[0]
                    ),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question7_b.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjdfYi5wbmciLCJpYXQiOjE2OTY4ODUxNzUsImV4cCI6MTcyODQyMTE3NX0.ktHEN-ZOSkIDXZmUNRDdvGm1Y_2Fr_ysxNBLD6jmMb4&t=2023-10-09T20%3A59%3A35.374Z"
            />
            <div class="flex flex-col">
              <label for="selectBox2" class="mb-2 text-white"
                >Revolved About Which Axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[1]"
                  id="selectBox2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="X">X</option>
                  <option value="Z">Z</option>
                  <option value="Z2">Z2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC(
                      'sc_q1',
                      1,
                      selectedOptions.subChoiceQuestions.sc_q1[1]
                    ),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question7_c.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjdfYy5wbmciLCJpYXQiOjE2OTY4ODU0MDEsImV4cCI6MTcyODQyMTQwMX0._kEeVEZWMQF2MaR3k2aD6PWcKkMW6Bezzejj9Z_8NU4&t=2023-10-09T21%3A03%3A22.009Z"
            />
            <div class="flex flex-col">
              <label for="selectBox3" class="mb-2 text-white"
                >Revolved About Which Axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[2]"
                  id="selectBox3"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="X">Z</option>
                  <option value="Z">X</option>
                  <option value="Z2">Z2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC(
                      'sc_q1',
                      2,
                      selectedOptions.subChoiceQuestions.sc_q1[2]
                    ),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question7_d.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjdfZC5wbmciLCJpYXQiOjE2OTY4ODU0MTQsImV4cCI6MTcyODQyMTQxNH0.dNsqHJ1-eT1mue9UQW5p-nztZF9Js9Kl-y3wqMdyBP8&t=2023-10-09T21%3A03%3A34.771Z"
            />
            <div class="flex flex-col">
              <label for="selectBox4" class="mb-2 text-white"
                >Revolved About Which Axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[3]"
                  id="selectBox4"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                  <option value="X">X</option>
                  <option value="Z2">Z2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC(
                      'sc_q1',
                      3,
                      selectedOptions.subChoiceQuestions.sc_q1[3]
                    ),
                  }"
                ></span>
              </div>
            </div>
          </div>
        </div>

        <!--- Question 8 -->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 8:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.msc_q1 }} / 8
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Indicate the axis about which the 2-D shape was revolved around to
            obtain the given solid.
          </h3>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question10_a.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjEwX2EucG5nIiwiaWF0IjoxNjk2ODkzNjgwLCJleHAiOjE3Mjg0Mjk2ODB9.njpIRGyNJAXbDQvEP2BlD7cRLCPVdmkJvx81NR7nhf0&t=2023-10-09T23%3A21%3A21.396Z"
            />
            <div class="flex flex-col">
              <label for="selectBoxa1" class="mb-2 text-white"
                >Revolved (in degrees):</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[0]"
                  id="selectBoxa1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="90">90°</option>
                  <option value="180">180°</option>
                  <option value="270">270°</option>
                  <option value="360">360°</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 0, '180'),
                  }"
                ></span>
              </div>

              <label for="selectBoxa2" class="mb-2 text-white"
                >About which axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[1]"
                  id="selectBoxa2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                  <option value="X">X</option>
                  <option value="X2">X2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 1, 'X'),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question10_b.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjEwX2IucG5nIiwiaWF0IjoxNjk2ODk1MTU3LCJleHAiOjE3Mjg0MzExNTd9.EDFWsgoEQZ_ZKUTP2TO6esNBe43rx3Y4yRxo-2AgTJ0&t=2023-10-09T23%3A45%3A57.546Z"
            />
            <div class="flex flex-col">
              <label for="selectBoxb1" class="mb-2 text-white"
                >Revolved (in degrees):</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[2]"
                  id="selectBoxb1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="90">90°</option>
                  <option value="180">180°</option>
                  <option value="270">270°</option>
                  <option value="360">360°</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 2, '270'),
                  }"
                ></span>
              </div>

              <label for="selectBoxb2" class="mb-2 text-white"
                >About which axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[3]"
                  id="selectBoxb2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                  <option value="X">X</option>
                  <option value="Z2">Z2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 3, 'Z2'),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question10_c.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjEwX2MucG5nIiwiaWF0IjoxNjk2ODk1NTc3LCJleHAiOjE3Mjg0MzE1Nzd9.SN_XsaMKn8QdymDulgO5ec52Z7tPVhngvsBWL40AMDI&t=2023-10-09T23%3A52%3A57.955Z"
            />
            <div class="flex flex-col">
              <label for="selectBoxc1" class="mb-2 text-white"
                >Revolved (in degrees):</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[4]"
                  id="selectBoxc1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="90">90°</option>
                  <option value="180">180°</option>
                  <option value="270">270°</option>
                  <option value="360">360°</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 4, '270'),
                  }"
                ></span>
              </div>
              <label for="selectBoxc2" class="mb-2 text-white"
                >About which axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[5]"
                  id="selectBoxc2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                  <option value="X">X</option>
                  <option value="X2">X2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 5, 'X2'),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <img
              class="w-1/3 border-black border-4 rounded-lg mb-2"
              src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module1_Surfaces_Solids/m1_question10_d.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUxX1N1cmZhY2VzX1NvbGlkcy9tMV9xdWVzdGlvbjEwX2QucG5nIiwiaWF0IjoxNjk2ODk1NjE1LCJleHAiOjE3Mjg0MzE2MTV9.qkVZjfQuNF0ToBCwL8ekeqyq7bX_rdKgYiNpsZTI648&t=2023-10-09T23%3A53%3A35.913Z"
            />
            <div class="flex flex-col">
              <label for="selectBoxd1" class="mb-2 text-white"
                >Revolved (in degrees):</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[6]"
                  id="selectBoxd1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="90">90°</option>
                  <option value="180">180°</option>
                  <option value="270">270°</option>
                  <option value="360">360°</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 6, '90'),
                  }"
                ></span>
              </div>
              <label for="selectBoxd2" class="mb-2 text-white"
                >About which axis:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.multipleSubchoiceQuestions.msc_q1[7]"
                  id="selectBoxd2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                  <option value="X">X</option>
                  <option value="Z2">Z2</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMSC('msc_q1', 7, 'Z'),
                  }"
                ></span>
              </div>
            </div>
          </div>
        </div>

        <button v-if="!submittedQuiz" @click="checkAnswers">
          Submit Answers
        </button>
        <button v-else @click="router.push(basePath)">Return to Quizzes</button>
      </div>
    </div>
  
</template>
