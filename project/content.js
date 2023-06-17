// set up canvas
const body = document.body;
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = body.clientHeight;
canvas.style.top = '0';
canvas.style.position = 'absolute';
canvas.style.zIndex = 1000;
canvas.style.cursor = 'crosshair';
// canvas.style.pointerEvents = 'none';

// for touchscreen users - disable browser handling of all panning and zooming gestures
body.style.touchAction = 'none';

// append canvas to body
body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#d00d1e';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 1;

let lastX = 0;
let lastY = 0;
let hue = 0;
let resetLineWidth = true;
let isDrawing = false;

// listen to incoming messages from popup
chrome.runtime.onMessage.addListener(getPreviousSelection);
chrome.runtime.onMessage.addListener(getUpdatedSelection);

function getPreviousSelection(message, sender, sendResponse) {
    ctx.globalCompositeOperation = message.lastBlendmode;
}

function getUpdatedSelection(message, sender, sendResponse) {
    ctx.globalCompositeOperation = message.updatedBlendmode;
}

function draw(e) {
    // stop from running when not mousedown/touchstart
    if (!isDrawing) return;
    
    // set line color
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    // initialize drawing
    ctx.beginPath();
    // start position
    ctx.moveTo(lastX, lastY);
    // translateX and translateY position
    ctx.lineTo(e.offsetX, e.offsetY);
    // generate line
    ctx.stroke();
    // update x and y coords
    [lastX, lastY] = [e.offsetX, e.offsetY];
    
    // adjust hue, loop back to beginning of color wheel when value reaches full circle (360) 
    hue++;
    if (hue >= 360) {
        hue = 0;
    }
    
    // restrict line width to be between 1-70
    if (ctx.lineWidth >= 70 || ctx.lineWidth <= 1) {
        resetLineWidth = !resetLineWidth;
    }
    // increment if under 70
    if (resetLineWidth) {
        ctx.lineWidth++;
    // decrement when line width reaches 70
    } else {
        ctx.lineWidth--;
    }
}

// stamp paw prints on canvas
function stampPaw(e) {
    // save x + y click coordinates 
    const x = e.pageX;
    const y = e.pageY;

    // draw paw
    let img = new Image();
    img.onload = () => ctx.drawImage(img, e.pageX, e.pageY);
    img.src = chrome.runtime.getURL("paw.svg");
    
    // change stamp color
    changeStampColor();
    let animatedPawColor = changeStampColor();
    // trigger paw animation
    pawsify(x, y, animatedPawColor);
}

// change stamp color
function changeStampColor() {
    // store random rgb values
    let randomR = Math.floor(Math.random() * 256);
    let randomG = Math.floor(Math.random() * 256);
    let randomB = Math.floor(Math.random() * 256);
    let newColor = {
        r: randomR,
        g: randomG,
        b: randomB
    };
    let animationColor = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;

    // get color data of image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    
    // loop through image data, replace current pixels with new pixel values
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        
        // pixel values for original image is black: rgb(0, 0, 0)
        if (r == 0 && g == 0 && b == 0) {
            data[i] = newColor['r'];
            data[i + 1] = newColor['g'];
            data[i + 2] = newColor['b'];
        } 
    }
    // source-over draws new shapes on top of existing canvas content
    ctx.globalCompositeOperation = 'source-over';

    // transfer new color data to stamp
    ctx.putImageData(imageData, 0, 0);

    return animationColor;
}

// trigger paw pulse animation
function pawsify(x, y, color) {
    const pawPrint = document.createElement('div');
    pawPrint.id = 'pawsify';
    
    // set position of animation
    pawPrint.style.left = `${x}px`;
    pawPrint.style.top = `${y}px`;
    
    // set color of animation
    pawPrint.style.backgroundColor = color;
    
    // append paw print elements to DOM
    body.appendChild(pawPrint);
}

// break from previous end point after mouse/touchend to draw on different part of canvas
body.addEventListener('pointerdown', e => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

body.addEventListener('pointermove', draw);

body.addEventListener('pointerup', () => {
    isDrawing = false;
});

body.addEventListener('pointerleave', () => {
    isDrawing = false;
});

body.addEventListener('dblclick', stampPaw);