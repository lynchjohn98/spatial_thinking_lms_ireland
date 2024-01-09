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
        Module 8: Rotation of Objects about Two or More Axes
      </h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning to rotate objects about two or more axes.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords for this module.</li>
          <li>Identify rotated bojects given their image.</li>
          <li>Rotate an object about given axes.</li>
        </ul>
      </div>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Success Criteria</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all activities in my workbook.</li>
          <li>
            Used the software to investigate rotations about two or more axes.
          </li>
          <li>
            Used the stack cubes and model axis to investigate rotations about
            two or more axes.
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
            Explain the keywords: Positive rotation, Negative rotation,
            Right-hand rule, Clockwise, Counterclockwise.
          </li>
          <li>
            Identify correctly an object that has been rotated about two or more
            axes.
          </li>
          <li>
            Write down the degrees of rotation and arrow sequence for a given
            rotation.
          </li>
          <li>Sketch a rotated object, following a given rotation code.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started</h4>
        <ol class="list-disc">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            target="_blank"
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/175886751"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Rotation of Objects about Two or More Axes.
          </NuxtLink>
          <li class="p-2">Access the software here:</li>
          <NuxtLink
            target="_blank"
            to="https://www.higheredservices.org/HES01/Module_8/module_8_theme_1.html"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Rotation of Objects about Two or More Axes.
          </NuxtLink>
          <li class="p-2">Watch Getting Started Videos:</li>
          <NuxtLink
            target="_blank"
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026505"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            target="_blank"
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113640"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 2
          </NuxtLink>

          <li class="p-2">Complete the workbook pages as assigned by your teacher.</li>
          <li class="p-2">Complete the Module 8 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
