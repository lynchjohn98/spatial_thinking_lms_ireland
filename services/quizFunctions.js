export async function handleSubmitQuiz(
  quizStore,
  selectedAnswers,
  windowConfirm
) {
  let score = 0;
  let answeredQuestions = 0;
  let questionStatusUpdates = {}; // Temporary storage for question statuses

  quizStore.questions.forEach((question) => {
    if (selectedAnswers.hasOwnProperty(question.id)) {
      answeredQuestions++;
      const selectedOptionIds = Array.isArray(selectedAnswers[question.id])
        ? selectedAnswers[question.id]
        : [selectedAnswers[question.id]]; // Ensure we always work with an array
      const correctAnswerOptionIds = question.correct_answers.map(
        (answer) => answer.option_id
      );

      // Check if the question is multiple-choice or multiple-select
      if (question.question_type === "multiple_choice") {
        if (correctAnswerOptionIds.includes(selectedOptionIds[0])) {
          score++;
          questionStatusUpdates[question.id] = "correct"; // Add correct status
        } else {
          questionStatusUpdates[question.id] = "incorrect"; // Add incorrect status
        }
      } else if (question.question_type === "multiple_select") {
        const isCorrect =
          selectedOptionIds.every((id) =>
            correctAnswerOptionIds.includes(id)
          ) && selectedOptionIds.length === correctAnswerOptionIds.length;
        if (isCorrect) {
          score++;
          questionStatusUpdates[question.id] = "correct"; // Add correct status
        } else {
          // For multiple-select, we need to check each option individually
          questionStatusUpdates[question.id] = selectedOptionIds.map((id) => ({
            optionId: id,
            isCorrect: correctAnswerOptionIds.includes(id),
          }));
        }
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
  return { submitted: true, score, questionStatusUpdates  };
}
