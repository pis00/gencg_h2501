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

// video base size (manteniamo aspect ratio)
let vidW = 640;
let vidH = 480;

// area centrata dove vive la “camera” (e quindi anche la mask/lettere)
let camX, camY, camW, camH;

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
    // aggiorna dimensioni reali (se diverse)
    vidW = video.width;
    vidH = video.height;

    videoReadyFlag = true;
    updateCameraArea();
    initStreams();
    tryStartSegmentation();
  });

  // Carica BodyPix
  bodypix = ml5.bodyPix(options, () => {
    console.log("BodyPix model loaded");
    modelReadyFlag = true;
    tryStartSegmentation();
  });

  textAlign(CENTER, CENTER);
  textSize(cellSize - 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateCameraArea();
  initStreams();
}

function updateCameraArea() {
  // area centrata con aspect ratio del video
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
      x: camX + i * cellSize + cellSize / 2, // dentro area camera centrata
      y: random(camY - camH, camY),          // partono sopra l’area camera
      speed: random(2, 5),
      length: len
    });
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

function draw() {
  background(255);

  if (!modelReadyFlag) {
    fill(0);
    text("Caricamento modello BodyPix...", width / 2, height / 2);
    return;
  }

  if (!videoReadyFlag) {
    fill(0);
    text("Caricamento video dalla camera...", width / 2, height / 2);
    return;
  }

  if (!segmentation || !segmentation.backgroundMask) {
    fill(0);
    text("Calcolo della segmentazione...", width / 2, height / 2);
    return;
  }

  // Maschera della persona
  let maskImg = segmentation.backgroundMask;
  maskImg.loadPixels();

  noStroke();
  fill(0); // LETTERE NERE
  textSize(cellSize - 2);

  // (opzionale) visualizza il rettangolo area camera per debug
  // noFill(); stroke(220); rect(camX, camY, camW, camH); noStroke();

  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];

    // scende
    s.y += s.speed;

    // reset quando lo stream è sceso oltre l’area camera
    if (s.y > camY + camH + s.length * cellSize) {
      s.length = floor(random(rows * 0.8, rows * 1.4));
      s.y = camY - s.length * cellSize;
      s.speed = random(2, 5);
    }

    for (let k = 0; k < s.length; k++) {
      let yPos = s.y - k * cellSize;
      if (yPos < camY || yPos >= camY + camH) continue;

      let xPos = s.x;

      // mappa coordinate canvas -> coordinate mask (video)
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