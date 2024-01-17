<script setup>
import { ref, reactive, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";
import { gradeMathTest } from "~/services/mathInstrumentGrader";
import { useUserStore } from "@/stores/userStore.js";

const userStore = useUserStore();
const user = useSupabaseUser();
const client = useSupabaseClient();
const submittedQuiz = ref(false);
const courseStore = useCourseStore();
const basePath = "courses/" + courseStore.getCourseURL + "/quizzes";

//Create placeholders for user answers
const question1_a = ref("");
const question1_b = ref("");
const question2_a1 = ref("");
const question2_a2 = ref("");
const question2_a3 = ref("");
const question3_a = ref("");
const question3_b = ref("");
const question4_a1 = ref("");
const question4_a2 = ref("");
const question4_a3 = ref("");
const question4_a4 = ref("");
const question4_b = ref("");
const question5_a = ref("");
const question5_b = ref("");

const questionArray = [
  question1_a,
  question1_b,
  question2_a1,
  question2_a2,
  question2_a3,
  question3_a,
  question3_b,
  question4_a1,
  question4_a2,
  question4_a3,
  question4_a4,
  question4_b,
  question5_a,
  question5_b,
];

//Check if the user has already submitted this type of quiz
onMounted(async () => {
  console.log(user);

  const { data, error } = await client
    .from("grades")
    .select("*")
    .eq("survey_quiz_id", 3)
    .eq("student_id", userStore.getUserId);
  if (error) {
    console.log("Error fetching data from gradebook", error);
  } else if (data.length > 0) {
    console.log("Record found, attempt submitted", data);
    submittedQuiz.value = false;
  } else {
    console.log("Record not submitted, can start quiz");
  }
  console.log("Submitted quiz", submittedQuiz.value);
});

async function handleSubmit() {
  console.log("Running grading");
  let quizScore = gradeMathTest(questionArray);
  const finalJson = {};
  questionArray.forEach((item, index) => {
    finalJson[`question${index + 1}`] = item.value;
  });
  const finalJsonObject = JSON.stringify(finalJson);
  const { data, error } = await client.from("grades").insert([
    {
      student_id: userStore.getUserId,
      survey_quiz_id: 3,
      score: quizScore,
      class_id: courseStore.getCourseId,
      answers: finalJsonObject,
      attempt_count: 1,
    },
  ]);
  if (error) {
    console.log("Error in submission", error);
  } else {
    console.log("Submission successful");
  }
  submittedQuiz.value = true;
  console.log("Submitted quiz", submittedQuiz.value);
  console.log("Score", quizScore);
}
</script>

<template>
  <div v-if="submittedQuiz === false" class="quiz-fullpage bg-emerald-700">
    <div class="title text-white">Math Instrument Pre Test</div>
    <div
      class="question bg-emerald-600 text-white border-gray-500 border rounded-lg m-2 p-2 w-1/2"
    >
      <h2 class="font-bold text-2xl">Question 1</h2>
      <p>
        Here you see a photograph of a farmhouse with a roof in the shape of a
        pyramid.
      </p>
      <div class="image-container">
        <img
          class="question-image"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_1.png"
        />
      </div>
      <p>
        Below is a student’s mathematical model of the farmhouse roof with
        measurements added. The attic floor, ABCD in the model, is a square. The
        beams that support the roof are the edges of a block (rectangular prism)
        EFGHKLMN. E is the middle of AT, F is the middle of BT, G is the middle
        of CT and H is the middle of DT. All the edges of the pyramid in the
        model have length 12 m.
      </p>
      <div class="image-container">
        <img
          class="question-image"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_2.png"
        />
      </div>
      <p>Part A: Calculate the area of the attic floor ABCD.</p>
      <label for="text-entry">The area of the attic floor ABCD = </label>
      <input
        id="text-entry"
        class="text-black"
        type="text"
        style="width: 50%"
        name="question1_a"
        v-model="question1_a"
        placeholder="Type your numerical answer here (no units)"
      />
      m²
      <p>
        Part B: Calculate the length of EF, one of the horizontal edges of the
        block.
      </p>
      <label for="text-entry">The length of EF = </label>
      <input
        id="text-entry"
        class="text-black"
        name="question1_b"
        type="text"
        style="width: 50%"
        v-model="question1_b"
        placeholder="Type your numerical answer here (no units)"
      />
      m
      <p></p>
    </div>

    <div
      class="question bg-emerald-500 text-white border-gray-500 border rounded-lg m-2 p-2 w-1/2"
    >
      <h2 class="font-bold text-2xl">Question 2</h2>
      <p>Below is a picture of two dice.</p>
      <div class="image-container">
        <img
          class="question-image"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_3.png"
        />
      </div>
      <p>
        The total number of dots on two opposite faces is always seven. You can
        make a simple number cube by cutting, folding, and gluing carboard. This
        can be done in many ways. In the figure below you can see three cuttings
        that can be used to make cubes, with dots on the sides.
      </p>
      <p>
        Which of the following shapes can be folded together to form a cube that
        obeys the rule that the sum of opposite faces is 7? For each shape,
        select either “Yes” or “No” in the table below.
      </p>
      <div class="image-container">
        <img
          class="question-image border-black border-2 m-2"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_4.png"
        />
      </div>
      <p>
        Which of the following shapes can be folded together to form a cube that
        obeys the rule that the sum of opposite faces is 7?
      </p>
      <p>For each shape, select either "Yes" or "No"</p>

      <table>
        <thead>
          <tr>
            <th>Shape</th>
            <th>Obeys the rule that the sum of opposite faces is 7:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Shape I</td>
            <td>
              <select
                name="question2_a1"
                v-model="question2_a1"
                class="text-black"
              >
                <option disabled value="null">[ Select ]</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Shape II</td>
            <td>
              <select
                name="question2_a2"
                v-model="question2_a2"
                class="text-black"
              >
                <option disabled value="null">[ Select ]</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Shape III</td>
            <td>
              <select
                name="question2_a3"
                v-model="question2_a3"
                class="text-black"
              >
                <option disabled value="null">[ Select ]</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="question bg-emerald-500 border-gray-500 border rounded-lg m-2 p-2 w-1/2 text-white"
    >
      <h2 class="font-bold text-2xl">Question 3</h2>
      <div class="image-container">
        <img
          class="question-image border-black border-2"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_5.png"
        />
      </div>
      <!-- Part A -->
      <div class="question-section mt-2">
        <h3>
          Part A: What is the approximate distance from the starting line to the
          beginning of the longest straight section of the track?
        </h3>
        <ul class="multiple-choice">
          <li>
            <input type="radio" name="partA" value="A" v-model="question3_a" />
            A. 0.5 km
          </li>
          <li>
            <input type="radio" name="partA" value="B" v-model="question3_a" />
            B. 1.5 km
          </li>
          <li>
            <input type="radio" name="partA" value="C" v-model="question3_a" />
            C. 2.3 km
          </li>
          <li>
            <input type="radio" name="partA" value="D" v-model="question3_a" />
            D. 2.6 km
          </li>
        </ul>
      </div>

      <!-- Part B -->
      <div class="question-section mt-4">
        <h3>
          Part B: Here is a picture of four tracks: Along which one of these
          tracks was the car driven to produce the speed graph shown above?
          Select the correct answer.
        </h3>
        <div class="image-container">
          <img
            class="question-image border-black border-2"
            src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_6.png"
          />
        </div>
        <ul class="multiple-choice">
          <li>
            <input type="radio" name="partB" value="A" v-model="question3_b" />
            Track A
          </li>
          <li>
            <input type="radio" name="partB" value="B" v-model="question3_b" />
            Track B
          </li>
          <li>
            <input type="radio" name="partB" value="C" v-model="question3_b" />
            Track C
          </li>
          <li>
            <input type="radio" name="partB" value="D" v-model="question3_b" />
            Track D
          </li>
        </ul>
      </div>
    </div>

    <div
      class="question bg-emerald-500 border-gray-500 border rounded-lg m-2 p-2 w-1/2 text-white"
    >
      <h2 class="font-bold text-2xl">Question 4</h2>
      <p>
        People living in an apartment building decide to buy the building. They
        will put their money together in such a way that each will pay an amount
        that is proportional to the size of their apartment. For example, a man
        living in an apartment that occupies one fifth of the floor area of all
        apartments will pay one fifth of the total price of the building.
      </p>
      <h3>
        Part A: Select Correct or Incorrect for each of the following statements
      </h3>
      <table>
        <thead>
          <tr>
            <th>Statement</th>
            <th>Correct / Incorrect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              A person living in the largest apartment will pay more money for
              each square meter of his apartment than the person living in the
              smallest apartment.
            </td>
            <td>
              <select
                name="question4_a1"
                v-model="question4_a1"
                class="text-black"
              >
                <option disabled selected>[ Select ]</option>
                <option value="Correct">Correct</option>
                <option value="Incorrect">Incorrect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              If we know the areas of two apartments and the price of one of
              them, we can calculate the price of the second.
            </td>
            <td>
              <select
                name="question4_a2"
                v-model="question4_a2"
                class="text-black"
              >
                <option disabled selected>[ Select ]</option>
                <option value="Correct">Correct</option>
                <option value="Incorrect">Incorrect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              If we know the price of the building and how much each owner will
              pay, then the total area of all apartments can be calculated.
            </td>
            <td>
              <select
                name="question4_a3"
                v-model="question4_a3"
                class="text-black"
              >
                <option disabled selected>[ Select ]</option>
                <option value="Correct">Correct</option>
                <option value="Incorrect">Incorrect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              If the total price of the building were reduced by 10%, each of
              the owners would pay 10% less.
            </td>
            <td>
              <select
                name="question4_a4"
                v-model="question4_a4"
                class="text-black"
              >
                <option disabled selected>[ Select ]</option>
                <option value="Correct">Correct</option>
                <option value="Incorrect">Incorrect</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Part B: Calculate payments</h3>
      <p>
        There are three apartments in the building. The largest, apartment 1,
        has a total area of 95m². Apartments 2 and 3 have areas of 85m² and 70m²
        respectively. The selling price for the building is 300,000 zeds.
      </p>
      <label for="text-entry"
        >How much should the owner of apartment 2 pay?
      </label>
      <input
        id="text-entry"
        type="text"
        style="width: 50%"
        name="question4_b"
        class="text-black"
        placeholder="Type your numerical answer here (no units)"
        v-model="question4_b"
      />
    </div>

    <div
      class="question bg-emerald-500 border-gray-500 border rounded-lg m-2 p-2 w-1/2 text-white"
    >
      <h2 class="font-bold text-2xl">Question 5</h2>
      <p>
        Susan likes to build blocks from small cubes like the one shown in the
        following diagram
      </p>
      <div class="image-container">
        <img
          class="question-image"
          style="width: 10%"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_7.png"
        />
      </div>
      <p>
        Susan has a lot of small cubes like this one. She uses glue to join
        cubes together to make other blocks. First, Susan glues eight of the
        cubes together to make the block shown in Diagram A:
      </p>
      <div class="image-container">
        <img
          class="question-image"
          style="width: 10%"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_8.png"
        />
      </div>
      <p>
        Then Susan makes the solid blocks shown in Diagram B and Diagram C
        below:
      </p>
      <div class="image-container">
        <img
          class="question-image"
          style="width: 25%"
          src="https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/wave4g9_images/wg9_9.png"
        />
      </div>
      <h3>Part A: Making a Block</h3>
      <p>
        Susan realizes that she used more small cubes than she really needed to
        make a block like the one shown in Diagram C. She realizes that she
        could have glued small cubes together to look like Diagram C, but the
        block could have been hollow on the inside
      </p>

      <label for="question5_a_entry">
        What is the minimum number of cubes she needs to make a block that looks
        like the one shown in Diagram C, but is hollow?
      </label>
      <input
        id="question5_a_entry"
        type="text"
        class="text-black"
        style="width: 50%"
        name="question4_b"
        placeholder="Type your numerical answer here (no units)"
        v-model="question5_a"
      />

      <h3>Part B: Another Block Creation</h3>
      <p>
        Now Susan wants to make a block that looks like a solid block that is 6
        small cubes long, 5 small cubes wide, and 4 small cubes high. She wants
        to use the smallest number of cubes possible, by leaving the largest
        possible hollow space inside the block.
      </p>
      <label for="question5_n_entry">
        What is the minimum number of cubes Susan will need to make this block?
      </label>
      <input
        id="question5_b_entry"
        type="text"
        class="text-black"
        style="width: 50%"
        name="question4_b"
        placeholder="Type your numerical answer here (no units)"
        v-model="question5_b"
      />
    </div>

    <button @click="handleSubmit">Submit</button>
  </div>
  <div v-if="submittedQuiz" class="quiz-fullpage bg-emerald-700 min-h-screen w-full flex flex-col justify-center items-center">
    <h1 class="text-white text-2xl text-center px-6 py-4">Pre-Math Instrument Submitted</h1>
    <!--- Can edit here to display the score if needed -->
    <NuxtLink :to="`/${basePath}`" class="bg-emerald-500 w-auto px-6 py-4 text-white text-2xl text-center rounded">
      Return to All Quizzes
    </NuxtLink>
</div>
</template>

<style>
.multiple-choice {
  list-style-type: none;
  padding-left: 0;
}
</style>
