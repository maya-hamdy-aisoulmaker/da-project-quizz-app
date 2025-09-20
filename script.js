const highscoreDisplay = document.getElementById("highscoreDisplay");

let question = [];
let currentQuestion = 0;
let score = 0;

// Elemente referenzieren (per ID – stabil)
const questionText = document.getElementById("questionText");
const answerContainer = document.getElementById("answers");
const nextButton = document.getElementById("nextButton");
const progressBar = document.getElementById("progressBar");
const quizView = document.getElementById("quizView");
const resultView = document.getElementById("resultView");
const resultAlert = document.getElementById("resultAlert");
const restartBtn = document.getElementById("restartBtn");

function getHighscore() {
  return localStorage.getItem("quizHighscore") || 0;
}

function saveHighscore() {
  const existingHighscore = localStorage.getItem("quizHighscore");

  if (!existingHighscore || score > parseInt(existingHighscore)) {
    localStorage.setItem("quizHighscore", score);
  }
  updateHighscoreDisplay();
}

function updateHighscoreDisplay() {
  const highscore = getHighscore();
  highscoreDisplay.textContent = `🏅 Highscore: ${highscore} / ${questions.length}`;
}

// Frage laden
function loadQuestion() {
  // Sichtbarkeit: Quiz an, Ergebnis aus
  quizView.classList.remove("d-none");
  resultView.classList.add("d-none");

  const q = questions[currentQuestion];
  questionText.textContent = `Frage ${currentQuestion + 1}: ${q.question}`;

  // Antworten neu rendern
  answerContainer.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("list-group-item", "list-group-item-action");
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(index, btn);
    answerContainer.appendChild(btn);
  });

  // Fortschritt updaten
  updateProgress();
  updateHighscoreDisplay();
}

// Fortschritt
function updateProgress() {
  const progress = (currentQuestion / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
  progressBar.textContent = `${currentQuestion} / ${questions.length}`;
}

// Antwort prüfen
function checkAnswer(index, button) {
  const q = questions[currentQuestion];

  if (index === q.correct) {
    button.classList.add("list-group-item-success");
    score++;
  } else {
    button.classList.add("list-group-item-danger");
    // Optional: richtige Antwort markieren
    Array.from(answerContainer.children)[q.correct].classList.add(
      "list-group-item-success"
    );
  }

  // Alle Buttons deaktivieren
  Array.from(answerContainer.children).forEach((btn) => (btn.disabled = true));
}

// Weiter
nextButton.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

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

  // Highscore speichern
  saveHighscore();
  const highscore = getHighscore();

  // Fortschritt final setzen
  progressBar.style.width = "100%";
  progressBar.setAttribute("aria-valuenow", "100");
  progressBar.textContent = "Fertig";

  // Views toggeln
  quizView.classList.add("d-none");
  resultView.classList.remove("d-none");

  // Alert befüllen
  resultAlert.className = `alert ${alertClass}`;
  resultAlert.innerHTML = `
      ${message}<br>
      <small class="d-block mt-2">🏅 Bester Score bisher: ${highscore} / ${questions.length}</small>
    `;
}

// Neustart
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

restartBtn.addEventListener("click", restartQuiz);

// Erste Frage laden
async function loadQuestionsFromJSON() {
  try {
    const response = await fetch('questions.json'); // Datei muss im gleichen Ordner wie index.html liegen
    questions = await response.json();
    loadQuestion();
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
  }
}

// Start
loadQuestionsFromJSON();