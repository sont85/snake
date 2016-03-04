export const canvas = document.getElementById('snake');
export const ctx = canvas.getContext('2d');
// Superclass
class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this._unitWidth = canvas.width / 30;
    this._unitHeight = canvas.height / 30;
  }
  get xPos() {
    return this.x * this._unitWidth;
  }
  get yPos() {
    return this.y * this._unitHeight;
  }
}

// Class for building the block for snake
class Snake extends Entity {
  constructor(x, y) {
    super(x, y);
  }
  render() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.xPos, this.yPos, this._unitWidth - 1, this._unitHeight - 1);
  }
}

class Fruit extends Entity {
  constructor() {
    super(Math.floor(Math.random() * 30), Math.floor(Math.random() * 30));
    this.images = [
      'image/cherry.png',
      'image/strawberry.png',
      'image/banana.png',
      'image/pineapple.png',
      'image/apple.png',
    ];
    this.image = new Image();
    this.image.src = this.images[Math.floor(Math.random() * 5)];
  }

  render() {
    ctx.drawImage(this.image, this.xPos, this.yPos, this._unitWidth, this._unitHeight);
  }
}

export class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.snake = [];
    this.fruit = new Fruit();
    this.points = 0;
    this.startingLength = 4;
    this._direction = 'right';
    this.acceptingInput = true;
    this.endGame = false;
    this.init();
  }

  set direction(direction) {
    this._direction = direction;
    this.acceptingInput = false;
  }

  get direction() {
    return this._direction;
  }

  // building the snake body
  init() {
    for (let i = 0; i < this.startingLength; i++) {
      this.x++;
      this.snake.push(new Snake(this.x, this.y));
    }
  }

  handleKey(keyCode) {
    // check to prevent more than one input per game loop
    if (!this.acceptingInput) {
      return;
    }

    // check to make sure not moving opposite direction
    if (keyCode === 37 && this.direction !== 'right') {
      this.direction = 'left';
    } else if (keyCode === 38 && this.direction !== 'down') {
      this.direction = 'up';
    } else if (keyCode === 39 && this.direction !== 'left') {
      this.direction = 'right';
    } else if (keyCode === 40 && this.direction !== 'up') {
      this.direction = 'down';
    }
  }

  advance() {
    // direction state
    switch (this.direction) {
      case 'left':
        this.x--;
        break;
      case 'right':
        this.x++;
        break;
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
    }

    // removing last block and adding new block to move the snake
    this.snake.shift();

    // checking for collision with self that could end game before adding block
    if (!this.checkCollision()) {
      this.snake.push(new Snake(this.x, this.y));
    } else {
      this.endGame = true;
    }
  }

  renderEndGame() {
    // Render end game scoreboard
    ctx.restore();
    ctx.save();
    ctx.fillText('Game Over', 125, 200);
    ctx.fillText(`Final Score: ${this.points}`, 125, 300);
  }

  checkCollision() {
    // Check Canvas Border Collision
    if (this.xPos > canvas.width ||
      this.xPos < 0 ||
      this.yPos > canvas.height ||
      this.yPos < 0) {
      return true;
    }

    // Check colliding with own body
    return this.snake.some(bodyBlock => bodyBlock.x === this.x && bodyBlock.y === this.y);
  }

  collectFruit() {
    return this.x === this.fruit.x && this.y === this.fruit.y;
  }

  // Grow snake body
  grow() {
    this.points++;
    this.snake.push(new Snake(this.x, this.y));
  }

  update() {
    this.advance();
    if (this.collectFruit()) {
      this.fruit = new Fruit();
      this.grow();
    }
  }

  render() {
    ctx.fillStyle = 'red';
    ctx.font = '14px Serif';
    ctx.fillText(`Score: ${this.points}`, 20, 20);
  }
}
