//Storage for each of the classes settings, module and quiz visibility etc.
// stores/userStore.js
import { defineStore } from "pinia";
import { quizList } from "@/services/quizList.js";
import { moduleList } from "@/services/moduleList.js";

//const client = useSupabaseClient();

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    module_visibility: null,
    quiz_visibility: null,
    courseId: null,
  }),
  persist: true,
  // Actions (Setters)
  actions: {
    async setCourseId(class_id) {
      this.courseId = class_id;
    },

    //Get Module Visibility Settings
    async fetchModuleSettings(courseId, client) {
      const { data, error } = await client
        .from("classes_settings")
        .select("module_visibility")
        .eq("class_id", courseId);
      if (error) {
        console.log(error);
      }
      this.module_visibility = data[0].module_visibility;
      // const postTestIndex = this.module_visibility.findIndex(
      //   (m) => m.name === "post-test"
      // );
      // if (postTestIndex !== -1) {
      //   this.module_visibility.splice(postTestIndex, 1); // Remove the 'post-tests' module
      //   const { data, error } = await client
      //     .from("classes_settings")
      //     .update({ module_visibility: this.module_visibility })
      //     .eq("class_id", courseId);
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Post test found as was removed.");
      //   }
      // }
      this.module_visibility = data[0].module_visibility;
    },

    //Get Quiz Visibility Settings
    async fetchQuizSettings(courseId, client) {
      
      const { data } = await client
        .from("classes_settings")
        .select("quiz_visibility")
        .eq("class_id", courseId);
      this.quiz_visibility = data[0].quiz_visibility;
    },

    //Toggle settings
    async toggleModuleVisibility(moduleName, client, courseId) {
      console.log(moduleName, courseId);
      const { data } = await client
        .from("classes_settings")
        .select("module_visibility")
        .eq("class_id", courseId)
        .single();
      console.log("Data retrieved: ", data);
      const moduleVisibility = data.module_visibility;
      const moduleIndex = moduleVisibility.findIndex(
        (m) => m.name === moduleName
      );
      moduleVisibility[moduleIndex].visibility =
        !moduleVisibility[moduleIndex].visibility;
      // Update the module_visibility in Supabase and local storage with new module visibility
      const { error } = await client
        .from("classes_settings")
        .update({ module_visibility: moduleVisibility })
        .eq("class_id", courseId);
      if (error) {
        console.error("Error updating module visibility:", error);
      } else {
        this.module_visibility = moduleVisibility;
      }
    },

    async toggleQuizVisibility(quizName, client, courseId) {
      const { data } = await client
        .from("classes_settings")
        .select("quiz_visibility")
        .eq("class_id", courseId)
        .single();

      if (data) {
        const quizVisibility = data.quiz_visibility;
        const quizIndex = quizVisibility.findIndex((q) => q.name === quizName);

        if (quizIndex !== -1) {
          quizVisibility[quizIndex].visibility =
            !quizVisibility[quizIndex].visibility;
          const { error } = await client
            .from("classes_settings")
            .update({ quiz_visibility: quizVisibility })
            .eq("class_id", courseId);

          if (error) {
            console.error("Error updating quiz visibility:", error);
          } else {
            // Directly update the state to be reactive
            this.quiz_visibility = quizVisibility;
          }
        }
      } else {
        console.error("Quiz settings not found.");
      }
    },

    //Helper function to append post-tests if they are missing
    async updateQuizAttempts(quizName, attempts, client, courseId) {
      console.log('Here');
      //Set the number of attempts for a quiz
      const quizIndex = this.quiz_visibility.findIndex(
        (q) => q.name === quizName
      );
      this.quiz_visibility[quizIndex].attempts = attempts;
      const { error } = await client
        .from("classes_settings")
        .update({ quiz_visibility: this.quiz_visibility })
        .eq("class_id", courseId);
      if (error) {
        console.error("Error updating quiz attempts:", error);
      }
    },

    async ensureDefaultQuizzes(client) {
      if (this.quiz_visibility === null) {
        this.quiz_visibility = [];
      }
      const quizVisibilityMap = new Map(
        this.quiz_visibility.map((q) => [q.name, q])
      );
      for (const defaultQuiz of quizList) {
        const currentQuiz = quizVisibilityMap.get(defaultQuiz.name);
        if (!currentQuiz) {
          this.quiz_visibility.push(defaultQuiz);
        } else if (currentQuiz.attempts !== defaultQuiz.attempts) {
          // If the quiz is present but the attempts don't match, update the attempts
          currentQuiz.attempts = defaultQuiz.attempts;
        }
      }
      const { data, error } = await client
        .from("classes_settings")
        .update({ quiz_visibility: this.quiz_visibility })
        .eq("class_id", this.courseId);

      if (error) {
        console.error("Error updating quiz visibility:", error);
      } else {
        console.log("Quizzes updated successfully:", data);
      }
    },

    async ensureDefaultModules(client) {
      console.log("Here for quizzes:", quizList);
      if (!Array.isArray(this.module_visibility)) {
        this.module_visibility = []; // Initialize with an empty array if null
      }
      const existingModuleNames = new Set(
        this.module_visibility.map((m) => m.name)
      );
      const missingModules = moduleList.filter(
        (module) => !existingModuleNames.has(module.name)
      );

      if (missingModules.length > 0) {
        this.module_visibility.push(...missingModules);
        const { data, error } = await client
          .from("classes_settings")
          .update({ module_visibility: this.module_visibility })
          .eq("class_id", this.courseId);
        if (error) {
          console.log("Error updating module visibility:", error);
        } else {
          console.log("Updated the entry in supabase", data);
        }
      }
    },

    async postTestQuizAppend(courseId, client) {
      //Add in the quiz post-test data if it doesn't exist
      const existingQuizzes = this.quiz_visibility;
      const quizzesToAdd = [
        {
          name: "post-psvtr-instructions",
          title: "PSVT:R Post-Test",
          visibility: false,
          attempts: 1,
        },
        {
          name: "post-datsr-instructions",
          title: "DAT:SR Post-Test",
          visibility: false,
          attempts: 1,
        },
        {
          name: "post-math-instrument-instructions",
          title: "Math Instrument Post-Test",
          visibility: false,
          attempts: 1,
        },
      ];
      const updatedQuizVisibility = existingQuizzes.concat(quizzesToAdd);
      const { error: updateError } = await client
        .from("classes_settings")
        .update({ quiz_visibility: updatedQuizVisibility })
        .eq("class_id", courseId);
      if (updateError) {
        console.log("Error updating quiz visibility:", updateError);
      }
    },
  },

  // Getters
  getters: {
    getCourseId() {
      return this.courseId;
    },
    getModuleVisibility() {
      return this.module_visibility;
    },
    getQuizVisibility() {
      return this.quiz_visibility;
    },
  },
});
