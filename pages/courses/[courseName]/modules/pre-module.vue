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
      <h3>Pre-Module: The Importance of Spatial Skills</h3>
      <h4>Learning Intentions</h4>
      <p style="font-style: italic">
        Today, we are learning about the importance of spatial thinking skills
        for success in many careers
      </p>
      <p>By the end of this module, I will be able to:</p>
      <ul class="list-disc">
        <li>Describe what is meant by spatial skills</li>
        <li>
          Describe the various intelligences and how spatial thinking fits
          within this structure
        </li>
        <li>List various careers for which spatial skills are important</li>
        <li>
          List various careers for which spatial skills are not so important
        </li>
      </ul>
      <h4>Success Criteria</h4>
      <p>I have:</p>
      <ul class="list-disc">
        <li>Completed all the activities in my workbook.</li>
        <li>
          Listed careers I am interested in and whether or not they require
          spatial thinking skills
        </li>
      </ul>
      <p>I can:</p>
      <ul class="list-disc">
        <li>Explain the words: spatial skills; spatial intelligence.</li>
        <li>
          Describe the types of spatial thinking required for various
          occupations.
        </li>
        <li>
          Determine if spatial skills are required for various professions.
        </li>
        <li>
          Describe how spatial thinking skills are used in my everyday life.
        </li>
      </ul>

      <h4>Let's Get Started</h4>
      <ol class="list-decimal ml-8">
        <li>Take the PSVT:R Pre-Test</li>

        <li>Take the DAT:SR Pre-Test</li>

        <li>Take the Math Instrument Pre-Test</li>

        <li>
          Do the reading for the module and complete the workbook pages as
          assigned by your teacher.
        </li>
      </ol>
    </div>
  </CourseSidebar>
</template>
