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
      <h3>Module 6: Object Reflection and Symmetry</h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Learning Intentions:</h4>
        <p style="font-style: italic">
          Today, we are learning about object reflection and symmetry.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords for this module.</li>
          <li>Recognize the symmetry of 3D objects.</li>
          <li>Sketch the reflection of an isometric object.</li>
          <li>Identify the reflection of an isometric object.</li>
        </ul>
      </div>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Success Criteria:</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all the activities in my workbook.</li>
          <li>
            Used the software to investigate objects reflections and symmetry.
          </li>
          <li>Verified the solution for all the workbook activities by:</li>
          <ul class="list-disc">
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li>
            Explain the words: Symmetry, Reflection, Plane of reflection, Plane
            of symmetry, Symmetric, Corresponding points.
          </li>
          <li>
            Sketch the image of an isometric object in the plane of reflection.
          </li>
          <li>Identify the planes of symmetry of an isometric object.</li>
          <li>Identify the reflection of an object.</li>
        </ul>
      </div>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started:</h4>
        <ol class="list-disc">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174457917"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Reflection and Symmetry
          </NuxtLink>
          <li class="p-2">Access the software here:</li>
          <NuxtLink
            to="https://www.higheredservices.org/HES01/Module_9/module_9_theme_1.html"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Reflection and Symmetry
          </NuxtLink>
          <li class="p-2">Watch the Getting Started videos:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030428"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 1
          </NuxtLink>
          <li class="p-2">Complete the workbook pages as assigned by your teacher.</li>
          <li class="p-2">Complete the Module 6 Quiz</li>

        
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
