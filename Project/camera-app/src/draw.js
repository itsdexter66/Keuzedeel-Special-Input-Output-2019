import { videoHeight, videoWidth } from './camera.js';
import { PosePoints } from './input.js';
const { ipcRenderer } = require('electron');

let canvas, ctx;

let rect = {};
let drag = false;

let drawing = false;

ipcRenderer.on('main:draw', () => {
    drawing = !drawing;
    drawing ? document.getElementById('drawCanvas').style.cursor = 'crosshair' : document.getElementById('drawCanvas').style.cursor = 'default';
    drawing ? document.getElementById('drawCanvas').style.display = 'block' : document.getElementById('drawCanvas').style.display = 'none';
    drawing ? document.getElementById('drawOptions').style.display = 'block' : document.getElementById('drawOptions').style.display = 'none';
});

function init() {
    makeCanvas();
    fillDropdown();

    canvas = document.getElementById('drawCanvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}

function makeCanvas() {
    let elem = document.createElement('canvas');

    elem.height = videoHeight;
    elem.width = videoWidth;
    elem.id = 'drawCanvas';
    elem.style.backgroundColor = 'transparent';
    elem.style.zIndex = 99;
    elem.style.position = 'absolute';
    elem.style.top = 0;
    elem.style.left = 0;
    elem.style.display = 'none';

    document.body.appendChild(elem);
}

function fillDropdown() {
    let dropdown = document.getElementById('poses');

    for (var key in PosePoints) {
        if (PosePoints.hasOwnProperty(key)) {
            let option = document.createElement('option');
            option.text = key.toString();
            option.value = PosePoints[key];
            dropdown.add(option);
        }
    }
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

        let dropdown = document.getElementById('poses');
        let input = {
            xStart: rect.startX,
            xEnd: rect.w + rect.startX,
            yStart: rect.startY,
            yEnd: rect.h + rect.startY,
            pose: dropdown.options[dropdown.selectedIndex].value,
            key: document.getElementById('poseKey').value
        }

        if(input.key != '') { 
            ipcRenderer.send('main:addinput', input);
            document.getElementById('errorText').innerHTML = '';
        }
        else document.getElementById('errorText').innerHTML = 'You have to specify a key!';

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