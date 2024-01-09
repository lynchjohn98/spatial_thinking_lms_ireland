<script setup>
import { useCourseStore } from "@/stores/courseStore.js";

const courseStore = useCourseStore();
const basePath = "courses/" + courseStore.getCourseURL + "/quizzes";

const consent = ref("");
const sex = ref("");
const otherSex = ref("");
const age = ref("");
const schoolName = ref("");
const additionalComments = ref("");
const focusGroupParticipantion = ref(null);
const focusGroupParticipantName = ref("");

const surveySubmitted = ref(false);
const client = useSupabaseClient();
const user = useSupabaseUser();

const likertAgreementLevels = [
  "Strongly Disagree",
  "Disagree",
  "Neither Agree nor Disagree",
  "Agree",
  "Strongly Agree",
  "N/A",
];

const likertTimesLevels = [
  "Never",
  "Rarely",
  "Sometimes",
  "Often",
  "Always",
  "N/A",
];

const likertQuestions = reactive([
  {
    question_id: 5,
    text: "I enjoyed participating in the spatial thinking course and completing the activities involved.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 6,
    text: "Completing the spatial thinking course will benefit me in the future.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 7,
    text: "The spatial thinking course was pitched at the correct level of difficulty.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 8,
    text: "The spatial thinking course was too difficult.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 9,
    text: "The resources provided supported me during the spatial thinking course (workbook, snapcubes, website, etc).",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 10,
    text: "The snap cubes were not used enough during the spatial thinking course.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 11,
    text: "The website was not used enough during the spatial thinking course.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 12,
    text: "There was too much reliance on the resources during the spatial thinking course.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 13,
    text: "The website was well structured and easy to navigate.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 14,
    text: "The website was a useful resource and provided support during difficult activities.",
    options: likertAgreementLevels,
    response: null,
  },
  {
    question_id: 15,
    text: "When I encountered a difficulty, I would ask the teacher for help.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 16,
    text: "When I encountered a difficulty, I would try to figure it out on my own before asking for help.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 17,
    text: "When I encountered a difficulty, I would not ask for help and keep trying until I solved it.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 18,
    text: "When I encountered a difficulty, I would ask a classmate for help.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 19,
    text: "When I encountered a difficulty, I would use the snap cubes to help me solve it.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 20,
    text: "When I encountered a difficulty, I would use the software on the website to help me solve it.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 21,
    text: "When I encountered a difficulty, I would use sketching to help me solve it.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 22,
    text: "I worked in a group to solve the problems in the workbook.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 23,
    text: "I worked alone to solve the problems in the workbook.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 24,
    text: "I ran out of time when trying to solve the problems in the workbook.",
    options: likertTimesLevels,
    response: null,
  },
  {
    question_id: 25,
    text: "I gave up when I couldn't solve the problems in the workbook.",
    options: likertTimesLevels,
    response: null,
  },
]);

const allQuestionsAnswered = computed(() => {
  return likertQuestions.every(
    (question) => question.response !== null && question.response !== ""
  );
});

//Functions on first page run

onMounted(async () => {
  //Check if the user has already submitted a post-test survey attempt
  const { data, error } = await client
    .from("grades")
    .select("*")
    .eq("student_id", user.value.id)
    .eq("quiz_id", 13);
  if (data.length === 0) {
    console.log("Empty data");
  } else {
    console.log("Data", data);
    //surveySubmitted.value = true;
  }
});

//Final object to store all responses
const submitSurvey = async () => {
  //Check for the unique sex and name identifiers if selected
  if (sex.value === "other" && otherSex.value === "") {
    alert("Please enter your sex.");
    return;
  }
  if (
    focusGroupParticipantion.value === "yes" &&
    focusGroupParticipantName.value === ""
  ) {
    alert("Please enter your name.");
    return;
  }
  // Validate all likertQuestions
  const allLikertAnswered = likertQuestions.every(
    (question) => question.response !== null && question.response !== ""
  );

  const requiredFieldsValid =
    consent.value !== "" &&
    sex.value !== "" &&
    age.value !== "" &&
    schoolName.value !== "";

  // Validate focus group participation and name (if "yes" is selected)
  const focusGroupValid =
    focusGroupParticipantion.value !== "yes" ||
    (focusGroupParticipantion.value === "yes" &&
      focusGroupParticipantName.value.trim() !== "");

  // Combine all validation checks
  const allValid = allLikertAnswered && requiredFieldsValid && focusGroupValid;

  if (allValid) {
    // Prepare the JSON object with responses
    const payload = {
      consent: consent.value,
      sex: sex.value === "other" ? otherSex.value : sex.value,
      age: age.value,
      schoolName: schoolName.value,
      additionalComments: additionalComments.value,
      // Include the responses from likertQuestions
      likertResponses: likertQuestions.map((q) => ({ [q.text]: q.response })),
      focusGroupParticipation: focusGroupParticipantion.value,
      focusGroupParticipantName:
        focusGroupParticipantion.value === "yes"
          ? focusGroupParticipantName.value
          : null,
    };
    const { data: quizData, error: quizError } = await client
      .from("grades")
      .insert([
        {
          class_id: courseStore.getCourseId,
          student_id: user.value.id,
          score: 0,
          quiz_id: 13,
          attempt_count: 1,
          answers: JSON.stringify(payload),
        },
      ]);
    if (quizData) {
      console.log("Successful insertion");
    } else {
      console.log("Error", quizError);
      console.log(courseStore.getCourseId, user.value.id, payload)
    }
  } else {
    console.error("Please fill in all required fields.");
    alert("Please fill in all fields before submitting the survey.");
  }
  
};
</script>

