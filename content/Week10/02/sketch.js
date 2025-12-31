// Webcam pixelation with interactive color overlay
let video;
let pixelSizeW;
let pixelSizeH;

let virtualW = 80; // numero di "pixel" in orizzontale
let virtualH = 60; // numero di "pixel" in verticale

// matrice di colori per i filtri (null = nessun filtro)
let filterColors = [];

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(virtualW, virtualH);
  video.hide();

  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;

  noStroke();

  for (let y = 0; y < virtualH; y++) {
    filterColors[y] = [];
    for (let x = 0; x < virtualW; x++) {
      filterColors[y][x] = null;
    }
  }
}

// Main render loop
function draw() {
  background(0);

  video.loadPixels();

  push();
  translate(width, 0);
  scale(-1, 1);

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {

      let i = (x + y * video.width) * 4;
      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      fill(r, g, b);
      let px = x * pixelSizeW;
      let py = y * pixelSizeH;
      rect(px, py, pixelSizeW, pixelSizeH);

      let fColor = filterColors[y][x];
      if (fColor !== null) {
        fill(fColor);
        rect(px, py, pixelSizeW, pixelSizeH);
      }
    }
  }

  pop();

  if (mouseIsPressed && mouseButton === LEFT) {
    paintAt(mouseX, mouseY);
  }  
  drawBorder2D();
}

// Start painting
function mousePressed() {
  if (mouseButton !== LEFT) return;
  paintAt(mouseX, mouseY);
}

// Continue painting while dragging
function mouseDragged() {
  if (mouseButton === LEFT) {
    paintAt(mouseX, mouseY);
  }
}

// Paint a virtual pixel at screen position
function paintAt(screenX, screenY) {
  if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) {
    return;
  }

  let mirroredX = width - screenX;

  let gridX = floor(mirroredX / pixelSizeW);
  let gridY = floor(screenY / pixelSizeH);

  if (
    gridX >= 0 && gridX < virtualW &&
    gridY >= 0 && gridY < virtualH
  ) {
    if (filterColors[gridY][gridX] === null) {
      filterColors[gridY][gridX] = color(
        random(255),
        random(255),
        random(255),
        120
      );
    }
  }
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;
}