import * as Camera from './camera.js';

//Use this to track certain points of the pose
export const PosePoints = {
    NOSE: 0,
    LEFTEYE: 1, RIGHTEYE: 2,
    LEFTEAR: 3, RIGHTEAR: 4,
    LEFTSHOULDER: 5, RIGHTSHOULDER: 6,
    LEFTELBOW: 7, RIGHTELBOW: 8,
    LEFTWRIST: 9, RIGHTWRIST: 10,
    LEFTHIP: 11, RIGHTHIP: 12,
    LEFTKNEE: 13, RIGHTKNEE: 14,
    LEFTANKLE: 15, RIGHTANKLE: 16,
}

//Class to hold the data for the input fields
let inputBoxes = [];
class InputBox {
    constructor(posePoint, xMin, xMax, yMin, yMax, callback) {
        this.posePoint = posePoint;
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.callback = callback;

        this.inside = false;
        this.color = "red";
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.xMin, this.yMin, this.xMax - this.xMin, this.yMax - this.yMin);
        ctx.stroke();
    }
}

//Used to create a input to check for
export function createInput(posePoint, xMin, xMax, yMin, yMax, callback) {
    let temp = new InputBox(posePoint, xMin, xMax, yMin, yMax, callback);
    inputBoxes.push(temp);
    return temp;
}

//Checks all the given inputs and fires the callback
//when PosePoint enters the rectangular area
function checkInput() {
    if(inputBoxes.length > 0) {
        inputBoxes.forEach(input => {
            if(Camera.lastPoses.length > 0) {
                let x = Camera.lastPoses[0].keypoints[input.posePoint].position.x;
                let y = Camera.lastPoses[0].keypoints[input.posePoint].position.y;

                if(x >= input.xMin && x <= input.xMax && y >= input.yMin && y <= input.yMax) {
                    if(input.callback != undefined) input.callback();
                    input.color = "lime";
                    input.inside = true;
                } else {
                    input.color = "red";
                    input.inside = false;
                }
            }

            input.draw(Camera.ctx);
        });
    }

    requestAnimationFrame(checkInput);
}

checkInput();