const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bola
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 1;
let dy = -1;

// Papan
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Kontrol
let rightPressed = false;
let leftPressed = false;

// Balok
const brickRowCount = 5;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Skor
let score = 0;

// Nyawa
let lives = 3;

// Pendengar event
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Deteksi tabrakan
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          x > brick.x &&
          x < brick.x + brickWidth &&
          y > brick.y &&
          y < brick.y + brickHeight
        ) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("Selamat! Anda menang!");
            document.location.reload();
            clearInterval(interval); // Diperlukan untuk Chrome mengakhiri permainan
          }
        }
      }
    }
  }
}

// Fungsi menggambar
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      if (bricks[c][r].status === 1) {
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "pink";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Gambar skor
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Skor: " + score, 8, 20);
}

// Gambar nyawa
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Nyawa: " + lives, canvas.width - 65, 20);
}

// Gambar pesan game over
function drawGameOver() {
  ctx.font = "40px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}

// Loop permainan
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Gerakan bola
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        drawGameOver();
        clearInterval(interval); // Diperlukan untuk Chrome mengakhiri permainan
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Gerakan papan
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}

const interval = setInterval(draw, 10);
