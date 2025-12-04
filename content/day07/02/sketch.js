let video;
let pixelSizeW;
let pixelSizeH;

let virtualW = 80; // numero di "pixel" in orizzontale
let virtualH = 60; // numero di "pixel" in verticale

// matrice di colori per i filtri (null = nessun filtro)
let filterColors = [];

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

  // inizializza matrice dei filtri
  for (let y = 0; y < virtualH; y++) {
    filterColors[y] = [];
    for (let x = 0; x < virtualW; x++) {
      filterColors[y][x] = null; // nessun filtro all'inizio
    }
  }
}

function draw() {
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

      // disegno il "pixel" con il colore della webcam
      fill(r, g, b);
      let px = x * pixelSizeW;
      let py = y * pixelSizeH;
      rect(px, py, pixelSizeW, pixelSizeH);

      // se c'è un filtro su questo pixel, disegna sopra un rettangolo semi-trasparente
      let fColor = filterColors[y][x];
      if (fColor !== null) {
        fill(fColor);
        rect(px, py, pixelSizeW, pixelSizeH);
      }
    }
  }

  pop();

  // se il mouse è premuto, dipingiamo in tempo reale
  if (mouseIsPressed && mouseButton === LEFT) {
    paintAt(mouseX, mouseY);
  }
}

// inizio del tratto: disegno subito
function mousePressed() {
  if (mouseButton !== LEFT) return;
  paintAt(mouseX, mouseY);
}

// mentre trascini continuando a tenere premuto il tasto sinistro
function mouseDragged() {
  if (mouseButton === LEFT) {
    paintAt(mouseX, mouseY);
  }
}

// funzione che colora il pixel sotto una certa posizione del mouse
function paintAt(screenX, screenY) {
  // ignora fuori dal canvas
  if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) {
    return;
  }

  // correzione per lo specchio (nel draw abbiamo usato translate + scale)
  let mirroredX = width - screenX;

  // calcolo l'indice del pixel nella griglia
  let gridX = floor(mirroredX / pixelSizeW);
  let gridY = floor(screenY / pixelSizeH);

  // controllo limiti
  if (
    gridX >= 0 && gridX < virtualW &&
    gridY >= 0 && gridY < virtualH
  ) {
    // se il pixel NON è ancora stato colorato, assegno un nuovo colore random
    if (filterColors[gridY][gridX] === null) {
      filterColors[gridY][gridX] = color(
        random(255),
        random(255),
        random(255),
        120 // alpha: trasparente per vedere la webcam sotto
      );
    }
    // se è già colorato, NON lo tocco → non cambia mai più
  }
}

function windowResized() {
  // quando la finestra cambia, ridimensiona il canvas e ricalcola le dimensioni dei pixel
  resizeCanvas(windowWidth, windowHeight);
  pixelSizeW = width / virtualW;
  pixelSizeH = height / virtualH;
}