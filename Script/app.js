const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const highScore = document.querySelector(".high-score");
const score = document.querySelector(".score");
const modal = document.querySelector(".modal");
const modalCurrentScore = document.querySelector(".modal-current-score");
const modalHighScore = document.querySelector(".modal-high-score");
const newGameBtn = document.querySelector(".new-game");
const buttons = document.querySelectorAll(".button");

let scale = 10;
let row = canvas.width / scale;
let column = canvas.height / scale;

function setHighScoreToLocalStorage() {
  if (Number(highScore.textContent) < Number(score.textContent)) {
    localStorage.setItem("highScore", JSON.stringify(score.innerHTML));
  } else {
    localStorage.setItem("highScore", JSON.stringify(highScore.innerHTML));
  }
}

function setHighScore() {
  const localHighScore = JSON.parse(localStorage.getItem("highScore"));
  localHighScore
    ? (highScore.innerHTML = localHighScore)
    : (highScore.innerHTML = 0);
}

function showModal() {
  modal.style.display = "flex";
  modalCurrentScore.innerHTML = score.textContent;
  modalHighScore.innerHTML = highScore.textContent;
}

newGameBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.location.reload();
});

function Food() {
  this.x = 0;
  this.y = 0;

  this.foodDraw = function () {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.generateRandomLocation = function () {
    this.x = Math.floor(Math.random() * row) * scale;
    this.y = Math.floor(Math.random() * column) * scale;
  };
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale;
  this.ySpeed = 0;

  this.total = 0;
  this.tail = [];

  this.snakeDraw = function () {
    ctx.fillStyle = "white";

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.updateLocation = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x > canvas.width) {
      this.x = 0;
    } else if (this.y > canvas.height) {
      this.y = 0;
    } else if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.y < 0) {
      this.y = canvas.height;
    }
  };

  this.updateDirection = function (userDirection) {
    switch (userDirection) {
      case "Up": {
        this.xSpeed = 0;
        this.ySpeed = -scale;
        break;
      }
      case "Down": {
        this.xSpeed = 0;
        this.ySpeed = scale;
        break;
      }
      case "Left": {
        this.ySpeed = 0;
        this.xSpeed = -scale;
        break;
      }
      case "Right": {
        this.ySpeed = 0;
        this.xSpeed = scale;
        break;
      }
    }
  };

  this.isEatFood = function (food) {
    if (this.x === food.x && this.y === food.y) {
      this.total++;
      console.log(this.total);
      return true;
    }
    return false;
  };

  this.collision = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        return true;
      }
    }
    return false;
  };
}

window.addEventListener("load", () => {
  let snake = new Snake();
  let food = new Food();
  food.generateRandomLocation();
  setHighScore();

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    food.foodDraw();
    snake.snakeDraw();
    snake.updateLocation();

    if (snake.isEatFood(food)) {
      console.log("eat food!");
      food.generateRandomLocation();
    }

    score.innerHTML = snake.total;

    if (snake.collision()) {
      setHighScoreToLocalStorage();
      setHighScore();
      showModal();
      return;
    }
  }, 200);

  window.addEventListener("keydown", (event) => {
    let userDirection = event.key.replace("Arrow", "");
    snake.updateDirection(userDirection);
  });

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log(e.target.dataset.arrow);
      snake.updateDirection(e.target.dataset.arrow);
    });
  });
});
