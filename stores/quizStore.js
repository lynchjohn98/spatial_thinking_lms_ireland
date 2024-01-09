// stores/userStore.js
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useQuizStore = defineStore("quizStore", {
  state: () => {
    return {
      attempts: useLocalStorage("quiz_attempts", ""),
      description: useLocalStorage("quiz_description", ""),
      id: useLocalStorage("quiz_id", ""),
      questions: useLocalStorage("quiz_questions", ""),
      quizType: useLocalStorage("quiz_quizType", ""),
      title: useLocalStorage("quiz_title", ""),
      userScore: useLocalStorage("quiz_userScore", ""),
      maxScore: useLocalStorage("quiz_maxScore", ""),
      options: useLocalStorage("quiz_options", ""),
      correctAnswers: useLocalStorage("quiz_correctAnswers", ""),
      allData: useLocalStorage("quiz_allData", ""),
    };
  },
  persist: true,

  // Actions (Setters)
  actions: {
    setAttempts(attempts) {
      this.attempts = attempts;
    },
    setDescription(description) {
      this.description = description;
    },
    setId(id) {
      this.id = id;
    },
    setQuestions(questions) {
      this.questions = questions;
    },
    setQuizType(quizType) {
      this.quizType = quizType;
    },
    setTitle(title) {
      this.title = title;
    },
    setUserScore(userScore) {
      this.userScore = userScore;
    },
    setMaxScore(maxScore) {
      this.maxScore = maxScore;
    },
    setOptions(options) {
      this.options = options;
    },
    setAllData(allData) {
      this.allData = allData;
    },
    setCorrectAnswers(correctAnswers) {
      this.correctAnswers = correctAnswers;
    },

    async fetchQuizData(client, quizId, numberOfQuestions) {

      const { data, error } = await client
        .from("quizzes")
        .select(
          `
          *,
          questions (
            *,
            options (*),
            images (*),
            correct_answers(*),
            sub_questions (
              *,
              options (*),
              parts(
                *,
                options(*)
              )
            )
          )
        `
        )
        .eq("id", quizId)
        .single();
      if (error) {
        console.log(error);
      }
      this.allData = data;

      //Set other variables
      this.attempts = data.attempts;
      this.description = data.description;
      this.id = data.id;
      let questionsArray = Object.values(data.questions);
      questionsArray = questionsArray.slice(0, numberOfQuestions);
      this.questions = questionsArray;
      this.quizType = data.quiz_type;
      this.title = data.title;
    },

    async submitQuiz(client, userScore, maxScore)  {
      
      console.log('Running submit quiz');
    }
  },

  // Getters
  getters: {
    //Help me make getters
    getAttempts() {
      return this.attempts;
    },
    getDescription() {
      return this.description;
    },
    getId() {
      return this.id;
    },
    getQuestions() {
      return this.questions;
    },
    getQuizType() {
      return this.quizType;
    },
    getTitle() {
      return this.title;
    },
    getUserScore() {
      return this.userScore;
    },
    getMaxScore() {
      return this.maxScore;
    },
    getOptions() {
      return this.options;
    },
    getAllData() {
      return this.allData;
    },
    getCorrectAnswers() {
      return this.correctAnswers;
    }
  },
});
