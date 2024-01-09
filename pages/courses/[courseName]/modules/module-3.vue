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
        Module 3: Isometric Sketching and Coded Plans
      </h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning about isometric sketching.
        </p>
        <p>By the end of the lesson, I will be able to:</p>
        <ul>
          <li>Record, define and explain the keywords for this module.</li>
          <li>Recognise isometric drawings.</li>
          <li>Visualize the isometric drawings of an object.</li>
          <li>
            Understand that objects can look different from different
            perspectives.
          </li>
          <li>Create an isometric sketch.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4 class="text-xl font-bold">Success Criteria:</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all the activities in my workbook.</li>
          <li>
            Used the software to identify isometric sketches and coded plans.
          </li>
          <li>Used the snap cubes to identify isometric sketches.</li>
          <li>Verified the solution for all the workbook activities by</li>
          <ul class="list-disc">
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li>
            Explain the words: Isometric, Coded plan, Flat surface, Viewpoint
          </li>
          <li>Identify examples of isometric drawings and coded plans.</li>
          <li>Count the number of blocks in an isometric drawing</li>
          <li>Visualise an isometric sketch from a drawing.</li>
          <li>Draw an isometric sketch.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started:</h4>
        <ol class="list-decimal">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174461467"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
        
          >
            Mini-Lecture: Isometric Sketching and Coded Plans
          </NuxtLink>
          <li class="p-2" >Access the software here:</li>
          <NuxtLink
            to="http://www.higheredservices.org/HES01/Module_3/module_3_theme_1.html"
            target="_blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
    
          >
            Isometric Drawing and Coded Plans
          </NuxtLink>
          <li class="p-2">Watch the getting started videos:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030421"
            target="_blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
    
          >
            Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177254480"
            target="_blank"
            class="p-4 m-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
    
          >
            Getting Started Video 2
          </NuxtLink>
          <li class="p-2">Complete the workbook pages as assigned by your teacher.</li>
          <li class="p-2">Complete the Module 3 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
