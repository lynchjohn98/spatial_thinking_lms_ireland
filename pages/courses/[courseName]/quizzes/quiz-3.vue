<script setup>
import { ref, reactive, onMounted } from "vue";
import { updateQuizData } from "@/services/generateQuizData.js";
import { globalVariables } from "@/services/globalVariables.js";

const router = useRouter();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();

const submittedQuiz = ref(false);
const isLoading = ref(false);
const userScore = ref(0);
const maxScore = ref(0);
const studentAttempts = ref(0);
const canTakeQuiz = ref(true);

//How to get the id of the class
const class_id = router.currentRoute.value.params.courseName;
const match = class_id.match(/(\d+)$/); // This regex matches one or more digits at the end of the string.
const final_class_id = ref(0);
final_class_id.value = match[1];

//Set up the program to get the quiz data from the user entry and the correct answers
const selectedOptions = reactive({
  multipleChoiceQuestions: {},
  multipleSelectQuestions: {},
  subChoiceQuestions: {
    sc_q1: ["", "", ""], //We need a blank string for each selected option.
    sc_q2: ["", "", "", "", "", ""],
  },
  multipleSubchoiceQuestions: {},
});

const correctOptions = reactive({
  multipleChoiceQuestions: {},
  multipleSelectQuestions: {},
  subChoiceQuestions: {
    sc_q1: ["C", "D", "A"],
    sc_q2: ["Y", "Y", "X", "X", "Y", "Z"],
  },
  multipleSubchoiceQuestions: {},
});

//Store scores of each user question here:
const questionScores = reactive({
  sc_q1: null,
  sc_q2: null,
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
    console.log(userAnswers);
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
    console.log("Here i am ");
    const correctAnswers = correctOptions.multipleSubchoiceQuestions[question];
    const userAnswers = selectedOptions.multipleSubchoiceQuestions[question];

    if (userAnswers.includes("")) {
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
    
    Object.values(correctOptions.subChoiceQuestions).reduce(
      (acc, answers) => acc + answers.length,
      0
    );
    
}

function isCorrectMC(questionId, option) {
  return (
    selectedOptions.multipleSelectQuestions[questionId].includes(option) &&
    correctOptions.multipleSelectQuestions[questionId].includes(option)
  );
}

function isCorrectMS(questionId, option) {
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
    .eq("quiz_id", 4)
    .order("id", { ascending: false });
  if (studentError) {
    console.log("Error fetching student data", studentError);
  } else {
    console.log("Found this data", studentData);
    //Get quiz visibility data
    const { data: quizData, error: quizError } = await client
      .from("classes_settings")
      .select("quiz_visibility")
      .eq("class_id", final_class_id.value);
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
          console.log("CAN");
          canTakeQuiz.value = false; //user is over the max allowed attempts
        }
      } else {
        canTakeQuiz.value = true;
      }
    }
    console.log("TESTING");
  }
});

