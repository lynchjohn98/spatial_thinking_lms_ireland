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
      <h3>Module 7: Cutting Planes and Cross-Sections</h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Learning Intentions:</h4>
        <p style="font-style: italic">
          Today, we are learning how 3D shapes can be sliced by an imaginary
          cutting plane to determine the shape of the cross-section at that
          location.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords of this module.</li>
          <li>
            Match the cross-section with an object and an imaginary cutting
            plane.
          </li>
          <li>
            Match various cross-sections that all can be obtained from a single
            object, based on the orientation of the cutting plane.
          </li>
          <li>
            Identify multiple cross-sections that could be obtained from a
            single object.
          </li>
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
            Used the software to investigate cutting planes and cross-sections.
          </li>
          <li>Verified the solution for all the workbook activities by:</li>
          <ul>
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li>Explain the words: cutting plane; cross-section.</li>
          <li>
            Identify cross-sections that correspond to a given object and
            cutting plane.
          </li>
          <li>
            Identify several possible cross-sections that could be obtained from
            a given object.
          </li>
        </ul>
      </div>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started:</h4>
        <ol class="list-disc">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174536365"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Cutting Planes and Cross-Sections
          </NuxtLink>
          <li class="p-2">Access the software here:</li>
          <NuxtLink
            to="http://www.higheredservices.org/HES01/Module_10/module_10_theme_1.html"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Cutting Planes and Cross-Sections
          </NuxtLink>
          <li class="p-2" >Watch the Getting Started Videos:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030414"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030422"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 2
          </NuxtLink>
          <li class="p-2">Complete the workbook pages as assigned by your teacher.</li>
          <li class="p-2">Complete the Module 7 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
