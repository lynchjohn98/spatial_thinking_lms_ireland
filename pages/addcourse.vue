<script setup>
import { onMounted, ref } from "vue";
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const courseStore = useCourseStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const joinCode = ref("");

async function generateUUID() {
  return 'xxxx-xxxx'
  .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, 
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
const submitSuccess = ref(false);

onMounted(async () => {
  generateJoinCode(); // Generate the join code when the component is mounted
});

async function generateJoinCode() {
  joinCode.value = await generateUUID();
}

const handleThumbnailUpload = (event) => {
  thumbnailFile.value = event.target.files[0];
  // Create a data URL for the selected image
  const reader = new FileReader();
  reader.onload = () => {
    thumbnailPreview.value = reader.result;
  };
  reader.readAsDataURL(thumbnailFile.value);
};

const submitForm = async () => {
  let thumbnailUrl = null;
  if (thumbnailFile.value != null) {
    const filename = `${uuidv4()}-${thumbnailFile.value.name}`;
    const { data, error } = await client.storage
      .from("thumbnail_images")
      .upload(filename, thumbnailFile.value, {
        cacheControl: "3600",
        upsert: false,
      });
    thumbnailUrl = `https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/thumbnail_images/${data.path}`;
  } else {
    console.log("No image was uploaded");
    thumbnailUrl =
      "https://ketcslswwsvlsdcnvgll.supabase.co/storage/v1/object/public/thumbnail_images/default_thumbnail";
  }
  //Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();

  // Insert the new course into the database
  const { data: insertData, error: insertError } = await client
    .from("classes")
    .insert(
      [
        {
          instructor_id: user.value.id,
          class_name: courseName.value,
          thumbnail_url: thumbnailUrl,
          class_join_code: joinCode.value,
          started_at: formattedDate,
          class_type: selectedCourseType.value,
        },
      ],
      { returning: "minimal" }
    );
  //Insert default class settings
  console.log("Running insert class settings");
  insertClassSettings();
};

const insertClassSettings = async () => {
  const { data, error } = await client
    .from("classes")
    .select("id")
    .eq("class_name", courseName.value)
    .eq("instructor_id", user.value.id)
    .eq("class_join_code", joinCode.value);
  if (error) {
    console.log("Class settings insert error", error);
  } else {
    //Get class ID
    const classId = data[0].id;
    //Stringify the module and quiz lists
    //const JSONModuleList = JSON.stringify(moduleList);
    //const JSONquizList = JSON.stringify(quizList);
    if (selectedCourseType.value === "control") {
      const { data: settingsData, error: settingsError } = await client
        .from("classes_settings")
        .insert([
          {
            class_id: classId,
            quiz_visibility: quizList,
            instructor_id: user.value.id,
          },
        ]);
      if (settingsError) {
        console.log("Class settings insert error", settingsError);
      } else {
        console.log("Class settings insert success", settingsData);
        submitSuccess.value = true;
      }
    } else {
      const { data: settingsData, error: settingsError } = await client
        .from("classes_settings")
        .insert([
          {
            class_id: classId,
            module_visibility: moduleList,
            quiz_visibility: quizList,
            instructor_id: user.value.id,
          },
        ]);
      if (settingsError) {
        console.log("Class settings insert error", settingsError);
      } else {
        console.log("Class settings insert success", settingsData);
        submitSuccess.value = true;
      }
    }
  }
};

const showPopup = ref(false);
const togglePopup = () => {
  showPopup.value = !showPopup.value;
};
</script>

<template>
  <Navbar></Navbar>
  <div class="absolute top-20 left-4">
      <NuxtLink to="/">
        <button class="bg-emerald-600 px-4 py-2 text-white rounded">
          <NuxtLink class="text-white" to="/">
            <Icon
              name="fluent-mdl2:back"
              class="mb-2 main-icon text-white"
              size="20"
            />
            Back to Dashboard
          </NuxtLink>
        </button>
      </NuxtLink>
    </div>
  <div v-if="userStore.getAccountType === 'instructor'">
    <div
      class="min-w-screen min-h-screen flex flex-col items-center justify-center px-5 py-5 bg-gradient-to-b from-emerald-500 to-emerald-900"
    >
      <div>
       
        <h1 class="text-2xl font-bold mb-4 text-white">
          
          Create New Course

          <NuxtLink @click="togglePopup">
            <Icon
              name="streamline:interface-help-question-circle-circle-faq-frame-help-info-mark-more-query-question"
              class="text-white fill-current main-icon cursor-pointer"
              size="28"
            />
          </NuxtLink>
        </h1>
      </div>
      <div class="">
        <form
          v-if="submitSuccess === false"
          @submit.prevent="submitForm"
          class="space-y-4"
        >
          <div class="text-white">
            <label for="courseName" class="block font-medium"
              >Course Name</label
            >
            <input
              v-model="courseName"
              id="courseName"
              type="text"
              class="mt-1 p-2 border w-full text-black"
              required
            />
          </div>
          <div class="text-white">
            <label class="block font-medium"
              >Upload Thumbnail (Leave blank if you want to use a default
              thumbnail)</label
            >
            <input
              type="file"
              @change="handleThumbnailUpload"
              class="mt-1"
              accept=".png, .jpg, .jpeg"
            />
          </div>
          <div v-if="thumbnailPreview" class="mt-4 text-white">
            <label class="block font-medium">Thumbnail Preview</label>
            <img
              :src="thumbnailPreview"
              alt="Thumbnail Preview"
              class="mt-1 thumbnail-preview"
            />
          </div>
          <div class="">
            <label class="font-medium text-white">
              Course Type (Control or Experimental)
            </label>
            <select
              style="margin-left: 1em"
              name="courseType"
              id="courseType"
              class="mt-2 text-center justify-center items-center rounded-md p-1 text-md"
              required
              v-model="selectedCourseType"
            >
              <option value="" selected disabled>[Select one]</option>
              <option value="control">Control</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-white">Course Join Code</label>
            <p class="mt-1 p-2 bg-gray-100 w-full">{{ joinCode }}</p>
          </div>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Course
          </button>
        </form>
      </div>
      <div
        class="text-center justify-normal text-white"
        v-if="submitSuccess === true"
      >
        <p>Course created!</p>

        <p>
          Please use this code to have registered students' join your course.
          This code is stored in the course settings page.
        </p>
        <h3 class="text-2xl py-4 font-bold">
          {{ joinCode }}
        </h3>

        <NuxtLink
          to="/"
          class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
        >
          Return to Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
