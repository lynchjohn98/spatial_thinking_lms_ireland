<script setup>
import { ref, onMounted, reactive } from "vue";
import { useQuizStore } from "@/stores/quizStore.js";
import { useCourseStore } from "@/stores/courseStore.js";
import { handleSubmitQuiz } from "@/services/quizFunctions.js";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";


const userStore = useUserStore();
//Get old url for reference later
const router = useRouter();
const basePath = router.currentRoute.value.fullPath.replace(/\/quiz-\d+$/, "");

//Get objects
const user = useSupabaseUser();
const client = useSupabaseClient();
const quizStore = useQuizStore();
const courseStore = useCourseStore();

//Set quiz settings
const quizId = 3;
const numberOfQuestions = 13;

//Get quiz scores ready
const finalScore = ref(0);
const submittedQuiz = ref(false);
const selectedAnswers = reactive({});
const questionStatus = reactive({});

//Get current student attempts
const studentAttempts = ref(0);

//Aux methods
function selectOption(questionId, optionId) {
  selectedAnswers[questionId] = optionId;
}
async function submitQuiz() {
  const results = await handleSubmitQuiz(
    quizStore,
    selectedAnswers,
    window.confirm
  );
  if (results.submitted) {
    submittedQuiz.value = true;
    finalScore.value = results.score;
    questionStatus.value = results.questionStatusUpdates; // Update question status with details

    console.log(results);

    //Create payload and push attempts into the backend
    const { data, error } = await client.from("grades").insert([
      {
        class_id: courseStore.getCourseId,
        student_id: userStore.getUserId,
        quiz_id: 3,
        score: finalScore.value,
        attempt_count: attemptPayload,
      },
    ]);
    if (error) {
      console.log("Error inserting payload", error);
    } else {
      console.log("Quiz data inserted successfully", data);
    }
  }
}

onMounted(async () => {
  //Check if user is over alloted attempts for the quiz:
  //here
  await quizStore.fetchQuizData(client, quizId, numberOfQuestions);
  // Computed property to filter only multiple choice questions, change for question types
  const multipleChoiceQuestions = computed(() => {
    return quizStore.questions.filter(
      (q) => q.question_type === "multiple_choice"
    );
  });
  quizStore.setQuestions(multipleChoiceQuestions.value);
});
</script>

<template>
  <div class="bg-emerald-600 flex flex-col quiz-fullpage">
    <div class="text-white mb-6">
      <button v-if="!submittedQuiz" @click="submitQuiz">
        Submit Quiz and Return to All Quizzes
      </button>
      <button v-else @click="router.push(basePath)">
        <Icon class="red-icon" icon="bx:bx-home" inline />
        Return to All Quizzes
      </button>
    </div>

    <h3
      class="text-white font-bold text-4xl mb-4 ml-4 flex justify-between items-center"
    >
      {{ quizStore.description }}
      <span class="mr-8" v-if="submittedQuiz"
        >Final score: {{ finalScore }} / {{ quizStore.questions.length }}</span
      >
    </h3>

    <div class="space-y-6">
      <div v-for="(question, index) in quizStore.questions" :key="question.id">
        <!-- Multiple Choice questions -->
        <div
          v-if="question.question_type === 'multiple_choice'"
          class="bg-emerald-500 p-4 rounded-lg"
        >
          <!-- Original way when solution-->
          <div class="text-white text-3xl font-bold mb-2">
            Question {{ index + 1 }} of {{ quizStore.questions.length }}:
          </div>
          <div class="text-white text-2xl mb-4">
            {{ question.question_text }}
          </div>
          <img
            class="rounded-lg mb-4 border-4 border-black"
            :src="question.images[0].image_url"
          />
          <!-- ... -->
          <div
            v-for="option in question.options"
            :key="option.id"
            class="relative"
          >
            <label
              :for="`option_${option.id}`"
              class="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                :id="`option_${option.id}`"
                :name="`question_${question.id}`"
                :value="option.id"
                @change="selectOption(question.id, option.id)"
                :disabled="submittedQuiz"
                class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:focus:ring-emerald-600"
              />
              <span class="text-white text-xl font-medium">{{
                option.option_text
              }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="!submittedQuiz"
      @click="submitQuiz"
      class="mt-6 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
    >
      Submit Quiz
    </button>
    <button
      v-else
      @click="router.push(basePath)"
      class="mt-6 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
    >
      Quiz Submitted
    </button>
  </div>
</template>
