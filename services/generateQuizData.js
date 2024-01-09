// Function will generate the required data for each of the quizzes
export const updateQuizData = (data) => {
  const quiz = ref({});
  quiz.value = data;
  quiz.quizTitle = data.title;
  //Convert to array
  const questionArray = data.questions;
  //Reset arrays to not carry data over on reload
  quiz.multipleChoiceQuestions = [];
  quiz.multipleSelectQuestions = [];
  quiz.subChoiceQuestions = [];
  quiz.multipleSubchoiceQuestions = [];

  //Iterate over array
  for (let question of questionArray) {
    switch (question.question_type) {
      case "multiple_choice":
        quiz.multipleChoiceQuestions.push(question);
        break;
      case "multiple_select":
        quiz.multipleSelectQuestions.push(question);
        break;
      case "sub_question":
        quiz.subChoiceQuestions.push(question);
        break;
      case "multiple_sub_question":
        quiz.multipleSubchoiceQuestions.push(question);
        break;
    }
  }
  quiz.multipleChoiceQuestions.forEach((question) => {
    question.options.sort((a, b) => a.id - b.id);
  });
  quiz.subChoiceQuestions.forEach((question) => {
    question.sub_questions.sort((a, b) => a.id - b.id);
  });
  quiz.multipleSubchoiceQuestions.forEach((question) => {
    question.sub_questions.sort((a, b) => a.id - b.id);
  });
  return quiz;
};
