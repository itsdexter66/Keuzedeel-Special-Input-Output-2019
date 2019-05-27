import { videoHeight, videoWidth } from './camera.js';
const { ipcRenderer } = require('electron');

let drawing = false;

ipcRenderer.on('info', (e, data) => {
    drawing = !drawing;
});

let elem = document.createElement('canvas');
elem.height = videoHeight;
elem.width = videoWidth;
elem.id = 'drawCanvas';
elem.style.backgroundColor = 'transparent';
elem.style.zIndex = 99;
elem.style.position = 'absolute';
elem.style.top = 0;
elem.style.left = 0;

document.body.appendChild(elem);

let canvas = document.getElementById('drawCanvas');
let ctx = canvas.getContext('2d');

let rect = {};
let drag = false;

function init() {
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousemove', mouseMove, false);
}

function mouseDown(e) {
    if(drawing) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
    }
}

function mouseUp() {
    if(drawing) {
        drag = false;

        let positions = {
            xStart: rect.startX,
            xEnd: rect.w + rect.startX,
            yStart: rect.startY,
            yEnd: rect.h + rect.startY,
        }

        ipcRenderer.send('main:draw', positions);

        //clears the rect that has been drawn on the top canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
}

function mouseMove(e) {
    if (drag && drawing) {
        rect.w = (e.pageX - this.offsetLeft) - rect.startX;
        rect.h = (e.pageY - this.offsetTop) - rect.startY;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw();
    }
}

function draw() {
    // ctx.setLineDash([6]);
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
}

init();