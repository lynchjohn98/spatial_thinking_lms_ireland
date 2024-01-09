<script setup>
import { ref, reactive, onMounted } from "vue";
import { updateQuizData } from "@/services/generateQuizData.js";
import { useQuiz } from "@/composables/quizSetup.js";
import { globalVariables } from "@/services/globalVariables.js";
const courseName = globalVariables.coursename;
const client = useSupabaseAuthClient();
const selectedOptions = reactive({}); // to keep track of selected options
const quiz = ref({});


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
    .eq("id", 11)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
  } else {

    quiz.value = updateQuizData(data);
    quiz.value.multipleChoiceQuestions =
      quiz.value.multipleChoiceQuestions.slice(0, 3);
    quiz.value.multipleSelectQuestions =
      quiz.value.multipleSelectQuestions.slice(0, 2);
    quiz.value.subChoiceQuestions = quiz.value.subChoiceQuestions.slice(0, 1);
    console.log(quiz.value);
  }
});
</script>

<template>
  <CourseSidebar :courseName="globalVariables.class_name">
    <div class="quiz-fullpage">
      <div class="title">{{ quiz.quizTitle }}</div>
      <!--- Multiple choice questions -->
      <div
        v-for="(question, index) in quiz.multipleChoiceQuestions"
        :key="index"
        class="question"
        :id="'question-' + index"
      >
        <h3>{{ question.question_text }}</h3>
        <div
          class="image-container"
          v-for="(image, index) in question.images"
          :key="index"
        >
          <img
            class="question-image"
            :src="image.image_url"
            alt="Question related image"
          />
        </div>
        <div class="options-container">
          <div
            class="option"
            v-for="(option, index) in question.options"
            :key="index"
          >
            <input
              type="radio"
              :id="'option' + option.id"
              :value="option.id"
              v-model="selectedOptions[question.id]"
            />
            <label :for="'option' + option.id">{{ option.option_text }}</label>
          </div>
        </div>
      </div>

      <!--- Multiple select questions -->

      <div
        v-for="(question, index) in quiz.multipleSelectQuestions"
        :key="index"
        class="question multiple-select-question"
      >
        
        <h2>{{ question.question_text }}</h2>

        <div
          class="image-container"
          v-for="(image, index) in question.images"
          :key="index"
        >
          <img
            class="question-image"
            :src="image.image_url"
            alt="Question related image"
          />
        </div>
        <div class="options-container">
          <div
            class="option"
            v-for="(option, index) in question.options"
            :key="index"
          >
            <input
              type="checkbox"
              :id="'option' + option.id"
              :value="option.id"
            />
            <label :for="'option' + option.id">{{ option.option_text }}</label>
          </div>
        </div>
      </div>

      <!--- Subchoice questions -->
      <div
        v-for="(question, qIndex) in quiz.subChoiceQuestions"
        :key="qIndex"
        class="question subchoice-question"
      >


        <h3>{{ question.question_text }}</h3>
        <div
          class="image-container"
          v-for="(image, index) in question.images"
          :key="index"
        >
          <img class="question-image" :src="image.image_url" />
        </div>
        <div
          v-for="(subQuestion, sqIndex) in question.sub_questions"
          :key="sqIndex"
          class="subchoice-question"
        >
          <div class="subchoice-question-row">
            <h3>{{ subQuestion.sub_question_text }}</h3>

            <div class="dropdown-container">
              <select>
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

      <!--- Multiple subchoice questions -->
      <div
        v-for="(question, index) in quiz.multipleSubchoiceQuestions"
        :key="index"
        class="question multiple-subchoice-question"
      >
        <h2>{{ question.question_text }}</h2>
        <div
          v-for="(subQuestion, sqIndex) in question.sub_questions"
          :key="sqIndex"
          class="sub-question"
        >
          <div class="multiple-subchoice-question-row">
            <div class="image-container">
              <img
                class="question-image"
                :src="subQuestion.image_url"
                alt="Sub Question related image"
              />
            </div>
            <h3>{{ subQuestion.sub_question_text }}</h3>

            <!-- Loop over each part of the sub-question -->
            <div
              v-for="(part, partIndex) in subQuestion.parts"
              :key="partIndex"
              class="part"
            >
              <h4>{{ part.part_text }}</h4>

              <!-- Dropdown for each part -->
              <div class="dropdown-container">
                <select>
                  <option selected value="" disabled>[ Select ]</option>
                  <option
                    v-for="(option, optIndex) in part.options"
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
    </div>
    <button @click="submitAnswers">Submit Answers</button>
  </CourseSidebar>
</template>
