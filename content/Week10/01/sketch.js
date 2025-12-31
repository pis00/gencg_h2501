// Low-resolution webcam pixelation sketch

let video;
let pixelSizeW;
let pixelSizeH;

let virtualW = 80; // number of "pixels" horizontally
let virtualH = 60; // number of "pixels" vertically

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(virtualW, virtualH);
  video.hide();

  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;

  noStroke();
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

      rect(
        x * pixelSizeW,
        y * pixelSizeH,
        pixelSizeW,
        pixelSizeH
      );
    }
  }

  pop();

  drawBorder2D();
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;
}