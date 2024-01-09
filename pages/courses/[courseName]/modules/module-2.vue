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
      <h3 class="text-white mb-4">
        Module 2: Surfaces and Solids of Revolution
      </h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning about how 2D shapes can be revolved around an
          axis to form a 3D Solid.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords of the module.</li>
          <li>
            Choose the appropriate 3D shape from the revolution of a given 2D
            shape.
          </li>
          <li>Choose the appropriate 2D shape from a given 3D diagram.</li>
          <li>Identify the axis of revolution.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Success Criteria</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all the activities in my workbook.</li>
          <li>
            Used the software to investigate the relationship bewteen 2D shapes
            and 3D objects.
          </li>
          <li>Verified the solutions for all the workbook activities by:</li>
          <ul class="list-disc">
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li>Explain the words: Revolve, About an axis, Axis of revolution</li>
          <li>Take a 2D shape and revolve it about any axis.</li>
          <li>
            Identify the axis of revolution given a 2D shape and a 3D object.
          </li>
          <li>Write down the number of degrees that a shape was revolved.</li>
          <li>Select a 2D shape from a given 3D object.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started:</h4>

        <ol class="list-decimal">
          <li>Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174459909"
            target="_blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Surfaces and Solids of Revolution
          </NuxtLink>
          <li class="p-2">Access the software here:</li>

          <NuxtLink
            to="https://www.higheredservices.org/HES01/Module_1/module_1_theme_1.html"
            target="_blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Surfaces and Solids of Revolution
          </NuxtLink>

          <li class="p-2">Watch the Getting Started videos here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177263869"
            target="_blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video
          </NuxtLink>
          <li class="p-2">
            Complete the workbook pages as assigned by your teacher.
          </li>
          <li class="p-2">Complete the Module 2 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>

<style lang="scss" scoped></style>