<template >
  <div v-if="surveySubmitted" class="">
    <h2 class="text-black  font-bold text-3xl">
      Thank you for submitting the post intervention survey!
    </h2>
    <NuxtLink :to="`/${basePath}`" class=" bg-emerald-500  text-white text-2xl text-center">
      <button> Return to All Quizzes</button>
    </NuxtLink>
    
  </div>
  <div v-else class="quiz-fullpage bg-emerald-700 p-6 rounded-lg">
    <h2 class="font-bold text-2xl mb-4 text-white">
      Spatial Thinking Post Intervention Survey
    </h2>

    <!-- Consent Question -->
    <div class="mb-4">
      <p class="mb-2 text-white font-semibold">
        1. I have read the information sheet and consent to take part in the
        study.
      </p>
      <div class="flex gap-4 text-white">
        <label class="flex items-center">
          <input
            type="radio"
            name="consent"
            value="yes"
            v-model="consent"
            class="mr-2"
          />
          Yes
        </label>
      </div>
    </div>

    <!-- Sex Question -->
    <div class="mb-4">
      <p class="mb-2 text-white font-semibold">2. Sex:</p>
      <div class="flex gap-4 text-white">
        <label class="flex items-center">
          <input
            type="radio"
            name="sex"
            value="male"
            v-model="sex"
            class="mr-2"
          />
          Male
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            name="sex"
            value="female"
            v-model="sex"
            class="mr-2"
          />
          Female
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            name="sex"
            value="other"
            v-model="sex"
            class="mr-2"
          />
          Other
        </label>
        <input
          v-if="sex === 'other'"
          type="text"
          v-model="otherSex"
          class="border p-2 rounded text-black"
          placeholder="Please specify"
        />
      </div>
    </div>

    <!-- Age Question -->
    <div class="mb-4">
      <p class="mb-2 text-white font-semibold">3. Age:</p>
      <input
        type="number"
        onkeydown="return event.keyCode !== 69"
        name="age"
        v-model="age"
        class="border p-2 rounded"
        placeholder="Enter your age"
      />
    </div>

    <!-- School Name Question -->
    <div class="mb-4">
      <p class="mb-2 text-white font-semibold">4. School Name:</p>
      <input
        type="text"
        name="school_name"
        v-model="schoolName"
        class="border p-2 rounded"
        placeholder="Enter your school name"
      />
    </div>

    <!-- Likert Scale Questions -->
    <!-- Template for questions 5 to 22 -->
    <div v-for="question in likertQuestions" :key="question.question_id">
      <div class="mb-4">
        <p class="mb-2 text-white font-semibold">
          {{ question.question_id }}. {{ question.text }}
        </p>
        <div class="flex gap-4">
          <div v-for="option in question.options" :key="option">
            <label class="flex items-center space-x-2 text-white font-light">
              <input
                type="radio"
                :name="`question_${question.question_id}`"
                :id="`question_${question.question_id}_${option}`"
                :value="option"
                v-model="question.response"
                class="form-radio h-4 w-4 text-emerald-600"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Text Questions -->
    <!-- Question 31 -->
    <div class="mb-4">
      <p class="mb-2 text-white font-bold">26. Any other comments?</p>
      <textarea
        v-model="additionalComments"
        class="border p-2 rounded w-full"
        placeholder="Type your comments here"
      ></textarea>
    </div>

    <!--- Focus Group Question -->
    <div class="mb-4">
      <p class="mb-2 text-white font-semibold">
        Please indicate whether or not you would like to take part in a focus
        group to discuss your experiences throughout the spatial thinking
        course.
      </p>
      <select
        v-model="focusGroupParticipantion"
        class="border p-2 rounded mb-2 text-gray-500"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <div v-if="focusGroupParticipantion === 'yes'">
        <input
          type="text"
          v-model="focusGroupParticipantName"
          class="border p-2 rounded"
          placeholder="Enter your name"
        />
      </div>
    </div>
    <!-- Submit Button -->
    <button
      class="bg-emerald-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
      @click="submitSurvey"
    >
      Submit Survey
    </button>
  </div>
</template>

<style></style>
