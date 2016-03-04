(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _player = require('./player');

var player = new _player.Player(0, 15);
/// Engine
var main = function main() {
  _player.ctx.clearRect(0, 0, _player.canvas.width, _player.canvas.height);
  player.update();
  player.render();
  player.snake.forEach(function (snake) {
    snake.render();
  });
  player.fruit.render();

  // Break out of loop if game ended
  if (player.endGame) {
    player.renderEndGame();

    // click to restart game
    $('canvas').one('click', function () {
      player = new _player.Player(0, 15);
      main();
    });
  } else {
    // Continue game loop
    setTimeout(function () {
      // Prevent game break due to more than one input per loop
      player.acceptingInput = true;
      main();
    }, 100);
  }
};

// Intro Screen
var intro = function intro() {
  _player.ctx.clearRect(0, 0, _player.canvas.width, _player.canvas.height);
  _player.ctx.shadowColor = 'black';
  _player.ctx.shadowOffsetY = 0.5;
  _player.ctx.shadowOffsetX = 0.5;
  _player.ctx.fillStyle = 'green';
  _player.ctx.font = '40px Serif';
  _player.ctx.save();
  _player.ctx.fillText('Classic Snake Game', 80, 200);
  _player.ctx.fillText('Click To Play', 125, 350);
};

var init = function init() {
  intro();
  $('canvas').one('click', function () {
    main();
  });
};

init();

// Handle arrow input
$(document).keydown(function (e) {
  player.handleKey(e.keyCode);
});

},{"./player":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = exports.canvas = document.getElementById('snake');
var ctx = exports.ctx = canvas.getContext('2d');
// Superclass

var Entity = function () {
  function Entity(x, y) {
    _classCallCheck(this, Entity);

    this.x = x;
    this.y = y;
    this._unitWidth = canvas.width / 30;
    this._unitHeight = canvas.height / 30;
  }

  _createClass(Entity, [{
    key: 'xPos',
    get: function get() {
      return this.x * this._unitWidth;
    }
  }, {
    key: 'yPos',
    get: function get() {
      return this.y * this._unitHeight;
    }
  }]);

  return Entity;
}();

// Class for building the block for snake


var Snake = function (_Entity) {
  _inherits(Snake, _Entity);

  function Snake(x, y) {
    _classCallCheck(this, Snake);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Snake).call(this, x, y));
  }

  _createClass(Snake, [{
    key: 'render',
    value: function render() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.xPos, this.yPos, this._unitWidth - 1, this._unitHeight - 1);
    }
  }]);

  return Snake;
}(Entity);

var Fruit = function (_Entity2) {
  _inherits(Fruit, _Entity2);

  function Fruit() {
    _classCallCheck(this, Fruit);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Fruit).call(this, Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)));

    _this2.images = ['image/cherry.png', 'image/strawberry.png', 'image/banana.png', 'image/pineapple.png', 'image/apple.png'];
    _this2.image = new Image();
    _this2.image.src = _this2.images[Math.floor(Math.random() * 5)];
    return _this2;
  }

  _createClass(Fruit, [{
    key: 'render',
    value: function render() {
      ctx.drawImage(this.image, this.xPos, this.yPos, this._unitWidth, this._unitHeight);
    }
  }]);

  return Fruit;
}(Entity);

var Player = exports.Player = function (_Entity3) {
  _inherits(Player, _Entity3);

  function Player(x, y) {
    _classCallCheck(this, Player);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, x, y));

    _this3.snake = [];
    _this3.fruit = new Fruit();
    _this3.points = 0;
    _this3.startingLength = 4;
    _this3._direction = 'right';
    _this3.acceptingInput = true;
    _this3.endGame = false;
    _this3.init();
    return _this3;
  }

  _createClass(Player, [{
    key: 'init',


    // building the snake body
    value: function init() {
      for (var i = 0; i < this.startingLength; i++) {
        this.x++;
        this.snake.push(new Snake(this.x, this.y));
      }
    }
  }, {
    key: 'handleKey',
    value: function handleKey(keyCode) {
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
  }, {
    key: 'advance',
    value: function advance() {
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
  }, {
    key: 'renderEndGame',
    value: function renderEndGame() {
      // Render end game scoreboard
      ctx.restore();
      ctx.save();
      ctx.fillText('Game Over', 125, 200);
      ctx.fillText('Final Score: ' + this.points, 125, 300);
    }
  }, {
    key: 'checkCollision',
    value: function checkCollision() {
      var _this4 = this;

      // Check Canvas Border Collision
      if (this.xPos > canvas.width || this.xPos < 0 || this.yPos > canvas.height || this.yPos < 0) {
        return true;
      }

      // Check colliding with own body
      return this.snake.some(function (bodyBlock) {
        return bodyBlock.x === _this4.x && bodyBlock.y === _this4.y;
      });
    }
  }, {
    key: 'collectFruit',
    value: function collectFruit() {
      return this.x === this.fruit.x && this.y === this.fruit.y;
    }

    // Grow snake body

  }, {
    key: 'grow',
    value: function grow() {
      this.points++;
      this.snake.push(new Snake(this.x, this.y));
    }
  }, {
    key: 'update',
    value: function update() {
      this.advance();
      if (this.collectFruit()) {
        this.fruit = new Fruit();
        this.grow();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      ctx.fillStyle = 'red';
      ctx.font = '14px Serif';
      ctx.fillText('Score: ' + this.points, 20, 20);
    }
  }, {
    key: 'direction',
    set: function set(direction) {
      this._direction = direction;
      this.acceptingInput = false;
    },
    get: function get() {
      return this._direction;
    }
  }]);

  return Player;
}(Entity);

},{}]},{},[1]);
