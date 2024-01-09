<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
const courseStore = useCourseStore();
</script>

<template>
  <Navbar></Navbar>
  <CourseSidebar
  >
    <div class="flex flex-row text-white mb-4">
      <NuxtLink :to="'/courses/' + courseStore.getCourseURL + '/modules/'">
        <Icon name="fluent-mdl2:back" class="mb-2 main-icon" size="20" />
        Return to Modules
      </NuxtLink>
    </div>
    <div
      class="module-container rounded-xl shadow-xl p-6 text-white"
      v-if="courseStore.getCourseType === 'experimental'"
    >
      <h3 class="text-white mb-4">Module 1: Combining Solid Objects</h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning how 3D shapes can be combined to form a single
          object.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords of the module.</li>
          <li>Match two objects with the appropriate combined solid.</li>
          <li>Identify the volume of interference from a combined solid.</li>
          <li>Make a sketch of a composite solid.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Success Criteria</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all the activities in my workbook.</li>
          <li>Used the software to investigate the combined solids.</li>
          <li>Verified the solutions for all the workbook activities by</li>
          <ul class="list-disc">
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li>
            Explain the words: volume of interference; join; cut; intersect;
            combined.
          </li>
          <li>Classify a combining operation.</li>
          <li>
            Identify the correct volume of interference of two overlapping
            solids.
          </li>
          <li>
            Sketch the edges of a composite solid obtained from a combining
            operation.
          </li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Let's Get Started</h4>

        <ol class="list-decimal">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174463571"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Combining Solids
          </NuxtLink>
          <li class="p-2">Access the Software here:</li>
          <ul>
            <NuxtLink
              to="https://www.higheredservices.org/HES01/Module_2/module_2_theme_1.html"
              target="blank"
              class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >
              Module 1: Combining Solids</NuxtLink
            >
          </ul>

          <li class="p-2">Watch the Getting Started Videos:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113618"
            target="blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113638"
            target="blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 2
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030415"
            target="blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 3
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030413"
            target="blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 4
          </NuxtLink>
          <li class="p-2">
            Complete the workbook pages as assigned by your teacher.
          </li>
          <li class="p-2">Complete the Module 1 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>

<style lang="scss" scoped></style>
