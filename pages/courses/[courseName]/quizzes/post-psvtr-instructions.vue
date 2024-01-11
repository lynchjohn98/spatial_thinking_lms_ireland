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
  <div class="bg-emerald-600 flex flex-col text-white">
    <NuxtLink :to="`/${basePath}`" class="space-x-2">
      <div class="font-bold text-2xl m-1 whitespace-pre-line text-white">
        <Icon name="openmoji:return-back-button" class="white-icon" size="48" />
        Return to All Quizzes
      </div>
    </NuxtLink>

    <div class="flex flex-col items-center justify-center p-5">
      <h2 class="text-3xl font-bold text-white m-2">PSVT:R - Instructions</h2>
      <p class="text-white text-1xl justify-center">
        Please read the following instructions before taking the following quiz.
        This test consists of 30 questions designed to see how well you can
        visualize the rotation of three-dimensional objects. Shown below is an
        example of the type of question included in the following test.
      </p>
      <img
        class="rounded-lg w-1/4"
        src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/psvt:r_images/psvt_r_instruction_1.png"
      />
      <ol class="text-white m-2 mb-2">
        <p>You are to:</p>
        <li>
          Study how the object in the top line of the question is rotated.
        </li>
        <li>
          Picture in your mind what the object shown in the middle line of the
          question looks like when rotated in exactly the same manner.
        </li>
        <li>
          Select from among the five drawings (A, B, C, D, or E) given in the
          bottom line of the question the one that looks like the object rotated
          in the correct position.
        </li>
      </ol>
      <p class="text-white">
        What is the correct answer to the example shown above?
      </p>
      <button class="psvt-instructions-button" @click="updateButton1">
        {{ buttonState1 }} Answer
      </button>
      <div
        v-if="showAnswer1"
        :class="{ 'psvt-instructions-answer': true, show: showAnswer1 }"
      >
        Answers A, B, C, and E are wrong. Only drawing D looks like the object
        rotated according to the given rotation. Remember that each question has
        only one correct answer.
      </div>

      <div><br /></div>
      <p class="text-white text-1xl">
        Now look at the next example shown below and try to select the drawing
        that looks like the object in the correct position when the given
        rotation is applied.
      </p>
      <img
        class="rounded-lg w-1/4"
        src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/psvt:r_images/psvt_r_instruction_2.png"
      />
      <p>Notice that the given rotation in this example is more complex.</p>
      <button class="psvt-instructions-button" @click="updateButton2">
        {{ buttonState2 }} Answer
      </button>
      <div
        v-if="showAnswer2"
        :class="{ 'psvt-instructions-answer': true, show: showAnswer2 }"
      >
        The correct answer for this example is B.
      </div>

      <p>
        When you are ready, please use the link below to begin the PSVT:R Test.
        Remember you will have 20 minutes to complete the test before it is
        automatically submitted.
      </p>
      <NuxtLink
        :to="
          '/courses/' + courseStore.getCourseName + '/quizzes/' + ['post-psvtr']
        "
        ><button>Begin PSVT:R Post-Test</button></NuxtLink
      >
    </div>
  </div>
</template>

<style>
ol {
  list-style-type: numeric;
}
</style>
