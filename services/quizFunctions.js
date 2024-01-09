export async function handleSubmitQuiz(
  quizStore,
  selectedAnswers,
  windowConfirm
) {
  let score = 0;
  let answeredQuestions = 0;
  quizStore.questions.forEach((question) => {
    if (selectedAnswers.hasOwnProperty(question.id)) {
      answeredQuestions++;
      const selectedOptionId = selectedAnswers[question.id];
      const correctAnswerOptionId = question.correct_answers[0].option_id;

      if (selectedOptionId === correctAnswerOptionId) {
        score++;
      }
    }
  });
  const totalQuestions = quizStore.questions.length;
  if (
    answeredQuestions < totalQuestions &&
    !windowConfirm(
      "You have not answered all the questions. Do you still want to submit your quiz?"
    )
  ) {
    return { submitted: false, score: null };
  }
  if (!windowConfirm("Are you sure you want to submit your quiz?")) {
    return { submitted: false, score: null };
  }
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  return { submitted: true, score };
}
