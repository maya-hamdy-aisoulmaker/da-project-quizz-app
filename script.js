import { getTemplate } from "./template.js";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

let quizView, resultView, progressBar, questionText, answerContainer;
let nextButton, resultAlert, restartButton, highscoreDisplay;

document.addEventListener("DOMContentLoaded", async () => {
  const appRoot = document.getElementById("appRoot");
  appRoot.innerHTML = getTemplate();

  cacheDomElements();
  registerEventListeners();

  await fetchQuestions();
});

function cacheDomElements() {
  highscoreDisplay = document.getElementById("highscoreDisplay");
  questionText = document.getElementById("questionText");
  answerContainer = document.getElementById("answers");
  nextButton = document.getElementById("nextButton");
  progressBar = document.getElementById("progressBar");
  quizView = document.getElementById("quizView");
  resultView = document.getElementById("resultView");
  resultAlert = document.getElementById("resultAlert");
  restartButton = document.getElementById("restartBtn");
}

function registerEventListeners() {
  nextButton.addEventListener("click", handleNextQuestion);
  restartButton.addEventListener("click", restartQuiz);
}

function getHighscore() {
  return parseInt(localStorage.getItem("quizHighscore")) || 0;
}

function saveHighscore() {
  const oldHighscore = getHighscore();
  if (score > oldHighscore) {
    localStorage.setItem("quizHighscore", score);
  }
  updateHighscoreDisplay();
}

function updateHighscoreDisplay() {
  const highscore = getHighscore();
  highscoreDisplay.textContent = `🏅 Highscore: ${highscore} / ${questions.length}`;
}

async function fetchQuestions() {
  try {
    const response = await fetch("questions.json");
    questions = await response.json();
    renderQuestion();
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
  }
}

function renderQuestion() {
  toggleViews(true);

  const question = questions[currentQuestionIndex];
  questionText.textContent = `Frage ${currentQuestionIndex + 1}: ${question.question}`;

  renderAnswers(question);
  updateProgress();
  updateHighscoreDisplay();
}

function renderAnswers(question) {
  answerContainer.innerHTML = "";
  question.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("list-group-item", "list-group-item-action");
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(index, question.correct, btn);
    answerContainer.appendChild(btn);
  });
}

function handleNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  renderQuestion();
}

function checkAnswer(selectedIndex, correctIndex, button) {
  if (selectedIndex === correctIndex) {
    button.classList.add("list-group-item-success");
    score++;
  } else {
    button.classList.add("list-group-item-danger");
    answerContainer.children[correctIndex].classList.add("list-group-item-success");
  }
  Array.from(answerContainer.children).forEach((btn) => (btn.disabled = true));
}

function updateProgress() {
  const progress = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
  progressBar.textContent = `${currentQuestionIndex} / ${questions.length}`;
}

function showResult() {
  const percentage = (score / questions.length) * 100;
  let alertClass = "alert-info";
  let message = `Quiz beendet! 🎉 Dein Score: ${score} / ${questions.length}`;

  if (percentage === 100) {
    alertClass = "alert-success";
    message = `Perfekt! 🏆 Alle ${questions.length} Fragen richtig!`;
  } else if (percentage < 50) {
    alertClass = "alert-danger";
    message = `Ohje 😅 nur ${score} / ${questions.length}. Versuch's nochmal!`;
  }

  saveHighscore();
  finalizeProgress();
  toggleViews(false);

  resultAlert.className = `alert ${alertClass}`;
  resultAlert.innerHTML = `
    ${message}<br>
    <small class="d-block mt-2">🏅 Bester Score bisher: ${getHighscore()} / ${questions.length}</small>
  `;
}

function finalizeProgress() {
  progressBar.style.width = "100%";
  progressBar.setAttribute("aria-valuenow", "100");
  progressBar.textContent = "Fertig";
}

function toggleViews(isQuizView) {
  quizView.classList.toggle("d-none", !isQuizView);
  resultView.classList.toggle("d-none", isQuizView);
}