//Code to run after the student has submitted the quiz
async function submitStudentData() {
  let attemptPayload = studentAttempts.value + 1;
  const { data: quizData, error: quizError } = await client
    .from("grades")
    .insert([
      {
        class_id: final_class_id.value,
        student_id: user.value.id,
        quiz_id: 4,
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
  <CourseSidebar>
    <div class="quiz-fullpage">
      <div
        v-if="isLoading"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="loader"></div>
        <h3 class="text-white mt-4">Grading Quiz...</h3>
      </div>

      <div class="title rounded-lg flex justify-between items-center">
        Module 3: Isometric Drawings & Coded Plans
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
              {{ questionScores.sc_q1 }} / 3
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Indicate the axis about which the 2-D shape was revolved around to
            obtain the given solid.
          </h3>
          <img
            class="w-4/5 border-black border-4 rounded-lg mb-2"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module3_Isometric_Drawings_Coded_Plans/m3_q5.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUzX0lzb21ldHJpY19EcmF3aW5nc19Db2RlZF9QbGFucy9tM19xNS5wbmciLCJpYXQiOjE2OTc1MjU4OTksImV4cCI6MTcyOTA2MTg5OX0.g5qwnAOPosZjtPsdSiln493Fb1X48Ho1QSW3VFTc47g&t=2023-10-17T06%3A58%3A20.571Z"
          />
          <!--- Individual subchoice questions -->
          <div class="flex items-center space-x-4 justify-between">
            <div class="flex flex-col">
              <label for="selectBox1" class="mb-2 text-white"
                >Coded Plan #1:
              </label>
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[0]"
                  id="selectBox1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
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
            <div class="flex flex-col">
              <label for="selectBox2" class="mb-2 text-white"
                >Coded Plan #2:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[1]"
                  id="selectBox2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
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
            <div class="flex flex-col">
              <label for="selectBox3" class="mb-2 text-white"
                >Coded Plan #3:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q1[2]"
                  id="selectBox3"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
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
        </div>

        <!--- Question 2 -->
        <div
          class="question multiple-select-question bg-gradient-to-b from-emerald-500 to-green-600"
        >
          <h2 class="font-bold text-white text-3xl flex">
            <div class="flex-grow">Question 2:</div>
            <span class="" v-if="submittedQuiz">
              {{ questionScores.sc_q2 }} / 6
            </span>
          </h2>
          <h3 class="font-bold text-white lg:p-1 md:p-2 sm:m-2">
            Select the letter (W, X, Y, or Z) on the coded plan that coresponds
            to the view shown by the isometric drawing:
          </h3>
          <img
            class="w-4/5 border-black border-4 rounded-lg mb-2"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/sign/Module3_Isometric_Drawings_Coded_Plans/m3_q6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJNb2R1bGUzX0lzb21ldHJpY19EcmF3aW5nc19Db2RlZF9QbGFucy9tM19xNi5wbmciLCJpYXQiOjE2OTc1MjcwMzcsImV4cCI6MTcyOTA2MzAzN30.O4z4qk0X9qbjdGEu-dolphpcxBvTy2QZRnTzmGiidLw&t=2023-10-17T07%3A17%3A18.668Z"
          />
          <div class="flex items-center space-x-4 justify-between">
            <div class="flex flex-col">
              <label for="selectBoxa1" class="mb-2 text-white"
                >Isometric View #1:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q2[0]"
                  id="selectBoxa1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="W">W</option>
                  <option value="X">X</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC('sc_q2', 0,  selectedOptions.subChoiceQuestions.sc_q2[0]),
                  }"
                ></span>
              </div>
             
              <label for="selectBoxa2" class="mb-2 text-white"
                >Isometric View #2:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q2[1]"
                  id="selectBoxa2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="W">W</option>
                  <option value="X">X</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC('sc_q2', 1, selectedOptions.subChoiceQuestions.sc_q2[1]),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <div class="flex flex-col">
              <label for="selectBoxb1" class="mb-2 text-white"
                >Isometric View #3:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q2[2]"
                  id="selectBoxb1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="W">W</option>
                  <option value="X">X</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC('sc_q2', 2, selectedOptions.subChoiceQuestions.sc_q2[2]),
                  }"
                ></span>
              </div>

              <label for="selectBoxb2" class="mb-2 text-white"
                >Isometric View #4:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q2[3]"
                  id="selectBoxb2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="W">W</option>
                  <option value="X">X</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC('sc_q2', 3, selectedOptions.subChoiceQuestions.sc_q2[3]),
                  }"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 justify-between">
            <div class="flex flex-col">
              <label for="selectBoxc1" class="mb-2 text-white"
                >Isometric View #5:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q2[4]"
                  id="selectBoxc1"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="W">W</option>
                  <option value="X">X</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC('sc_q2', 4, selectedOptions.subChoiceQuestions.sc_q2[4]),
                  }"
                ></span>
              </div>
              <label for="selectBoxc2" class="mb-2 text-white"
                >Isometric View #6:</label
              >
              <div class="flex items-center">
                <select
                  v-model="selectedOptions.subChoiceQuestions.sc_q2[5]"
                  id="selectBoxc2"
                  class="w-full p-2 border rounded-md text-black"
                >
                  <option value="" selected disabled>[ Select ]</option>
                  <option value="W">W</option>
                  <option value="X">X</option>
                  <option value="Y">Y</option>
                  <option value="Z">Z</option>
                </select>
                <span
                  v-if="submittedQuiz"
                  :class="{
                    correct: isCorrectSC('sc_q2', 5, selectedOptions.subChoiceQuestions.sc_q2[5]),
                  }"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <button v-if="!submittedQuiz" @click="checkAnswers">
          Submit Answers
        </button>
        <button v-else @click="returnToQuizzes">Return to Quizzes</button>
      </div>
    </div>
  </CourseSidebar>
</template>
