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
      <h3>Module 9: Orthographic Drawings</h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning how to create a set of orthographic drawings
          from a single object.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul class="list-disc">
          <li>Record, define and explain the keywords of the module.</li>
          <li>Identify the top, front, and side views of a given object.</li>
          <li>
            Match an isometric view of any object with its corresponding top,
            front, and side views.
          </li>
          <li>Determine when orthographic views are properly aligned.</li>
          <li>
            Sketch the top, front, and side views (properly aligned) from a
            given isometric view of an object, including hidden lines when
            necessary.
          </li>
          <li>
            Sketch an isometric view of an object, given its top, front, and
            side views.
          </li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Success Criteria</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li>Completed all the activities in my workbook.</li>
          <li>Used the software to investigate orthographic projections.</li>
          <li>Verified the solution for all the workbook activities by:</li>
          <ul class="list-disc">
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li>
            Explain the words: orthographic; hidden lines; view alignment; box
            method.
          </li>
          <li>
            Identify orthographic views that correspond to an isometric view of
            an object.
          </li>
          <li>
            Identify isometric views from the top, front, and side views of a
            given object.
          </li>
          <li>
            Sketch the top, front, and side views of an object given its
            isometric view and the three views are properly aligned.
          </li>
          <li>
            Sketch an isometric view of an object, given its three orthographic
            views.
          </li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started</h4>
        <ol class="list-disc">
          <li class="p-2">Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/175886752"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Orthographic Drawings
          </NuxtLink>
          <li class="p-2">Access the Software here:</li>
          <NuxtLink
            to="https://www.higheredservices.org/HES01/Module_4/module_4_theme_1.html"
            target="blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Orthographic Views</NuxtLink
          >
          <li class="p-2">Watch the Getting Started Videos:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/170976907"
            target="blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177460037"
            target="blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 2
          </NuxtLink>
          <li class="p-2">Complete the workbook pages as assigned by your teacher</li>
          <li class="p-2">Complete the Module 9 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>

<script setup></script>

<style lang="scss" scoped></style>
