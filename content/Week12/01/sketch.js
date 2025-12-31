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

let cellSize = 14;
let cols, rows;
let streams = [];
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let vidW = 640;
let vidH = 480;

let camX, camY, camW, camH;

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

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

  bodypix = ml5.bodyPix(options, () => {
    modelReadyFlag = true;
    tryStartSegmentation();
  });

  textAlign(CENTER, CENTER);
  textSize(cellSize);
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateCameraArea();
  initStreams();
}

function updateCameraArea() {
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
    streams.push({
      x: camX + i * cellSize + cellSize / 2,
      y: random(camY - camH, camY),
      speed: random(2, 6),
      length: floor(random(10, 25))
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
  drawBorder2D();
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
  fill(0, 180, 0);

  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];

    s.y += s.speed;
    if (s.y - s.length * cellSize > camY + camH + 50) {
      s.y = random(camY - camH, camY);
      s.speed = random(2, 6);
      s.length = floor(random(10, 25));
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
}