const TOTAL_QUESTIONS = 10;

const firstNumberElement = document.querySelector("#first-number");
const secondNumberElement = document.querySelector("#second-number");
const operatorElement = document.querySelector(".sum .operator");
const arithmeticEquals = document.querySelector("#arithmetic-equals");
const sumElement = document.querySelector("#sum");
const comparisonOptions = document.querySelector("#comparison-options");
const comparisonButtons = document.querySelectorAll(".comparison-button");
const syllableGame = document.querySelector("#syllable-game");
const syllableAnswer = document.querySelector("#syllable-answer");
const syllableOptions = document.querySelector("#syllable-options");
const undoSyllableButton = document.querySelector("#undo-syllable-button");
const clearSyllablesButton = document.querySelector("#clear-syllables-button");
const syllableLevel = document.querySelector("#syllable-level");
const listenInstructionButton = document.querySelector("#listen-instruction-button");
const instructionAudio = document.querySelector("#instruction-audio");
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
let wordDeck = [];
let currentWord = null;
let shuffledSyllables = [];
let selectedSyllables = [];

const readingWords = [
  { word: "papa", syllables: ["pa", "pa"] },
  { word: "vélo", syllables: ["vé", "lo"] },
  { word: "moto", syllables: ["mo", "to"] },
  { word: "tapis", syllables: ["ta", "pis"] },
  { word: "salade", syllables: ["sa", "la", "de"] },
  { word: "tomate", syllables: ["to", "ma", "te"] },
  { word: "cabane", syllables: ["ca", "ba", "ne"] },
  { word: "banane", syllables: ["ba", "na", "ne"] },
  { word: "domino", syllables: ["do", "mi", "no"] },
  { word: "lavabo", syllables: ["la", "va", "bo"] },
];

function shuffleReadingWords() {
  const simpleWords = readingWords.filter((item) => item.syllables.length === 2);
  const longerWords = readingWords.filter((item) => item.syllables.length === 3);
  return [...shuffle(simpleWords), ...shuffle(longerWords)];
}

function speak(text, { onUnavailable } = {}) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    if (onUnavailable) {
      onUnavailable();
    }
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.8;
  const frenchVoice = window.speechSynthesis.getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("fr"));
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }
  utterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      feedbackElement.textContent = "Le son n’a pas pu être lu. Vérifie le son de ton appareil.";
      feedbackElement.className = "feedback is-wrong";
    }
  };
  window.speechSynthesis.speak(utterance);
  return true;
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createSyllableQuestion() {
  currentWord = wordDeck[questionNumber - 1];
  syllableLevel.textContent = currentWord.syllables.length === 2
    ? "Niveau CP · Je découvre les syllabes"
    : "Niveau CP · Je progresse avec 3 syllabes";
  selectedSyllables = [];
  shuffledSyllables = shuffle(currentWord.syllables.map((text, index) => ({ text, index })));
  if (
    shuffledSyllables.length > 1
    && shuffledSyllables.every((syllable, index) => syllable.index === index)
  ) {
    shuffledSyllables.push(shuffledSyllables.shift());
  }
  renderSyllables();
}

function renderSyllables() {
  syllableAnswer.replaceChildren();
  syllableOptions.replaceChildren();

  if (selectedSyllables.length === 0) {
    const placeholder = document.createElement("span");
    placeholder.className = "syllable-placeholder";
    placeholder.textContent = "Choisis la première syllabe";
    syllableAnswer.append(placeholder);
  }

  selectedSyllables.forEach((syllableIndex) => {
    const syllable = shuffledSyllables.find((item) => item.index === syllableIndex);
    const button = document.createElement("button");
    button.className = "syllable-tile syllable-tile-selected";
    button.type = "button";
    button.textContent = syllable.text;
    button.setAttribute("aria-label", `Retirer la syllabe ${syllable.text}`);
    button.disabled = answered;
    button.addEventListener("click", () => {
      selectedSyllables = selectedSyllables.filter((index) => index !== syllableIndex);
      renderSyllables();
      (syllableOptions.querySelector("button") || checkButton).focus();
    });
    syllableAnswer.append(button);
  });

  shuffledSyllables.forEach((syllable) => {
    if (selectedSyllables.includes(syllable.index)) {
      return;
    }

    const button = document.createElement("button");
    button.className = "syllable-tile";
    button.type = "button";
    button.textContent = syllable.text;
    button.setAttribute("aria-label", `Choisir la syllabe ${syllable.text}`);
    button.disabled = answered;
    button.addEventListener("click", () => {
      speak(syllable.text, {
        onUnavailable: () => {
          feedbackElement.textContent = "La lecture audio n’est pas disponible sur ce navigateur.";
          feedbackElement.className = "feedback is-wrong";
        },
      });
      selectedSyllables.push(syllable.index);
      renderSyllables();
      const nextOption = syllableOptions.querySelector("button");
      (nextOption || checkButton).focus();
    });
    syllableOptions.append(button);
  });

  undoSyllableButton.disabled = answered || selectedSyllables.length === 0;
  clearSyllablesButton.disabled = answered || selectedSyllables.length === 0;
}

