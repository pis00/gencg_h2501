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

const alphaThreshold = 40;

// grid / letters
let cellSize = 8;
let cols, rows;
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let charGrid = [];

let vidW = 320;
let vidH = 240;

let gridX, gridY, gridW, gridH;

let colOffset = [];
let colSpeed = [];

function setup() {
  // Initialize canvas and video capture
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
    updateGridArea();
    initColumnsAndChars();
    tryStartSegmentation();
  });

  // Load BodyPix model
  bodypix = ml5.bodyPix(options, () => {
    modelReadyFlag = true;
    tryStartSegmentation();
  });

  textAlign(CENTER, CENTER);
  textSize(cellSize - 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateGridArea();
  initColumnsAndChars();
}

// Calculate grid size and position based on canvas and video aspect ratio
function updateGridArea() {
  let canvasRatio = width / height;
  let videoRatio = vidW / vidH;

  if (canvasRatio > videoRatio) {
    gridH = height * 0.9;
    gridW = gridH * videoRatio;
  } else {
    gridW = width * 0.9;
    gridH = gridW / videoRatio;
  }

  gridX = (width - gridW) / 2;
  gridY = (height - gridH) / 2;

  cols = floor(gridW / cellSize);
  rows = floor(gridH / cellSize);
}

// Initialize vertical rain offsets, speeds, and character grid
function initColumnsAndChars() {
  colOffset = [];
  colSpeed = [];
  charGrid = [];

  if (!cols || !rows) return;

  for (let c = 0; c < cols; c++) {
    colOffset[c] = random(0, gridH);
    colSpeed[c]  = random(1.5, 3);

    charGrid[c] = [];
    for (let r = 0; r < rows; r++) {
      charGrid[c][r] = randomChar();
    }
  }
}

// Start segmentation if model and video are ready
function tryStartSegmentation() {
  if (modelReadyFlag && videoReadyFlag && !startedSegmentation) {
    startedSegmentation = true;
    bodypix.segment(video, gotResults);
  }
}

// Continuously receive segmentation results
function gotResults(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  segmentation = result;
  bodypix.segment(video, gotResults);
}

function randomChar() {
  return letters.charAt(floor(random(letters.length)));
}

// Check if pixel is inside the person mask with a 5x5 neighborhood
function isInsideMask(maskImg, px, py) {
  let mW = maskImg.width;
  let mH = maskImg.height;
  const radius = 2;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      let x = px + dx;
      let y = py + dy;
      if (x < 0 || x >= mW || y < 0 || y >= mH) continue;
      let idx = (x + y * mW) * 4;
      let a = maskImg.pixels[idx + 3];
      if (a >= alphaThreshold) {
        return true;
      }
    }
  }
  return false;
}

function draw() {
  // Clear background
  background(255);

  if (!modelReadyFlag || !videoReadyFlag || !segmentation || !segmentation.backgroundMask) {
    return;
  }

  let maskImg = segmentation.backgroundMask;
  maskImg.loadPixels();

  let mW = maskImg.width;
  let mH = maskImg.height;

  // Draw falling letters inside the person mask
  textAlign(CENTER, CENTER);
  textSize(cellSize - 1);
  fill(0);

  for (let c = 0; c < cols; c++) {
    colOffset[c] = (colOffset[c] + colSpeed[c]) % gridH;

    for (let r = 0; r < rows; r++) {
      let baseY = r * cellSize + colOffset[c];
      let yPos = gridY + (baseY % gridH);
      let xPos = gridX + c * cellSize + cellSize / 2;

      let xNorm = (xPos - gridX) / gridW;
      let yNorm = (yPos - gridY) / gridH;

      let px = floor(xNorm * (mW - 1));
      let py = floor(yNorm * (mH - 1));
      if (px < 0 || px >= mW || py < 0 || py >= mH) continue;

      if (isInsideMask(maskImg, px, py)) {
        let ch = charGrid[c][r];
        text(ch, xPos, yPos);

        if (random() < 0.01) {
          charGrid[c][r] = randomChar();
        }
      }
    }
  }
  drawBorder2D();
}