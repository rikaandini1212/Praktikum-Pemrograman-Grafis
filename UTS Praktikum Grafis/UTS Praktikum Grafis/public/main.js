var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var dino = {
  x: 50,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  velocityY: 0,
  jumping: false,
};

var obstacles = [];
var gameover = false;

function addObstacle() {
  var obstacleType = Math.floor(Math.random() * 2); // Randomize obstacle type: 0 - circle, 1 - triangle
  var obstacle = {
    x: canvas.width,
    y: canvas.height - 50,
    type: obstacleType,
    size: 20,
    speed: 5,
  };
  obstacles.push(obstacle);
}

function drawDino() {
  ctx.fillStyle = "blue";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
  ctx.fillStyle = "purple";
  obstacles.forEach(function (obstacle) {
    if (obstacle.type === 0) {
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, obstacle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    } else if (obstacle.type === 1) {
      ctx.beginPath();
      ctx.moveTo(obstacle.x, obstacle.y - obstacle.size);
      ctx.lineTo(obstacle.x + obstacle.size, obstacle.y + obstacle.size);
      ctx.lineTo(obstacle.x - obstacle.size, obstacle.y + obstacle.size);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
}

function update() {
  if (!gameover) {
    obstacles.forEach(function (obstacle) {
      obstacle.x -= obstacle.speed;

      if (obstacle.x + obstacle.size < 0) {
        obstacle.x = canvas.width;
      }

      if (
        dino.x < obstacle.x + obstacle.size &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.size &&
        dino.y + dino.height > obstacle.y
      ) {
        gameover = true;
        setTimeout(restartGame, 1000);
      }
    });

    if (Math.random() < 0.01) {
      addObstacle();
    }

    if (dino.jumping) {
      dino.y -= dino.velocityY;
      dino.velocityY -= 0.5;
      if (dino.y >= canvas.height - 50) {
        dino.y = canvas.height - 50;
        dino.jumping = false;
      }
    }
  }
}

function playGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawDino();
  drawObstacles();

  if (gameover) {
    drawGameOver();
  } else {
    update();
    requestAnimationFrame(playGame);
  }
}

function restartGame() {
  obstacles = [];
  dino.y = canvas.height - 50;
  gameover = false;
  addObstacle();
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !dino.jumping && !gameover) {
    dino.jumping = true;
    dino.velocityY = 10;
  }
});

addObstacle();
playGame();
