export function gradeMathTest(questionArray) {


    // for (const question in questionArray) {
    //   console.log(question.value);
    //   if (question.value === "" || question.value == null) {
    //     alert("Please answer all questions before submitting");
    //     return;
    //   }
    // }

  //If passed, all questions are asked
  let quizScore = 0;
  //Hardcode the question checks
  if (questionArray[0].value.trim() === "144") {
    quizScore += 1;
  }

  if (questionArray[1].value.trim() === "6") {
    quizScore += 1;
  }

  if (questionArray[2].value === "No") {
    quizScore += 1;
  }

  if (questionArray[3].value === "Yes") {
    quizScore += 1;
  }

  if (questionArray[4].value === "Yes") {
    quizScore += 1;
  }

  if (questionArray[5].value === "B") {
    quizScore += 1;
  }

  if (questionArray[6].value === "B") {
    quizScore += 1;
  }
  else {
    console.log("Wrong answer for question 7")
  }
  if (questionArray[7].value === "Incorrect") {
    quizScore += 1;
  }
  if (questionArray[8].value === "Correct") {
    quizScore += 1;
  }
  if (questionArray[9].value === "Incorrect") {
    quizScore += 1;
  }
  if (questionArray[10].value === "Correct") {
    quizScore += 1;
  }
  if (questionArray[11].value.trim() === "102,000" || questionArray[11].value.trim() === "102000") {
    quizScore += 1;
  }
  if (questionArray[12].value.trim() === "26") {
    quizScore += 1;
  }
  if (questionArray[13].value.trim() === "96") {
    quizScore += 1;
  }
  console.log("User score:", quizScore);
  return quizScore;
}
