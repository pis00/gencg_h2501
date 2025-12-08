let video;
let pixelSizeW;
let pixelSizeH;

let virtualW = 80; // numero di "pixel" in orizzontale
let virtualH = 60; // numero di "pixel" in verticale

function setup() {
  createCanvas(windowWidth, windowHeight);

  // avvia la webcam con risoluzione bassa (pixel virtuali)
  video = createCapture(VIDEO);
  video.size(virtualW, virtualH);
  video.hide();

  // ogni pixel del video viene scalato in larghezza e altezza
  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;

  noStroke();
}

function draw() {
  drawBorder2D();
  background(0);

  video.loadPixels();

  push();
  // specchio orizzontale (effetto specchio)
  translate(width, 0);
  scale(-1, 1);

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {

      let i = (x + y * video.width) * 4;
      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      fill(r, g, b);

      // ogni pixel del video diventa un rettangolo che riempie la griglia
      rect(
        x * pixelSizeW,
        y * pixelSizeH,
        pixelSizeW,
        pixelSizeH
      );
    }
  }

  pop();
}

function windowResized() {
  // quando la finestra cambia, ridimensiona il canvas e ricalcola le dimensioni dei pixel
  resizeCanvas(windowWidth, windowHeight);
  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;
}