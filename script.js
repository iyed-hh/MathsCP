const TOTAL_QUESTIONS = 10;

const firstNumberElement = document.querySelector("#first-number");
const secondNumberElement = document.querySelector("#second-number");
const operatorElement = document.querySelector(".sum .operator");
const sumElement = document.querySelector("#sum");
const pageTitle = document.querySelector("#page-title");
const introCopy = document.querySelector(".intro-copy");
const exerciseTitle = document.querySelector("#exercise-title");
const tipText = document.querySelector("#tip-text");
const answerInput = document.querySelector("#answer");
const feedbackElement = document.querySelector("#feedback");
const checkButton = document.querySelector("#check-button");
const restartButton = document.querySelector("#restart-button");
const scoreElement = document.querySelector("#score");
const questionCountElement = document.querySelector("#question-count");
const progressPercentElement = document.querySelector("#progress-percent");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const exercise = document.querySelector("#exercise");
const resultPanel = document.querySelector("#result-panel");
const resultEmoji = document.querySelector("#result-emoji");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const lessonButtons = document.querySelectorAll(".lesson-button");

let firstNumber = 0;
let secondNumber = 0;
let questionNumber = 1;
let score = 0;
let answered = false;
let operation = "addition";

function createQuestion() {
  if (operation === "addition") {
    firstNumber = Math.floor(Math.random() * 6);
    secondNumber = Math.floor(Math.random() * (11 - firstNumber));
  } else {
    firstNumber = Math.floor(Math.random() * 11);
    secondNumber = Math.floor(Math.random() * (firstNumber + 1));
  }

  firstNumberElement.textContent = firstNumber;
  secondNumberElement.textContent = secondNumber;
  sumElement.setAttribute(
    "aria-label",
    `${operation === "addition" ? "Addition" : "Soustraction"} à résoudre`
  );
  answerInput.value = "";
  answerInput.disabled = false;
  answerInput.setAttribute("aria-invalid", "false");
  checkButton.textContent = "Vérifier ma réponse";
  checkButton.disabled = false;
  feedbackElement.textContent = "Compte dans ta tête ou sur tes doigts !";
  feedbackElement.className = "feedback";
  answered = false;
  updateProgress();
  answerInput.focus();
}

function updateProgress() {
  const completed = questionNumber - 1;
  const percentage = Math.round((completed / TOTAL_QUESTIONS) * 100);

  questionCountElement.textContent = `Question ${questionNumber} sur ${TOTAL_QUESTIONS}`;
  progressPercentElement.textContent = `${percentage} %`;
  progressTrack.setAttribute("aria-valuenow", completed);
  progressFill.style.width = `${percentage}%`;
  scoreElement.textContent = score;
}

function checkAnswer() {
  if (answered) {
    questionNumber += 1;
    if (questionNumber > TOTAL_QUESTIONS) {
      showResults();
    } else {
      createQuestion();
    }
    return;
  }

  const answer = answerInput.value.trim();
  if (answer === "") {
    feedbackElement.textContent = "Écris une réponse avant de vérifier.";
    feedbackElement.className = "feedback is-wrong";
    answerInput.setAttribute("aria-invalid", "true");
    answerInput.focus();
    return;
  }

  if (!answerInput.validity.valid || Number(answer) < 0 || Number(answer) > 10) {
    feedbackElement.textContent = "Choisis un nombre entre 0 et 10.";
    feedbackElement.className = "feedback is-wrong";
    answerInput.setAttribute("aria-invalid", "true");
    answerInput.focus();
    return;
  }

  answered = true;
  answerInput.disabled = true;
  checkButton.textContent = questionNumber === TOTAL_QUESTIONS ? "Voir mon résultat" : "Question suivante";

  const correctAnswer = operation === "addition"
    ? firstNumber + secondNumber
    : firstNumber - secondNumber;

  if (Number(answer) === correctAnswer) {
    score += 1;
    feedbackElement.textContent = "Bravo, c’est la bonne réponse ! 🎉";
    feedbackElement.className = "feedback is-correct";
  } else {
    feedbackElement.textContent = `Pas tout à fait : la réponse était ${correctAnswer}.`;
    feedbackElement.className = "feedback is-wrong";
  }

  scoreElement.textContent = score;
}

function showResults() {
  exercise.hidden = true;
  resultPanel.hidden = false;
  progressTrack.setAttribute("aria-valuenow", TOTAL_QUESTIONS);
  progressFill.style.width = "100%";
  progressPercentElement.textContent = "100 %";
  questionCountElement.textContent = "Série terminée !";

  if (score === TOTAL_QUESTIONS) {
    resultEmoji.textContent = "🏆";
    resultTitle.textContent = "Incroyable !";
    resultMessage.textContent = `Tu as réussi les ${TOTAL_QUESTIONS} exercices. Tu es un champion !`;
  } else if (score >= 7) {
    resultEmoji.textContent = "🎉";
    resultTitle.textContent = "Bravo !";
    resultMessage.textContent = `Tu as trouvé ${score} bonnes réponses sur ${TOTAL_QUESTIONS}. Encore un petit entraînement et tu seras au top !`;
  } else {
    resultEmoji.textContent = "💪";
    resultTitle.textContent = "Bien joué !";
    resultMessage.textContent = `Tu as trouvé ${score} bonnes réponses sur ${TOTAL_QUESTIONS}. Recommence pour progresser !`;
  }
  restartButton.focus();
}

function selectOperation(nextOperation) {
  if (operation === nextOperation) {
    return;
  }

  operation = nextOperation;
  const isAddition = operation === "addition";
  pageTitle.textContent = isAddition ? "Les additions" : "Les soustractions";
  introCopy.textContent = isAddition
    ? "Additionner, c’est réunir des nombres. À toi de jouer !"
    : "Soustraire, c’est enlever une quantité. À toi de jouer !";
  exerciseTitle.textContent = isAddition ? "Résous l’addition" : "Résous la soustraction";
  operatorElement.textContent = isAddition ? "+" : "−";
  tipText.innerHTML = isAddition
    ? "<strong>Mon astuce :</strong> commence par le plus grand nombre, puis compte sur tes doigts."
    : "<strong>Mon astuce :</strong> commence par le premier nombre, puis enlève le second en comptant à rebours.";
  document.title = `${isAddition ? "Les additions" : "Les soustractions"} — Maths CP`;
  lessonButtons.forEach((button) => {
    const isSelected = button.dataset.operation === operation;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  restartGame();
}

function restartGame() {
  questionNumber = 1;
  score = 0;
  exercise.hidden = false;
  resultPanel.hidden = true;
  createQuestion();
}

checkButton.addEventListener("click", checkAnswer);
restartButton.addEventListener("click", restartGame);
lessonButtons.forEach((button) => {
  button.addEventListener("click", () => selectOperation(button.dataset.operation));
});
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

createQuestion();
