const TOTAL_QUESTIONS = 10;

const firstNumberElement = document.querySelector("#first-number");
const secondNumberElement = document.querySelector("#second-number");
const operatorElement = document.querySelector(".sum .operator");
const arithmeticEquals = document.querySelector("#arithmetic-equals");
const sumElement = document.querySelector("#sum");
const comparisonOptions = document.querySelector("#comparison-options");
const comparisonButtons = document.querySelectorAll(".comparison-button");
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
let selectedComparison = "";

function createQuestion() {
  if (operation === "addition") {
    firstNumber = Math.floor(Math.random() * 6);
    secondNumber = Math.floor(Math.random() * (11 - firstNumber));
  } else if (operation === "subtraction") {
    firstNumber = Math.floor(Math.random() * 11);
    secondNumber = Math.floor(Math.random() * (firstNumber + 1));
  } else {
    const comparison = ["<", "=", ">"][Math.floor(Math.random() * 3)];
    if (comparison === "<") {
      firstNumber = Math.floor(Math.random() * 10);
      secondNumber = firstNumber + 1 + Math.floor(Math.random() * (10 - firstNumber));
    } else if (comparison === ">") {
      firstNumber = 1 + Math.floor(Math.random() * 10);
      secondNumber = Math.floor(Math.random() * firstNumber);
    } else {
      firstNumber = Math.floor(Math.random() * 11);
      secondNumber = firstNumber;
    }
  }

  firstNumberElement.textContent = firstNumber;
  secondNumberElement.textContent = secondNumber;
  sumElement.setAttribute("aria-label", operation === "comparison"
    ? `Compare ${firstNumber} et ${secondNumber}`
    : `${operation === "addition" ? "Addition" : "Soustraction"} à résoudre`);
  answerInput.value = "";
  answerInput.disabled = false;
  answerInput.setAttribute("aria-invalid", "false");
  answerInput.hidden = operation === "comparison";
  arithmeticEquals.hidden = operation === "comparison";
  operatorElement.hidden = operation === "comparison";
  comparisonOptions.hidden = operation !== "comparison";
  selectedComparison = "";
  comparisonButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
  checkButton.textContent = "Vérifier ma réponse";
  checkButton.disabled = false;
  feedbackElement.textContent = "Compte dans ta tête ou sur tes doigts !";
  feedbackElement.className = "feedback";
  answered = false;
  updateProgress();
  if (operation === "comparison") {
    comparisonButtons[0].focus();
  } else {
    answerInput.focus();
  }
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

  let answer;
  if (operation === "comparison") {
    if (!selectedComparison) {
      feedbackElement.textContent = "Choisis un signe avant de vérifier.";
      feedbackElement.className = "feedback is-wrong";
      comparisonButtons[0].focus();
      return;
    }
    answer = selectedComparison;
  } else {
    answer = answerInput.value.trim();
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
  }

  answered = true;
  answerInput.disabled = true;
  comparisonButtons.forEach((button) => {
    button.disabled = true;
  });
  checkButton.textContent = questionNumber === TOTAL_QUESTIONS ? "Voir mon résultat" : "Question suivante";

  const correctAnswer = operation === "comparison"
    ? firstNumber < secondNumber ? "<" : firstNumber > secondNumber ? ">" : "="
    : operation === "addition" ? firstNumber + secondNumber : firstNumber - secondNumber;

  if (operation === "comparison" ? answer === correctAnswer : Number(answer) === correctAnswer) {
    score += 1;
    feedbackElement.textContent = "Bravo, c’est la bonne réponse ! 🎉";
    feedbackElement.className = "feedback is-correct";
  } else {
    feedbackElement.textContent = operation === "comparison"
      ? `Pas tout à fait : le bon signe était « ${correctAnswer} ».`
      : `Pas tout à fait : la réponse était ${correctAnswer}.`;
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
  const isSubtraction = operation === "subtraction";
  const isComparison = operation === "comparison";
  const lesson = isAddition ? "Les additions" : isSubtraction ? "Les soustractions" : "Comparer les nombres";
  pageTitle.textContent = lesson;
  introCopy.textContent = isAddition
    ? "Additionner, c’est réunir des nombres. À toi de jouer !"
    : isSubtraction
      ? "Soustraire, c’est enlever une quantité. À toi de jouer !"
      : "Choisis le signe >, < ou = pour comparer les nombres.";
  exerciseTitle.textContent = isAddition
    ? "Résous l’addition"
    : isSubtraction ? "Résous la soustraction" : "Compare les nombres";
  operatorElement.textContent = isAddition ? "+" : "−";
  tipText.innerHTML = isAddition
    ? "<strong>Mon astuce :</strong> commence par le plus grand nombre, puis compte sur tes doigts."
    : isSubtraction
      ? "<strong>Mon astuce :</strong> commence par le premier nombre, puis enlève le second en comptant à rebours."
      : "<strong>Mon astuce :</strong> le signe s’ouvre toujours vers le plus grand nombre.";
  document.title = `${lesson} — Maths CP`;
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
comparisonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedComparison = button.dataset.sign;
    comparisonButtons.forEach((option) => {
      const isSelected = option === button;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });
    feedbackElement.textContent = "Signe choisi ! Vérifie ta réponse.";
    feedbackElement.className = "feedback";
  });
});
lessonButtons.forEach((button) => {
  button.addEventListener("click", () => selectOperation(button.dataset.operation));
});
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

createQuestion();
