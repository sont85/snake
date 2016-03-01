
(() => {
  'use strict';

  const canvas = document.getElementById('snake');
  const ctx = canvas.getContext('2d');
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
      this.images = ['image/cherry.png', 'image/strawberry.png', 'image/banana.png', 'image/pineapple.png', 'image/apple.png'];
      this.image = new Image();
      this.image.src = this.images[Math.floor(Math.random() * 5)];
    }

    render() {
      ctx.drawImage(this.image, this.xPos, this.yPos, this._unitWidth, this._unitHeight);
    }
  }

  class Player extends Entity {
    constructor(x, y) {
      super(x, y);
      this.snake = [];
      this.fruit = [];
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

    static reset() {
      player = new Player(0, 15);
      player.fruit = new Fruit();
      main();
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
      ctx.fillText(`Final Score: ${ this.points }`, 125, 300);

      // click to restart game
      $('canvas').one('click', () => {
        Player.reset();
      });
    }

    checkCollision() {
      // Check Canvas Border Collision
      if (this.xPos > canvas.width || this.xPos < 0 || this.yPos > canvas.height || this.yPos < 0) {
        return true;
      }

      // Check colliding with own body
      return this.snake.some(bodyBlock => {
        return bodyBlock.x === this.x && bodyBlock.y === this.y;
      });
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
      ctx.fillText(`Score: ${ this.points }`, 20, 20);
    }
  }

  let player = new Player(0, 15);
  player.fruit = new Fruit();

  /// Engine
  let main = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.render();
    player.snake.forEach(snake => {
      snake.render();
    });
    player.fruit.render();

    // Break out of loop if game ended
    if (player.endGame) {
      player.renderEndGame();
    } else {
      // Continue game loop
      setTimeout(() => {
        // Prevent game break due to more than one input per loop
        player.acceptingInput = true;
        main();
      }, 100);
    }
  };

  // Intro Screen
  let intro = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = 0.5;
    ctx.shadowOffsetX = 0.5;
    ctx.fillStyle = 'green';
    ctx.font = '40px Serif';
    ctx.save();
    ctx.fillText('Classic Snake Game', 80, 200);
    ctx.fillText('Click To Play', 125, 350);
  };

  let init = () => {
    intro();
    $('canvas').one('click', () => {
      main();
    });
  };

  init();

  // Handle arrow input
  $(document).keydown(e => {
    player.handleKey(e.keyCode);
  });
})();