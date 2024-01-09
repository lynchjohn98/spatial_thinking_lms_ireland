import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useCourseStore = defineStore("courseStore", {
  state: () => ({
    courseName: null,
    courseJoinCode: null,
    courseId: null,
    courseType: null,
    courseInstructor: null,
    courseURL: null,
  }),
  persist: true,
  actions: {
    setCourseName(name) {
      this.courseName = name;
    },
    setCourseJoinCode(code) {
      this.courseJoinCode = code;
    },
    setCourseId(id) {
      this.courseId = id;
    },
    setCourseType(type) {
      this.courseType = type;
    },
    setCourseInstructor(instructor) {
      this.courseInstructor = instructor;
    },
    setCourseURL(url) {
      this.courseURL = url;
    },
    clearCourseData() {
      this.$reset();
    },

    async updateCourseType(type, client) {
      
    }
  },
  getters: {
    getCourseName: (state) => state.courseName,
    getCourseJoinCode: (state) => state.courseJoinCode,
    getCourseId: (state) => state.courseId,
    getCourseType: (state) => state.courseType,
    getCourseInstructor: (state) => state.courseInstructor,
    getCourseURL: (state) => state.courseURL,
  },
});
