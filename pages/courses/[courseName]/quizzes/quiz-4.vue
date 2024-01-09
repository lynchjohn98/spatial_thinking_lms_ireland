<script setup>
import { ref, onMounted } from "vue";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { useCourseStore } from "@/stores/useCourseStore";

const courseStore = useCourseStore();
const globalStore = useGlobalStore();

const router = useRouter();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();

const submittedQuiz = ref(false);
const isLoading = ref(false);
const userScore = ref(0);
const maxScore = ref(0);
const studentAttempts = ref(0);
const canTakeQuiz = ref(true);

const returnToQuizzes = () => {
  console.log(courseStore.course_name);
  router.push("/courses/" + courseStore.course_fullUrl + "/quizzes/");
};

//Set up the program to get the quiz data from the user entry and the correct answers
const selectedOptions = reactive({
  multipleChoiceQuestions: {
    mc_q1: "",
    mc_q2: "",
    mc_q3: "",
    mc_q4: "",
    mc_q5: "",
  },
  multipleSelectQuestions: {},
  subChoiceQuestions: {},
  multipleSubchoiceQuestions: {},
});

const correctOptions = reactive({
  multipleChoiceQuestions: {
    mc_q1: ["B"],
    mc_q2: ["A"],
    mc_q3: ["A"], //Question 13
    mc_q4: ["B"], //Question 14
    mc_q5: ["A"], //Question 15
  },
  multipleSelectQuestions: {},
  subChoiceQuestions: {},
  multipleSubchoiceQuestions: {},
});

//Store scores of each user question here:
const questionScores = reactive({
  mc_q1: null,
  mc_q2: null,
  mc_q3: null,
  mc_q4: null,
  mc_q5: null,
});

function resetQuestionScores() {
  console.log("Reset question scores called");
  for (let question in questionScores) {
    questionScores[question] = null;
  }
}

function gradeQuestions() {
  console.log("Inside the mai nfunction");
  // MultipleChoice question grading
  for (let question in selectedOptions.multipleChoiceQuestions) {
    const correctAnswer = correctOptions.multipleChoiceQuestions[question][0]; // assuming the correct answer is the first element of the array
    const userAnswer = selectedOptions.multipleChoiceQuestions[question];

    if (!userAnswer) {
      alert(
        `Please make sure you make a selection for ${formatQuestionIDMC(
          question
        )}.`
      );
      resetQuestionScores();
      return false;
    }
    console.log("In grade questions before the score increase");
    // Check if the user's answer matches the correct answer
    questionScores[question] = userAnswer === correctAnswer ? 1 : 0;
  }
  console.log("Finished grading");
  return true;
}

function updateFinalScores() {
  userScore.value = Object.values(questionScores).reduce(
    (acc, score) => acc + score,
    0
  );
  maxScore.value = Object.values(correctOptions.multipleChoiceQuestions).reduce(
    (acc, answers) => acc + answers.length,
    0
  );
}

