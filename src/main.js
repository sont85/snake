import { Player, canvas, ctx } from './player'

let player = new Player(0, 15);
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

    // click to restart game
    $('canvas').one('click', () => {
      player = new Player(0, 15);
      main();
    });
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
