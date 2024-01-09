/*
Keep code within index.vue for the course pages identical for this code to work with (
  Index.vue is called, OnMounted loads in Modules and Quizzes that are stored in database
  Run a check against what is the expected stored and check against actual stored (for both)
  use settingsStore.js with this file and moduleList.js to determine which ones to add
  Add them in using settingsStore.js
  Update finally and push out to production
)

*/
export const quizList = [
    {
      name: "pre-psvtr-instructions",
      title: "PSVT:R Pre-Test",
      visibility: true,
      attempts: 1,
      survey_quiz_id: 1,
    },
    {
      name: "pre-datsr-instructions",
      title: "DAT:SR Pre-Test",
      visibility: false,
      attempts: 1,
      survey_quiz_id: 2,
    },
    {
      name: "pre-math-instrument-instructions",
      title: "Math Instrument Pre-Test",
      visibility: false,
      attempts: 1,
      survey_quiz_id: 3,
    },
  
    {
      id: 3,
      name: "quiz-1",
      title: "Quiz 1: Combining Solids",
      visibility: false,
      attempts: 3,
    },
    {
      id: 2,
      name: "quiz-2",
      title: "Quiz 2: Surfaces and Solids of Revolution",
      visibility: false,
      attempts: 3,
    },
    {
      id: 4,
      name: "quiz-3",
      title: "Quiz 3: Isometric Sketching and Coded Plans",
      visibility: false,
      attempts: 3,
    },
    {
      id: 7,
      name: "quiz-4",
      title: "Quiz 4: Flat Patterns",
      visibility: false,
      attempts: 3,
    },
    {
      id: 8,
      name: "quiz-5",
      title: "Quiz 5: Rotation of Objects About a Single Axis",
      visibility: false,
      attempts: 3,
    },
    {
      id: 10,
      name: "quiz-6",
      title: "Quiz 6: Reflections and Symmetry",
      visibility: false,
      attempts: 3,
    },
    {
      id: 11,
      name: "quiz-7",
      title: "Quiz 7: Cutting Planes and Cross-Sections",
      visibility: false,
      attempts: 3,
    },
    {
      id: 9,
      name: "quiz-8",
      title: "Quiz 8: Rotation of Objects About Two or More Axes",
      visibility: false,
      attempts: 3,
    },
    {
      id: 5,
      name: "quiz-9",
      title: "Quiz 9: Orthographic Projection",
      visibility: false,
      attempts: 3,
    },
    {
      id: 13,
      name: "quiz-10",
      title: "Quiz 10: Inclined and Curved Surfaces",
      visibility: false,
      attempts: 3,
    },
    {
      name: "post-psvtr-instructions",
      title: "PSVT:R Post-Test",
      visibility: true,
      attempts: 1,
      survey_quiz_id: 6,
    },
    {
      name: "post-datsr-instructions",
      title: "DAT:SR Post-Test",
      visibility: false,
      attempts: 1,
      survey_quiz_id: 7,
    },
    {
      name: "post-math-instrument-instructions",
      title: "Math Instrument Post-Test",
      visibility: false,
      attempts: 1,
      survey_quiz_id: 8,
    },
    {
      name: "post-intervention-survey",
      title: "End of Course Survey",
      visibility: false,
      attempts: 1,
      id: 13,
    }
  ];
  