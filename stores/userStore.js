// stores/userStore.js
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { quizList } from "../services/quizList";

export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      accountType: null,
      gender: null,
      age: null,
      grades: null,
    };
  },
  persist: true,
  // Actions (Setters)
  actions: {
    setUserId(id) {
      this.id = id;
    },
    setEmail(email) {
      this.email = email;
    },
    setFirstName(firstName) {
      this.firstName = firstName;
    },
    setLastName(lastName) {
      this.lastName = lastName;
    },
    setAccountType(accountType) {
      this.accountType = accountType;
    },
    setGender(gender) {
      this.gender = gender;
    },
    setAge(age) {
      this.age = age;
    },
    setGrades(grades) {
      this.grades = grades;
    },

    async retrieveGrades(client) {
      const { data, error } = await client
        .from("grades")
        .select("*")
        .eq("student_id", this.id);
      if (error) {
        console.log(error);
      }
      const gradesData = data;
      // Initialize gradesObject with all quizzes/surveys from quizList
      const gradesObject = quizList.map((quiz) => ({
        ...quiz,
        attemptsTaken: 0,
        maxScore: 0,
      }));

      // Create a lookup object to find quizzes/surveys by id or survey_quiz_id quickly
      const gradesLookup = gradesObject.reduce((acc, quiz, index) => {
        const idKey = quiz.id
          ? `quiz_${quiz.id}`
          : `survey_${quiz.survey_quiz_id}`;
        acc[idKey] = index; // Store the index of the quiz in gradesObject
        return acc;
      }, {});

      // Update gradesObject based on gradesData
      gradesData.forEach((grade) => {
        const idKey = grade.quiz_id
          ? `quiz_${grade.quiz_id}`
          : `survey_${grade.survey_quiz_id}`;
        if (typeof gradesLookup[idKey] !== "undefined") {
          const quizIndex = gradesLookup[idKey];
          gradesObject[quizIndex].attemptsTaken += 1;
          gradesObject[quizIndex].maxScore = Math.max(
            gradesObject[quizIndex].maxScore,
            grade.score
          );
        }
      });
      return gradesObject;
    },
  },

  // Getters
  getters: {
    getUserId: (state) => state.id,
    getEmail: (state) => state.email,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getAccountType: (state) => state.accountType,
    getGender: (state) => state.gender,
    getAge: (state) => state.age,
    getGrades: (state) => state.grades,
    getFullName: (state) => `${state.firstName} ${state.lastName}`,
  },
});
