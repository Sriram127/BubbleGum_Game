const board = document.querySelector("#gameBoard");
const hitValue = document.querySelector("#hitVal");
const timerValue = document.querySelector("#timerVal");
const scoreValue = document.querySelector("#scoreVal");
const bestValue = document.querySelector("#bestVal");
const soundToggle = document.querySelector("#soundToggle");
const gameOverSound = document.querySelector("#gameOverSound");

const difficulties = {
  easy: { seconds: 75, bubbles: 96 },
  medium: { seconds: 60, bubbles: 144 },
  hard: { seconds: 45, bubbles: 180 },
};

let difficulty = "medium";
let timer = difficulties[difficulty].seconds;
let score = 0;
let hitNumber = 0;
let intervalId = null;
let soundEnabled = true;
let bestScore = Number(localStorage.getItem("bubblegum-best-score") || 0);

bestValue.textContent = bestScore;

function setDifficulty(nextDifficulty) {
  difficulty = nextDifficulty;
  document.querySelectorAll(".difficulty-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.difficulty === difficulty);
  });
}

function showStartScreen() {
  clearInterval(intervalId);
  timer = difficulties[difficulty].seconds;
  score = 0;
  hitValue.textContent = "-";
  timerValue.textContent = timer;
  scoreValue.textContent = score;
  board.innerHTML = `
    <div class="screen">
      <h2>Ready to pop?</h2>
      <p>Click bubbles matching the hit number before time runs out. Build a streak, beat your best score, and keep your eyes moving.</p>
      <div class="difficulty-row">
        <button class="difficulty-button" data-difficulty="easy" type="button">Easy</button>
        <button class="difficulty-button" data-difficulty="medium" type="button">Medium</button>
        <button class="difficulty-button" data-difficulty="hard" type="button">Hard</button>
      </div>
      <button id="startGame" class="primary-button" type="button">Start Game</button>
    </div>
  `;

  setDifficulty(difficulty);
  board.querySelectorAll(".difficulty-button").forEach((button) => {
    button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
  });
  board.querySelector("#startGame").addEventListener("click", startGame);
}

function startGame() {
  timer = difficulties[difficulty].seconds;
  score = 0;
  timerValue.textContent = timer;
  scoreValue.textContent = score;
  createBubbles();
  setNewHit();
  runTimer();
}

function createBubbles() {
  const totalBubbles = difficulties[difficulty].bubbles;
  const bubbles = Array.from({ length: totalBubbles }, () => {
    const number = Math.floor(Math.random() * 10);
    return `<button class="bubble" type="button" aria-label="Bubble ${number}">${number}</button>`;
  }).join("");

  board.innerHTML = bubbles;
}

function setNewHit() {
  hitNumber = Math.floor(Math.random() * 10);
  hitValue.textContent = hitNumber;
}

function runTimer() {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer -= 1;
    timerValue.textContent = timer;

    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function increaseScore() {
  score += 10;
  scoreValue.textContent = score;
}

function endGame() {
  clearInterval(intervalId);
  bestScore = Math.max(bestScore, score);
  localStorage.setItem("bubblegum-best-score", bestScore);
  bestValue.textContent = bestScore;

  if (soundEnabled) {
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(() => {});
  }

  board.innerHTML = `
    <div class="screen">
      <h2>Game Over</h2>
      <p class="final-score">Final score: ${score}</p>
      <p>Best score: ${bestScore}</p>
      <button id="playAgain" class="primary-button" type="button">Play Again</button>
    </div>
  `;
  hitValue.textContent = "-";
  board.querySelector("#playAgain").addEventListener("click", showStartScreen);
}

board.addEventListener("click", (event) => {
  if (!event.target.classList.contains("bubble")) {
    return;
  }

  const clickedNumber = Number(event.target.textContent);
  if (clickedNumber === hitNumber) {
    increaseScore();
    createBubbles();
    setNewHit();
  }
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
});

showStartScreen();
