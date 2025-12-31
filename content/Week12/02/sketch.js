let video;
let bodypix;
let segmentation;

let options = {
  outputStride: 8,
  segmentationThreshold: 0.7,
  multiplier: 1.0
};

let modelReadyFlag = false;
let videoReadyFlag = false;
let startedSegmentation = false;

const alphaThreshold = 128;

// Matrix effect settings
let cellSize = 10;
let cols, rows;
let streams = [];
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// video base size (maintain aspect ratio)
let vidW = 640;
let vidH = 480;

// centered area where the camera and mask/letters reside
let camX, camY, camW, camH;

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Webcam
  video = createCapture(VIDEO, () => {
  });
  video.size(vidW, vidH);
  video.hide();

  video.elt.addEventListener("loadeddata", () => {
    vidW = video.width;
    vidH = video.height;

    videoReadyFlag = true;
    updateCameraArea();
    initStreams();
    tryStartSegmentation();
  });

  // Load BodyPix model
  bodypix = ml5.bodyPix(options, () => {
    modelReadyFlag = true;
    tryStartSegmentation();
  });

  textAlign(CENTER, CENTER);
  textSize(cellSize - 2);
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateCameraArea();
  initStreams();
}

function updateCameraArea() {
  // centered area with video aspect ratio
  let canvasRatio = width / height;
  let videoRatio = vidW / vidH;

  if (canvasRatio > videoRatio) {
    camH = height * 0.95;
    camW = camH * videoRatio;
  } else {
    camW = width * 0.95;
    camH = camW / videoRatio;
  }

  camX = (width - camW) / 2;
  camY = (height - camH) / 2;

  cols = floor(camW / cellSize);
  rows = floor(camH / cellSize);
}

function initStreams() {
  streams = [];
  if (!cols || !rows) return;

  for (let i = 0; i < cols; i++) {
    let len = floor(random(rows * 0.8, rows * 1.4));
    streams.push({
      x: camX + i * cellSize + cellSize / 2,
      y: random(camY - camH, camY),
      speed: random(2, 5),
      length: len
    });
  }
}

// Start segmentation loop when ready
function tryStartSegmentation() {
  if (modelReadyFlag && videoReadyFlag && !startedSegmentation) {
    startedSegmentation = true;
    bodypix.segment(video, gotResults);
  }
}

// Segmentation result callback
function gotResults(error, result) {
  if (error) {
    return;
  }
  segmentation = result;
  bodypix.segment(video, gotResults);
}

// Main render loop
function draw() {
  background(255);

  if (!modelReadyFlag) {
    fill(0);
    text("Loading BodyPix model...", width / 2, height / 2);
    return;
  }

  if (!videoReadyFlag) {
    fill(0);
    text("Loading camera video...", width / 2, height / 2);
    return;
  }

  if (!segmentation || !segmentation.backgroundMask) {
    fill(0);
    text("Computing segmentation...", width / 2, height / 2);
    return;
  }

  let maskImg = segmentation.backgroundMask;
  maskImg.loadPixels();

  noStroke();
  fill(0);
  textSize(cellSize - 2);

  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];

    s.y += s.speed;

    if (s.y > camY + camH + s.length * cellSize) {
      s.length = floor(random(rows * 0.8, rows * 1.4));
      s.y = camY - s.length * cellSize;
      s.speed = random(2, 5);
    }

    for (let k = 0; k < s.length; k++) {
      let yPos = s.y - k * cellSize;
      if (yPos < camY || yPos >= camY + camH) continue;

      let xPos = s.x;

      let xNorm = (xPos - camX) / camW;
      let yNorm = (yPos - camY) / camH;

      if (xNorm < 0 || xNorm > 1 || yNorm < 0 || yNorm > 1) continue;

      let px = floor(xNorm * (maskImg.width - 1));
      let py = floor(yNorm * (maskImg.height - 1));

      let index = (px + py * maskImg.width) * 4;
      let alpha = maskImg.pixels[index + 3];

      if (alpha >= alphaThreshold) {
        let ch = letters.charAt(floor(random(letters.length)));
        text(ch, xPos, yPos);
      }
    }
  }
  drawBorder2D();
}