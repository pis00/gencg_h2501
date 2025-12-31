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
let cellSize = 8;        // celle un po' più grandi → meno colonne, più FPS
let cols, rows;
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let charGrid = [];       // [col][row] carattere fisso per ogni cella

// video size
let vidW = 320;
let vidH = 240;

// area dove disegnare le lettere (stesso aspect del video)
let gridX, gridY, gridW, gridH;

// offset e velocità per ogni colonna (pioggia verticale)
let colOffset = [];
let colSpeed = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Webcam
  video = createCapture(VIDEO, () => {
    console.log("Capture created");
  });
  video.size(vidW, vidH);
  video.hide();

  video.elt.addEventListener("loadeddata", () => {
    console.log("Video loaded data");
    vidW = video.width;
    vidH = video.height;
    videoReadyFlag = true;
    updateGridArea();
    initColumnsAndChars();
    tryStartSegmentation();
  });

  // BodyPix
  bodypix = ml5.bodyPix(options, () => {
    console.log("BodyPix model loaded");
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

function initColumnsAndChars() {
  colOffset = [];
  colSpeed = [];
  charGrid = [];

  if (!cols || !rows) return;

  for (let c = 0; c < cols; c++) {
    colOffset[c] = random(0, gridH);      // posizione iniziale del “nastro”
    colSpeed[c]  = random(1.5, 3);        // velocità un po' più lenta

    charGrid[c] = [];
    for (let r = 0; r < rows; r++) {
      charGrid[c][r] = randomChar();      // lettera iniziale per ogni cella
    }
  }
}

function tryStartSegmentation() {
  if (modelReadyFlag && videoReadyFlag && !startedSegmentation) {
    startedSegmentation = true;
    console.log("Starting segmentation loop");
    bodypix.segment(video, gotResults);
  }
}

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

// controlla se (px,py) è dentro la persona usando un intorno 5x5
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
  background(255);

  // debug
  textAlign(LEFT, TOP);
  fill(0);
  textSize(14);
  text(
    "modelReady: " + modelReadyFlag +
    "\nvideoReady: " + videoReadyFlag +
    "\nsegmentation: " + (segmentation ? "ok" : "no") +
    "\nFPS: " + nf(frameRate(), 2, 1),
    10, 10
  );

  // preview camera + mask in alto a destra
  if (videoReadyFlag) {
    let previewW = min(220, width / 3);
    let previewH = previewW * (vidH / vidW);

    image(video, width - previewW - 10, 10, previewW, previewH);

    if (segmentation && segmentation.backgroundMask) {
      let maskImgPrev = segmentation.backgroundMask;
      push();
      tint(0, 200, 0, 180);
      image(maskImgPrev, width - previewW - 10, 20 + previewH, previewW, previewH);
      pop();

      textAlign(RIGHT, TOP);
      fill(0);
      textSize(12);
      text("Camera", width - 10, 10);
      text("Mask", width - 10, 20 + previewH);
    }
  }

  if (!modelReadyFlag || !videoReadyFlag || !segmentation || !segmentation.backgroundMask) {
    return;
  }

  let maskImg = segmentation.backgroundMask;
  maskImg.loadPixels();

  let mW = maskImg.width;
  let mH = maskImg.height;

  // --- LETTERE CHE SCENDONO NELLA SAGOMA ---
  textAlign(CENTER, CENTER);
  textSize(cellSize - 1);
  fill(0);

  for (let c = 0; c < cols; c++) {
    // aggiorno l’offset della colonna: pioggia continua
    colOffset[c] = (colOffset[c] + colSpeed[c]) % gridH;

    for (let r = 0; r < rows; r++) {
      let baseY = r * cellSize + colOffset[c];
      let yPos = gridY + (baseY % gridH);
      let xPos = gridX + c * cellSize + cellSize / 2;

      // mappo verso la mask
      let xNorm = (xPos - gridX) / gridW;
      let yNorm = (yPos - gridY) / gridH;

      let px = floor(xNorm * (mW - 1));
      let py = floor(yNorm * (mH - 1));
      if (px < 0 || px >= mW || py < 0 || py >= mH) continue;

      if (isInsideMask(maskImg, px, py)) {
        // usa il carattere fisso della cella
        let ch = charGrid[c][r];
        text(ch, xPos, yPos);

        // ogni tanto cambia lettera (ma non ad ogni frame)
        if (random() < 0.01) { // 1% di probabilità per frame
          charGrid[c][r] = randomChar();
        }
      }
    }
  }
  drawBorder2D();
}