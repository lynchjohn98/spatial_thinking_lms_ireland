<script setup>
import { ref, onMounted, reactive } from "vue";
import { useQuizStore } from "@/stores/quizStore.js";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { handleSubmitQuiz } from "@/services/quizFunctions.js";
import { useRouter } from "vue-router";

//Get objects
const client = useSupabaseClient();
const quizStore = useQuizStore();
const courseStore = useCourseStore();

//Get old url for reference later
const router = useRouter();
const basePath = "courses/" + courseStore.getCourseURL + "/quizzes";

//Set quiz settings
const quizId = 3;
const numberOfQuestions = 13;

//Get quiz scores ready
const finalScore = ref(0);
const submittedQuiz = ref(false);
const selectedAnswers = reactive({});
const questionStatus = reactive({});

//Buttons on the information page to show answers
const showAnswer1 = ref(false);
const showAnswer2 = ref(false);
const buttonState1 = ref("Show");
const buttonState2 = ref("Show");

function updateButton1() {
  showAnswer1.value = !showAnswer1.value;
  buttonState1.value = showAnswer1.value ? "Hide" : "Show";
}

function updateButton2() {
  showAnswer2.value = !showAnswer2.value;
  buttonState2.value = showAnswer2.value ? "Hide" : "Show";
}
</script>

<template>
  <div class="bg-emerald-600 flex flex-col h-full w-full">
    <NuxtLink :to="`/${basePath}`" class="space-x-2">
      <div class="font-bold text-2xl m-1 whitespace-pre-line text-white">
        <Icon name="openmoji:return-back-button" class="white-icon" size="48" />
        Return to All Quizzes
      </div>
    </NuxtLink>

    <div class="text-center max-w-4xl mx-auto text-white">
      <div class="flex flex-col items-center justify-center p-5">
        <h2 class="font-3xl font-bold text-white">DAT:SR - Instructions</h2>
        <p style="font-weight: bold">
          Please read the following instructions before taking the following
          quiz
        </p>
        <p class="mb-4 mt-4 text-white text-lg">
          This assessment consists of 10 questions designed to see how well you
          can visualize the folding of a pattern to make a three-dimensional
          object. The assessment consists of patterns with shading or designs on
          them. These patterns can be folded to make three-dimensional shapes.
          Each problem shows on pattern, followed by four three-dimensional
          figures. You are to choose the one figure that can be made from the
          pattern. An example is shown below.
        </p>
        <img
          class="rounded-lg border-black border-2"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/datsr/datsr_instructions_1.png"
        />
        <p>
          In the example above the pattern will form a rectangular box, with the
          top, bottom, and one of the short sides shaded.
        </p>
        <p>What is the correct answer to the example shown above?</p>
        <button class="psvt-instructions-button" @click="updateButton1">
          {{ buttonState1 }} Answer
        </button>
        <div
          v-if="showAnswer1"
          :class="{ 'psvt-instructions-answer': true, show: showAnswer1 }"
          class="bg-emerald-700 rounded-md m-6 p-2"
        >
          Look at the answer figures A, B, C, and D. Only one of these can be
          made from the pattern. Answer A is wrong because the top is not
          shaded. Answer B is wrong because one of the long sides is shaded, and
          the pattern shows that the long sides are not shaded. Answer C is
          wrong because the top is not shaded. The correct answer is D because
          the top and one of the short sides are shaded. The shaded bottom is
          hidden from view.
        </div>

        <p>
          In the second example, the pattern will make an object shaped like a
          house. The center of the pattern is the bottom of the figure, as the
          pattern is folded, the roof will be shaded on two opposite sides.
          Notice that each of the four sides of the house has a window.
        </p>
        <img
          class="rounded-lg"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/datsr/datsr_instructions_2.png"
        />
        <p>Notice that the given rotation in this example is more complex.</p>
        <button class="psvt-instructions-button" @click="updateButton2">
          {{ buttonState2 }} Answer
        </button>
        <div
          v-if="showAnswer2"
          :class="{ 'psvt-instructions-answer': true, show: showAnswer2 }"
        >
          Look at the answer figures A, B, C, and D. Only one of these can be
          made from the pattern. Answer A is wrong because the two shaded sides
          of the roof are next to each other, not on opposite sides. Answer B is
          wrong because all four sides of the roof are next to each other, not
          on opposite sides. Answer B is wrong because all four sides of the
          house are supposed to have windows. Answer D is wrong because one
          shaded side of the roof should be visible. The correct answer is C
          because one shaded side of the roof is visible and each visible side
          of the house has a window.
        </div>

        <p>
          Remember the pattern always shows the outside surface of the completed
          figure. Each answer figure is the correct shape, but only one figure
          can be made from the pattern. When you are ready, please use the link
          below to begin the DAT:SR Test.
        </p>
        <NuxtLink
          class="m-2 bg-emerald-500 rounded-lg p-2 text-white text-center"
          :to="
            '/courses/' + courseStore.courseName + '/quizzes/' + ['post-datsr']
          "
          >Begin DAT:SR Post-Test</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