function createQuestion() {
  answered = false;
  const isSyllableLesson = operation === "syllables";
  sumElement.hidden = isSyllableLesson;
  syllableGame.hidden = !isSyllableLesson;

  if (isSyllableLesson) {
    createSyllableQuestion();
  } else if (operation === "addition") {
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
  feedbackElement.textContent = isSyllableLesson
    ? "Lis chaque syllabe, puis assemble-les."
    : "Compte dans ta tête ou sur tes doigts !";
  feedbackElement.className = "feedback";
  updateProgress();
  if (isSyllableLesson) {
    syllableOptions.querySelector("button")?.focus();
  } else if (operation === "comparison") {
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
  if (operation === "syllables") {
    if (selectedSyllables.length !== currentWord.syllables.length) {
      feedbackElement.textContent = "Choisis toutes les syllabes pour former le mot.";
      feedbackElement.className = "feedback is-wrong";
      syllableOptions.querySelector("button")?.focus();
      return;
    }
    answer = selectedSyllables
      .map((index) => shuffledSyllables.find((syllable) => syllable.index === index).text)
      .join("");
  } else if (operation === "comparison") {
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
  renderSyllables();
  comparisonButtons.forEach((button) => {
    button.disabled = true;
  });
  checkButton.textContent = questionNumber === TOTAL_QUESTIONS ? "Voir mon résultat" : "Question suivante";

  const correctAnswer = operation === "syllables"
    ? currentWord.word
    : operation === "comparison"
      ? firstNumber < secondNumber ? "<" : firstNumber > secondNumber ? ">" : "="
      : operation === "addition" ? firstNumber + secondNumber : firstNumber - secondNumber;

  if (operation === "syllables" ? answer === correctAnswer
    : operation === "comparison" ? answer === correctAnswer : Number(answer) === correctAnswer) {
    score += 1;
    feedbackElement.textContent = "Bravo, c’est la bonne réponse ! 🎉";
    feedbackElement.className = "feedback is-correct";
    if (operation === "syllables") {
      speak(currentWord.word, {
        onUnavailable: () => {
          feedbackElement.textContent = "Bravo, c’est la bonne réponse ! La lecture audio n’est pas disponible sur ce navigateur.";
        },
      });
    }
  } else {
    feedbackElement.textContent = operation === "syllables"
      ? `Pas tout à fait : les syllabes forment « ${correctAnswer} ».`
      : operation === "comparison"
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
  const isSyllableLesson = operation === "syllables";
  const lesson = isAddition ? "Les additions"
    : isSubtraction ? "Les soustractions"
      : isComparison ? "Comparer les nombres" : "Lecture : les syllabes";
  pageTitle.textContent = lesson;
  introCopy.textContent = isAddition
    ? "Additionner, c’est réunir des nombres. À toi de jouer !"
    : isSubtraction
      ? "Soustraire, c’est enlever une quantité. À toi de jouer !"
      : isComparison
        ? "Choisis le signe >, < ou = pour comparer les nombres."
        : "Remets les syllabes dans l’ordre pour lire un mot.";
  exerciseTitle.textContent = isAddition
    ? "Résous l’addition"
    : isSubtraction ? "Résous la soustraction"
      : isComparison ? "Compare les nombres" : "Lis le mot";
  operatorElement.textContent = isAddition ? "+" : "−";
  tipText.innerHTML = isAddition
    ? "<strong>Mon astuce :</strong> commence par le plus grand nombre, puis compte sur tes doigts."
    : isSubtraction
      ? "<strong>Mon astuce :</strong> commence par le premier nombre, puis enlève le second en comptant à rebours."
      : isComparison
        ? "<strong>Mon astuce :</strong> le signe s’ouvre toujours vers le plus grand nombre."
        : "<strong>Mon astuce :</strong> lis chaque syllabe séparément, puis colle-les pour lire le mot.";
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
  if (operation === "syllables") {
    wordDeck = shuffleReadingWords();
  }
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
undoSyllableButton.addEventListener("click", () => {
  selectedSyllables.pop();
  renderSyllables();
  (syllableOptions.querySelector("button") || checkButton).focus();
});
listenInstructionButton.addEventListener("click", async () => {
  try {
    window.speechSynthesis?.cancel();
    instructionAudio.currentTime = 0;
    await instructionAudio.play();
    feedbackElement.textContent = "Écoute la consigne, puis remets les syllabes dans le bon ordre.";
    feedbackElement.className = "feedback";
  } catch (error) {
    feedbackElement.textContent = "Le son de la consigne n’a pas pu être lu. Vérifie le son de ton appareil.";
    feedbackElement.className = "feedback is-wrong";
  }
});
clearSyllablesButton.addEventListener("click", () => {
  selectedSyllables = [];
  renderSyllables();
  (syllableOptions.querySelector("button") || checkButton).focus();
});
lessonButtons.forEach((button) => {
  button.addEventListener("click", () => selectOperation(button.dataset.operation));
});
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

wordDeck = shuffleReadingWords();
createQuestion();
