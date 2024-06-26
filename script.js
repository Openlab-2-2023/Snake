// zadefinovanie HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const pauseButton = document.getElementById('pause-button');

// Zadefinovanie premennych
const gridSize = 30;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let gamePaused = false;

// mapa, snake, jedlo
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Vytvorenie snake alebo jedlo cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Nastavenie pozicie snake alebo jedlo
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generacia jedla
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Ovladanie snake + pause button
function move() {
  if (gamePaused) return

  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head);

  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // vymaže predchadzajuci interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Funkcia pre začatie hry
function startGame() {
  gameStarted = true; 
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Funkcia pre spracovanie stlačenia klávesy
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

// Pridanie event listenera pre spracovanie stlačenia klávesy
document.addEventListener('keydown', handleKeyPress);

// Pridanie event listenera pre spracovanie kliknutia na pause button
pauseButton.addEventListener('click', togglePause);

// Funkcia pre pauzu a obnovu hry
function togglePause() {
  if (gamePaused) {
    gamePaused = false;
    pauseButton.textContent = 'Pause';
  } else {
    gamePaused = true;
    pauseButton.textContent = 'Resume';
  }
}

// Zvýšenie rýchlosti hry
function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Kontrola kolízie
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// Resetovanie hry
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

// Aktualizácia skóre
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

// Zastavenie hry
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
}

// Aktualizácia najvyššieho skóre
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