function isCorrectMC(questionId, option) {
  return (
    selectedOptions.multipleChoiceQuestions[questionId] === option &&
    correctOptions.multipleChoiceQuestions[questionId][0] === option
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
function formatQuestionIDMC(questionID) {
  console.log(questionID);
  let formattedQuestion = questionID
    .replace("mc_", "Question ")
    .replace("q", "");
  return formattedQuestion;
}

onMounted(async () => {
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
});

//Code to run after the student has submitted the quiz
async function submitStudentData() {
  let attemptPayload = studentAttempts.value + 1;
  const { data: quizData, error: quizError } = await client
    .from("grades")
    .insert([
      {
        class_id: courseStore.course_id ,
        student_id: user.value.id,
        quiz_id: 7,
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
  <CourseSidebar
    :classType="courseStore.course_type"
    :courseName="courseStore.course_name"
    :username="globalStore.username"
  >
    <div class="quiz-fullpage">
      <div
        v-if="isLoading"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="loader"></div>
        <h3 class="text-white mt-4">Grading Quiz...</h3>
      </div>

      <div class="title rounded-lg flex justify-between items-center">
        Module 4 Quiz: Flat Patterns
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

      <!-- Starting Quiz -->
      <div v-else>
        <!-- Question 1 Rectnagular Prism-->
        <div class="question multiple-select-question bg-emerald-700">
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 1:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.mc_q1 }} / 1
            </span>
          </h2>
          <h3 class="font-bold text-white text-2xl lg:p-1 md:p-2 sm:m-2">
            The rectangular prism shown in isometric below has markings on each
            of its four long sides. Choose the panel for the flat pattern so
            that when folded up, the correct object is formed.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module6_FlatPatterns/20_m6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGU2X0ZsYXRQYXR0ZXJucy8yMF9tNi5wbmciLCJpYXQiOjE3MDIzNTcyMTEsImV4cCI6MTczMzg5MzIxMX0.kQw8qwE__JHB4f3c2Z9D614SBBtTXIwuWIbV6_EZw28&t=2023-12-12T04%3A59%3A50.513Z"
          />
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              v-for="option in ['A', 'B', 'C']"
              :key="option"
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label :for="'mc_q1' + option" class="flex-1 text-left">
                {{ option }}
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMC('mc_q1', option),
                  }"
                ></span>
              </label>
              <input
                type="radio"
                :id="'mc_q1' + option"
                :value="option"
                class="form-radio h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleChoiceQuestions.mc_q1"
                name="mc_q1"
              />
            </div>
          </div>
        </div>

        <!-- Question 2 Rectangular Prism-->
        <div class="question multiple-select-question bg-emerald-700">
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 2:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.mc_q2 }} / 1
            </span>
          </h2>
          <h3 class="font-bold text-white text-2xl lg:p-1 md:p-2 sm:m-2">
            The rectangular prism shown in isometric below has markings on each
            of its four long sides. Choose the panel for the flat pattern so
            that when folded up, the correct object is formed.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module6_FlatPatterns/21_m6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGU2X0ZsYXRQYXR0ZXJucy8yMV9tNi5wbmciLCJpYXQiOjE3MDIzNTg0MTMsImV4cCI6MTczMzg5NDQxM30.E2B3s2Ity7lP9OMJiQPsomvlBfGBI-q_nMygzb4dUv0&t=2023-12-12T05%3A19%3A50.200Z"
          />
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              v-for="option in ['A', 'B', 'C']"
              :key="option"
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label :for="'mc_q2' + option" class="flex-1 text-left">
                {{ option }}
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMC('mc_q2', option),
                  }"
                ></span>
              </label>
              <input
                type="radio"
                :id="'mc_q2' + option"
                :value="option"
                class="form-radio h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleChoiceQuestions.mc_q2"
                name="mc_q2"
              />
            </div>
          </div>
        </div>

        <!-- Question 3 Isometric View -->
        <div class="question multiple-select-question bg-emerald-700">
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 3:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.mc_q3 }} / 1
            </span>
          </h2>
          <h3 class="font-bold text-white text-2xl lg:p-1 md:p-2 sm:m-2">
            The rectangular prism shown in isometric below has markings on each
            of its four long sides. Choose the panel for the flat pattern so
            that when folded up, the correct object is formed.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module6_FlatPatterns/13_m6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGU2X0ZsYXRQYXR0ZXJucy8xM19tNi5wbmciLCJpYXQiOjE3MDIzNTg1NTQsImV4cCI6MTczMzg5NDU1NH0.EtYsrWNCR0SufI1Ec0PqSzJyxeX9Q5-9tkulUjNAUqo&t=2023-12-12T05%3A22%3A11.142Z"
          />
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              v-for="option in ['A', 'B', 'C']"
              :key="option"
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label :for="'mc_q3' + option" class="flex-1 text-left">
                {{ option }}
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMC('mc_q3', option),
                  }"
                ></span>
              </label>
              <input
                type="radio"
                :id="'mc_q3' + option"
                :value="option"
                class="form-radio h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleChoiceQuestions.mc_q3"
                name="mc_q3"
              />
            </div>
          </div>
        </div>

        <!-- Question 4 Isometric View -->
        <div class="question multiple-select-question bg-emerald-700">
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 4:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.mc_q4 }} / 1
            </span>
          </h2>
          <h3 class="font-bold text-white text-2xl lg:p-1 md:p-2 sm:m-2">
            The rectangular prism shown in isometric below has markings on each
            of its four long sides. Choose the panel for the flat pattern so
            that when folded up, the correct object is formed.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module6_FlatPatterns/14_m6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGU2X0ZsYXRQYXR0ZXJucy8xNF9tNi5wbmciLCJpYXQiOjE3MDIzNTg2MTcsImV4cCI6MTczMzg5NDYxN30.PGDvR__uMfaCJA8DtEPayc-Shqqbzk5OSCS_AJA9Ung&t=2023-12-12T05%3A23%3A14.456Z"
          />
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              v-for="option in ['A', 'B', 'C']"
              :key="option"
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label :for="'mc_q4' + option" class="flex-1 text-left">
                {{ option }}
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMC('mc_q4', option),
                  }"
                ></span>
              </label>
              <input
                type="radio"
                :id="'mc_q4' + option"
                :value="option"
                class="form-radio h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleChoiceQuestions.mc_q4"
                name="mc_q4"
              />
            </div>
          </div>
        </div>

        <!-- Question 5 Isometric View -->
        <div class="question multiple-select-question bg-emerald-700">
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 5:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.mc_q5 }} / 1
            </span>
          </h2>
          <h3 class="font-bold text-white text-2xl lg:p-1 md:p-2 sm:m-2">
            The rectangular prism shown in isometric below has markings on each
            of its four long sides. Choose the panel for the flat pattern so
            that when folded up, the correct object is formed.
          </h3>
          <img
            class="ml-5 question-image justify-center align-center border-black border-4 rounded-lg"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module6_FlatPatterns/15_m6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGU2X0ZsYXRQYXR0ZXJucy8xNV9tNi5wbmciLCJpYXQiOjE3MDIzNTg3NjYsImV4cCI6MTczMzg5NDc2Nn0.4F2Zst1hW969KBUNR0iEolJASo2gxpr-uWLNmatg768&t=2023-12-12T05%3A25%3A43.133Z"
          />
          <div class="options-container p-4 space-y-4 flex flex-col text-white">
            <div
              v-for="option in ['A', 'B', 'C']"
              :key="option"
              class="option flex flex-1 p-2 rounded cursor-pointer hover:bg-gray-700 transition duration-300 shadow-md box-border"
            >
              <label :for="'mc_q5' + option" class="flex-1 text-left">
                {{ option }}
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectMC('mc_q5', option),
                  }"
                ></span>
              </label>
              <input
                type="radio"
                :id="'mc_q5' + option"
                :value="option"
                class="form-radio h-5 w-5 text-gray-600"
                v-model="selectedOptions.multipleChoiceQuestions.mc_q5"
                name="mc_q5"
              />
            </div>
          </div>
        </div>
      </div>
      <button v-if="!submittedQuiz" @click="checkAnswers">
        Submit Answers
      </button>
      <button v-else @click="returnToQuizzes">Return to Quizzes</button>
    </div>
  </CourseSidebar>
</template>

<!--
  https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module6_FlatPatterns/14_m6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGU2X0ZsYXRQYXR0ZXJucy8xNF9tNi5wbmciLCJpYXQiOjE3MDIzNTg1ODMsImV4cCI6MTczMzg5NDU4M30.Osuh0C5YnmcDn1RHnnscMb3I_hFptyIDH2iue4rxo1s&t=2023-12-12T05%3A22%3A40.349Z


-->
