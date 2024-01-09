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
      <h3 class="text-white mb-4">Module 4: Flat Patterns</h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
      <h4>Learning Intentions</h4>
      <p style="font-style: italic">
        Today, we are learning about flat patterns.
      </p>
      <p>By the end of this module, I will be able to:</p>
      <ul>
        <li>Record, define and explain the keywords for this module.</li>
        <li>Identify a 3D object, given a flat pattern.</li>
        <li>Identify a flat pattern from a given orthographic projection.</li>
        <li>Identify a flat pattern from an isometric sketch.</li>
        <li>Visualise related 2D and 3D images and objects.</li>
      </ul>

      </div>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
      <h4>Success Criteria:</h4>
      <p>I have:</p>
      <ul>
        <li>Completed all the activities in my workbook.</li>
        <li>Used the software to investigate flat patterns.</li>
        <li>Created a 3D object using a flat pattern.</li>
        <li>Verified the solution for all the workbook activities by:</li>
        <ul>
          <li>Checking my answers with my partner.</li>
          <li>Checking my answers with my teacher.</li>
        </ul>
      </ul>
      <p>I can:</p>
      <ul>
        <li>
          Explain the words: Flat pattern, Orthographic, Fold lines, Adjacent
          surfaces, Orientation, Net, Development.
        </li>
        <li>Identify the correct orientation of a flat pattern.</li>
        <li>Identify a 3D object from a flat pattern.</li>
        <li>Identify a flat pattern from a 3D object.</li>
      </ul>
    </div>
    <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
      <h4>Let's Get Started:</h4>
      <ol class="list-decimal">
        <li class="p-2">Watch the Mini-Lecture video here: </li>
        <NuxtLink
        to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113636"
        target="_blank"
        class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
      
         >
         Mini-Lecture: Flat Patterns
      </NuxtLink>
        <li class="p-2">Access the software here:</li>
        <NuxtLink
          to="http://www.higheredservices.org/HES01/Module_6/module_6_theme_1.html"
          target="_blank"
          class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
      
        >
          Flat Patterns
        </NuxtLink>
        <li class="p-2">Watch the getting started videos:</li>
        <NuxtLink
          to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113636"
          target="_blank"
          class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
      
        >
          Getting Started Video 1
        </NuxtLink>
        <li class="p-2">Complete the workbook pages as assigned by your teacher.</li>
        <li class="p-2">Complete the Module 4 Quiz </li>
      </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
