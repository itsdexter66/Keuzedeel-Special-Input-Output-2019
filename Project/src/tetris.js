import * as Input from './input.js';
import { videoHeight, videoWidth } from './camera.js';

let canvasDiv = document.createElement('canvas');
canvasDiv.id = "screen";
canvasDiv.width = 240;
canvasDiv.height = 400;

document.getElementById("gameslist").appendChild(canvasDiv);

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

context.scale(20, 20);
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

let dy, dx;

function arenaSweep() {
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for(let x = 0; x < arena[y].length; ++x) {
      if(arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
  }
}

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for(let y = 0; y < m.length; ++y) {
    for(let x = 0; x < m[y].length; ++x) {
      if(m[y][x] !== 0 &&
      (arena[y + o.y] &&
      arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPieces(type) {
  if(type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ];
  }
  if(type === 'O') {
    return [
      [2, 2],
      [2, 2]
    ];
  }
  if(type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3]
    ];
  }
  if(type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0]
    ];
  }
  if(type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0]
    ];
  }
  if(type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0]
    ];
  }
  if(type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ];
  }
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;
  if(collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerMove() {
  player.pos.x += dx;
  if(collide(arena, player)) {
    player.pos.x -= dx;
  }
  moveCounter = 0;
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = createPieces(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if(collide(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
}

function playerRotate(dir) {
  rotateCounter = 0;
  if(dy == 0) return;
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if(offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      rotateCounter = 0;
      return;
    }
  }
}

function rotate(matrix, dir) {
  for(let y = 0; y < matrix.length; ++y) {
    for(let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }
  if(dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let moveCounter = 0;
let moveInterval = 100;
let rotateCounter = 0;
let rotateInterval = 300;

let lastTime = 0
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  moveCounter += deltaTime;
  rotateCounter += deltaTime;
  if(dropCounter > dropInterval) {
    playerDrop();
  }
  
  if(moveCounter > moveInterval) {
    playerMove();
  }
  
  if(rotateCounter > rotateInterval) {
    playerRotate(dy);
    console.log("h1");
  }

  dx = 0;
  dy = 0;

  draw();
  requestAnimationFrame(update);
}

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF'
];

const arena = createMatrix(12, 20);

const player = {
  pos: {x: 5, y: 5},
  matrix: matrix
}

function setupInput() {
  Input.createInput(Input.PosePoints.NOSE, 0, videoWidth/3, videoHeight/3, videoHeight/3 + videoHeight/3, goLeft);
  Input.createInput(Input.PosePoints.NOSE, videoWidth/3 + videoWidth/3, videoWidth, videoHeight/3, videoHeight/3 + videoHeight/3, goRight);
  Input.createInput(Input.PosePoints.NOSE, videoWidth/3, videoWidth/3 + videoWidth/3, videoHeight/3 + videoHeight/3, videoHeight, goDown);
  Input.createInput(Input.PosePoints.NOSE, (videoWidth/3)/2, (videoWidth/3)/2 + videoWidth/3, 0, videoHeight/3, rotateLeft);
  Input.createInput(Input.PosePoints.NOSE, videoWidth/2, videoWidth/3 + videoWidth/3 + (videoWidth/3)/2, 0, videoHeight/3, rotateRight);
}

function goLeft() {
  moveInput(-1);
}

function goRight() {
  moveInput(1);
}

function goDown() {
  playerDrop();
}

function rotateLeft() {
  rotateInput(-1);
}

function rotateRight() {
  rotateInput(1);
}

function rotateInput(dir) {
  dy = dir;
}

function moveInput(dir) {
  dx = dir;
}

setupInput();
update();
