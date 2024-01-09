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
      <h3>Module 10: Inclined and Curved Surfaces</h3>
      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Learning Intentions</h4>
        <p style="font-style: italic">
          Today, we are learning how to create a set of orthographic drawings
          from an object that includes inclined or curved surfaces.
        </p>
        <p>By the end of this module, I will be able to:</p>
        <ul>
          <li>Record, define and explain the keywords of the module.</li>
          <li>
            Identify the top, front, and side views of an object with inclined
            or curved surfaces.
          </li>
          <li>
            Match an isometric view of an object that contains either inclined
            or curved surfaces with its corresponding top, front, and side
            views.
          </li>
          <li>Determine when orthographic views are properly aligned.</li>
          <li>
            Sketch the top, front, and side views (properly aligned) from a
            given isometric view of an object that includes inclined or curved
            surfaces, including hidden lines when necessary.
          </li>
          <li>
            Sketch an isometric view of an object with inclined surfaces, given
            its top, front, and side views
          </li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Success Criteria</h4>
        <p>I have:</p>
        <ul class="list-disc">
          <li class="p-2">Completed all the activities in my workbook.</li>
          <li class="p-2">
            Used the software to investigate orthographic projections of
            inclined and curved surfaces.
          </li>
          <li>Verified the solution for all the workbook activities by:</li>
          <ul class="list-disc">
            <li>Checking my answers with my partner.</li>
            <li>Checking my answers with my teacher.</li>
          </ul>
        </ul>
        <p>I can:</p>
        <ul class="list-disc">
          <li class="p-2">
            Explain the words: orthographic; inclined surfaces; curved surfaces.
          </li>
          <li class="p-2">
            Identify orthographic views that correspond to an isometric view of
            an object that contains inclined or curved surfaces.
          </li>
          <li class="p-2">
            Identify isometric views from the top, front, and side views of a
            given object that contains inclined or curved surfaces.
          </li>
          <li class="p-2">
            Sketch the top, front, and side views of an object with inclined or
            curved surfaces given its isometric view and the three views are
            properly aligned.
          </li>
          <li class="p-2">
            Sketch an isometric view of an object with inclined surfaces, given
            its three orthographic views.
          </li>
        </ul>
      </div>

      <div
        class="bg-emerald-700 p-6 border border-black rounded-lg shadow-inner space-y-4 m-5"
      >
        <h4>Let's Get Started</h4>
        <ol class="list-disc">
          <li>Watch the Mini-Lecture video here:</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174513397"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Mini-Lecture: Inclined and Curved Surfaces
          </NuxtLink>
          <li>Access the Software here:</li>
          <NuxtLink
            to="https://www.higheredservices.org/HES01/Module_5/module_5_theme_1.html"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
          >
            Ortographic Projection of Inclined and Curved Surfaces
          </NuxtLink>

          <li>Watch the Getting Started Videos</li>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/178667573"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 1
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030416"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 2
          </NuxtLink>
          <NuxtLink
            to="https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113629"
            target="_blank"
            class="p-4 mt-2 bg-emerald-600 rounded-lg space-y-4 shadow-inner w-1/4 transition ease-in-out"
            >Getting Started Video 3
          </NuxtLink>
          <li class="p-2">
            Complete the workbook pages as assigned by your teacher.
          </li>
          <li class="p-2">Complete the Module 10 Quiz</li>
        </ol>
      </div>
    </div>
  </CourseSidebar>
</template>
