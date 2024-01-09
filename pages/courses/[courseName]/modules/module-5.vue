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
        Module 5: Rotation of Objects About a Single Axis
      </h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning to rotate objects about one axis.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords for this module.</li>
          <li>Recognise positive and negative rotations.</li>
          <li>Identify rotated objects given their image.</li>
          <li>Rotate an object about a given axis.</li>
          <li>Sketch an object after it has been rotated by a given amount.</li>
        </ul>
      </div>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Success Criteria:</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all the activities in my workbook.</li>
          <li>Used the software to investigate rotations about one axis.</li>
          <li>
            Used the stack cubes and model axis to investigate rotations about
            one axis.
          </li>
          <li>Demonstrate and describe positive and negative rotations.</li>
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
            Magnitude, Right-hand rule, Clockwise, Counterclockwise,
            Anticlockwise, Equivalent Rotation code.
          </li>
          <li>Identify correctly a rotated object.</li>
          <li>
            Write down the degrees of rotation and arrow sequence for a given
            rotation.
          </li>
          <li>Identify the planes of symmetry of a given object.</li>
          <li>Sketch a rotated object, following a given rotation.</li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started:</h4>
        <ol class="list-disc">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174521439"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Rotation of Objects about One Axis
          </NuxtLink>
          <li class="p-2">Access the software here:</li>
          <NuxtLink
            to="https://www.higheredservices.org/HES01/Module_7/module_7_theme_1.html"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Rotation of Objects about One Axis
          </NuxtLink>
          <li class="p-2">Watch the Getting Started videos:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026502"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026504"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 2
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177261289"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 3
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030423"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 4
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172111782"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 5
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113637"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Getting Started Video 6
          </NuxtLink>
          <li class="p-2">Complete the workbook pages as assigned by your teacher.</li>
          <li class="p-2">Complete the Module 5 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
