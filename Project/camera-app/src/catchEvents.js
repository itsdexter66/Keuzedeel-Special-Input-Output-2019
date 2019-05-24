import * as Input from './input.js';
const electron = require('electron');
const {ipcRenderer} = electron;

ipcRenderer.on('input:add', (e, input) => {
    Input.createInput(parseInt(input.pose), parseInt(input.xMin), parseInt(input.xMax), parseInt(input.yMin), parseInt(input.yMax), () => {
        Input.sendKey(input.key);
    });
});